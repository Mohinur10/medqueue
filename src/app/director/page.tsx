"use client";
 
import React, { useEffect, useState } from 'react';
 
import { useMedQueue } from '../../context/MedQueueContext';
 
import { Building, Users, Stethoscope, Clock, TrendingUp, Receipt, PlusCircle, Calendar, ShieldCheck, Activity, AlertCircle, ChevronRight, BarChart3, Star, Landmark, Settings } from 'lucide-react';
 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
 
import { Skeleton } from '../../components/ui/Skeleton';
 
import { useRouter } from 'next/navigation';
 
import { useTranslation } from '../../hooks/useTranslation';
 
export default function DirectorDashboard() { const { currentUser, clinics, doctors, patients, appointments, payments, auditLogs } = useMedQueue();
 const router = useRouter();
 const { t } = useTranslation();
 const [isMounted, setIsMounted] = useState(false);
 useEffect(() => { setIsMounted(true);
 }, []);
 
/*  Isolate clinic data based on director's assigned clinic */
const clinicId = currentUser?.clinicId || 'clinic-1';
 const clinic = clinics.find(c => c.id === clinicId);
 if (!isMounted) { 
return ( <div className="flex flex-col gap-6 w-full"> <Skeleton variant="rect" className="h-28" /> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <Skeleton variant="rect" className="h-24" /> <Skeleton variant="rect" className="h-24" /> <Skeleton variant="rect" className="h-24" /> <Skeleton variant="rect" className="h-24" /> </div> <Skeleton variant="rect" className="h-80" /> </div> );
 } 
/*  Clinic Level Filtering */
const clinicDoctors = doctors.filter(d => d.clinicId === clinicId);
 const clinicAppointments = appointments.filter(a => a.clinicId === clinicId);
 const clinicPayments = payments.filter(p => p.clinicId === clinicId);
 
/*  Calculate clinic KPIs */
const today = new Date().toISOString().substring(0, 10);
 const todayAppts = clinicAppointments.filter(a => a.date === today || a.date === '2026-07-02');
 
/*  including mocked date */
const waitingPatientsCount = todayAppts.filter(a => a.status === 'waiting' || a.status === 'arrived').length;
 const inConsultationCount = todayAppts.filter(a => a.status === 'in_consultation').length;
 const completedToday = todayAppts.filter(a => a.status === 'completed').length;
 const todayRevenue = clinicPayments .filter(p => p.status === 'success') .reduce((acc, p) => acc + p.amount, 0);
 const activeDocCount = clinicDoctors.filter(d => d.status === 'active').length;
 
/*  Wait time simulation: 10 min average per patient waiting */
const avgWaitTime = waitingPatientsCount * 10;
 
/*  Chart Data preparation */
const weeklyAppointmentData = [ { name: 'Mon', count: 12 }, { name: 'Tue', count: 18 }, { name: 'Wed', count: 15 }, { name: 'Thu', count: 22 }, { name: 'Fri', count: 20 }, { name: 'Sat', count: todayAppts.length || 8 }, { name: 'Sun', count: 0 }];
 const monthlyRevenueData = [ { name: 'Jan', revenue: 6500000 }, { name: 'Feb', revenue: 7800000 }, { name: 'Mar', revenue: 9200000 }, { name: 'Apr', revenue: 11000000 }, { name: 'May', revenue: 10500000 }, { name: 'Jun', revenue: 12800000 + todayRevenue }];
 
/*  Doctor Performance Ranking */
const doctorPerformance = clinicDoctors.map(doc => { 
/*  Count completed consultations in history */
const completedCount = clinicAppointments.filter(a => a.doctorId === doc.id && a.status === 'completed').length;
 
return { name: doc.name, specialty: doc.specialization, rating: doc.id === 'doc-1' ? 4.9 : 4.7, completedCount: completedCount + (doc.id === 'doc-1' ? 24 : 15) 
/*  adding historical simulated completed */

 };
 }).sort((a, b) => b.completedCount - a.completedCount);
 
/*  Clinic log history */
const clinicLogs = auditLogs.filter(log => log.details.toLowerCase().includes(clinic?.name.toLowerCase() || ''));
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Clinic Header Banner */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-6 rounded-2xl border border-cyan-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]"> <div className="flex items-center gap-4"> <img src={clinic?.logo || "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=100"} alt="Clinic Logo" 

 className="h-14 w-14 rounded-xl border border-border bg-slate-800 object-cover shadow-[0_0_15px_rgba(6,182,212,0.2)]" /> <div> <h1 className="text-xl font-bold text-foreground tracking-tight"> {clinic?.name} {t.directorDashboard?.title?.split(' ')[1] || 'Portal'} </h1> <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"> <Building className="h-3.5 w-3.5 text-muted-foreground" /> {clinic?.address} </p> </div> </div> <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold w-max shadow-[0_0_12px_rgba(6,182,212,0.1)]"> <Clock className="h-4 w-4" /> {t.directorDashboard?.shiftSchedule || 'Shift Schedule'}: {clinic?.workingHours.start} - {clinic?.workingHours.end} </div> </div> {
/* KPI Cards Grid */
} <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {
/* Today's Revenue */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group"> <div className="flex flex-col gap-1.5"> <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.directorDashboard?.todaysRevenue || "Today's Revenue"}</span> <span className="text-2xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"> {todayRevenue.toLocaleString()} <span className="text-xs text-muted-foreground">{t.directorDashboard?.currency || 'UZS'}</span> </span> <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1"> <TrendingUp className="h-3 w-3" /> +8.5% from weekly average </span> </div> <div className="h-11 w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)] group-hover:border-cyan-500/50 transition-colors"> <Receipt className="h-5.5 w-5.5" /> </div> </div> {
/* Today's Appointments */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group"> <div className="flex flex-col gap-1.5"> <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.directorDashboard?.todaysQueue || "Today's Queue"}</span> <span className="text-2xl font-bold font-mono text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"> {todayAppts.length} <span className="text-xs text-muted-foreground">{t.directorDashboard?.booked || 'Booked'}</span> </span> <span className="text-[10px] text-muted-foreground font-semibold"> {completedToday} Completed • {todayAppts.filter(a => a.status === 'cancelled').length} Cancelled </span> </div> <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover:border-blue-500/50 transition-colors"> <Calendar className="h-5.5 w-5.5" /> </div> </div> {
/* Active Clinicians */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group"> <div className="flex flex-col gap-1.5"> <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.directorDashboard?.cliniciansOnShift || 'Clinicians On Shift'}</span> <span className="text-2xl font-bold font-mono text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]"> {activeDocCount} <span className="text-xs text-muted-foreground">/ {clinicDoctors.length} staff</span> </span> <span className="text-[10px] text-indigo-400 font-semibold"> {inConsultationCount} actively consulting patients </span> </div> <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)] group-hover:border-indigo-500/50 transition-colors"> <Stethoscope className="h-5.5 w-5.5" /> </div> </div> {
/* Average Waiting time */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group"> <div className="flex flex-col gap-1.5"> <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.directorDashboard?.queueCapacity || 'Queue Capacity'}</span> <span className="text-2xl font-bold font-mono text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"> {avgWaitTime} <span className="text-xs text-muted-foreground">{t.directorDashboard?.minsWait || 'mins wait'}</span> </span> <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1"> <Clock className="h-3.5 w-3.5" /> {waitingPatientsCount} waiting in lobby </span> </div> <div className="h-11 w-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)] group-hover:border-rose-500/50 transition-colors"> <Clock className="h-5.5 w-5.5" /> </div> </div> </div> {
/* Charts section */
} <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {
/* Weekly Appointment distribution */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl flex flex-col gap-4"> <div className="flex justify-between items-center"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t.directorDashboard?.weeklyVolume || 'Weekly Appointment Volume'}</h3> <span className="text-[10px] bg-secondary text-secondary-foreground border border-border text-muted-foreground px-2 py-1 rounded">{t.directorDashboard?.weeklyLoad || 'Weekly load'}</span> </div> <div className="h-64 w-full mt-2"> <ResponsiveContainer width="100%" height="100%"> <BarChart data={weeklyAppointmentData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}> <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" /> <XAxis dataKey="name" stroke="#64748b" fontSize={10} /> <YAxis stroke="#64748b" fontSize={10} /> <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} labelStyle={{ color: '#94a3b8', fontSize: 11 }} itemStyle={{ color: '#3b82f6', fontSize: 12 }} /> <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} /> </BarChart> </ResponsiveContainer> </div> </div> {
/* Revenue chart */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl flex flex-col gap-4"> <div className="flex justify-between items-center"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t.directorDashboard?.monthlyTrend || 'Monthly Revenue Trend'}</h3> <span className="text-[10px] bg-secondary text-secondary-foreground border border-border text-muted-foreground px-2 py-1 rounded">{t.directorDashboard?.currency || 'UZS'}</span> </div> <div className="h-64 w-full mt-2"> <ResponsiveContainer width="100%" height="100%"> <AreaChart data={monthlyRevenueData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}> <defs> <linearGradient id="colorDirRev" x1="0" y1="0" x2="0" y2="1"> <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/> <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/> </linearGradient> </defs> <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" /> <XAxis dataKey="name" stroke="#64748b" fontSize={10} /> <YAxis stroke="#64748b" fontSize={10} /> <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} labelStyle={{ color: '#94a3b8', fontSize: 11 }} itemStyle={{ color: '#06b6d4', fontSize: 12, fontWeight: 'bold' }} /> <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorDirRev)" /> </AreaChart> </ResponsiveContainer> </div> </div> </div> {
/* Performance rankings & Action triggers */
} <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {
/* Clinician Performance Ranking */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl lg:col-span-2 flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5"> <Star className="h-4.5 w-4.5 text-cyan-400" /> Medical Staff Performance Rankings </h3> <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto divide-y divide-slate-800/40"> {doctorPerformance.map((doc, idx) => ( <div key={idx} className="pt-2.5 pb-1 flex items-center justify-between text-xs"> <div className="flex items-center gap-3"> <div className="h-7 w-7 rounded-lg bg-secondary text-secondary-foreground border border-border text-muted-foreground font-bold flex items-center justify-center font-mono"> #{idx + 1} </div> <div> <div className="font-bold text-foreground">{doc.name}</div> <div className="text-[10px] text-muted-foreground mt-0.5">{doc.specialty}</div> </div> </div> <div className="flex items-center gap-6"> <div className="text-right"> <div className="text-muted-foreground font-mono font-bold">{doc.completedCount}</div> <div className="text-[9px] text-muted-foreground">{t.directorDashboard?.consultations || 'Consultations'}</div> </div> <div className="flex items-center gap-1 text-cyan-400 font-bold font-mono"> <Star className="h-3.5 w-3.5 fill-current" /> {doc.rating} </div> </div> </div> ))} </div> </div> {
/* Quick Action cards */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5"> <Activity className="h-4.5 w-4.5 text-muted-foreground" /> Control Operations </h3> <div className="flex flex-col gap-2.5"> <button onClick={() => router.push('/director/doctors')} className="w-full p-3 bg-card text-card-foreground/60 hover:bg-cyan-500/10 border border-border/80 hover:border-cyan-500/25 rounded-xl text-left text-xs font-semibold text-secondary-foreground hover:text-cyan-400 flex items-center gap-3 transition-all duration-300 cursor-pointer" > <PlusCircle className="h-5 w-5 text-muted-foreground" /> <div> <div>Register Clinic Doctor</div> <div className="text-[10px] text-muted-foreground font-medium mt-0.5">Setup doctor files & schedules</div> </div> </button> <button onClick={() => router.push('/director/departments')} className="w-full p-3 bg-card text-card-foreground/60 hover:bg-cyan-500/10 border border-border/80 hover:border-cyan-500/25 rounded-xl text-left text-xs font-semibold text-secondary-foreground hover:text-cyan-400 flex items-center gap-3 transition-all duration-300 cursor-pointer" > <BarChart3 className="h-5 w-5 text-muted-foreground" /> <div> <div>Clinic Room Allocations</div> <div className="text-[10px] text-muted-foreground font-medium mt-0.5">Map department doctors to rooms</div> </div> </button> <button onClick={() => router.push('/director/settings')} className="w-full p-3 bg-card text-card-foreground/60 hover:bg-cyan-500/10 border border-border/80 hover:border-cyan-500/25 rounded-xl text-left text-xs font-semibold text-secondary-foreground hover:text-cyan-400 flex items-center gap-3 transition-all duration-300 cursor-pointer" > <Settings className="h-5 w-5 text-muted-foreground" /> <div> <div>Clinic Profile branding</div> <div className="text-[10px] text-muted-foreground font-medium mt-0.5">Upload logo, hours, and coordinates</div> </div> </button> </div> </div> </div> </div> );
 } 