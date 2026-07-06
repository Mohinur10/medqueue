import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../middlewares/authMiddleware';
import { prisma } from '../../prisma/client';
import { logger } from '../../utils/logger';

export const bookingScene = new Scenes.WizardScene<MyContext>(
  'book_appointment_scene',
  
  // Step 1: Show Hospitals
  async (ctx) => {
    try {
      const hospitals = await prisma.hospital.findMany({ where: { isActive: true } });
      
      if (hospitals.length === 0) {
        await ctx.reply("Hozircha tizimda faol klinikalar yo'q.");
        return ctx.scene.leave();
      }

      const buttons = hospitals.map(h => [Markup.button.callback(h.name, `hosp_${h.id}`)]);
      buttons.push([Markup.button.callback('❌ Bekor qilish', 'cancel_booking')]);

      await ctx.reply("🏢 <b>Iltimos, o'zingizga qulay Klinikani tanlang:</b>", {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons)
      });
      
      return ctx.wizard.next();
    } catch (e) {
      logger.error('Error in booking step 1:', e);
      ctx.reply("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      return ctx.scene.leave();
    }
  },

  // Step 2: Show Doctors in the selected hospital
  async (ctx) => {
    try {
      if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
        const data = ctx.callbackQuery.data;
        if (data === 'cancel_booking') {
          await ctx.editMessageText("Bron qilish bekor qilindi. 🛑");
          return ctx.scene.leave();
        }

        const hospitalId = data.replace('hosp_', '');
        ctx.scene.session.hospitalId = hospitalId;

        const doctors = await prisma.doctor.findMany({
          where: { hospitalId, isActive: true },
          include: { user: true, department: true }
        });

        if (doctors.length === 0) {
          await ctx.editMessageText("Ushbu klinikada hozircha shifokorlar mavjud emas.");
          return ctx.scene.leave();
        }

        const buttons = doctors.map(d => [
          Markup.button.callback(`👨‍⚕️ Dr. ${d.user.firstName} ${d.user.lastName} (${d.department.name})`, `doc_${d.id}`)
        ]);
        buttons.push([Markup.button.callback('❌ Bekor qilish', 'cancel_booking')]);

        await ctx.editMessageText("👨‍⚕️ <b>Shifokorni tanlang:</b>", {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard(buttons)
        });

        return ctx.wizard.next();
      }
      return ctx.reply("Iltimos, tugmalardan birini tanlang.");
    } catch (e) {
      logger.error('Error in booking step 2:', e);
      return ctx.scene.leave();
    }
  },

  // Step 3: Show Dates (Next 5 days)
  async (ctx) => {
    try {
      if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
        const data = ctx.callbackQuery.data;
        if (data === 'cancel_booking') {
          await ctx.editMessageText("Bron qilish bekor qilindi. 🛑");
          return ctx.scene.leave();
        }

        const doctorId = data.replace('doc_', '');
        ctx.scene.session.doctorId = doctorId;

        // Generate next 5 days
        const dates = [];
        for (let i = 0; i < 5; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
          const displayStr = d.toLocaleDateString('uz-UZ', { weekday: 'short', month: 'short', day: 'numeric' });
          dates.push([Markup.button.callback(`📅 ${displayStr}`, `date_${dateStr}`)]);
        }
        dates.push([Markup.button.callback('❌ Bekor qilish', 'cancel_booking')]);

        await ctx.editMessageText("📅 <b>Uchrashuv sanasini tanlang:</b>", {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard(dates)
        });

        return ctx.wizard.next();
      }
    } catch (e) {
      logger.error('Error in booking step 3:', e);
      return ctx.scene.leave();
    }
  },

  // Step 4: Show Times (Static for now, normally based on Schedule)
  async (ctx) => {
    try {
      if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
        const data = ctx.callbackQuery.data;
        if (data === 'cancel_booking') {
          await ctx.editMessageText("Bron qilish bekor qilindi. 🛑");
          return ctx.scene.leave();
        }

        const dateStr = data.replace('date_', '');
        ctx.scene.session.selectedDate = dateStr;

        // In a real scenario we query Schedule and existing Appointments here to find free slots.
        // For phase 3 proof of concept, we generate some static available times.
        const times = ['09:00', '10:00', '11:30', '14:00', '15:30', '16:00'];
        
        // We need to query DB to check if these are already booked
        const existingAppts = await prisma.appointment.findMany({
          where: {
            doctorId: ctx.scene.session.doctorId,
            date: {
              gte: new Date(`${dateStr}T00:00:00.000Z`),
              lte: new Date(`${dateStr}T23:59:59.999Z`)
            },
            status: { not: 'CANCELLED' }
          }
        });

        const bookedTimes = existingAppts.map(a => {
          const d = new Date(a.date);
          const hh = d.getUTCHours().toString().padStart(2, '0');
          const mm = d.getUTCMinutes().toString().padStart(2, '0');
          return `${hh}:${mm}`;
        });

        const availableTimes = times.filter(t => !bookedTimes.includes(t));

        if (availableTimes.length === 0) {
          await ctx.editMessageText("Kechirasiz, ushbu sanada bo'sh vaqtlar qolmagan. Bekor qilinmoqda, qaytadan urinib ko'ring.");
          return ctx.scene.leave();
        }

        // Chunk into rows of 2
        const buttons = [];
        for (let i = 0; i < availableTimes.length; i += 2) {
          const row = [];
          row.push(Markup.button.callback(`🕒 ${availableTimes[i]}`, `time_${availableTimes[i]}`));
          if (availableTimes[i + 1]) {
            row.push(Markup.button.callback(`🕒 ${availableTimes[i + 1]}`, `time_${availableTimes[i + 1]}`));
          }
          buttons.push(row);
        }
        
        buttons.push([Markup.button.callback('❌ Bekor qilish', 'cancel_booking')]);

        await ctx.editMessageText("🕒 <b>Uchrashuv vaqtini tanlang:</b>", {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard(buttons)
        });

        return ctx.wizard.next();
      }
    } catch (e) {
      logger.error('Error in booking step 4:', e);
      return ctx.scene.leave();
    }
  },

  // Step 5: Confirm & Save
  async (ctx) => {
    try {
      if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
        const data = ctx.callbackQuery.data;
        if (data === 'cancel_booking') {
          await ctx.editMessageText("Bron qilish bekor qilindi. 🛑");
          return ctx.scene.leave();
        }

        const timeStr = data.replace('time_', '');
        const dateStr = ctx.scene.session.selectedDate;
        
        // Assemble DateTime object
        const appointmentDateTime = new Date(`${dateStr}T${timeStr}:00.000Z`);

        // Check again to strictly prevent double booking
        const conflict = await prisma.appointment.findFirst({
          where: {
            doctorId: ctx.scene.session.doctorId,
            date: appointmentDateTime,
            status: { not: 'CANCELLED' }
          }
        });

        if (conflict) {
          await ctx.editMessageText("Kechirasiz, ushbu vaqt band qilinib bo'lgan. Iltimos, boshqa vaqtni tanlang.");
          return ctx.scene.leave();
        }

        // Get patient profile ID based on User
        const patient = await prisma.patient.findUnique({
          where: { userId: ctx.user.id }
        });

        if (!patient) {
          await ctx.editMessageText("Sizning Bemor (Patient) profilingiz topilmadi. Sayt orqali to'ldiring.");
          return ctx.scene.leave();
        }

        // We must also fetch the departmentId to create the Queue
        const doctor = await prisma.doctor.findUnique({
          where: { id: ctx.scene.session.doctorId },
          include: { user: true }
        });

        if(!doctor) {
            await ctx.editMessageText("Shifokor topilmadi.");
            return ctx.scene.leave();
        }

        // Run transaction to create Appointment + Queue safely
        const [newAppt, newQueue] = await prisma.$transaction(async (tx) => {
          const appt = await tx.appointment.create({
            data: {
              patientId: patient.id,
              doctorId: doctor.id,
              date: appointmentDateTime,
              status: 'PENDING'
            }
          });

          // Determine queue number
          const existingQueuesToday = await tx.queue.count({
            where: {
              doctorId: doctor.id,
              createdAt: {
                gte: new Date(`${dateStr}T00:00:00.000Z`),
                lte: new Date(`${dateStr}T23:59:59.999Z`)
              }
            }
          });

          const queueNum = existingQueuesToday + 1;

          const q = await tx.queue.create({
            data: {
              departmentId: doctor.departmentId,
              doctorId: doctor.id,
              appointmentId: appt.id,
              number: queueNum,
              status: 'WAITING'
            }
          });

          return [appt, q];
        });

        const successMsg = `✅ <b>Bron muvaffaqiyatli yakunlandi!</b>\n\n`
          + `👨‍⚕️ Doktor: <b>Dr. ${doctor.user.firstName} ${doctor.user.lastName}</b>\n`
          + `📅 Sana: <b>${dateStr}</b>\n`
          + `🕒 Vaqt: <b>${timeStr}</b>\n`
          + `🔢 Navbat raqamingiz: <b>#${newQueue.number}</b>\n\n`
          + `(Vaqt yaqinlashganda Bot sizga eslatma jo'natadi)`;

        await ctx.editMessageText(successMsg, { parse_mode: 'HTML' });
        return ctx.scene.leave();
      }
    } catch (e) {
      logger.error('Error in booking step 5:', e);
      ctx.reply("Ma'lumotlar bazasida xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.");
      return ctx.scene.leave();
    }
  }
);
