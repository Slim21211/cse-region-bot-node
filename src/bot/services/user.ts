import { MyContext } from '../../types';
import { DatabaseService } from '../../database/supabase';
import { isAdmin } from '../middleware/auth';

const db = new DatabaseService();

export class UserService {
  static async processNameStep(ctx: MyContext, name: string) {
    if (!ctx.session) ctx.session = {};
    
    ctx.session.name = name;
    ctx.session.awaitingName = false;
    ctx.session.awaitingSurname = true;
    await ctx.reply('Введите вашу фамилию:');
  }

  static async processSurnameStep(ctx: MyContext, surname: string) {
    if (!ctx.session) ctx.session = {};
    
    ctx.session.surname = surname;
    ctx.session.awaitingSurname = false;
    ctx.session.awaitingCity = true;
    await ctx.reply('Введите ваш город:');
  }

  static async processCityStep(ctx: MyContext, city: string) {
    if (!ctx.from || !ctx.session?.name || !ctx.session?.surname) {
      await ctx.reply('Произошла ошибка. Начните заново с /start');
      return;
    }

    try {
      await db.createUser({
        user_id: ctx.from.id,
        name: ctx.session.name,
        surname: ctx.session.surname,
        city
      });

      await ctx.reply(
        `Спасибо, ${ctx.session.name} ${ctx.session.surname}!\n\n Для начала обучения нажмите /home`
      );

      // Clear session
      ctx.session = {};
    } catch (error) {
      console.error('Error creating user:', error);
      await ctx.reply('Произошла ошибка при сохранении данных');
    }
  }

  static async countActiveUsers(ctx: MyContext) {
    if (!ctx.from || !isAdmin(ctx.from.id)) {
      await ctx.reply('У вас нет прав для выполнения этой команды');
      return;
    }

    await ctx.reply('Подсчёт активных пользователей начат. Пожалуйста, подождите...');

    try {
      const users = await db.getAllUsers();
      const totalUsers = users.length;
      let activeCount = 0;
      const inactiveUsers: number[] = [];

      const progressMsg = await ctx.reply(`Проверено 0 из ${totalUsers} пользователей...`);

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        try {
          await ctx.telegram.sendChatAction(user.user_id, 'typing');
          activeCount++;
        } catch (error) {
          inactiveUsers.push(user.user_id);
        }

        if ((i + 1) % 50 === 0 || i === users.length - 1) {
          try {
            await ctx.telegram.editMessageText(
              ctx.chat?.id,
              progressMsg.message_id,
              undefined,
              `Проверено ${i + 1} из ${totalUsers} пользователей...`
            );
          } catch (error) {
            // Ignore edit errors
          }
        }

        await new Promise(resolve => setTimeout(resolve, 30));
      }

      for (const userId of inactiveUsers) {
        try {
          await db.deleteUser(userId);
        } catch (error) {
          console.error('Error deleting inactive user:', userId, error);
        }
      }

      await ctx.reply(
        `Подсчёт завершён!\n\n` +
        `Всего пользователей: ${totalUsers}\n` +
        `Активных: ${activeCount}\n` +
        `Удалено неактивных: ${inactiveUsers.length}\n/home`
      );
    } catch (error) {
      console.error('Error counting users:', error);
      await ctx.reply('Произошла ошибка при подсчёте пользователей');
    }
  }
}