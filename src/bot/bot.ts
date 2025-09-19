import { Telegraf, session } from 'telegraf';
import { MyContext } from '../types';
import { analyticsMiddleware } from './middleware/analytics';
import { setupHandlers } from './handlers';

const token = process.env.TELEGRAM_BOT_TOKEN!;

export const bot = new Telegraf<MyContext>(token);

// Простая типизация сессии
bot.use(session());

// Analytics middleware
bot.use(analyticsMiddleware);

// Setup all handlers
setupHandlers(bot);

console.log('Bot initialized successfully');