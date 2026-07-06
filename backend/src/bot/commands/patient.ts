import { Markup } from 'telegraf';
import { MyContext } from '../middlewares/authMiddleware';
import { prisma } from '../../prisma/client';
import { logger } from '../../utils/logger';

export const handleMyQueue = async (ctx: MyContext) => {
  try {
    if (!ctx.user) {
      return ctx.answerCbQuery("Iltimos, avval tizimga kiring (Sayt orqali bog'laning).", { show_alert: true });
    }

    // Find the patient's active queues
    const queues = await prisma.queue.findMany({
      where: {
        appointment: { patient: { userId: ctx.user.id } },
        status: { in: ['WAITING', 'SERVING'] }
      },
      include: {
        doctor: { include: { user: true } },
        department: { include: { hospital: true } }
      }
    });

    if (queues.length === 0) {
      return ctx.editMessageText(
        "Sizda hozirda faol navbatlar yo'q. 🎫",
        Markup.inlineKeyboard([[Markup.button.callback('⬅️ Orqaga', 'action_back')]])
      );
    }

    const q = queues[0]; // Assuming showing the first active queue for simplicity
    
    // Calculate how many people are before them
    const peopleAhead = await prisma.queue.count({
      where: {
        doctorId: q.doctorId,
        status: 'WAITING',
        number: { lt: q.number }
      }
    });

    const msg = `🎫 <b>Sizning navbatingiz</b>\n\n`
      + `🏥 Klinika: <b>${q.department.hospital.name}</b>\n`
      + `🩺 Shifokor: <b>Dr. ${q.doctor.user.firstName} ${q.doctor.user.lastName}</b>\n`
      + `🏢 Bo'lim: <b>${q.department.name}</b>\n\n`
      + `🔢 Sizning raqamingiz: <b>#${q.number}</b>\n`
      + `👥 Oldingizda: <b>${peopleAhead} kishi</b> bor\n\n`
      + `Holati: <b>${q.status === 'SERVING' ? '🔴 HOZIR SIZNING NAVBATINGIZ!' : '🟡 Kutilmoqda'}</b>`;

    await ctx.editMessageText(msg, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🔄 Yangilash', 'action_my_queue')],
        [Markup.button.callback('⬅️ Bosh menyu', 'action_back')]
      ])
    });

  } catch (err) {
    logger.error('Error fetching queue', err);
    ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true });
  }
};

export const handleHistory = async (ctx: MyContext) => {
  try {
    if (!ctx.user) return ctx.answerCbQuery("Iltimos tizimga kiring.");

    const history = await prisma.appointment.findMany({
      where: {
        patient: { userId: ctx.user.id },
        status: { in: ['COMPLETED', 'CANCELLED'] }
      },
      include: {
        doctor: { include: { user: true, department: { include: { hospital: true } } } }
      },
      orderBy: { date: 'desc' },
      take: 5
    });

    if (history.length === 0) {
      return ctx.editMessageText("📜 Sizda avvalgi uchrashuvlar tarixi mavjud emas.", Markup.inlineKeyboard([[Markup.button.callback('⬅️ Orqaga', 'action_back')]]));
    }

    let msg = `📜 <b>Sizning oxirgi 5 ta uchrashuv tarixingiz:</b>\n\n`;
    history.forEach((h, index) => {
      const d = new Date(h.date);
      const dateStr = d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const statusIcon = h.status === 'COMPLETED' ? '✅' : '❌';
      
      msg += `<b>${index + 1}. Dr. ${h.doctor.user.lastName}</b> - ${h.doctor.department.hospital.name}\n`;
      msg += `📅 Sana: ${dateStr}\n`;
      msg += `Holati: ${statusIcon} ${h.status}\n\n`;
    });

    await ctx.editMessageText(msg, { parse_mode: 'HTML', ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Bosh menyu', 'action_back')]]) });

  } catch (err) {
    logger.error('Error fetching history', err);
    ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true });
  }
};
