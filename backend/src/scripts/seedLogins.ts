import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';

async function seed() {
  const password = await bcrypt.hash('12345678', 10);

  // Super Admin
  await prisma.user.upsert({
    where: { email: 'admin@medqueue.uz' },
    update: { role: 'SUPER_ADMIN', password, isActive: true },
    create: {
      email: 'admin@medqueue.uz',
      password,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      phone: '+998901112233',
      isActive: true,
      isEmailVerified: true
    }
  });

  // Director
  const directorUser = await prisma.user.upsert({
    where: { email: 'director@medqueue.uz' },
    update: { role: 'CLINIC_DIRECTOR', password, isActive: true },
    create: {
      email: 'director@medqueue.uz',
      password,
      firstName: 'Clinic',
      lastName: 'Director',
      role: 'CLINIC_DIRECTOR',
      phone: '+998904445566',
      isActive: true,
      isEmailVerified: true
    }
  });

  // Create a hospital for this director if none exists
  const hosp = await prisma.hospital.upsert({
    where: { slug: 'medqueue-clinic' },
    update: { directorId: directorUser.id, isActive: true },
    create: {
      slug: 'medqueue-clinic',
      name: 'MedQueue Asosiy Klinikasi',
      directorId: directorUser.id,
      isActive: true
    }
  });

  // Department
  const dept = await prisma.department.upsert({
    where: { slug: 'kardiologiya' },
    update: { hospitalId: hosp.id },
    create: {
      slug: 'kardiologiya',
      name: 'Kardiologiya',
      hospitalId: hosp.id
    }
  });

  // Doctor
  const docUser = await prisma.user.upsert({
    where: { email: 'doctor@medqueue.uz' },
    update: { role: 'DOCTOR', password, isActive: true },
    create: {
      email: 'doctor@medqueue.uz',
      password,
      firstName: 'Test',
      lastName: 'Doktor',
      role: 'DOCTOR',
      phone: '+998907778899',
      isActive: true,
      isEmailVerified: true
    }
  });

  await prisma.doctor.upsert({
    where: { userId: docUser.id },
    update: { hospitalId: hosp.id, departmentId: dept.id },
    create: {
      userId: docUser.id,
      slug: 'test-doktor',
      hospitalId: hosp.id,
      departmentId: dept.id,
      specialization: 'Kardiolog',
      languages: 'Uz, Ru',
      isActive: true,
      isAvailable: true
    }
  });

  // Patient
  await prisma.user.upsert({
    where: { email: 'patient@medqueue.uz' },
    update: { role: 'PATIENT', password, isActive: true },
    create: {
      email: 'patient@medqueue.uz',
      password,
      firstName: 'Test',
      lastName: 'Bemor',
      role: 'PATIENT',
      phone: '+998900001122',
      isActive: true,
      isEmailVerified: true
    }
  });

  console.log('✅ Barcha 4 ta panel uchun akkauntlar yaratildi!');
  console.log('--- LOGIN MA`LUMOTLARI ---');
  console.log('ADMIN:     admin@medqueue.uz    | Parol: 12345678');
  console.log('DIRECTOR:  director@medqueue.uz | Parol: 12345678');
  console.log('DOCTOR:    doctor@medqueue.uz   | Parol: 12345678');
  console.log('PATIENT:   patient@medqueue.uz  | Parol: 12345678');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
