import { Telegraf } from 'telegraf';

// --- CONFIGURATION ---
const BOT_TOKEN = "8328506256:AAHdrm3QvgrB_HZ4K2z6l7C9O5R6r5-oX_Q";

const bot = new Telegraf(BOT_TOKEN);

// --- BOT LOGIC ---

const ABOUT_MESSAGE = `👋 <b>Привет! Я — Мега Чат-бот с ИИ.</b> 🤖

Сейчас я нахожусь на стадии активной разработки. Совсем скоро я стану твоим персональным умным помощником!

🚀 <b>Что я буду уметь:</b>
• Отвечать на любые вопросы
• Помогать с идеями и текстами
• Решать задачи
• И просто быть отличным собеседником

Следи за обновлениями, скоро будет интересно! ✨`;

// Start Command
bot.start(async (ctx) => {
  await ctx.reply(ABOUT_MESSAGE, { parse_mode: 'HTML' });
});

// Handle All Text Messages
bot.on('text', async (ctx) => {
    // Reply with the introduction regardless of what is typed
    await ctx.reply(ABOUT_MESSAGE, { parse_mode: 'HTML' });
});

export const handler = async (event: any, context: any) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const body = JSON.parse(event.body);
    await bot.handleUpdate(body);
    return { statusCode: 200, body: JSON.stringify({ message: 'OK' }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed' }) };
  }
};