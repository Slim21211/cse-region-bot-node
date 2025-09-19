import { Telegraf, Markup } from 'telegraf';
import { MyContext } from '../../types';
import { DocumentService } from '../services/document';

export function setupSbpHandlers(bot: Telegraf<MyContext>) {
  bot.hears('СБП', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Памятка по СБП', 'Инструкция по СБП'],
      ['Скрипт для курьеров по СБП', 'Видео урок СБП']
    ]).resize();

    await ctx.reply(
      '<b><i>СБП</i></b>\n\n' +
      'Выберите раздел:\n\n' +
      'Для возврата назад нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Памятка по СБП', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь порядком действий при оплате через СБП:',
      'Documents/fast_pay_reminder.pdf'
    );
  });

  bot.hears('Инструкция по СБП', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь порядком действий при оплате через СБП:',
      'Documents/fast_pay_manual.pdf'
    );
  });

  bot.hears('Скрипт для курьеров по СБП', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь со скриптом для курьеров при оплате через СБП:',
      'Documents/fast_pay_script.pdf'
    );
  });

  bot.hears('Видео урок СБП', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Видео урок СБП',
      'https://drive.google.com/file/d/10LCh0FJMRv8Axt4Lyc3UzIXxpDllxPQA/view?usp=drive_link'
    );
  });
}