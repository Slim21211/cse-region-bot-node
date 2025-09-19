import { Telegraf } from 'telegraf';
import { MyContext } from '../../types';
import { setupAdminHandlers } from './admin';
import { setupBaseTrainingHandlers } from './base-training';
import { setupCargoHandlers } from './cargo';
import { setupPvzHandlers } from './pvz';
import { setupSbpHandlers } from './sbp';
import { setupMentorHandlers } from './mentors';
import { setupTracesHandlers } from './traces';
import { setupTestHandlers } from './tests';
import { setupVsdHandlers } from './vsd';
import { setupHomeHandler } from './home';

export function setupHandlers(bot: Telegraf<MyContext>) {
  // Main menu
  setupHomeHandler(bot);
  
  // Admin functions
  setupAdminHandlers(bot);
  
  // Training sections
  setupBaseTrainingHandlers(bot);
  setupCargoHandlers(bot);
  setupPvzHandlers(bot);
  setupSbpHandlers(bot);
  setupMentorHandlers(bot);
  setupTracesHandlers(bot);
  setupTestHandlers(bot);
  setupVsdHandlers(bot);
  
  // Default handler for unknown messages
  bot.on('text', async (ctx) => {
    await ctx.reply(
      'Для возврата в начало нажмите /home\n\n' +
      'Если у Вас возникли вопросы, ответы на которые Вы не нашли в этом боте, ' +
      'обратитесь в Отдел обучения и развития\n\n' +
      'Для продолжения работы переключите клавиатуру на кнопки и выберите один из разделов ниже:'
    );
  });
}