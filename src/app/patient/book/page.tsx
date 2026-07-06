
/* eslint-disable */
 "use client";
 
import React, { useState, useEffect } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Building, Layers, Stethoscope, Calendar, Clock, User2, CheckCircle, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
 
import { useRouter, useSearchParams } from 'next/navigation';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import { Clinic, Doctor, Department, Appointment } from '../../../types';
 
export default function BookAppointmentWizard() { const { currentUser, clinics, doctors, departments, patients, appointments, bookAppointment, triggerNotification } = useMedQueue();
 const router = useRouter();
 const searchParams = useSearchParams();
 const { t } = useTranslation();
 
/*  Wizard Steps: 1: Clinic, 2: Department, 3: Doctor, 4: Date & Slot, 5: Patient Profile, 6: Review, 7: Finished */
const [step, setStep] = useState(1);
 
/*  Selections */
const [selClinic, setSelClinic] = useState<Clinic | null>(null);
 const [selDept, setSelDept] = useState<Department | null>(null);
 const [selDoctor, setSelDoctor] = useState<Doctor | null>(null);
 const [selDate, setSelDate] = useState('2026-07-02');
 
/*  tomorrow */
const [selSlot, setSelSlot] = useState('');
 const [selPatientId, setSelPatientId] = useState(currentUser?.patientId || 'pat-1');
 const [ticketResult, setTicketResult] = useState<Appointment | null>(null);
 
/* Auto-fill from search queries */
 useEffect(() => {
 const qClinic = searchParams.get('clinic');
 const qDoctor = searchParams.get('doctor');
 if (qClinic) { const match = clinics.find(c => c.id === qClinic);
 if (match) { setSelClinic(match);
 setStep(2);
 } } else if (qDoctor) { const docMatch = doctors.find(d => d.id === qDoctor);
 if (docMatch) { setSelDoctor(docMatch);
 const clMatch = clinics.find(c => c.id === docMatch.clinicId);
 if (clMatch) setSelClinic(clMatch);
 setStep(4);
 }
 }
 }, [searchParams]);
 
/*  Derived datasets */
const activeDepartments = selClinic ? departments.filter(d => d.clinicId === selClinic.id) : [];
 const activeDoctors = (selClinic && selDept) ? doctors.filter(d => d.clinicId === selClinic.id && d.specialization.toLowerCase() === selDept.name.toLowerCase()) : [];
 const timeSlots = ['09:00', '09:10', '09:20', '09:30', '10:00', '10:15', '11:00', '11:30', '14:00', '14:30', '15:00'];
 
/*  Prevent double booking by removing already booked slots */
const bookedSlots = appointments .filter(a => a.doctorId === selDoctor?.id && a.date === selDate && a.status !== 'cancelled') .map(a => a.timeSlot);
 const availableTimeSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
 
/*  Family members list + self */
const familyList = patients.filter(p => p.familyOwnerId === currentUser?.patientId || p.id === currentUser?.patientId);
 const handleNext = () => { setStep(prev => prev + 1);
 };
 const handlePrev = () => { setStep(prev => prev - 1);
 };
  const handleCommitBooking = () => { 
    if (!selClinic || !selDoctor || !selSlot) return;
    
    if (bookedSlots.includes(selSlot)) {
      triggerNotification(currentUser?.id || 'system', 'error', 'Slot Unavailable', 'This time slot has already been booked. Please choose another.');
      setSelSlot('');
      return;
    }
 
/*  Call context dispatch */
const appt = bookAppointment({ clinicId: selClinic.id, doctorId: selDoctor.id, patientId: selPatientId, date: selDate, timeSlot: selSlot, amount: 150000 
/*  mock consult charge */

 });
 setTicketResult(appt);
 setStep(7);
 triggerNotification(currentUser?.id || 'system', 'success', 'Session Confirmed', `Ticket ${appt.queueNumber} issued successfully.`);
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Wizard Header Progress */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl border border-border/40"> <h1 className="text-xl font-bold text-foreground">{t.patientBook?.title || 'Schedule Medical Appointment'}</h1> {
/* Step dots */
} <div className="flex items-center gap-2 mt-4 text-[10px] uppercase font-bold text-muted-foreground tracking-wider"> {[ { label: t.patientBook?.steps?.clinic || 'Clinic', num: 1 }, { label: t.patientBook?.steps?.specialty || 'Specialty', num: 2 }, { label: t.patientBook?.steps?.doctor || 'Doctor', num: 3 }, { label: t.patientBook?.steps?.schedule || 'Schedule', num: 4 }, { label: t.patientBook?.steps?.patient || 'Patient', num: 5 }, { label: t.patientBook?.steps?.review || 'Review', num: 6 }].map((item) => ( <React.Fragment key={item.num}> <span className={`transition-colors ${step === item.num ? 'text-cyan-400 font-extrabold' : step > item.num ? 'text-emerald-400' : ''}`}> {item.label} </span> {item.num < 6 && <ChevronRight className="h-3.5 w-3.5 text-secondary-foreground" />} </React.Fragment> ))} </div> </div> {
/* Steps Panels */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-6 rounded-2xl border border-border/40 flex flex-col gap-5 min-h-[350px]"> {
/* STEP 1: Clinic selection */
} {step === 1 && ( <div className="flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/60 pb-2"> <Building className="h-5 w-5 text-cyan-400" /> {t.patientBook?.chooseClinic || 'Choose Medical Center'} </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {clinics.map(c => ( <div key={c.id} onClick={() => { setSelClinic(c);
 handleNext();
 }} className={`p-5 rounded-xl border text-xs flex gap-4 cursor-pointer transition-all duration-300 hover:border-cyan-500/35 hover:bg-cyan-500/5 ${selClinic?.id === c.id ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-border bg-card text-card-foreground/40'}`} > <img src={c.logo} alt={c.name} className="h-12 w-12 rounded-lg object-cover bg-secondary" /> <div className="flex flex-col justify-between"> <div> <h4 className="font-bold text-foreground text-sm">{c.name}</h4> <p className="text-[10px] text-muted-foreground mt-1">{c.address}</p> </div> <span className="text-[9px] text-cyan-400/80 font-bold uppercase tracking-wider mt-2 block"> {t.patientBook?.hours || 'Hours'}: {c.workingHours.start} - {c.workingHours.end} </span> </div> </div> ))} </div> </div> )} {
/* STEP 2: Department selection */
} {step === 2 && ( <div className="flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/60 pb-2"> <Layers className="h-5 w-5 text-cyan-400" /> {t.patientBook?.chooseSpecialty || 'Choose Specialty Department'} </h3> <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {activeDepartments.map(d => ( <div key={d.id} onClick={() => { setSelDept(d);
 handleNext();
 }} className={`p-4 rounded-xl border text-center cursor-pointer transition-all duration-300 hover:border-cyan-500/35 hover:bg-cyan-500/5 flex flex-col gap-2 justify-center items-center ${selDept?.id === d.id ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-border bg-card text-card-foreground/40'}`} > <span className="text-sm font-bold text-foreground">{d.name}</span> <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{d.code}</span> </div> ))} </div> </div> )} {
/* STEP 3: Doctor selection */
} {step === 3 && ( <div className="flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/60 pb-2"> <Stethoscope className="h-5 w-5 text-cyan-400" /> {t.patientBook?.chooseDoctor || 'Choose Physician'} </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {activeDoctors.length > 0 ? ( activeDoctors.map(doc => ( <div key={doc.id} onClick={() => { setSelDoctor(doc);
 handleNext();
 }} className={`p-5 rounded-xl border text-xs flex gap-4 cursor-pointer transition-all duration-300 hover:border-cyan-500/35 hover:bg-cyan-500/5 ${selDoctor?.id === doc.id ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-border bg-card text-card-foreground/40'}`} > <img src={doc.photo} alt={doc.name} className="h-14 w-14 rounded-full object-cover border border-border bg-secondary" /> <div className="flex flex-col justify-between flex-grow"> <div> <h4 className="font-bold text-foreground text-sm">{doc.name}</h4> <p className="text-[10px] text-muted-foreground mt-1">{doc.education} • {t.patientBook?.exp || 'Exp'}: {doc.experience} {t.patientBook?.years || 'years'}</p> </div> <div className="flex justify-between items-center mt-2.5"> <span className="text-[10px] text-cyan-400 font-bold font-mono">150,000 UZS</span> <span className="text-[9px] text-muted-foreground font-semibold">{t.patientBook?.cabin || 'Cabin'} #{doc.roomNumber}</span> </div> </div> </div> )) ) : ( <div className="col-span-2 py-8 text-center text-xs text-muted-foreground font-bold"> {t.patientBook?.noDoctors || 'No doctors currently allocated on shifts for this department.'} </div> )} </div> </div> )} {
/* STEP 4: Schedule Date & Slot */
} {step === 4 && ( <div className="flex flex-col gap-5"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-2"> <Calendar className="h-5 w-5 text-cyan-400" /> {t.patientBook?.chooseSlots || 'Choose Appointment Slots'} </h3> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {
/* Date pick */
} <div className="flex flex-col gap-1.5 text-xs"> <label className="text-muted-foreground font-semibold">{t.patientBook?.selectDay || 'Select Session Day *'}</label> <input type="date" value={selDate} onChange={(e) => setSelDate(e.target.value)} className="bg-card text-card-foreground border border-border rounded-lg p-2.5 focus:border-cyan-500/60 text-foreground cursor-pointer" /> </div> {
/* Time Slots pick */
} <div className="md:col-span-2 flex flex-col gap-2"> <span className="text-xs text-muted-foreground font-semibold">{t.patientBook?.availableHours || 'Available Hours'}</span> <div className="flex flex-wrap gap-2"> {availableTimeSlots.length > 0 ? availableTimeSlots.map(slot => ( <button key={slot} onClick={() => setSelSlot(slot)} className={`text-xs px-3.5 py-2 rounded-lg border font-semibold transition-all cursor-pointer ${selSlot === slot ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-extrabold' : 'bg-card text-card-foreground border-border text-muted-foreground hover:border-slate-750'}`} > {slot} </button> )) : ( <div className="text-xs text-muted-foreground py-2">No available slots for this date.</div> )} </div> </div> </div> </div> )} {
/* STEP 5: Patient Selection */
} {step === 5 && ( <div className="flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-2"> <User2 className="h-5 w-5 text-cyan-400" /> {t.patientBook?.bookFor || 'Who is this appointment for?'} </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {familyList.map(pat => ( <div key={pat.id} onClick={() => { setSelPatientId(pat.id);
 handleNext();
 }} className={`p-5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-cyan-500/35 hover:bg-cyan-500/5 ${selPatientId === pat.id ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)] font-bold' : 'border-border bg-card text-card-foreground/40'}`} > <div> <h4 className="font-bold text-foreground text-sm">{pat.name}</h4> <p className="text-[10px] text-muted-foreground mt-1">DOB: {pat.dob} • Gender: {pat.gender}</p> </div> <span className="text-[9px] uppercase font-bold text-muted-foreground"> {pat.relationship || 'Primary Profile'} </span> </div> ))} </div> </div> )} {
/* STEP 6: Review & Payment Checkout */
} {step === 6 && ( <div className="flex flex-col gap-5"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-2"> <CheckCircle className="h-5 w-5 text-cyan-400" /> {t.patientBook?.confirmDetails || 'Confirm Session Details'} </h3> <div className="bg-card text-card-foreground/50 border border-border rounded-xl p-5 flex flex-col gap-4 text-sm"> <div className="grid grid-cols-2 gap-y-4"> <div className="text-muted-foreground">{t.patientBook?.chooseClinic || 'Clinic'}:</div> <div className="font-semibold text-right text-foreground">{selClinic?.name}</div> <div className="text-muted-foreground">{t.patientBook?.chooseSpecialty || 'Specialty'}:</div> <div className="font-semibold text-right text-foreground">{selDept?.name}</div> <div className="text-muted-foreground">{t.patientBook?.provider || 'Provider'}:</div> <div className="font-semibold text-right text-foreground">{selDoctor?.name}</div> <div className="text-muted-foreground">{t.patientBook?.date || 'Date'}:</div> <div className="font-semibold text-right text-foreground">{selDate}</div> <div className="text-muted-foreground">{t.patientBook?.time || 'Time'}:</div> <div className="font-semibold text-right text-foreground">{selSlot}</div> <div className="text-muted-foreground">{t.patientBook?.consultFee || 'Consultation Fee'}:</div> <div className="font-semibold text-right text-cyan-400">150,000 UZS</div> <div className="col-span-2 border-t border-border mt-2 pt-4 flex justify-between"> <div className="text-muted-foreground">{t.patientBook?.patientName || 'Patient Name'}:</div> <div className="font-semibold text-right text-foreground"> {patients.find(p => p.id === selPatientId)?.name} </div> </div> </div> </div> </div> )} {
/* STEP 7: Finished ticket confirmation */
} {step === 7 && ticketResult && ( <div className="flex flex-col items-center justify-center gap-4 py-8 text-center"> <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]"> <CheckCircle className="h-10 w-10" /> </div> <h2 className="text-2xl font-bold text-foreground mt-2">{t.patientBook?.bookingComplete || 'Booking Complete'}!</h2> <p className="text-sm text-muted-foreground max-w-md"> {t.patientBook?.ticketIssued || 'Your session has been securely recorded.'} </p> {ticketResult && ( <div className="bg-card text-card-foreground border border-emerald-500/30 p-6 rounded-2xl mt-4 flex flex-col gap-2 w-full max-w-sm"> <span className="text-xs text-emerald-400 uppercase tracking-widest font-bold">{t.patientBook?.ticketId || 'Ticket ID'}</span> <span className="text-4xl font-mono font-bold text-foreground">{ticketResult.queueNumber}</span> <span className="text-sm text-muted-foreground mt-2">{selDate} at {selSlot}</span> <span className="text-sm text-muted-foreground font-semibold">{selDoctor?.name}</span> </div> )} <Button variant="ghost" className="mt-6" onClick={() => router.push('/patient')} > {t.patientBook?.goToDashboard || 'Go to Dashboard'} </Button> </div> )} {
/* Navigation bottom bar */
} {step < 7 && ( <div className="flex justify-between border-t border-border/40 pt-4 mt-auto"> {step > 1 ? ( <Button variant="ghost" onClick={handlePrev} > <ChevronLeft className="h-4 w-4 mr-1" /> {t.patientBook?.prevBtn || 'Previous'} </Button> ) : ( <div /> )} {step < 6 ? ( <Button variant="primary" onClick={handleNext} disabled={ (step === 1 && !selClinic) || (step === 2 && !selDept) || (step === 3 && !selDoctor) || (step === 4 && (!selDate || !selSlot)) || (step === 5 && !selPatientId) } > {t.patientBook?.continueBtn || 'Continue'} <ChevronRight className="h-4 w-4 ml-1" /> </Button> ) : ( <Button variant="primary" onClick={handleCommitBooking} className="bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"> <CheckCircle className="h-4 w-4 mr-2" /> {t.patientBook?.confirmBtn || 'Confirm & Book'} </Button> )} </div> )} </div> </div> );
 } 