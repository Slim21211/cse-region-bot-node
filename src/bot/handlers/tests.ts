import { Telegraf, Markup } from 'telegraf';
import { MyContext } from '../../types';

export function setupTestHandlers(bot: Telegraf<MyContext>) {
  bot.hears('ТЕСТЫ', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Тест по базовому обучению', 'Тест Почтоматы и ПВЗ'],
      ['Тест Джамилько', 'Тест Температурные грузы'],
      ['Тест ВСД / ВПД', 'Тест Акт осмотра/Акт несоответствия'],
      ['Тест Просвещение', 'Тест Привязка грузовых мест'],
      ['Тест Авито для диспетчера', 'Тест Авито для К/В/Э'],
      ['Тест по МПК', 'Тест Доставка WB']
    ]).resize();

    await ctx.reply(
      'Для возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  // Test handlers
  const tests = [
    { name: 'Тест Почтоматы и ПВЗ', url: 'https://short.startexam.com/Yny_U_4t' },
    { name: 'Тест Джамилько', url: 'https://short.startexam.com/secVT8QM' },
    { name: 'Тест ВСД / ВПД', url: 'https://short.startexam.com/rFE5wIiY' },
    { name: 'Тест Просвещение', url: 'https://short.startexam.com/zwSgs6RW' },
    { name: 'Тест Привязка грузовых мест', url: 'https://short.startexam.com/XzTylbnc' },
    { name: 'Тест Авито для диспетчера', url: 'https://short.startexam.com/cVdg5zt2' },
    { name: 'Тест Авито для К/В/Э', url: 'https://short.startexam.com/yDSp-xOX' },
    { name: 'Тест по МПК', url: 'https://short.startexam.com/6y2pPKPj' },
    { name: 'Тест Доставка WB', url: 'https://short.startexam.com/_3YcfcWV' },
    { name: 'Тест Акт осмотра/Акт несоответствия', url: 'https://short.startexam.com/KZNee4D8' }
  ];

  tests.forEach(test => {
    bot.hears(test.name, async (ctx) => {
      const keyboard = Markup.inlineKeyboard([
        [Markup.button.url(test.name, test.url)]
      ]);

      await ctx.reply(
        'Перейдите по ссылке, чтобы пройти тестирование:',
        {
          parse_mode: 'HTML',
          reply_markup: keyboard.reply_markup
        }
      );

      await ctx.reply('Для возврата в меню нажмите /home');
    });
  });

  // Temperature cargo tests submenu
  bot.hears('Тест Температурные грузы', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Тест Температурные грузы для курьеров'],
      ['Тест Температурные грузы для диспетчеров']
    ]).resize();

    await ctx.reply(
      'Для возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Тест Температурные грузы для курьеров', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('Тест Температурные грузы для курьеров', 'https://short.startexam.com/tIx4yKMY')]
    ]);

    await ctx.reply(
      'Перейдите по ссылке, чтобы пройти тестирование:',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );

    await ctx.reply('Для возврата в меню нажмите /home');
  });

  bot.hears('Тест Температурные грузы для диспетчеров', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('Тест Температурные грузы для диспетчеров', 'https://short.startexam.com/X5bWMGgg')]
    ]);

    await ctx.reply(
      'Перейдите по ссылке, чтобы пройти тестирование:',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );

    await ctx.reply('Для возврата в меню нажмите /home');
  });
}