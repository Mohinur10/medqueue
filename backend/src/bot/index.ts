import { Telegraf, Scenes, session } from 'telegraf';
import { logger } from '../utils/logger';
import { startCommand, sudoCommand } from './commands/start';
import { authMiddleware, MyContext } from './middlewares/authMiddleware';
import { prisma } from '../prisma/client';

// Ensure bot token exists or provide fallback for dev
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'DUMMY_TOKEN_FOR_DEV';

export const bot = new Telegraf<MyContext>(BOT_TOKEN);

import { bookingScene } from './scenes/bookingScene';

// Initialize stage and register our booking scene
const stage = new Scenes.Stage<MyContext>([bookingScene]);

// Global Error Handler to prevent crashes (Requirement: No crashes, Try Catch everywhere)
bot.catch((err, ctx) => {
  logger.error(`[Bot Error] for ${ctx.updateType}`, err);
});

import { handleMyQueue, handleHistory } from './commands/patient';
import { handleClinics, handleDoctors } from './commands/general';
import { handleDocSchedule, handleDocQueue, handleNextPatient, handleDocStats, handleDocHistory } from './commands/doctor';

// Middlewares MUST be in order: session -> stage -> auth
bot.use(session());
bot.use(stage.middleware());
bot.use(authMiddleware);

// Core Commands
bot.start(startCommand);
bot.command('sudo', sudoCommand);

// Callback Actions (Patient)
bot.action('action_book_appointment', (ctx) => ctx.scene.enter('book_appointment_scene'));
bot.action('action_clinics', handleClinics);
bot.action('action_doctors', handleDoctors);
bot.action('action_my_queue', handleMyQueue);
bot.action('action_history', handleHistory);

// Callback Actions (Doctor)
bot.action('action_doc_schedule', handleDocSchedule);
bot.action('action_doc_queue', handleDocQueue);
bot.action('action_doc_next_patient', handleNextPatient);
bot.action('action_doc_stats', handleDocStats);
bot.action('action_doc_history', handleDocHistory);

// Common
bot.action('action_back', startCommand);

// Stubs for remaining
bot.action('action_appointments', (ctx) => ctx.answerCbQuery('Uchrashuvlaringiz yuklanmoqda...'));
bot.action('action_news', (ctx) => ctx.answerCbQuery('Yangiliklar...'));
bot.action('action_ai', (ctx) => ctx.answerCbQuery('AI ishga tushmoqda...'));
bot.action('action_contact', (ctx) => ctx.reply('Aloqa markazi: +998901234567'));

// Handle Contact (Phone Number) Sharing
bot.on('contact', async (ctx) => {
  try {
    const contact = ctx.message.contact;
    const telegramId = ctx.from.id.toString();
    const telegramUsername = ctx.from.username;
    
    // Normalize phone (ensure it starts with +)
    let phone = contact.phone_number;
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }

    // Security check: Ensure the contact shared is their own
    if (contact.user_id !== ctx.from.id) {
      return ctx.reply("❌ Iltimos, faqat o'zingizning raqamingizni yuboring.");
    }

    // Upsert user by phone
    await prisma.user.upsert({
      where: { phone },
      update: { telegramId, telegramUsername },
      create: { 
        phone, 
        telegramId, 
        telegramUsername, 
        email: `${telegramId}@medqueue.uz`, // Temporary mock email since email is unique and required
        password: 'NO_PASSWORD',
        role: 'PATIENT'
      }
    });

    await ctx.reply(
      '✅ Telefon raqamingiz muvaffaqiyatli ulandi!\n\nEndi vebsaytga qaytib <b>Login</b> tugmasini bosing. Tasdiqlash kodi shu yerga yuboriladi.',
      { parse_mode: 'HTML', reply_markup: { remove_keyboard: true } }
    );
    
    // Trigger start command again to show the main menu
    await startCommand(ctx as any);

  } catch (error) {
    logger.error('Error handling contact:', error);
    ctx.reply("❌ Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
  }
});

export const startBot = async () => {
  if (BOT_TOKEN === 'DUMMY_TOKEN_FOR_DEV') {
    logger.warn('TELEGRAM_BOT_TOKEN is missing in .env. Bot will not connect to Telegram servers.');
    return;
  }
  
  try {
    logger.info('Telegram Bot successfully started and listening for real-time events!');
    bot.launch();
  } catch (error) {
    logger.error('Failed to launch Telegram Bot:', error);
  }
};

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
