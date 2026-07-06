"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Clinic, User, Doctor, Patient, Appointment, MedicalRecord, 
  AuditLog, PaymentRecord, Department, Room, Article, Medicine 
} from '../types';
import { 
  mockClinics, mockUsers, mockDoctors, mockPatients, 
  mockAppointments, mockMedicalRecords, mockAuditLogs, 
  mockPayments, mockArticles, mockDepartments, mockRooms 
} from '../data/mockData';

interface MedQueueContextType {
  currentUser: User | null;
  activeRole: 'super_admin' | 'clinic_director' | 'doctor' | 'patient' | null;
  activeLanguage: 'en' | 'ru' | 'uz';
  developerMode: boolean;
  isNavigating: boolean;
  setIsNavigating: (val: boolean) => void;
  
  clinics: Clinic[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  payments: PaymentRecord[];
  auditLogs: AuditLog[];
  articles: Article[];
  departments: Department[];
  rooms: Room[];
  notifications: Array<{ id: string; userId: string; type: 'success' | 'warning' | 'error' | 'reminder'; title: string; message: string; read: boolean; timestamp: string }>;

  // Auth Operations
  login: (email: string, role: 'super_admin' | 'clinic_director' | 'doctor' | 'patient') => Promise<boolean>;
  logout: () => void;
  setLanguage: (lang: 'en' | 'ru' | 'uz') => void;
  
  // Super Admin Clinic Operations
  createClinic: (clinicData: Omit<Clinic, 'id' | 'storageUsed'>) => void;
  toggleClinicStatus: (clinicId: string) => void;
  deleteClinic: (clinicId: string) => void;
  
  // Director Operations
  createDoctor: (doctorData: Omit<Doctor, 'id' | 'status'>) => void;
  updateDoctorStatus: (doctorId: string, status: Doctor['status']) => void;
  updateClinicProfile: (clinicId: string, updatedData: Partial<Clinic>) => void;
  createDepartment: (deptData: Omit<Department, 'id'>) => void;
  
  // Doctor Operations
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  completeConsultation: (recordData: Omit<MedicalRecord, 'id' | 'date'>) => void;
  
  // Patient Operations
  bookAppointment: (appointmentData: Omit<Appointment, 'id' | 'status' | 'queueNumber' | 'paymentStatus'>) => Appointment;
  addFamilyMember: (memberData: Omit<Patient, 'id' | 'userId' | 'familyOwnerId'>, relationship: Patient['relationship']) => void;
  toggleFavoriteDoctor: (docId: string) => void;
  toggleFavoriteClinic: (clinicId: string) => void;
  favoriteDoctors: string[];
  favoriteClinics: string[];

  // Global Utilities
  triggerNotification: (userId: string, type: 'success' | 'warning' | 'error' | 'reminder', title: string, message: string) => void;
  markNotificationsAsRead: () => void;
  exportDatabase: () => string;
  importDatabase: (jsonData: string) => boolean;
  createAuditLog: (action: string, details: string) => void;
}

const MedQueueContext = createContext<MedQueueContextType | undefined>(undefined);

export const MedQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Settings
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<MedQueueContextType['activeRole']>(null);
  const [activeLanguage, setActiveLanguage] = useState<MedQueueContextType['activeLanguage']>('en');
  const [developerMode, setDeveloperMode] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  
  // Database Tables
  const [clinics, setClinics] = useState<Clinic[]>(mockClinics);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  
  // Favorites & Notifications
  const [favoriteDoctors, setFavoriteDoctors] = useState<string[]>([]);
  const [favoriteClinics, setFavoriteClinics] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<MedQueueContextType['notifications']>([]);

  // Load initial session on client hydration
  useEffect(() => {
    const savedLang = localStorage.getItem('mq_lang');
    const savedFavoritesDocs = localStorage.getItem('mq_fav_docs');
    const savedFavoritesClinics = localStorage.getItem('mq_fav_clinics');

    // Hydrate user strictly from HTTP-Only cookie validated by Backend
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/me`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.data) {
          // Transform backend user format if needed, assuming role is present
          setCurrentUser(data.data);
          setActiveRole(data.data.role);
        }
      } catch (err) {
        console.error('Failed to hydrate user from backend', err);
      }
    };
    fetchUser();
    
    if (savedLang) {
      setActiveLanguage(savedLang as MedQueueContextType['activeLanguage']);
    }
    if (savedFavoritesDocs) {
      setFavoriteDoctors(JSON.parse(savedFavoritesDocs));
    }
    if (savedFavoritesClinics) {
      setFavoriteClinics(JSON.parse(savedFavoritesClinics));
    }

    // Default notifications setup
    setNotifications([
      {
        id: "notif-1",
        userId: "user-patient-primary",
        type: "reminder",
        title: "Upcoming Appointment",
        message: "You have an appointment tomorrow with Dr. Alisher Toshmatov at 09:00.",
        read: false,
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: "notif-2",
        userId: "user-patient-primary",
        type: "success",
        title: "Payment Confirmed",
        message: "Payment of 150,000 UZS was successfully processed for Invoice #INV-883.",
        read: false,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    const savedDevMode = localStorage.getItem('mq_dev_mode');
    if (savedDevMode === 'true') {
      setDeveloperMode(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        setDeveloperMode(prev => {
          const next = !prev;
          localStorage.setItem('mq_dev_mode', next ? 'true' : 'false');
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const createAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser?.id || 'system',
      userRole: activeRole || 'guest',
      action,
      details,
      ipAddress: '192.168.1.100'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const triggerNotification = (userId: string, type: MedQueueContextType['notifications'][0]['type'], title: string, message: string) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      type,
      title,
      message,
      read: false,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const login = async (email: string, role: MedQueueContextType['activeRole']) => {
    // Simulating authentication matching user profiles
    const matchedUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    
    if (matchedUser) {
      setCurrentUser(matchedUser);
      setActiveRole(role);
      createAuditLog('USER_LOGIN', `User logged in with role: ${role}`);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch(err) {
      console.error('Logout failed', err);
    }
    createAuditLog('USER_LOGOUT', `User logged out`);
    setCurrentUser(null);
    setActiveRole(null);
  };

  const setLanguage = (lang: 'en' | 'ru' | 'uz') => {
    setActiveLanguage(lang);
    localStorage.setItem('mq_lang', lang);
  };

  // Super Admin Actions
  const createClinic = (clinicData: Omit<Clinic, 'id' | 'storageUsed'>) => {
    const newClinic: Clinic = {
      ...clinicData,
      id: `clinic-${Date.now()}`,
      storageUsed: 0
    };
    setClinics(prev => [...prev, newClinic]);
    createAuditLog('CREATE_CLINIC', `Created clinic: ${newClinic.name}`);
    triggerNotification('user-admin', 'success', 'Clinic Created', `Successfully provisioned clinic ${newClinic.name}`);
  };

  const toggleClinicStatus = (clinicId: string) => {
    setClinics(prev => prev.map(c => {
      if (c.id === clinicId) {
        const nextStatus = c.status === 'active' ? 'disabled' : 'active';
        createAuditLog('TOGGLE_CLINIC_STATUS', `Toggled clinic ${c.name} to ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const deleteClinic = (clinicId: string) => {
    const deletedClinic = clinics.find(c => c.id === clinicId);
    setClinics(prev => prev.filter(c => c.id !== clinicId));
    createAuditLog('DELETE_CLINIC', `Deleted clinic: ${deletedClinic?.name || clinicId}`);
  };

  // Director Actions
  const createDoctor = (doctorData: Omit<Doctor, 'id' | 'status'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
      status: 'active'
    };
    setDoctors(prev => [...prev, newDoc]);
    
    // Auto-create User account mapping
    const newDoctorUser: User = {
      id: `user-doc-${Date.now()}`,
      name: doctorData.name,
      role: 'doctor',
      email: doctorData.email,
      phone: doctorData.phone,
      clinicId: doctorData.clinicId,
      avatarUrl: doctorData.photo
    };
    mockUsers.push(newDoctorUser); // Mimic writing to user collection

    createAuditLog('CREATE_DOCTOR', `Registered doctor: ${newDoc.name}`);
  };

  const updateDoctorStatus = (doctorId: string, status: Doctor['status']) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        createAuditLog('UPDATE_DOCTOR_STATUS', `Changed status of Dr. ${d.name} to ${status}`);
        return { ...d, status };
      }
      return d;
    }));
  };

  const updateClinicProfile = (clinicId: string, updatedData: Partial<Clinic>) => {
    setClinics(prev => prev.map(c => {
      if (c.id === clinicId) {
        createAuditLog('UPDATE_CLINIC_PROFILE', `Updated profile parameters for ${c.name}`);
        return { ...c, ...updatedData };
      }
      return c;
    }));
  };

  const createDepartment = (deptData: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`
    };
    setDepartments(prev => [...prev, newDept]);
    createAuditLog('CREATE_DEPARTMENT', `Created department: ${newDept.name}`);
  };

  // Doctor Operations
  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        createAuditLog('UPDATE_APPOINTMENT_STATUS', `Appointment ${a.queueNumber} status set to ${status}`);
        return { ...a, status };
      }
      return a;
    }));
  };

  const completeConsultation = (recordData: Omit<MedicalRecord, 'id' | 'date'>) => {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10)
    };
    setMedicalRecords(prev => [newRecord, ...prev]);
    
    // Mark appointment as completed
    updateAppointmentStatus(recordData.appointmentId, 'completed');
    createAuditLog('COMPLETE_CONSULTATION', `Consultation completed for record: ${newRecord.id}`);

    // Call Next Patient in queue automatically
    const nextAppt = appointments.find(
      a => a.doctorId === recordData.doctorId && 
      (a.status === 'waiting' || a.status === 'arrived') &&
      a.date === new Date().toISOString().substring(0, 10)
    );
    if (nextAppt) {
      updateAppointmentStatus(nextAppt.id, 'in_consultation');
      triggerNotification(
        recordData.doctorId, 
        'reminder', 
        'Next Patient Called', 
        `Automatically called patient for ticket ${nextAppt.queueNumber}`
      );
    }
  };

  // Patient Actions
  const bookAppointment = (appointmentData: Omit<Appointment, 'id' | 'status' | 'queueNumber' | 'paymentStatus'>) => {
    const categoryLetter = appointmentData.doctorId === 'doc-1' ? 'A' : 'P';
    const activeCount = appointments.filter(a => a.doctorId === appointmentData.doctorId && a.date === appointmentData.date).length + 1;
    const queueNumber = `${categoryLetter}-${activeCount.toString().padStart(2, '0')}`;

    const newAppt: Appointment = {
      ...appointmentData,
      id: `appt-${Date.now()}`,
      status: 'booked',
      queueNumber,
      paymentStatus: 'paid' // Simulated pre-payment success
    };

    setAppointments(prev => [...prev, newAppt]);

    // Create payment entry
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      clinicId: appointmentData.clinicId,
      patientId: appointmentData.patientId,
      amount: appointmentData.amount,
      currency: "UZS",
      status: "success",
      method: "card",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      description: `Appointment booking with ticket ${queueNumber}`
    };
    setPayments(prev => [newPayment, ...prev]);

    createAuditLog('BOOK_APPOINTMENT', `Patient ${appointmentData.patientId} booked ticket ${queueNumber}`);
    triggerNotification(
      currentUser?.id || 'user-patient-primary', 
      'success', 
      'Appointment Booked', 
      `Ticket ${queueNumber} registered successfully for ${newAppt.timeSlot}`
    );

    return newAppt;
  };

  const addFamilyMember = (memberData: Omit<Patient, 'id' | 'userId' | 'familyOwnerId'>, relationship: Patient['relationship']) => {
    const newMember: Patient = {
      ...memberData,
      id: `pat-${Date.now()}`,
      userId: currentUser?.id || 'user-patient-primary',
      familyOwnerId: 'pat-1', // Default primary user's patient ID
      relationship
    };
    setPatients(prev => [...prev, newMember]);
    createAuditLog('ADD_FAMILY_MEMBER', `Added family member: ${newMember.name} (${relationship})`);
  };

  const toggleFavoriteDoctor = (docId: string) => {
    setFavoriteDoctors(prev => {
      const next = prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId];
      localStorage.setItem('mq_fav_docs', JSON.stringify(next));
      return next;
    });
  };

  const toggleFavoriteClinic = (clinicId: string) => {
    setFavoriteClinics(prev => {
      const next = prev.includes(clinicId) ? prev.filter(id => id !== clinicId) : [...prev, clinicId];
      localStorage.setItem('mq_fav_clinics', JSON.stringify(next));
      return next;
    });
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Import / Export backups
  const exportDatabase = () => {
    const db = {
      clinics,
      doctors,
      patients,
      appointments,
      medicalRecords,
      payments,
      auditLogs,
      articles,
      departments,
      rooms
    };
    createAuditLog('EXPORT_DATABASE', 'System data backup exported');
    return JSON.stringify(db, null, 2);
  };

  const importDatabase = (jsonData: string): boolean => {
    try {
      const db = JSON.parse(jsonData);
      if (db.clinics && db.doctors && db.patients && db.appointments) {
        setClinics(db.clinics);
        setDoctors(db.doctors);
        setPatients(db.patients);
        setAppointments(db.appointments);
        if (db.medicalRecords) setMedicalRecords(db.medicalRecords);
        if (db.payments) setPayments(db.payments);
        if (db.auditLogs) setAuditLogs(db.auditLogs);
        if (db.articles) setArticles(db.articles);
        if (db.departments) setDepartments(db.departments);
        if (db.rooms) setRooms(db.rooms);
        createAuditLog('IMPORT_DATABASE', 'System data backup imported successfully');
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <MedQueueContext.Provider value={{
      currentUser,
      activeRole,
      activeLanguage,
      isNavigating,
      setIsNavigating,
      clinics,
      doctors,
      patients,
      appointments,
      medicalRecords,
      payments,
      auditLogs,
      articles,
      departments,
      rooms,
      notifications,
      favoriteDoctors,
      favoriteClinics,
      developerMode,
      login,
      logout,
      setLanguage: setActiveLanguage,
      createClinic,
      toggleClinicStatus,
      deleteClinic,
      createDoctor,
      updateDoctorStatus,
      updateClinicProfile,
      createDepartment,
      updateAppointmentStatus,
      completeConsultation,
      bookAppointment,
      addFamilyMember,
      toggleFavoriteDoctor,
      toggleFavoriteClinic,
      triggerNotification,
      markNotificationsAsRead,
      exportDatabase,
      importDatabase,
      createAuditLog
    }}>
      {children}
    </MedQueueContext.Provider>
  );
};

export const useMedQueue = () => {
  const context = useContext(MedQueueContext);
  if (context === undefined) {
    throw new Error('useMedQueue must be used within a MedQueueProvider');
  }
  return context;
};
