/* eslint-disable */
 "use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState, useEffect } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Calendar as CalendarIcon, Clock, Users, PlusCircle, MapPin, AlertCircle, ShieldAlert, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
 
import { Doctor } from '../../../types';
 interface VacationEvent { id: string;
 doctorId: string;
 doctorName: string;
 startDate: string;
 endDate: string;
 reason: string;
 } 
export default function SchedulesDirector() { const { t: globalT } = useTranslation();
 const { currentUser, doctors, triggerNotification, createAuditLog } = useMedQueue();
 const clinicId = currentUser?.clinicId || 'clinic-1';
 
/*  State */
const [isMounted, setIsMounted] = useState(false);
 const [isVacationOpen, setIsVacationOpen] = useState(false);
 
/*  Vacation form */
const [vDocId, setVDocId] = useState('');
 const [vStart, setVStart] = useState('');
 const [vEnd, setVEnd] = useState('');
 const [vReason, setVReason] = useState('Annual Leave');
 
/*  Local state for vacation events */
const [vacations, setVacations] = useState<VacationEvent[]>([ { id: 'vac-1', doctorId: 'doc-2', doctorName: 'Dr. Dilnoza Karimova', startDate: '2026-07-15', endDate: '2026-07-22', reason: 'Medical Conference' }]);
 const clinicDoctors = doctors.filter(d => d.clinicId === clinicId);
 useEffect(() => { setIsMounted(true);
 if (clinicDoctors.length > 0) { setVDocId(clinicDoctors[0].id);
 } }, [doctors]);
 if (!isMounted) { 
return ( <div className="flex flex-col gap-6 w-full"> <Skeleton variant="rect" className="h-80" /> </div> );
 } const handleAddVacation = (e: React.FormEvent) => { e.preventDefault();
 if (!vDocId || !vStart || !vEnd) return;
 const doc = clinicDoctors.find(d => d.id === vDocId);
 if (!doc) return;
 const newVac: VacationEvent = { id: `vac-${Date.now()}`, doctorId: vDocId, doctorName: doc.name, startDate: vStart, endDate: vEnd, reason: vReason };
 setVacations(prev => [...prev, newVac]);
 setIsVacationOpen(false);
 
/*  Reset setVStart('');
 setVEnd('');
 setVReason('Annual Leave');
 createAuditLog('SCHEDULE_VACATION', `Scheduled vacation for Dr. ${doc.name} from ${vStart} to ${vEnd}`);
 triggerNotification(clinicId, 'success', 'Vacation Scheduled', `Successfully scheduled vacation for Dr. ${doc.name}`);
 */

 };
 const handleCancelVacation = (id: string) => { setVacations(prev => prev.filter(v => v.id !== id));
 createAuditLog('CANCEL_VACATION', `Cancelled vacation ID: ${id}`);
 triggerNotification(clinicId, 'success', 'Vacation Cancelled', 'Vacation dates released.');
 };
 
/*  Generate calendar days (mocking active month July 2026) */
const renderCalendarDays = () => { const days = [];
 const totalDays = 31;
 
/*  July */
const startOffset = 2;
 
/*  July 2026 starts on Wednesday (offset 2) // Empty cells for offset for (let i = 0;
 for (let i = 1; i < startOffset; i++) { days.push(<div key={`empty-${i}`} className="h-20 border border-border/40 p-2 text-secondary-foreground bg-slate-50 dark:bg-muted/50" />);
 } 
/* Days cells */
 for(let day=1; day<=totalDays;
 day++) { const dateString = `2026-07-${day.toString().padStart(2, '0')}`;
 
/* Check if any doctor is on vacation today */
 const activeVacations = vacations.filter(v => dateString >= v.startDate && dateString <= v.endDate );
 days.push( <div key={day} className="h-20 border border-border/40 p-2 flex flex-col justify-between hover:bg-card text-card-foreground/30 transition-colors bg-card text-card-foreground/10"> <span className="text-xs font-bold text-muted-foreground font-mono">{day}</span> <div className="flex flex-col gap-1 overflow-hidden max-h-12"> {activeVacations.map((v, idx) => ( <span key={idx} className="text-[8px] px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold truncate" title={`${v.doctorName}: ${v.reason}`} > {v.doctorName.split(' ').slice(1).join(' ')}: Off </span> ))} </div> </div> );
 } 
return days;
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> Shift & Vacation Planner </h1> <p className="text-xs text-muted-foreground mt-1"> Configure physician schedules, log leaves, and monitor shift calendars. </p> </div> <Button variant="primary" onClick={() => setIsVacationOpen(true)} className="flex items-center gap-2 cursor-pointer font-bold" > <PlusCircle className="h-4.5 w-4.5" /> Schedule Doctor Leave </Button> </div> {
/* Main Grid: Calendar and Vacations list */
} <div className="grid grid-cols-1 xl:grid-cols-3 gap-6"> {
/* Left: Monthly Calendar view */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl xl:col-span-2 flex flex-col gap-4"> <div className="flex justify-between items-center border-b border-border pb-3"> <div className="flex items-center gap-2"> <CalendarIcon className="h-5 w-5 text-cyan-400" /> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider"> Shift Calendar: July 2026 </h3> </div> <div className="flex gap-2"> <Button variant="ghost" size="sm" className="p-1 cursor-pointer"> <ChevronLeft className="h-4 w-4" /> </Button> <Button variant="ghost" size="sm" className="p-1 cursor-pointer"> <ChevronRight className="h-4 w-4" /> </Button> </div> </div> {
/* Weekday headers */
} <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2"> <div>Mon</div> <div>Tue</div> <div>Wed</div> <div>Thu</div> <div>Fri</div> <div>Sat</div> <div>Sun</div> </div> {
/* Calendar grid */
} <div className="grid grid-cols-7 rounded-xl overflow-hidden border border-border/40"> {renderCalendarDays()} </div> </div> {
/* Right: Active Leaves list */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-2"> <Clock className="h-5 w-5 text-cyan-400" /> Scheduled Leaves </h3> <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-2 divide-y divide-slate-800/40"> {vacations.length > 0 ? ( vacations.map((vac) => ( <div key={vac.id} className="pt-3 pb-1 flex justify-between items-start text-xs group"> <div className="flex flex-col gap-1"> <h4 className="font-bold text-foreground">{vac.doctorName}</h4> <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">{vac.reason}</p> <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-mono mt-1"> <span>{vac.startDate}</span> <span>to</span> <span>{vac.endDate}</span> </div> </div> <button onClick={() => handleCancelVacation(vac.id)} className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer opacity-0 group-hover:opacity-100" title="Cancel Leave" > Cancel </button> </div> )) ) : ( <EmptyState icon={CalendarIcon} title="No Doctor Leaves Scheduled" description="All doctors are fully active for the upcoming calendar month." /> )} </div> </div> </div> {
/* Schedule Leave Dialog */
} <Dialog isOpen={isVacationOpen} onClose={() => setIsVacationOpen(false)} title="Schedule Doctor Leave" > <form onSubmit={handleAddVacation} className="flex flex-col gap-4"> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Doctor *</label> <select value={vDocId} onChange={(e) => setVDocId(e.target.value)} required className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer w-full" > {clinicDoctors.map(d => ( <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option> ))} </select> </div> <div className="grid grid-cols-2 gap-4"> <Input id="vac-start" label="Start Date *" type="date" value={vStart} onChange={(e) => setVStart(e.target.value)} required /> <Input id="vac-end" label="End Date *" type="date" value={vEnd} onChange={(e) => setVEnd(e.target.value)} required /> </div> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Reason / Details</label> <select value={vReason} onChange={(e) => setVReason(e.target.value)} className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer w-full" > <option value="Annual Leave">Annual Leave</option> <option value="Medical Conference">Medical Conference</option> <option value="Sick Leave">Sick Leave</option> <option value="Personal Leave">Personal Leave</option> </select> </div> <div className="flex gap-2 justify-end mt-2"> <Button type="button" variant="ghost" onClick={() => setIsVacationOpen(false)}> Cancel </Button> <Button type="submit" variant="primary" className="font-bold"> Commit Schedule </Button> </div> </form> </Dialog> </div> );
 } 
/*  Minimal inline Skeleton component just to satisfy the */

 
/* import check since Skeleton is imported locally */
 function Skeleton({ variant = 'rect', className = '' }: { variant?: 'text' | 'rect' | 'circle';
 className?: string }) { const baseStyle = 'animate-pulse bg-slate-800/60';
 const variants = { text: 'h-4 rounded w-3/4', rect: 'rounded-lg h-24 w-full', circle: 'rounded-full h-12 w-12' };
 
return <div className={`${baseStyle} ${variants[variant]} ${className}`} />;
 }
