import { Telegraf, Markup } from 'telegraf';
import { MyContext } from '../../types';
import { DocumentService } from '../services/document';

export function setupTracesHandlers(bot: Telegraf<MyContext>) {
  bot.hears('Система трейсов', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Трейсы для курьеров', 'Трейсы для диспетчера'],
      ['Трейсы для логиста', 'Практические кейсы']
    ]).resize();

    await ctx.reply(
      'Для возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Трейсы для курьеров', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с новой системой трейсов:',
      'Documents/traces-courier.pdf',
      false
    );
    
    await DocumentService.sendDocumentWithMessage(
      ctx,
      '',
      'Documents/traces_scheme.pdf',
      true,
      false
    );
  });

  bot.hears('Трейсы для диспетчера', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с новой системой трейсов для диспетчеров:',
      'Documents/disp_traces_presentation.pdf'
    );
  });

  bot.hears('Трейсы для логиста', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с новой системой трейсов для логистов:',
      'Documents/traces_logist.pdf'
    );
  });

  bot.hears('Практические кейсы', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с практическими кейсами:',
      'Documents/traces_practic_cases.pdf'
    );
  });
}