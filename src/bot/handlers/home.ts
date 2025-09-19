import { Telegraf } from 'telegraf';
import { Markup } from 'telegraf';
import { MyContext } from '../../types';
import { isAdmin } from '../middleware/auth';

export function setupHomeHandler(bot: Telegraf<MyContext>) {
  bot.command('home', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Для стажеров', 'Базовое обучение'],
      ['КАРГО', 'ПВЗ и почтоматы'],
      ['СБП', 'Для наставника'],
      ['ВСД / ВПД / Просвещение', 'Самоинкассация'],
      ['ТЕСТЫ', 'Casarte'],
      ['Система трейсов', 'Джамилько'],
      ['Температурные грузы', 'Программа "Лучший сотрудник"'],
      ['Акт осмотра/Акт несоответствия', 'РЕСТОР'],
      ['Диспетчер', 'СТОПы'],
      ['Правила парковки', 'Обучение по ошибкам'],
      ['ПВЗ Авито', 'Охрана труда'],
      ['Доставка WB'],
      ['Привязка грузовых мест при сборе. Сдача в ячейку', 'Обновление МПК']
    ]).resize();

    // Add admin button for admins
    if (ctx.from && isAdmin(ctx.from.id)) {
      keyboard.keyboard.push(['Функции для администраторов']);
    }

    await ctx.reply('Выберите раздел:', {
      parse_mode: 'HTML',
      reply_markup: keyboard.reply_markup
    });
  });

  bot.hears('Для стажеров', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Памятка стажера']
    ]).resize();

    await ctx.reply(
      'Выберите интересующий раздел\n\nДля возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Памятка стажера', async (ctx) => {
    await ctx.reply('Ознакомьтесь с памяткой для стажеров:');
    await ctx.reply('📄 Документ: Памятка для курьеров и водителей.pdf');
    await ctx.reply('Для возврата нажмите /home', { parse_mode: 'HTML' });
  });
}