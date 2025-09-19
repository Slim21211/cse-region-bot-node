import { Telegraf, Markup } from 'telegraf';
import { MyContext, SessionData } from '../../types';
import { adminMiddleware } from '../middleware/auth';
import { BroadcastService } from '../services/broadcast';
import { UserService } from '../services/user';

export function setupAdminHandlers(bot: Telegraf<MyContext>) {
  // Send command
  bot.command('send', adminMiddleware, async (ctx) => {
    await ctx.reply('Отправьте сообщение для рассылки: текст или картинку с подписью.');
    ctx.session = { ...ctx.session, awaitingBroadcast: true };
  });

  // Admin functions menu
  bot.hears('Функции для администраторов', adminMiddleware, async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Отправить сообщение в бот', 'command1')],
      [Markup.button.callback('Посчитать активных пользователей', 'command2')]
    ]);

    await ctx.reply(
      'Выберите команду:\n\nДля возврата нажмите /home',
      keyboard
    );
  });

  // Callback handlers
  bot.action('command1', adminMiddleware, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Отправьте сообщение для рассылки: текст или картинку с подписью.');
    ctx.session = { ...ctx.session, awaitingBroadcast: true };
  });

  bot.action('command2', adminMiddleware, async (ctx) => {
    await ctx.answerCbQuery();
    await UserService.countActiveUsers(ctx);
  });

  // Handle broadcast messages
  bot.on(['text', 'photo'], async (ctx, next) => {
    if (ctx.session?.awaitingBroadcast) {
      ctx.session.awaitingBroadcast = false;
      await BroadcastService.handleBroadcastMessage(ctx);
      return;
    }
    return next();
  });

  // Confirm send command
  bot.command('confirm_send', adminMiddleware, async (ctx) => {
    await BroadcastService.confirmBroadcast(ctx, bot);
  });

  // Cancel send command
  bot.command('cancel_send', adminMiddleware, async (ctx) => {
    await BroadcastService.cancelBroadcast(ctx);
  });

  // Broadcast status command
  bot.command('broadcast_status', adminMiddleware, async (ctx) => {
    await BroadcastService.getBroadcastStatus(ctx);
  });
}