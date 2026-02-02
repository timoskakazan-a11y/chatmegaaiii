import { Telegraf, Markup } from 'telegraf';

const BOT_TOKEN = "8328506256:AAHdrm3QvgrB_HZ4K2z6l7C9O5R6r5-oX_Q";
const bot = new Telegraf(BOT_TOKEN);

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { target_chat_id, message, buttons } = body;

    if (!target_chat_id || !message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing chat ID or message text' }) };
    }

    // Prepare keyboard
    let keyboard: any = undefined;
    if (buttons && Array.isArray(buttons) && buttons.length > 0) {
      // Filter out empty buttons
      const validButtons = buttons.filter((b: any) => b.label && b.url);
      
      if (validButtons.length > 0) {
        // Create a vertical list of buttons (1 per row)
        const buttonRows = validButtons.map((b: any) => [Markup.button.url(b.label, b.url)]);
        keyboard = Markup.inlineKeyboard(buttonRows);
      }
    }

    // Send message
    await bot.telegram.sendMessage(target_chat_id, message, {
      parse_mode: 'HTML',
      ...keyboard
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error: any) {
    console.error('Publish error:', error);
    // Return error message to UI (e.g. "Chat not found" or "Bot not admin")
    return { statusCode: 500, body: JSON.stringify({ error: error.description || error.message || 'Failed to send post' }) };
  }
};