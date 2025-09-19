import { Telegraf, Markup } from 'telegraf';
import { MyContext, SessionData } from '../../types';
import { DocumentService } from '../services/document';

export function setupBaseTrainingHandlers(bot: Telegraf<MyContext>) {
  bot.hears('Базовое обучение', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Программа Базового обучения'],
      ['Начало рабочего дня', 'Расходные материалы'],
      ['Накладная', 'Доставка лично в руки'],
      ['Доставка с возвратом', 'Забор за наличные деньги'],
      ['Международное отправление', 'Завершение рабочего дня'],
      ['Тест по базовому обучению']
    ]).resize();

    await ctx.reply(
      'Выберите интересующий раздел\n\nДля возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.command('back', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Программа Базового обучения'],
      ['Начало рабочего дня', 'Расходные материалы'],
      ['Накладная', 'Доставка лично в руки'],
      ['Доставка с возвратом', 'Забор за наличные деньги'],
      ['Международное отправление', 'Завершение рабочего дня']
    ]).resize();

    await ctx.reply(
      'Выберите интересующий раздел\n\nДля возврата нажмите /home',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  // Program
  bot.hears('Программа Базового обучения', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с программой базового обучения:',
      'Documents/study_program.pdf'
    );
  });

  // Start of work day
  bot.hears('Начало рабочего дня', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Начало рабочего дня (текст)', 'Начало рабочего дня (видео)']
    ]).resize();

    await ctx.reply(
      '<b><i>Начало рабочего дня</i></b>\n\n' +
      'Выберите формат обучающего материала:\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Начало рабочего дня (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с порядком действий в начале рабочего дня:',
      'Documents/start_day.pdf'
    );
  });

  bot.hears('Начало рабочего дня (видео)', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Начало рабочего дня',
      'https://drive.google.com/file/d/10hm8iQ8OyytR-phHhQmwh25Lr2BUtDpR/view?usp=drive_link',
      true,
      false
    );
  });

  // Materials
  bot.hears('Расходные материалы', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Расходные материалы (текст)', 'Расходные материалы (видео)']
    ]).resize();

    await ctx.reply(
      '<b><i>Расходные материалы</i></b>\n\n' +
      'Выберите формат обучающего материала:\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Расходные материалы (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с порядком работы с расходными материалами:',
      'Documents/expend_materials.pdf'
    );
  });

  bot.hears('Расходные материалы (видео)', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Расходные материалы',
      'https://drive.google.com/file/d/1c55YdtzeFyOfyQIQRVcqdFOTZYgnh7c6/view?usp=drive_link',
      true,
      false
    );
  });

  // Invoice
  bot.hears('Накладная', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Накладная (текст)', 'Накладная (видео)']
    ]).resize();

    await ctx.reply(
      '<b><i>Накладная</i></b>\n\n' +
      'Выберите формат обучающего материала:\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Накладная (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с порядком работы с накладными:',
      'Documents/invoice.pdf'
    );
  });

  bot.hears('Накладная (видео)', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Накладная',
      'https://drive.google.com/file/d/1ddLAjq9t8mki7M-Dr33pv_Z4SkJ1H_Cq/view?usp=drive_link',
      true,
      false
    );
  });

  // Personal delivery
  bot.hears('Доставка лично в руки', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Доставка лично в руки (текст)', 'Доставка лично в руки (видео)']
    ]).resize();

    await ctx.reply(
      '<b><i>Доставка лично в руки</i></b>\n\n' +
      'Выберите формат обучающего материала:\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Доставка лично в руки (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с порядком работы при доставке лично в руки:',
      'Documents/deliv_person.pdf'
    );
  });

  bot.hears('Доставка лично в руки (видео)', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Доставка лично в руки',
      'https://drive.google.com/file/d/1dT0o7FTahiWOPKY3UmyBmHy4g-5xS7cE/view?usp=drive_link',
      true,
      false
    );
  });

  // Return delivery
  bot.hears('Доставка с возвратом', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Доставка с возвратом (текст)', 'Доставка с возвратом (видео)']
    ]).resize();

    await ctx.reply(
      '<b><i>Доставка с возвратом</i></b>\n\n' +
      'Выберите формат обучающего материала:\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Доставка с возвратом (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с порядком работы при доставке с возвратом:',
      'Documents/return_shipping.pdf'
    );
  });

  bot.hears('Доставка с возвратом (видео)', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Доставка с возвратом',
      'https://drive.google.com/file/d/1VA0TZDJV9cfCTiR93vHnOQ9U2mix0QR-/view?usp=drive_link',
      true,
      false
    );
  });

  // Cash collection
  bot.hears('Забор за наличные деньги', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Забор за наличные деньги (текст)', 'Забор за наличные деньги (видео)']
    ]).resize();

    await ctx.reply(
      '<b><i>Забор за наличные деньги</i></b>\n\n' +
      'Выберите формат обучающего материала:\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Забор за наличные деньги (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с порядком работы при заборе за наличные деньги:',
      'Documents/reception_cash.pdf'
    );
  });

  bot.hears('Забор за наличные деньги (видео)', async (ctx) => {
    await ctx.reply(
      'Материал на доработке...\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      { parse_mode: 'HTML' }
    );
  });

  // International shipping
  bot.hears('Международное отправление', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Международное отправление (текст)', 'Международное отправление (видео)']
    ]).resize();

    await ctx.reply(
      '<b><i>Международное отправление</i></b>\n\n' +
      'Выберите формат обучающего материала:\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Международное отправление (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с порядком работы при международном отправлении:',
      'Documents/international_shipping.pdf'
    );
  });

  bot.hears('Международное отправление (видео)', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Международное отправление',
      'https://drive.google.com/file/d/1zsgs04VACCAGVrQcRK1j6BlNopSBdwOb/view?usp=drive_link',
      true,
      false
    );
  });

  // End of work day
  bot.hears('Завершение рабочего дня', async (ctx) => {
    const keyboard = Markup.keyboard([
      ['Завершение рабочего дня (текст)', 'Завершение рабочего дня (видео)']
    ]).resize();

    await ctx.reply(
      '<b><i>Завершение рабочего дня</i></b>\n\n' +
      'Выберите формат обучающего материала:\n\n' +
      'Для возврата в начало нажмите /home\n\n' +
      'Для возврата к списку разделов нажмите /back',
      {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      }
    );
  });

  bot.hears('Завершение рабочего дня (текст)', async (ctx) => {
    await DocumentService.sendDocumentWithMessage(
      ctx,
      'Ознакомьтесь с порядком работы при завершении рабочего дня:',
      'Documents/end_day.pdf'
    );
  });

  bot.hears('Завершение рабочего дня (видео)', async (ctx) => {
    await DocumentService.sendVideoLink(
      ctx,
      'Завершение рабочего дня',
      'https://drive.google.com/file/d/1dA_x8cU2_WElcrfJehb5uRgGJnsHo921/view?usp=drive_link',
      true,
      false
    );
  });

  // Test
  bot.hears('Тест по базовому обучению', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('Базовое тестирование', 'https://short.startexam.com/B6HL1SHQ')]
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