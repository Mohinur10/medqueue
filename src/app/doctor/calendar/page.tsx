"use client";
 
import React, { useState, useEffect } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function DoctorCalendar() { const { currentUser, appointments, doctors } = useMedQueue();
 const { t } = useTranslation();
 const [isMounted, setIsMounted] = useState(false);
 
/*  Find active doctor */
const doctor = doctors.find(d => d.email === currentUser?.email) || doctors[0];
 const doctorId = doctor?.id || 'doc-1';
 
/*  Isolate appointments for this doctor */
const myAppts = appointments.filter(a => a.doctorId === doctorId);
 useEffect(() => { setIsMounted(true);
 }, []);
 if (!isMounted) { 
return ( <div className="flex flex-col gap-6 w-full transition-colors"> <Skeleton variant="rect" className="h-80 transition-colors" /> </div> );
 } 
/*  Generate calendar days for July 2026 */
const renderCalendarDays = () => { const days = [];
 const totalDays = 31;
 const offset = 2;
 
 /* Wed start */
 for (let i = 1; i < offset; i++) { days.push(<div key={`empty-${i}`} className="h-24 border border-border/40 bg-muted dark:bg-muted/50 transition-colors" />);
 } for (let day = 1; day <= totalDays; day++) {
   const dateString = `2026-07-${day.toString().padStart(2, '0')}`;
  const dayAppts = myAppts.filter(a => a.date === dateString);
  days.push( <div key={day} className="h-24 border border-border/40 p-2 flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-card text-card-foreground/20 transition-colors"> <span className="text-xs font-bold text-muted-foreground font-mono">{day}</span> <div className="flex flex-col gap-1 overflow-hidden"> {dayAppts.length > 0 && ( <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-primary font-bold font-mono transition-colors"> {dayAppts.length} {t.doctorCalendar?.patients || 'Patients'} </span> )} {day === 15 && ( <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 font-bold truncate transition-colors"> {t.doctorCalendar?.meeting || 'Staff Meeting'} </span> )} </div> </div> );
  } 
 return days;
  };
  
 return ( <div className="flex flex-col gap-6 w-full pb-10">
 { /* Header */ }
 <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {t.doctorCalendar?.title || 'Clinical Shift Schedule'} </h1> <p className="text-xs text-muted-foreground mt-1"> {t.doctorCalendar?.subtitle || 'Review allocated consultation days, holiday closures, and diagnostic appointments.'} </p> </div> </div>
 { /* Main Grid: Calendar and Upcoming summary list */ }
 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6"> { /* Left: Monthly calendar */ }
 <div className="bg-glass text-foreground p-5 rounded-2xl xl:col-span-2 flex flex-col gap-4 border border-border/40 shadow-sm dark:shadow-none transition-colors"> <div className="flex justify-between items-center border-b border-border pb-3 transition-colors"> <div className="flex items-center gap-2"> <CalendarIcon className="h-5 w-5 text-primary" /> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider transition-colors"> {t.doctorCalendar?.monthStr || 'Shift Timetable'}: July 2026 </h3> </div> <div className="flex gap-2"> <Button variant="ghost" size="sm" className="p-1 cursor-pointer border border-border dark:border-transparent text-muted-foreground"> <ChevronLeft className="h-4 w-4" /> </Button> <Button variant="ghost" size="sm" className="p-1 cursor-pointer border border-border dark:border-transparent text-muted-foreground"> <ChevronRight className="h-4 w-4" /> </Button> </div> </div> <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2 transition-colors"> <div>{t.doctorCalendar?.mon || 'Mon'}</div> <div>{t.doctorCalendar?.tue || 'Tue'}</div> <div>{t.doctorCalendar?.wed || 'Wed'}</div> <div>{t.doctorCalendar?.thu || 'Thu'}</div> <div>{t.doctorCalendar?.fri || 'Fri'}</div> <div>{t.doctorCalendar?.sat || 'Sat'}</div> <div>{t.doctorCalendar?.sun || 'Sun'}</div> </div> <div className="grid grid-cols-7 rounded-xl overflow-hidden border border-border/40 transition-colors"> {renderCalendarDays()} </div> </div> { /* Right: Upcoming shifts checklist */ }
 <div className="bg-glass text-foreground p-5 rounded-2xl flex flex-col gap-4 border border-border/40 shadow-sm dark:shadow-none transition-colors"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2 transition-colors"> <Clock className="h-5 w-5 text-primary" /> {t.doctorCalendar?.shiftParams || 'Shift Parameters'} </h3> <div className="flex flex-col gap-3"> <div className="p-4 bg-muted text-muted-foreground/60 border border-border rounded-xl flex items-center justify-between text-xs transition-colors"> <div> <h4 className="font-bold text-foreground transition-colors">{t.doctorCalendar?.stdHours || 'Standard Working Hours'}</h4> <p className="text-[10px] text-muted-foreground mt-1">{t.doctorCalendar?.shiftHours || 'Shift Hours'}: {doctor?.workingHours.start} - {doctor?.workingHours.end}</p> </div> <Clock className="h-5 w-5 text-primary transition-colors" /> </div> <div className="p-4 bg-muted text-muted-foreground/60 border border-border rounded-xl flex flex-col gap-2 text-xs transition-colors"> <h4 className="font-bold text-foreground flex items-center gap-1.5 transition-colors"> <AlertCircle className="h-4 w-4 text-amber-500" /> {t.doctorCalendar?.holidayTitle || 'Clinic Holiday Closures'} </h4> <p className="text-[10px] text-muted-foreground leading-relaxed transition-colors"> {t.doctorCalendar?.holidayDesc || 'General clinic closes on national holidays. Check-in kiosks will decline slot selections for those periods.'} </p> </div> </div> </div> </div> </div> );
  } 

/* Minimal inline Skeleton component just to satisfy the import check since Skeleton is imported locally */
 function Skeleton({ variant = 'rect', className = '' }: { variant?: 'text' | 'rect' | 'circle';
 className?: string }) { const baseStyle = 'animate-pulse bg-card/60';
 const variants = { text: 'h-4 rounded w-3/4', rect: 'rounded-lg h-24 w-full', circle: 'rounded-full h-12 w-12' };
 
return <div className={`${baseStyle} ${variants[variant]} ${className}`} />;
 }
