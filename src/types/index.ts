export interface Clinic {
  id: string;
  name: string;
  logo: string;
  phone: string;
  address: string;
  description: string;
  workingHours: { start: string; end: string };
  location: { lat: number; lng: number };
  socials: { telegram?: string; instagram?: string; website?: string };
  email: string;
  directorId: string;
  status: 'active' | 'disabled';
  subscription: 'basic' | 'premium' | 'enterprise';
  storageUsed: number;
}

export interface User {
  id: string;
  name: string;
  role: 'super_admin' | 'clinic_director' | 'doctor' | 'patient';
  email: string;
  phone: string;
  avatarUrl?: string;
  clinicId?: string;
  patientId?: string;
  doctorId?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  clinicId: string;
  name: string;
  photo: string;
  specialization: string;
  email: string;
  phone: string;
  workingDays: number[];
  workingHours: { start: string; end: string };
  appointmentDuration: number;
  roomNumber: string;
  experience: number;
  education: string;
  languages: string[];
  status: 'active' | 'vacation' | 'inactive';
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: 'male' | 'female';
  bloodGroup?: string;
  allergies?: string[];
  medicalNotes?: string;
  familyOwnerId?: string;
  relationship?: 'self' | 'mother' | 'father' | 'child' | 'spouse';
}

export interface Appointment {
  id: string;
  clinicId: string;
  doctorId: string;
  patientId: string;
  date: string;
  timeSlot: string;
  status: 'booked' | 'confirmed' | 'arrived' | 'waiting' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show';
  queueNumber: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  date: string;
  diagnosis: string;
  prescription: Array<{ medicine: string; dose: string; frequency: string; duration: string }>;
  injections?: string[];
  recommendations?: string;
  files: Array<{ name: string; url: string; size: string }>;
  qrCodeVerificationUrl: string;
  labResults?: LabResult[];
  radiologyReport?: RadiologyReport;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface PaymentRecord {
  id: string;
  clinicId: string;
  patientId: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  method: 'card' | 'cash' | 'transfer';
  timestamp: string;
  description: string;
}

export interface Department {
  id: string;
  clinicId: string;
  name: string;
  code: string;
  description: string;
}

export interface Room {
  id: string;
  clinicId: string;
  roomNumber: string;
  status: 'available' | 'occupied' | 'maintenance';
  departmentId: string;
}

export interface LabResult {
  testName: string;
  value: number;
  unit: string;
  referenceRange: { min: number; max: number };
  status: 'normal' | 'low' | 'high' | 'critical';
}

export interface RadiologyReport {
  studyName: string;
  technique: string;
  findings: string;
  impression: string;
  imageUrls: string[];
}

export interface Article {
  id: string;
  title: string;
  category: 'wellness' | 'cardiology' | 'pediatrics' | 'general' | 'announcement';
  content: string;
  authorName: string;
  clinicId?: string;
  status: 'draft' | 'published';
  publishedAt: string;
  readTime: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  form: string;
  strength: string;
  manufacturer: string;
  category: string;
  defaultInstructions: string;
}
