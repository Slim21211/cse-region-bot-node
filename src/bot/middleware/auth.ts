import { MiddlewareFn } from 'telegraf';
import { MyContext } from '../../types';

const ADMIN_IDS = process.env.ADMIN_IDS?.split(',').map(id => parseInt(id.trim())) || [];

export const adminMiddleware: MiddlewareFn<MyContext> = async (ctx, next) => {
  if (!ctx.from || !ADMIN_IDS.includes(ctx.from.id)) {
    await ctx.reply('Вы не можете выполнить эту команду');
    return;
  }
  return next();
};

export const isAdmin = (userId: number): boolean => {
  return ADMIN_IDS.includes(userId);
};