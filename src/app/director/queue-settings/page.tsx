"use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Sliders, Search, User, Clock, Printer, CheckCircle, Play, XCircle, SlidersHorizontal, Ticket } from 'lucide-react';
 
import { Appointment } from '../../../types';
 
export default function QueueSettingsDirector() { const { t: globalT } = useTranslation();
 const { currentUser, appointments, doctors, patients, triggerNotification, createAuditLog } = useMedQueue();
 const clinicId = currentUser?.clinicId || 'clinic-1';
 
/*  Config parameters state */
const [bufferTime, setBufferTime] = useState('10');
 const [ticketPrefix, setTicketPrefix] = useState('A');
 const [activePrinter, setActivePrinter] = useState('printer-thermal-01');
 const [isSaving, setIsSaving] = useState(false);
 
/*  Active queue state list */
const today = new Date().toISOString().substring(0, 10);
 const clinicAppts = appointments
  .filter(a => a.clinicId === clinicId && (a.date === today || a.date === '2026-07-02')) /* including mocked date */
  .map(appt => {
    const doc = doctors.find(d => d.id === appt.doctorId);
    const pat = patients.find(p => p.id === appt.patientId);
    return { ...appt, doctorName: doc ? doc.name : 'Unknown Doctor', patientName: pat ? pat.name : 'Unknown Patient' };
  });

 const waitingQueue = clinicAppts.filter(a => a.status === 'waiting' || a.status === 'arrived' || a.status === 'booked');
 const inConsultQueue = clinicAppts.filter(a => a.status === 'in_consultation');
 const completedQueue = clinicAppts.filter(a => a.status === 'completed');
 const handleSaveSettings = (e: React.FormEvent) => { e.preventDefault();
 setIsSaving(true);
 setTimeout(() => { setIsSaving(false);
 createAuditLog('UPDATE_QUEUE_SETTINGS', `Updated queue buffers: ${bufferTime}m, ticket prefix: ${ticketPrefix}`);
 triggerNotification(clinicId, 'success', 'Settings Updated', 'Queue parameters saved successfully.');
 }, 800);
 };
 
return (
  <div className="flex flex-col gap-6 w-full pb-10">
    { /* Header Banner */ }
    <div>
      <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> Queue Controls & Configurations </h1>
      <p className="text-xs text-muted-foreground mt-1"> Monitor active waiting rooms, adjust patient check-in buffers, and configure thermal printers. </p>
    </div>
    { /* Grid panels */ }
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      { /* Left: Queue Live Telemetry status */ }
<div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl xl:col-span-2 flex flex-col gap-5"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <Ticket className="h-5 w-5 text-cyan-400" /> Live Clinic Queue Status </h3> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> { /* Waiting box */ }
<div className="bg-slate-50 dark:bg-slate-950/40 border border-border p-4 rounded-xl flex flex-col gap-2"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Waiting Room</span> <span className="text-3xl font-bold font-mono text-cyan-400">{waitingQueue.length}</span> <div className="flex flex-col gap-1.5 mt-2 max-h-40 overflow-y-auto pr-1"> {waitingQueue.map(a => ( <div key={a.id} className="p-1.5 bg-card text-card-foreground/50 border border-border/80 rounded text-[10px] flex justify-between font-semibold"> <span className="text-secondary-foreground truncate">{a.patientName}</span> <span className="text-cyan-400 font-mono">{a.queueNumber}</span> </div> ))} </div> </div> { /* In consultation box */ }
<div className="bg-slate-50 dark:bg-slate-950/45 border border-cyan-500/10 p-4 rounded-xl flex flex-col gap-2"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">In Cabin Session</span> <span className="text-3xl font-bold font-mono text-indigo-400">{inConsultQueue.length}</span> <div className="flex flex-col gap-1.5 mt-2 max-h-40 overflow-y-auto pr-1"> {inConsultQueue.map(a => ( <div key={a.id} className="p-1.5 bg-indigo-500/5 border border-indigo-500/20 rounded text-[10px] flex justify-between font-semibold"> <span className="text-secondary-foreground truncate">{a.patientName}</span> <span className="text-indigo-400 font-mono">{a.queueNumber}</span> </div> ))} </div> </div> { /* Completed today box */ }
<div className="bg-slate-50 dark:bg-slate-950/40 border border-border p-4 rounded-xl flex flex-col gap-2"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Completed Consultations</span> <span className="text-3xl font-bold font-mono text-emerald-400">{completedQueue.length}</span> <div className="flex flex-col gap-1.5 mt-2 max-h-40 overflow-y-auto pr-1"> {completedQueue.map(a => ( <div key={a.id} className="p-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded text-[10px] flex justify-between font-semibold"> <span className="text-secondary-foreground truncate">{a.patientName}</span> <span className="text-emerald-400 font-mono">{a.queueNumber}</span> </div> ))} </div> </div> </div> </div> { /* Right: Queue parameter configurations */ }
<div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <SlidersHorizontal className="h-5 w-5 text-cyan-400" /> Queue Buffer parameters </h3> <form onSubmit={handleSaveSettings} className="flex flex-col gap-4"> <Input id="q-buffer" label="Consultation Duration limit (Minutes)" type="number" value={bufferTime} onChange={(e) => setBufferTime(e.target.value)} required /> <Input id="q-prefix" label="Default Ticket Category Prefix" maxLength={2} value={ticketPrefix} onChange={(e) => setTicketPrefix(e.target.value.toUpperCase())} required /> <div className="flex flex-col gap-1.5 border-t border-border/40 pt-3"> <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1"> <Printer className="h-4 w-4" /> Thermal Ticket Printer Node </label> <select value={activePrinter} onChange={(e) => setActivePrinter(e.target.value)} className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer w-full" > <option value="printer-thermal-01">Kiosk Printer Cabin 1 (IP: 192.168.1.18)</option> <option value="printer-thermal-02">Kiosk Printer Cabin 2 (IP: 192.168.1.19)</option> <option value="none">Disable Printer Connection</option> </select> </div> <Button type="submit" variant="primary" isLoading={isSaving} className="w-full mt-2 font-bold cursor-pointer" > Save Queue Config </Button> </form> </div> </div> </div> );
 }