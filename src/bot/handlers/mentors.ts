import { Telegraf, Markup } from 'telegraf';
import { MyContext } from '../../types';
import { DocumentService } from '../services/document';

export function setupMentorHandlers(bot: Telegraf<MyContext>) {
  bot.hears('Для наставника', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Видео урок для наставников', 'Презентация для наставников'],
      ['Памятка для наставников', 'Тест для наставников']
    ]).resize();

    await ctx.reply(
      'Для возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Видео урок для наставников', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Видео урок для наставников',
      'https://drive.google.com/file/d/1MSDuS72YwKESSEI9FR08-HAGR5qCbMh-/view?usp=drive_link'
    );
  });

  bot.hears('Презентация для наставников', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с презентацией для наставников:',
      'Documents/mentors_presentation.pdf'
    );
  });

  bot.hears('Памятка для наставников', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с памяткой для наставников:',
      'Documents/mentors_reminder.pdf'
    );
  });

  bot.hears('Тест для наставников', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('Тест для наставников', 'https://short.startexam.com/-491kseC')]
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