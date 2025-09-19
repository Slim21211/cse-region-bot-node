import { Telegraf, Markup } from 'telegraf';
import { MyContext } from '../../types';
import { DocumentService } from '../services/document';

export function setupPvzHandlers(bot: Telegraf<MyContext>) {
  bot.hears('ПВЗ и почтоматы', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Видео урок ПВЗ', 'Инструкция почтоматы Халва'],
      ['Презентация почтоматы Халва', 'Тест Почтоматы и ПВЗ']
    ]).resize();

    await ctx.reply(
      'Выберите интересующий раздел\n\nДля возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Видео урок ПВЗ', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Видео урок ПВЗ',
      'https://drive.google.com/file/d/1DpceGHOzdDcMh9f3-oUK5LW6GSzBx08z/view?usp=drive_link'
    );
  });

  bot.hears('Инструкция почтоматы Халва', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с инструкцией по закладке и изъятию отправлений в почтоматах Халва:',
      'Documents/halva.pdf'
    );
  });

  bot.hears('Презентация почтоматы Халва', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с инструкцией по закладке и изъятию отправлений в почтоматах Халва:',
      'Documents/halva_presentation.pdf'
    );
  });
}