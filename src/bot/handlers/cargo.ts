import { Telegraf, Markup } from 'telegraf';
import { MyContext } from '../../types';
import { DocumentService } from '../services/document';

export function setupCargoHandlers(bot: Telegraf<MyContext>) {
  bot.hears('КАРГО', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Видео урок Карго', 'Памятка Карго'],
      ['Схема трейсов', 'Презентация Карго'],
      ['Электронные чеки']
    ]).resize();

    await ctx.reply(
      'Выберите интересующий раздел\n\nДля возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Видео урок Карго', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Карго. Основные операции',
      'https://drive.google.com/file/d/1Bf6vn0BgSEtYXoV-TKXQkeWAHiWWE23Y/view?usp=drive_link'
    );
  });

  bot.hears('Памятка Карго', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с инструкцией по работе с мобильным приложением Cargo5:',
      'Documents/cargo_manual.pdf'
    );
  });

  bot.hears('Схема трейсов', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь со схемой трейсов:',
      'Documents/traces_scheme.pdf'
    );
  });

  bot.hears('Презентация Карго', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с презентацией по работе в мобильном приложении:',
      'Documents/cargo-presentation.pdf'
    );
  });

  bot.hears('Электронные чеки', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с инструкцией по работе с интернет-магазинами (электронные чеки):',
      'Documents/e_chek.pdf'
    );
  });
}