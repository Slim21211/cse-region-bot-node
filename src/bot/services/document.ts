import { supabase } from '../../database/supabase';
import { MyContext } from '../../types';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export class DocumentService {
  static async sendDocumentWithMessage(
    ctx: MyContext,
    messageText: string,
    documentPath: string,
    finalText: boolean = true,
    startText: boolean = true
  ) {
    try {
      if (startText && messageText) {
        await ctx.reply(messageText);
      }
      const { data } = supabase.storage
        .from('files')
        .getPublicUrl(documentPath);

        const filename = documentPath.split('/').pop() || 'document.pdf';

      if (!data?.publicUrl) {
        throw new Error('Не удалось получить ссылку на документ');
      }

      await ctx.replyWithDocument(
        { url: data.publicUrl, filename },
        { caption: `📄 Документ: ${filename}` }
      );

      if (finalText) {
        await ctx.reply('Для возврата нажмите /home', { parse_mode: 'HTML' });
      }
    } catch (error) {
      console.error('Error sending document:', error);
      await ctx.reply('Произошла ошибка при отправке документа');
    }
  }

  static async sendVideoLink(
    ctx: MyContext,
    title: string,
    videoUrl: string,
    backButton: boolean = false,
    finalText: boolean = true
  ) {
    try {
      const keyboard: InlineKeyboardMarkup = {
        inline_keyboard: [
          [{ text: 'Смотреть видео', url: videoUrl }]
        ]
      };

      await ctx.reply(
        `<b>${title}</b>\nДля просмотра видео перейдите по ссылке:`,
        {
          reply_markup: keyboard,
          parse_mode: 'HTML'
        }
      );

      if (finalText) {
        await ctx.reply('Для возврата нажмите /home', { parse_mode: 'HTML' });
      }

      if (backButton) {
        await ctx.reply('Для возврата нажмите /back');
      }
    } catch (error) {
      console.error('Error sending video link:', error);
      await ctx.reply('Произошла ошибка при отправке видео');
    }
  }
}