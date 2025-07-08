import { Telegraf } from 'telegraf';
import 'dotenv/config';
const bot = new Telegraf(process.env.TOKEN_BOT);

export async function sendMessageToChannel(message) {
  let retryingCount = 1;
  let maxRetryingCount = 3;
  while (retryingCount <= maxRetryingCount) {
    try {
      const msg = await bot.telegram.sendMessage(
        process.env.CHANNEL_ID,
        message
      );
      console.log(`success send message ${msg.text}`);
      break;
    } catch (error) {
      retryingCount++;
      console.log(error);
    }
  }
}
