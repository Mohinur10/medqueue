import { Markup } from 'telegraf';
import { MyContext } from '../middlewares/authMiddleware';
import { prisma } from '../../prisma/client';
import { logger } from '../../utils/logger';
import { sendPushNotification } from '../utils/notifier';
import { bot } from '../index'; // import the main bot instance to send notifications

// Helper to get doctor profile
const getDoctor = async (userId: string) => {
  return await prisma.doctor.findUnique({
    where: { userId },
    include: { department: { include: { hospital: true } } }
  });
};

export const handleDocSchedule = async (ctx: MyContext) => {
  try {
    if (!ctx.user) return ctx.answerCbQuery("Iltimos tizimga kiring.");
    
    const doctor = await getDoctor(ctx.user.id);
    if (!doctor) return ctx.answerCbQuery("Doktor profili topilmadi.");

    // Get today's start and end
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        date: { gte: today, lte: endOfDay }
      },
      include: { patient: { include: { user: true } }, queue: true },
      orderBy: { date: 'asc' }
    });

    if (appointments.length === 0) {
      return ctx.editMessageText("📅 Bugun uchun sizda uchrashuvlar mavjud emas.", Markup.inlineKeyboard([[Markup.button.callback('⬅️ Orqaga', 'action_back')]]));
    }

    let msg = `📅 <b>Bugungi Uchrashuvlar Jadvali</b>\n\n`;
    appointments.forEach((a, i) => {
      const timeStr = new Date(a.date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const qNum = a.queue ? `#${a.queue.number}` : '-';
      msg += `<b>${i + 1}. ${timeStr}</b> | Bemor: ${a.patient.user.firstName || a.patient.user.phone} | Navbat: ${qNum} | Holati: ${a.status}\n`;
    });

    await ctx.editMessageText(msg, { parse_mode: 'HTML', ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Bosh menyu', 'action_back')]]) });

  } catch (err) {
    logger.error('Error fetching doc schedule', err);
    ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true });
  }
};

export const handleDocQueue = async (ctx: MyContext) => {
  try {
    if (!ctx.user) return ctx.answerCbQuery("Iltimos tizimga kiring.");
    const doctor = await getDoctor(ctx.user.id);
    if (!doctor) return ctx.answerCbQuery("Doktor profili topilmadi.");

    // Find the currently serving patient
    const serving = await prisma.queue.findFirst({
      where: { doctorId: doctor.id, status: 'SERVING' },
      include: { appointment: { include: { patient: { include: { user: true } } } } }
    });

    // Find the next 3 waiting patients
    const waiting = await prisma.queue.findMany({
      where: { doctorId: doctor.id, status: 'WAITING' },
      orderBy: { number: 'asc' },
      take: 3,
      include: { appointment: { include: { patient: { include: { user: true } } } } }
    });

    let msg = `👥 <b>Joriy Navbat Holati</b>\n\n`;

    if (serving) {
      const p = serving.appointment.patient.user;
      msg += `🔴 <b>HOZIR XONADA:</b>\n`;
      msg += `Navbat: <b>#${serving.number}</b>\n`;
      msg += `Bemor: <b>${p.firstName || p.phone}</b>\n\n`;
    } else {
      msg += `🟢 <b>Hozir xonada hech kim yo'q (Bo'sh).</b>\n\n`;
    }

    if (waiting.length > 0) {
      msg += `🟡 <b>KUTYOTGANLAR:</b>\n`;
      waiting.forEach(w => {
        const p = w.appointment.patient.user;
        msg += `Navbat: #${w.number} | Bemor: ${p.firstName || p.phone}\n`;
      });
    } else {
      msg += `\n<i>Kutyotgan bemorlar yo'q.</i>`;
    }

    const buttons = [];
    if (serving || waiting.length > 0) {
      buttons.push([Markup.button.callback('⏭ Keyingi Bemor (Yakunlash)', 'action_doc_next_patient')]);
    }
    buttons.push([Markup.button.callback('🔄 Yangilash', 'action_doc_queue')]);
    buttons.push([Markup.button.callback('⬅️ Bosh menyu', 'action_back')]);

    await ctx.editMessageText(msg, { parse_mode: 'HTML', ...Markup.inlineKeyboard(buttons) });

  } catch (err) {
    logger.error('Error fetching doc queue', err);
    ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true });
  }
};

export const handleNextPatient = async (ctx: MyContext) => {
  try {
    if (!ctx.user) return ctx.answerCbQuery("Iltimos tizimga kiring.");
    const doctor = await getDoctor(ctx.user.id);
    if (!doctor) return ctx.answerCbQuery("Doktor profili topilmadi.");

    // Run a transaction to safely advance the queue
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find currently SERVING and mark as COMPLETED
      const serving = await tx.queue.findFirst({
        where: { doctorId: doctor.id, status: 'SERVING' },
        include: { appointment: { include: { patient: { include: { user: true } } } } }
      });

      if (serving) {
        await tx.queue.update({
          where: { id: serving.id },
          data: { status: 'COMPLETED' }
        });
        await tx.appointment.update({
          where: { id: serving.appointmentId },
          data: { status: 'COMPLETED' }
        });
      }

      // 2. Find the FIRST WAITING and mark as SERVING
      const nextPatient = await tx.queue.findFirst({
        where: { doctorId: doctor.id, status: 'WAITING' },
        orderBy: { number: 'asc' },
        include: { appointment: { include: { patient: { include: { user: true } } } } }
      });

      if (nextPatient) {
        await tx.queue.update({
          where: { id: nextPatient.id },
          data: { status: 'SERVING' }
        });
        await tx.appointment.update({
          where: { id: nextPatient.appointmentId },
          data: { status: 'SERVING' } // or leave as PENDING, but usually SERVING is not in Appointment status, maybe keep it PENDING or IN_PROGRESS. We'll use PENDING for simplicity or whatever website uses.
        });
      }

      // 3. Find subsequent patients for notifications
      const remaining = await tx.queue.findMany({
        where: { doctorId: doctor.id, status: 'WAITING' },
        orderBy: { number: 'asc' },
        take: 5,
        include: { appointment: { include: { patient: { include: { user: true } } } } }
      });

      return { serving, nextPatient, remaining };
    });

    // Handle Push Notifications OUTSIDE the transaction so slow networks don't lock SQLite
    
    // Notify the person who just completed (Optional, but good UX)
    if (result.serving) {
       sendPushNotification(bot, result.serving.appointment.patient.userId, `✅ Sizning uchrashuvingiz muvaffaqiyatli yakunlandi. Salomat bo'ling!`);
    }

    // Notify the person who is now SERVING
    if (result.nextPatient) {
      sendPushNotification(bot, result.nextPatient.appointment.patient.userId, `🔴 <b>DIQQAT! Sizning navbatingiz keldi!</b>\nIltimos, shifokor xonasiga kiring (Dr. ${ctx.user.lastName}).`);
    }

    // Notify the others (1st, 3rd, 5th in waiting)
    result.remaining.forEach((q, index) => {
      const position = index + 1; // 1-indexed
      if (position === 1) {
        sendPushNotification(bot, q.appointment.patient.userId, `🟡 <b>Tayyorgarlik ko'ring!</b>\nSizdan oldin faqat <b>1 kishi</b> qoldi. Navbat raqamingiz: #${q.number}.`);
      } else if (position === 3) {
        sendPushNotification(bot, q.appointment.patient.userId, `🔵 <b>Navbatingiz yaqinlashmoqda!</b>\nSizdan oldin <b>3 kishi</b> qoldi. Navbat raqamingiz: #${q.number}.`);
      } else if (position === 5) {
        sendPushNotification(bot, q.appointment.patient.userId, `⚪️ <b>Navbatingiz yaqinlashmoqda!</b>\nSizdan oldin <b>5 kishi</b> qoldi. Navbat raqamingiz: #${q.number}.`);
      }
    });

    // Re-render the Queue view
    return handleDocQueue(ctx);

  } catch (err) {
    logger.error('Error in next patient logic', err);
    ctx.answerCbQuery('Ma\'lumotlarni saqlashda xatolik yuz berdi.', { show_alert: true });
  }
};

export const handleDocStats = async (ctx: MyContext) => {
  try {
    if (!ctx.user) return ctx.answerCbQuery("Iltimos tizimga kiring.");
    const doctor = await getDoctor(ctx.user.id);
    if (!doctor) return ctx.answerCbQuery("Doktor profili topilmadi.");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completed = await prisma.queue.count({
      where: { doctorId: doctor.id, status: 'COMPLETED', updatedAt: { gte: today } }
    });

    const waiting = await prisma.queue.count({
      where: { doctorId: doctor.id, status: 'WAITING', createdAt: { gte: today } }
    });

    const msg = `📊 <b>Bugungi Statistika</b>\n\n`
      + `✅ Yakunlangan bemorlar: <b>${completed}</b> ta\n`
      + `🟡 Kutyotgan bemorlar: <b>${waiting}</b> ta\n\n`
      + `<i>Jami bugun ko'rilgan va kutyotganlar: ${completed + waiting} ta</i>`;

    await ctx.editMessageText(msg, { parse_mode: 'HTML', ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Bosh menyu', 'action_back')]]) });

  } catch (err) {
    logger.error('Error fetching doc stats', err);
    ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true });
  }
};

export const handleDocHistory = async (ctx: MyContext) => {
  try {
    if (!ctx.user) return ctx.answerCbQuery("Iltimos tizimga kiring.");
    const doctor = await getDoctor(ctx.user.id);
    if (!doctor) return ctx.answerCbQuery("Doktor profili topilmadi.");

    const history = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: { in: ['COMPLETED', 'CANCELLED'] }
      },
      include: { patient: { include: { user: true } } },
      orderBy: { date: 'desc' },
      take: 5
    });

    if (history.length === 0) {
      return ctx.editMessageText("📜 Sizda avvalgi kasallar tarixi mavjud emas.", Markup.inlineKeyboard([[Markup.button.callback('⬅️ Orqaga', 'action_back')]]));
    }

    let msg = `📜 <b>Oxirgi ko'rilgan 5 ta bemor tarixingiz:</b>\n\n`;
    history.forEach((h, index) => {
      const d = new Date(h.date);
      const dateStr = d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const statusIcon = h.status === 'COMPLETED' ? '✅' : '❌';
      
      msg += `<b>${index + 1}. Bemor: ${h.patient.user.firstName || h.patient.user.phone}</b>\n`;
      msg += `📅 Sana: ${dateStr}\n`;
      msg += `Holati: ${statusIcon} ${h.status}\n\n`;
    });

    await ctx.editMessageText(msg, { parse_mode: 'HTML', ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Bosh menyu', 'action_back')]]) });

  } catch (err) {
    logger.error('Error fetching doc history', err);
    ctx.answerCbQuery('Xatolik yuz berdi.', { show_alert: true });
  }
};
