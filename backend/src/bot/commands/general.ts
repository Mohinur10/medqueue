import { Markup } from 'telegraf';
import { MyContext } from '../middlewares/authMiddleware';
import { prisma } from '../../prisma/client';
import { logger } from '../../utils/logger';

export const handleClinics = async (ctx: MyContext) => {
  try {
    const clinics = await prisma.hospital.findMany({
      where: { isActive: true },
      take: 10
    });

    if (clinics.length === 0) {
      return ctx.editMessageText("Hozircha tizimda klinikalar yo'q.", 
        Markup.inlineKeyboard([[Markup.button.callback('⬅️ Orqaga', 'action_back')]])
      );
    }

    const buttons = clinics.map(c => [Markup.button.callback(`🏥 ${c.name}`, `clinic_${c.id}`)]);
    buttons.push([Markup.button.callback('⬅️ Orqaga', 'action_back')]);

    await ctx.editMessageText("🏥 <b>Bizning Klinikalar:</b>\nO'zingizga kerakli klinikani tanlang:", {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    });
  } catch (err) {
    logger.error('Error fetching clinics', err);
    ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true });
  }
};

export const handleDoctors = async (ctx: MyContext) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
      include: { user: true, department: { include: { hospital: true } } },
      take: 10
    });

    if (doctors.length === 0) {
      return ctx.editMessageText("Hozircha tizimda shifokorlar yo'q.", 
        Markup.inlineKeyboard([[Markup.button.callback('⬅️ Orqaga', 'action_back')]])
      );
    }

    let msg = '🩺 <b>Bizning Shifokorlar:</b>\n\n';
    doctors.forEach((d, i) => {
      msg += `${i + 1}. <b>Dr. ${d.user.firstName} ${d.user.lastName}</b>\n`;
      msg += `⚕️ ${d.specialization} (${d.department.hospital.name})\n\n`;
    });

    await ctx.editMessageText(msg, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Orqaga', 'action_back')]])
    });
  } catch (err) {
    logger.error('Error fetching doctors', err);
    ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true });
  }
};
