import { MiddlewareFn } from 'telegraf';
import { MyContext } from '../../types';
import { DatabaseService } from '../../database/supabase';
import { UserService } from '../services/user';

const db = new DatabaseService();

export const analyticsMiddleware: MiddlewareFn<MyContext> = async (ctx, next) => {
  try {
    if (!ctx.from || !ctx.chat) return next();

    // Инициализируем сессию если её нет
    if (!ctx.session) {
      ctx.session = {};
    }

    const userId = ctx.from.id;

    // Handle user registration flow
    if (ctx.session.awaitingName && ctx.message && 'text' in ctx.message) {
      await UserService.processNameStep(ctx, ctx.message.text);
      return;
    }

    if (ctx.session.awaitingSurname && ctx.message && 'text' in ctx.message) {
      await UserService.processSurnameStep(ctx, ctx.message.text);
      return;
    }

    if (ctx.session.awaitingCity && ctx.message && 'text' in ctx.message) {
      await UserService.processCityStep(ctx, ctx.message.text);
      return;
    }

    // Check if user exists on /start
    if (ctx.message && 'text' in ctx.message && ctx.message.text === '/start') {
      const existingUser = await db.getUserById(userId);
      
      if (existingUser) {
        await ctx.reply(
          `Приветствуем, ${existingUser.name} ${existingUser.surname}!\n\n Для начала обучения нажмите /home`,
          { parse_mode: 'HTML' }
        );
        return;
      } else {
        await ctx.reply(
          'Добро пожаловать в команду компании <i>Курьер Сервис Экспресс!</i>\n\n' +
          'Вы подписались на обучающий бот компании.\n\n' +
          ' Введите ваше имя:',
          { parse_mode: 'HTML' }
        );
        
        ctx.session.awaitingName = true;
        return;
      }
    }

    // Log messages
    if (ctx.message && 'text' in ctx.message) {
      const messageDate = new Date(ctx.message.date * 1000);
      const formattedDate = messageDate.toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      try {
        await db.createMessage({
          user_id: userId,
          name: ctx.from.first_name || '',
          surname: ctx.from.last_name || '',
          message: ctx.message.text,
          time_sent: formattedDate
        });
      } catch (error) {
        console.error('Error logging message:', error);
      }
    }

    return next();
  } catch (error) {
    console.error('Analytics middleware error:', error);
    return next();
  }
};