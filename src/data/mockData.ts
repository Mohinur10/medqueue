import { Clinic, User, Doctor, Patient, Appointment, MedicalRecord, AuditLog, PaymentRecord, Department, Room, Article } from '../types';

export const mockDepartments: Department[] = [
  { id: "dept-1", clinicId: "clinic-1", name: "Cardiology", code: "CARD", description: "Heart and blood vessels care" },
  { id: "dept-2", clinicId: "clinic-1", name: "Pediatrics", code: "PEDI", description: "Infant, child, and adolescent medicine" },
  { id: "dept-3", clinicId: "clinic-1", name: "Neurology", code: "NEUR", description: "Brain, nervous system, and nerve disorders" },
  { id: "dept-4", clinicId: "clinic-1", name: "General Therapy", code: "THER", description: "General health assessments and treatments" },
  { id: "dept-5", clinicId: "clinic-2", name: "Cardiology", code: "CARD", description: "Advanced heart care" },
  { id: "dept-6", clinicId: "clinic-2", name: "Orthopedics", code: "ORTH", description: "Bones, joints, and ligaments clinic" }
];

export const mockRooms: Room[] = [
  { id: "room-101", clinicId: "clinic-1", roomNumber: "101", status: "available", departmentId: "dept-1" },
  { id: "room-102", clinicId: "clinic-1", roomNumber: "102", status: "available", departmentId: "dept-2" },
  { id: "room-103", clinicId: "clinic-1", roomNumber: "103", status: "available", departmentId: "dept-3" },
  { id: "room-104", clinicId: "clinic-1", roomNumber: "104", status: "available", departmentId: "dept-4" },
  { id: "room-201", clinicId: "clinic-2", roomNumber: "201", status: "available", departmentId: "dept-5" },
  { id: "room-202", clinicId: "clinic-2", roomNumber: "202", status: "available", departmentId: "dept-6" }
];

export const mockClinics: Clinic[] = [
  {
    id: "clinic-1",
    name: "Akfa Medline",
    logo: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=100&auto=format&fit=crop&q=60",
    phone: "+998712033003",
    address: "Kichik Halka Yoli, 5A, Tashkent, Uzbekistan",
    description: "Largest private medical center in Central Asia providing multi-disciplinary premium diagnostics and inpatient treatments.",
    workingHours: { start: "08:00", end: "20:00" },
    location: { lat: 41.3456, lng: 69.2134 },
    socials: { telegram: "akfamedline", instagram: "akfa_medline", website: "akfamedline.uz" },
    email: "info@akfamedline.uz",
    directorId: "user-dir-1",
    status: "active",
    subscription: "enterprise",
    storageUsed: 2450 // in MB
  },
  {
    id: "clinic-2",
    name: "Medion Clinic",
    logo: "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=100&auto=format&fit=crop&q=60",
    phone: "+998711400010",
    address: "Istiqbol street, 15, Tashkent, Uzbekistan",
    description: "A premium medical center specializing in advanced aesthetics, dentistry, and multi-profile outpatient clinical therapy.",
    workingHours: { start: "08:30", end: "19:00" },
    location: { lat: 41.3112, lng: 69.2882 },
    socials: { telegram: "medion_uz", instagram: "medion.uz", website: "medion.uz" },
    email: "contact@medion.uz",
    directorId: "user-dir-2",
    status: "active",
    subscription: "premium",
    storageUsed: 890 // in MB
  }
];

export const mockUsers: User[] = [
  {
    id: "user-admin",
    name: "Sanjar Alimov",
    role: "super_admin",
    email: "admin@medqueue.uz",
    phone: "+998901234567",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
  },
  {
    id: "user-dir-1",
    name: "Farhod Karimov",
    role: "clinic_director",
    email: "director@shifo.uz",
    phone: "+998931112233",
    clinicId: "clinic-1",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
  },
  {
    id: "user-dir-2",
    name: "Malika Sobirova",
    role: "clinic_director",
    email: "director@medion.uz",
    phone: "+998942223344",
    clinicId: "clinic-2",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: "user-doc-1",
    name: "Dr. Alisher Toshmatov",
    role: "doctor",
    email: "doctor.toshmatov@medqueue.uz",
    phone: "+998973334455",
    clinicId: "clinic-1",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
  },
  {
    id: "user-doc-2",
    name: "Dr. Dilnoza Karimova",
    role: "doctor",
    email: "doctor.karimova@medqueue.uz",
    phone: "+998974445566",
    clinicId: "clinic-1",
    avatarUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150"
  },
  {
    id: "user-patient-primary",
    name: "Otabek Karimov",
    role: "patient",
    email: "patient.karimov@medqueue.uz",
    phone: "+998998887766",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: "doc-1",
    userId: "user-doc-1",
    clinicId: "clinic-1",
    name: "Dr. Alisher Toshmatov",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200",
    specialization: "Cardiology",
    email: "doctor.toshmatov@medqueue.uz",
    phone: "+998973334455",
    workingDays: [1, 2, 3, 4, 5], // Mon - Fri
    workingHours: { start: "09:00", end: "17:00" },
    appointmentDuration: 10,
    roomNumber: "101",
    experience: 15,
    education: "Tashkent Medical Academy, Residency in Heart & Vascular Institute of Seoul National University",
    languages: ["Uzbek", "Russian", "English"],
    status: "active"
  },
  {
    id: "doc-2",
    userId: "user-doc-2",
    clinicId: "clinic-1",
    name: "Dr. Dilnoza Karimova",
    photo: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=200",
    specialization: "Pediatrics",
    email: "doctor.karimova@medqueue.uz",
    phone: "+998974445566",
    workingDays: [1, 2, 3, 4, 6], // Mon - Fri, Sat
    workingHours: { start: "08:30", end: "16:00" },
    appointmentDuration: 10,
    roomNumber: "102",
    experience: 9,
    education: "Samarkand State Medical Institute, Pediatric Diagnostics Specialization in Moscow Clinical Center",
    languages: ["Uzbek", "Russian"],
    status: "active"
  }
];

export const mockPatients: Patient[] = [
  {
    id: "pat-1",
    userId: "user-patient-primary",
    name: "Otabek Karimov",
    phone: "+998998887766",
    email: "patient.karimov@medqueue.uz",
    dob: "1988-05-12",
    gender: "male",
    bloodGroup: "A+ (II)",
    allergies: ["Penicillin", "Pollen"],
    medicalNotes: "Hypertensive patient. Follow-up required every 3 months."
  },
  {
    id: "pat-2",
    userId: "user-patient-primary",
    name: "Madina Karimova", // Wife
    phone: "+998998887767",
    email: "madina.k@medqueue.uz",
    dob: "1991-09-24",
    gender: "female",
    bloodGroup: "B+ (III)",
    allergies: [],
    familyOwnerId: "pat-1",
    relationship: "spouse"
  },
  {
    id: "pat-3",
    userId: "user-patient-primary",
    name: "Jasur Karimov", // Son
    phone: "+998998887768",
    email: "jasur.k@medqueue.uz",
    dob: "2018-02-14",
    gender: "male",
    bloodGroup: "A+ (II)",
    allergies: ["Peanuts"],
    familyOwnerId: "pat-1",
    relationship: "child"
  },
  {
    id: "pat-4",
    userId: "user-patient-primary",
    name: "Lola Karimova", // Mother
    phone: "+998998887769",
    email: "lola.k@medqueue.uz",
    dob: "1960-03-30",
    gender: "female",
    bloodGroup: "O- (I)",
    allergies: ["Aspirin"],
    familyOwnerId: "pat-1",
    relationship: "mother"
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: "appt-1",
    clinicId: "clinic-1",
    doctorId: "doc-1",
    patientId: "pat-1",
    date: "2026-07-02",
    timeSlot: "09:00",
    status: "booked",
    queueNumber: "A-10",
    paymentStatus: "paid",
    amount: 150000
  },
  {
    id: "appt-2",
    clinicId: "clinic-1",
    doctorId: "doc-1",
    patientId: "pat-4",
    date: "2026-07-02",
    timeSlot: "09:10",
    status: "confirmed",
    queueNumber: "A-11",
    paymentStatus: "paid",
    amount: 150000
  },
  {
    id: "appt-3",
    clinicId: "clinic-1",
    doctorId: "doc-2",
    patientId: "pat-3",
    date: "2026-07-02",
    timeSlot: "10:30",
    status: "arrived",
    queueNumber: "P-04",
    paymentStatus: "paid",
    amount: 120000
  }
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "rec-1",
    appointmentId: "appt-prev-1",
    patientId: "pat-1",
    doctorId: "doc-1",
    clinicId: "clinic-1",
    date: "2026-04-12",
    diagnosis: "I10 - Essential (primary) hypertension",
    prescription: [
      { medicine: "Bisoprolol (Concor)", dose: "5mg", frequency: "Once daily", duration: "30 days" },
      { medicine: "Amlodipine (Tenoks)", dose: "5mg", frequency: "Once daily", duration: "30 days" }
    ],
    injections: [],
    recommendations: "Limit salt intake to < 2g per day. Engage in aerobic exercise 30 minutes daily. Monitor blood pressure morning and evening.",
    files: [
      { name: "Blood_Test_Report.pdf", url: "#", size: "1.2 MB" },
      { name: "ECG_Scan.jpg", url: "#", size: "2.4 MB" }
    ],
    qrCodeVerificationUrl: "https://verify.medqueue.uz/record/rec-1"
  },
  {
    id: "rec-2",
    appointmentId: "appt-prev-2",
    patientId: "pat-3",
    doctorId: "doc-2",
    clinicId: "clinic-1",
    date: "2026-05-18",
    diagnosis: "J00 - Acute nasopharyngitis [common cold]",
    prescription: [
      { medicine: "Paracetamol (Amadol)", dose: "250mg", frequency: "Three times daily", duration: "3 days" },
      { medicine: "Ascorutin", dose: "50mg", frequency: "Twice daily", duration: "7 days" }
    ],
    injections: [],
    recommendations: "Rest, warm tea, saline nasal drops as needed. Return if fever persists beyond 3 days.",
    files: [],
    qrCodeVerificationUrl: "https://verify.medqueue.uz/record/rec-2"
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2026-07-01 10:15:30",
    userId: "user-admin",
    userRole: "super_admin",
    action: "CREATE_CLINIC",
    details: "Super admin registered new clinic: Akfa Medline",
    ipAddress: "195.158.28.14"
  },
  {
    id: "log-2",
    timestamp: "2026-07-01 11:20:12",
    userId: "user-dir-1",
    userRole: "clinic_director",
    action: "CREATE_DOCTOR",
    details: "Farhod Karimov registered Dr. Alisher Toshmatov in Cardiology",
    ipAddress: "195.158.28.16"
  },
  {
    id: "log-3",
    timestamp: "2026-07-01 14:02:44",
    userId: "user-patient-primary",
    userRole: "patient",
    action: "BOOK_APPOINTMENT",
    details: "Otabek Karimov booked appointment for child Jasur Karimov with Dr. Dilnoza Karimova",
    ipAddress: "84.54.92.12"
  }
];

export const mockPayments: PaymentRecord[] = [
  {
    id: "pay-1",
    clinicId: "clinic-1",
    patientId: "pat-1",
    amount: 150000,
    currency: "UZS",
    status: "success",
    method: "card",
    timestamp: "2026-07-01 14:00:00",
    description: "Appointment booking with Dr. Alisher Toshmatov (A-10)"
  },
  {
    id: "pay-2",
    clinicId: "clinic-1",
    patientId: "pat-3",
    amount: 120000,
    currency: "UZS",
    status: "success",
    method: "card",
    timestamp: "2026-07-01 14:02:44",
    description: "Appointment booking with Dr. Dilnoza Karimova (P-04)"
  }
];

export const mockArticles: Article[] = [
  {
    id: "art-1",
    title: "10 Steps to Maintain a Healthy Heart",
    category: "wellness",
    content: "Heart disease is one of the leading causes of health complications in Central Asia. Incorporating fresh vegetables, active walking, and reducing fat intake can significantly improve myocardial function.",
    authorName: "Dr. Alisher Toshmatov",
    clinicId: "clinic-1",
    status: "published",
    publishedAt: "2026-06-15",
    readTime: "4 min read"
  },
  {
    id: "art-2",
    title: "Understanding Childhood Flu Season",
    category: "pediatrics",
    content: "Flu viruses mutate regularly. Safeguard your children through preventative hygiene and timely pediatric checkups. Keep tabs on fever thresholds and avoid administering self-directed antibiotics.",
    authorName: "Dr. Dilnoza Karimova",
    clinicId: "clinic-1",
    status: "published",
    publishedAt: "2026-06-20",
    readTime: "5 min read"
  }
];
