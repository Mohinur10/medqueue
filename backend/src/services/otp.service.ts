import { bot } from '../bot';
import { logger } from '../utils/logger';

export class OtpService {
  /**
   * Telegram orqali 6-xonali OTP jo'natish funksiyasi
   * @param telegramId Foydalanuvchining Telegram ID si
   * @param code 6-xonali tasdiqlash kodi
   */
  static async sendTelegramOtp(telegramId: string, code: string): Promise<boolean> {
    try {
      const message = `🔐 <b>MedQueue Tasdiqlash Kodi</b>\n\n`
        + `<b>${code}</b>\n\n`
        + `Kod 2 daqiqa amal qiladi.\n`
        + `Uni hech kimga bermang!`;

      await bot.telegram.sendMessage(telegramId, message, { parse_mode: 'HTML' });
      return true;
    } catch (error) {
      logger.error(`[OTP Service] Failed to send Telegram OTP to ${telegramId}:`, error);
      return false; // Fail gracefully
    }
  }

  /**
   * 6-xonali tasodifiy son yaratish
   */
  static generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
