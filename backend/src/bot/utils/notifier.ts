import { Telegraf } from 'telegraf';
import { prisma } from '../../prisma/client';
import { logger } from '../../utils/logger';

export const sendPushNotification = async (bot: Telegraf<any>, patientUserId: string, message: string) => {
  try {
    // 1. Find the user's telegram ID using their global User ID
    const user = await prisma.user.findUnique({
      where: { id: patientUserId }
    });

    if (!user || !user.telegramId) {
      logger.info(`Notification skipped: User ${patientUserId} does not have a linked Telegram account.`);
      return false; // Not a failure, just can't notify
    }

    // 2. Send the message via Telegram Bot API safely
    await bot.telegram.sendMessage(user.telegramId, message, { parse_mode: 'HTML' });
    logger.info(`Push notification sent to ${user.telegramId}`);
    return true;

  } catch (error: any) {
    // We catch and log the error, but we DO NOT throw it.
    // Throwing here would crash the doctor's "Next Patient" flow if the patient blocked the bot.
    logger.error(`Failed to send push notification to user ${patientUserId}:`, error.message);
    return false;
  }
};
