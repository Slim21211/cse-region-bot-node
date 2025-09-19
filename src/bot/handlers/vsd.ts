import { Telegraf, Markup } from 'telegraf';
import { MyContext } from '../../types';
import { DocumentService } from '../services/document';

export function setupVsdHandlers(bot: Telegraf<MyContext>) {
  bot.hears('ВСД / ВПД / Просвещение', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Памятка по заполнению ВСД клиентов JTI, Нестле', 'Презентация ВСД / ВПД'],
      ['Тест ВСД / ВПД', 'Просвещение (текст)'],
      ['Просвещение (видео)', 'Тест Просвещение']
    ]).resize();

    await ctx.reply(
      'Для возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Памятка по заполнению ВСД клиентов JTI, Нестле', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с памяткой по заполнению ВСД клиентов JTI, Нестле:',
      'Documents/VSD_reminder.pdf'
    );
  });

  bot.hears('Презентация ВСД / ВПД', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с презентацией ВСД / ВПД:',
      'Documents/VSD_presentation.pdf'
    );
  });

  bot.hears('Просвещение (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с презентацией:',
      'Documents/Просвещение текст.pdf'
    );
  });

  bot.hears('Просвещение (видео)', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Просвещение (видео)',
      'https://drive.google.com/file/d/1xwI9PlqM-YebjaMjOBKdyu3CzsFeh2sm/view?usp=sharing'
    );
  });
}