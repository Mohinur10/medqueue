import { Markup } from 'telegraf';
import { MyContext } from '../middlewares/authMiddleware';
import { prisma } from '../../prisma/client';
import { logger } from '../../utils/logger';

export const startCommand = async (ctx: MyContext) => {
  try {
    // Check if user is linked (from authMiddleware)
    const user = ctx.user;

    if (user) {
      const welcomeMsg = `🏥 <b>MedQueue - Smart Healthcare</b>\n\n`
        + `Xush kelibsiz, <b>${user.firstName || user.phone}</b>!\n`
        + `Tizimdagi maqomingiz: <b>${user.role}</b>\n\n`
        + `Iltimos, o'zingizga kerakli bo'limni tanlang:`;
      
      let buttons = [];

      switch (user.role) {
        case 'PATIENT':
          buttons = [
            [Markup.button.callback('📅 Navbat olish (Bron)', 'action_book_appointment')],
            [Markup.button.callback('🎫 Mening navbatlarim', 'action_my_queue'), Markup.button.callback('📜 Tarix', 'action_history')],
            [Markup.button.callback('🏥 Klinikalar', 'action_clinics'), Markup.button.callback('👨‍⚕️ Doktorlar', 'action_doctors')],
            [Markup.button.callback('⚙️ Sozlamalar', 'action_settings'), Markup.button.callback('🤖 AI Yordamchi', 'action_ai')]
          ];
          break;
        case 'DOCTOR':
          buttons = [
            [Markup.button.callback('📅 Bugungi jadval', 'action_doc_schedule')],
            [Markup.button.callback('👥 Joriy navbat', 'action_doc_queue'), Markup.button.callback('📋 Bemorlar tarixi', 'action_doc_history')],
            [Markup.button.callback('📊 Kunlik statistika', 'action_doc_stats'), Markup.button.callback('⚙️ Sozlamalar', 'action_settings')]
          ];
          break;
        case 'CLINIC_DIRECTOR':
          buttons = [
            [Markup.button.callback('🏢 Klinika profili', 'action_dir_clinic')],
            [Markup.button.callback('👨‍⚕️ Doktorlarni boshqarish', 'action_dir_doctors')],
            [Markup.button.callback('📈 Navbat va Statistikalar', 'action_dir_stats')],
            [Markup.button.callback('📢 E\'lon yuborish', 'action_dir_broadcast')]
          ];
          break;
        case 'SUPER_ADMIN':
          buttons = [
            [Markup.button.callback('💻 Tizim boshqaruvi', 'action_adm_dashboard')],
            [Markup.button.callback('🏥 Barcha Klinikalar', 'action_adm_clinics'), Markup.button.callback('👨‍💼 Direktorlar', 'action_adm_directors')],
            [Markup.button.callback('🌍 Global E\'lonlar', 'action_adm_broadcast'), Markup.button.callback('📡 AI Tower', 'action_adm_ai')]
          ];
          break;
        default:
          buttons = [
            [Markup.button.callback('📍 Tizim haqida', 'action_about')]
          ];
      }

      const keyboard = Markup.inlineKeyboard(buttons);
      return ctx.reply(welcomeMsg, { parse_mode: 'HTML', ...keyboard });
    }

    // Unlinked User - Request Contact
    const welcomeMsg = `🏥 <b>MedQueue - Smart Healthcare</b> tizimiga xush kelibsiz!\n\n`
      + `Siz hali profilingizni ulashmadingiz. Tizimdan to'liq foydalanish va uchrashuvlarni boshqarish uchun <b>Telefon raqamingizni ulashing</b>.\n\n`
      + `👇 Quyidagi tugmani bosing:`;
    
    const contactKeyboard = Markup.keyboard([
      [Markup.button.contactRequest('📱 Telefon raqamni ulash')]
    ]).oneTime().resize();

    await ctx.reply(welcomeMsg, { parse_mode: 'HTML', ...contactKeyboard });

  } catch (error) {
    logger.error('Error in start command:', error);
    return ctx.reply('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
  }
};

export const sudoCommand = async (ctx: MyContext) => {
  try {
    const user = ctx.user;
    if (!user) {
      return ctx.reply('Siz hali tizimdan ro\'yxatdan o\'tmagansiz. Avval /start orqali raqamingizni yuboring.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SUPER_ADMIN' }
    });

    return ctx.reply('🔥 Tabriklaymiz! Siz SUPER ADMIN maqomini oldingiz. /start ni bossangiz yangi panel ochiladi.');
  } catch (error) {
    logger.error('Error in sudo command:', error);
    return ctx.reply('Xatolik yuz berdi.');
  }
};
