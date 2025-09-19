import dotenv from 'dotenv';
import express from 'express';
import { bot } from './bot/bot';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Bot is running!' });
});

// Webhook endpoint
app.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// Set webhook for production
if (process.env.NODE_ENV === 'production') {
  const webhookUrl = `${process.env.WEBHOOK_URL}/webhook/${process.env.TELEGRAM_BOT_TOKEN}`;
  bot.telegram.setWebhook(webhookUrl);
  console.log(`Webhook set to: ${webhookUrl}`);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  if (process.env.NODE_ENV !== 'production') {
    bot.launch();
    console.log('Bot started in polling mode');
  }
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));