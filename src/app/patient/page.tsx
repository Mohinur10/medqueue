"use client";
 
import React, { useEffect, useState } from 'react';
 
import { useMedQueue } from '../../context/MedQueueContext';
 
import { Users, Clock, Calendar, CheckCircle, Heart, Building, Stethoscope, Receipt, ShieldAlert, Sparkles, ChevronRight, BookOpen, Star, RefreshCw } from 'lucide-react';
 
import { useRouter } from 'next/navigation';
 
import { useTranslation } from '../../hooks/useTranslation';
 
import { Skeleton } from '../../components/ui/Skeleton';
 
export default function PatientDashboard() { const { currentUser, appointments, doctors, clinics, medicalRecords, favoriteClinics, favoriteDoctors, toggleFavoriteDoctor, toggleFavoriteClinic, triggerNotification, articles } = useMedQueue();
 const router = useRouter();
 const { t } = useTranslation();
 const [isMounted, setIsMounted] = useState(false);
 useEffect(() => { setIsMounted(true);
 }, []);
 
/*  Isolate patient details */
const patientId = currentUser?.patientId || 'pat-1';
 if (!isMounted) { 
return ( <div className="flex flex-col gap-6 w-full pb-10"> <Skeleton variant="rect" className="h-32" /> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <Skeleton variant="rect" className="h-44" /> <Skeleton variant="rect" className="h-44" /> <Skeleton variant="rect" className="h-44" /> </div> </div> );
 } 
/*  Get active appointments for this patient */
const today = new Date().toISOString().substring(0, 10);
 const myAppts = appointments .filter(a => a.patientId === patientId) .map(appt => { const doc = doctors.find(d => d.id === appt.doctorId);
 const cl = clinics.find(c => c.id === appt.clinicId);
 
return { ...appt, doctorName: doc ? doc.name : 'Unknown Doctor', doctorSpecialty: doc ? doc.specialization : 'N/A', doctorPhoto: doc ? doc.photo : '', clinicName: cl ? cl.name : 'Unknown Clinic', clinicLogo: cl ? cl.logo : '' };
 });
 
/*  Find active queue ticket (Booked, Arrived, Waiting, In Consultation) */
const activeTicket = myAppts.find(a => a.status === 'waiting' || a.status === 'arrived' || a.status === 'in_consultation' || a.status === 'booked' );
 
/*  Remaining patients and wait time mock calculations */
const remainingPatients = activeTicket ? 3 : 0;
 const estWaitTime = remainingPatients * 10;
 
/*  History and Prescriptions */
const myHistory = medicalRecords.filter(r => r.patientId === patientId);
 const latestRecord = myHistory[0] || null;
 
/*  Favorite objects */
const myFavDoctors = doctors.filter(d => favoriteDoctors.includes(d.id));
 const myFavClinics = clinics.filter(c => favoriteClinics.includes(c.id));
 
/*  Dynamic Articles from Super Admin CMS */
const healthTips = articles.filter(a => a.status === 'published').slice(0, 3);
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Patient Welcome Banner */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-6 rounded-2xl border border-cyan-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]"> <div className="flex items-center gap-4"> <div className="h-14 w-14 rounded-full bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center font-bold text-cyan-400 text-2xl"> {currentUser?.name?.charAt(0) || 'P'} </div> <div> <h1 className="text-xl font-bold text-foreground tracking-tight"> {t.patientDashboard?.welcome ? t.patientDashboard.welcome.split('.')[0] + ', ' + (currentUser?.name || 'Patient') : 'Assalomu Alaykum, ' + (currentUser?.name || 'Patient')} </h1> <p className="text-xs text-muted-foreground mt-1"> {t.patientDashboard?.welcome || 'Welcome back to MedQueue. Access your medical cards, prescription tariffs, and active queues.'} </p> </div> </div> <button onClick={() => router.push('/patient/book')} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer w-max" > {t.patientDashboard?.bookConsultation || 'Book Consultation'} </button> </div> {
/* Main Grid splits */
} <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"> {
/* Left column: Live Ticket widget & History (Col span 7) */
} <div className="lg:col-span-7 flex flex-col gap-6"> {
/* Live Queue Ticket Card */
} {activeTicket ? ( <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col gap-4 relative overflow-hidden animate-pulse-glow"> <div className="flex justify-between items-start"> <div className="flex items-center gap-3"> <img src={activeTicket.clinicLogo || "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=100"} alt="Clinic Logo" 

 className="h-10 w-10 rounded-lg border border-border bg-slate-800 object-cover" /> <div> <h3 className="font-bold text-foreground text-sm">{activeTicket.clinicName}</h3> <p className="text-[10px] text-muted-foreground mt-0.5">Doctor: {activeTicket.doctorName} ({activeTicket.doctorSpecialty})</p> </div> </div> <span className="text-[9px] uppercase font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded flex items-center gap-1 animate-pulse"> <RefreshCw className="h-3 w-3 animate-spin" /> {t.patientDashboard?.liveQueue || 'Live Queue Number'} </span> </div> {
/* Big Queue number */
} <div className="flex items-center justify-between border-t border-border/60 pt-4"> <div className="flex flex-col gap-0.5"> <span className="text-[10px] text-muted-foreground uppercase font-bold">{t.patientDashboard?.yourTicket || 'Your Ticket:'}</span> <span className="text-4xl font-extrabold font-mono text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"> {activeTicket.queueNumber} </span> </div> <div className="flex flex-col gap-0.5 text-right"> <span className="text-[10px] text-muted-foreground uppercase font-bold">{t.patientDashboard?.estWait || 'Estimated Wait:'}</span> <span className="text-xl font-bold font-mono text-foreground"> ~{estWaitTime} mins </span> <span className="text-[9px] text-muted-foreground font-semibold">{remainingPatients} {t.patientDashboard?.remaining || 'patients remaining'}</span> </div> </div> {
/* Status details */
} <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs mt-1"> <div className="flex items-center gap-1.5 text-muted-foreground"> <Clock className="h-4 w-4 text-muted-foreground" /> <span>{t.patientDashboard?.sessionSlot || 'Session Slot:'} <strong className="text-secondary-foreground font-mono">{activeTicket.timeSlot}</strong></span> </div> <div className="flex items-center gap-1.5"> <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider capitalize"> {t.patientDashboard?.status || 'Status:'} {activeTicket.status.replace('_', ' ')} </span> </div> </div> </div> ) : ( <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-6 rounded-2xl border border-border/40 text-center flex flex-col items-center justify-center gap-3"> <Calendar className="h-10 w-10 text-muted-foreground" /> <div> <h3 className="text-xs font-bold text-muted-foreground">{t.patientDashboard?.noActive || 'No active queue bookings'}</h3> <p className="text-[10px] text-muted-foreground mt-1">{t.patientDashboard?.scheduleDesc || 'Schedule a session with one of our certified physicians.'}</p> </div> <button onClick={() => router.push('/patient/book')} className="px-3.5 py-1.5 bg-card text-card-foreground border border-border hover:border-cyan-500/30 text-secondary-foreground text-xs font-bold rounded-lg cursor-pointer transition-all" > {t.patientDashboard?.scheduleNow || 'Schedule Now'} </button> </div> )} {
/* Recent Diagnostics and Pharmacotherapy */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl border border-border/40 flex flex-col gap-4"> <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 border-b border-border pb-2"> <Users className="h-4.5 w-4.5 text-muted-foreground" /> {t.patientDashboard?.latestConsult || 'Latest Consultation Summary'} </h3> {latestRecord ? ( <div className="flex flex-col gap-3 text-xs"> <div className="flex justify-between items-center text-[10px] text-muted-foreground"> <span className="font-mono font-bold text-cyan-400">{latestRecord.date}</span> <span>{t.patientDashboard?.recordId || 'Record ID:'} {latestRecord.id}</span> </div> <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 border border-slate-900 rounded-xl"> <span className="text-[10px] text-muted-foreground font-bold uppercase block">{t.patientDashboard?.diagnosis || 'Diagnosis:'}</span> <p className="text-foreground font-bold mt-1 text-xs">{latestRecord.diagnosis}</p> </div> {latestRecord.prescription && latestRecord.prescription.length > 0 && ( <div> <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1.5">{t.patientDashboard?.pharmacotherapy || 'Prescribed Pharmacotherapy:'}</span> <div className="flex flex-col gap-1.5"> {latestRecord.prescription.map((m, idx) => ( <div key={idx} className="p-2.5 bg-card text-card-foreground/60 border border-border rounded-lg flex items-center justify-between text-xs"> <span className="font-bold text-secondary-foreground">{m.medicine}</span> <span className="text-[10px] font-mono text-muted-foreground">{m.dose} ({m.frequency})</span> </div> ))} </div> </div> )} <button onClick={() => router.push('/patient/history')} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 mt-1 cursor-pointer w-max ml-auto" > {t.patientDashboard?.viewFull || 'View Full Medical Timeline'} <ChevronRight className="h-4 w-4" /> </button> </div> ) : ( <div className="py-6 text-center text-xs text-muted-foreground"> {t.patientDashboard?.noPast || 'No past clinical records found.'} </div> )} </div> </div> {
/* Right column: Favorites & Health Tips (Col span 5) */
} <div className="lg:col-span-5 flex flex-col gap-6"> {
/* Health Tip widget */
} <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-5 rounded-2xl border border-cyan-500/20 flex flex-col gap-3"> <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5"> <Sparkles className="h-4 w-4" /> {t.patientDashboard?.healthInsights || 'Daily Health Insights'} </h3> <div className="flex flex-col gap-2.5 text-xs"> {healthTips.map((tip) => ( <div key={tip.id} className="bg-slate-50 dark:bg-slate-950/30 p-3 rounded-xl border border-slate-900/40 hover:bg-card text-card-foreground transition-colors cursor-pointer group"> <div className="flex items-center justify-between mb-1"> <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{tip.category}</span> <span className="text-[9px] text-muted-foreground">{tip.readTime}</span> </div> <h4 className="font-bold text-foreground group-hover:text-cyan-400 transition-colors">{tip.title}</h4> <p className="text-muted-foreground mt-1 leading-relaxed text-[11px] line-clamp-2">{tip.content}</p> </div> ))} {healthTips.length === 0 && ( <div className="text-center p-4 text-muted-foreground text-xs"> {t.patientDashboard?.noInsights || 'No health insights available at the moment.'} </div> )} </div> </div> {
/* Favorite doctors list */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl border border-border/40 flex flex-col gap-4"> <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 border-b border-border pb-2"> <Star className="h-4.5 w-4.5 text-cyan-400" /> {t.patientDashboard?.favPhysicians || 'Favorite Physicians'} </h3> <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1"> {myFavDoctors.length > 0 ? ( myFavDoctors.map((doc) => ( <div key={doc.id} className="p-3 bg-card text-card-foreground/60 border border-border rounded-xl flex items-center justify-between gap-3 text-xs"> <div className="flex items-center gap-3"> <img src={doc.photo} alt={doc.name} className="h-10 w-10 rounded-full object-cover border border-border bg-slate-800" /> <div> <h4 className="font-bold text-foreground">{doc.name}</h4> <span className="text-[10px] text-muted-foreground font-semibold">{doc.specialization}</span> </div> </div> <button onClick={() => router.push(`/patient/book?doctor=${doc.id}`)} className="px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-semibold cursor-pointer" > {t.patientDashboard?.book || 'Book'} </button> </div> )) ) : ( <div className="py-4 text-center text-xs text-muted-foreground"> {t.patientDashboard?.addFavDocs || 'Add physicians to favorites for quick booking.'} </div> )} </div> </div> {
/* Favorite clinics list */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl border border-border/40 flex flex-col gap-4"> <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 border-b border-border pb-2"> <Building className="h-4.5 w-4.5 text-cyan-400" /> {t.patientDashboard?.savedClinics || 'Saved Clinics'} </h3> <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1"> {myFavClinics.length > 0 ? ( myFavClinics.map((c) => ( <div key={c.id} className="p-3 bg-card text-card-foreground/60 border border-border rounded-xl flex items-center justify-between gap-3 text-xs"> <div className="flex items-center gap-3"> <img src={c.logo} alt={c.name} className="h-9 w-9 rounded-lg object-cover border border-border bg-slate-800" /> <div> <h4 className="font-bold text-foreground">{c.name}</h4> <span className="text-[9px] text-muted-foreground truncate max-w-[150px] block mt-0.5">{c.address}</span> </div> </div> <button onClick={() => router.push(`/patient/book?clinic=${c.id}`)} className="px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-semibold cursor-pointer" > {t.patientDashboard?.book || 'Book'} </button> </div> )) ) : ( <div className="py-4 text-center text-xs text-muted-foreground"> {t.patientDashboard?.saveFavClinics || 'Save clinics to favorites for fast checkout.'} </div> )} </div> </div> </div> </div> </div> );
 } 