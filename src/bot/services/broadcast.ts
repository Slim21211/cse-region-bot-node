import { Telegraf } from 'telegraf';
import { MyContext, PendingMessage } from '../../types';
import { DatabaseService } from '../../database/supabase';
import { isAdmin } from '../middleware/auth';

const db = new DatabaseService();

export class BroadcastService {
  private static pendingMessages: Map<number, PendingMessage> = new Map();

  static setPendingMessage(userId: number, message: PendingMessage) {
    this.pendingMessages.set(userId, message);
  }

  static getPendingMessage(userId: number): PendingMessage | undefined {
    return this.pendingMessages.get(userId);
  }

  static removePendingMessage(userId: number) {
    this.pendingMessages.delete(userId);
  }

  static async handleBroadcastMessage(ctx: MyContext) {
    if (!ctx.from || !isAdmin(ctx.from.id)) {
      await ctx.reply('У вас нет прав для рассылки');
      return;
    }

    if (ctx.message && 'photo' in ctx.message && ctx.message.photo) {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const caption = ctx.message.caption || '';
      
      this.setPendingMessage(ctx.from.id, {
        type: 'photo',
        file_id: fileId,
        caption
      });
    } else if (ctx.message && 'text' in ctx.message) {
      this.setPendingMessage(ctx.from.id, {
        type: 'text',
        text: ctx.message.text
      });
    }

    await ctx.reply(
      'Подтвердите рассылку командой /confirm_send, или отправьте /cancel_send, чтобы отменить.'
    );
  }

  static async confirmBroadcast(ctx: MyContext, bot: Telegraf<MyContext>) {
    if (!ctx.from || !isAdmin(ctx.from.id)) {
      await ctx.reply('У вас нет прав для рассылки');
      return;
    }

    const content = this.getPendingMessage(ctx.from.id);
    if (!content) {
      await ctx.reply('Отсутствует сообщение для рассылки.');
      return;
    }

    try {
      const users = await db.getAllUsers();
      const totalUsers = users.length;

      const broadcast = await db.createBroadcast({
        admin_id: ctx.from.id,
        content: JSON.stringify(content),
        total_users: totalUsers,
        status: 'pending',
        sent_count: 0,
        failed_count: 0,
        blocked_count: 0
      });

      await ctx.reply(`Рассылка запущена для ${totalUsers} пользователей.`);

      // Remove pending message
      this.removePendingMessage(ctx.from.id);

      // Start broadcast
      setTimeout(() => {
        this.runBroadcast(broadcast.id, bot);
      }, 1000);
    } catch (error) {
      console.error('Error creating broadcast:', error);
      await ctx.reply('Произошла ошибка при создании рассылки');
    }
  }

  static async cancelBroadcast(ctx: MyContext) {
    if (!ctx.from || !isAdmin(ctx.from.id)) {
      await ctx.reply('У вас нет прав для отмены рассылки');
      return;
    }

    this.removePendingMessage(ctx.from.id);
    await ctx.reply('Рассылка отменена.');
  }

  static async runBroadcast(broadcastId: number, bot: Telegraf<MyContext>) {
    try {
      // Update status to processing
      await db.updateBroadcast(broadcastId, { status: 'processing' });

      const users = await db.getAllUsers();
      const broadcast = await db.getBroadcast(broadcastId);
      
      if (!broadcast) return;

      const content: PendingMessage = JSON.parse(broadcast.content);
      let success = 0;
      let failed = 0;
      let blocked = 0;

      // Send start message
      const progressMsg = await bot.telegram.sendMessage(
        broadcast.admin_id,
        `Начинаю рассылку для ${users.length} пользователей...`
      );

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        
        try {
          if (content.type === 'text' && content.text) {
            await bot.telegram.sendMessage(user.user_id, content.text);
          } else if (content.type === 'photo' && content.file_id) {
            await bot.telegram.sendPhoto(user.user_id, content.file_id, {
              caption: content.caption || ''
            });
          }
          success++;
        } catch (error: any) {
          if (error.description && error.description.includes('bot was blocked')) {
            blocked++;
            // Remove blocked user
            try {
              await db.deleteUser(user.user_id);
            } catch (deleteError) {
              console.error('Error deleting blocked user:', deleteError);
            }
          }
          failed++;
        }

        // Update progress every 50 users
        if ((i + 1) % 50 === 0 || i === users.length - 1) {
          try {
            const progress = ((i + 1) / users.length * 100).toFixed(1);
            await bot.telegram.editMessageText(
              broadcast.admin_id,
              progressMsg.message_id,
              undefined,
              `Отправлено ${i + 1}/${users.length} (${progress}%)\n` +
              `Успешно: ${success}\nОшибок: ${failed}\nЗаблокировали: ${blocked}`
            );
          } catch (editError) {
            // Ignore edit errors
          }
        }

        // Update database
        await db.updateBroadcast(broadcastId, {
          sent_count: success,
          failed_count: failed,
          blocked_count: blocked
        });

        // Rate limit delay
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Complete broadcast
      await db.updateBroadcast(broadcastId, {
        status: 'completed',
        sent_count: success,
        failed_count: failed,
        blocked_count: blocked
      });

      // Delete progress message and send summary
      try {
        await bot.telegram.deleteMessage(broadcast.admin_id, progressMsg.message_id);
      } catch (error) {
        // Ignore deletion error
      }

      await bot.telegram.sendMessage(
        broadcast.admin_id,
        `✅ Рассылка завершена.\n\n` +
        `Всего пользователей: ${users.length}\n` +
        `Успешно: ${success}\n` +
        `Ошибок: ${failed}\n` +
        `Заблокировали бота: ${blocked}\n` +
        `/home`
      );
    } catch (error) {
      console.error('Broadcast error:', error);
    }
  }

  static async getBroadcastStatus(ctx: MyContext) {
    if (!ctx.from || !isAdmin(ctx.from.id)) {
      await ctx.reply('У вас нет прав для просмотра статуса рассылки');
      return;
    }

    try {
      const broadcast = await db.getLatestBroadcast();
      
      if (!broadcast) {
        await ctx.reply('Нет данных о рассылках.');
        return;
      }

      if (broadcast.status === 'processing') {
        await ctx.reply(
          `🔄 Рассылка в процессе:\n` +
          `Отправлено: ${broadcast.sent_count}/${broadcast.total_users}\n` +
          `Ошибок: ${broadcast.failed_count}\n` +
          `Заблокировали: ${broadcast.blocked_count}`
        );
      } else if (broadcast.status === 'completed') {
        await ctx.reply(
          `✅ Последняя рассылка завершена:\n` +
          `Всего: ${broadcast.total_users}\n` +
          `Успешно: ${broadcast.sent_count}\n` +
          `Ошибок: ${broadcast.failed_count}\n` +
          `Заблокировали: ${broadcast.blocked_count}`
        );
      } else {
        await ctx.reply(`Статус рассылки: ${broadcast.status}`);
      }
    } catch (error) {
      console.error('Error getting broadcast status:', error);
      await ctx.reply('Произошла ошибка при получении статуса рассылки');
    }
  }
}