"use client";
 
import React, { useEffect, useState } from 'react';
 
import { useMedQueue } from '../../context/MedQueueContext';
 
import { Button } from '../../components/ui/Button';
 
import { Input } from '../../components/ui/Input';
 
import { Dialog } from '../../components/ui/Dialog';
 
import { EmptyState } from '../../components/ui/EmptyState';
 
import { MedicineSearch } from '../../components/ui/MedicineSearch';
 
import { Medicine } from '../../types';
 
import { Stethoscope, Users, Clock, CheckCircle, PlusCircle, Trash2, Search, Eye, Printer, AlertTriangle, ShieldCheck, Play, SkipForward, XCircle, FileText, Activity, BrainCircuit, Heart, Flame, User2, History, ChevronRight, Sparkles, Scale, Thermometer } from 'lucide-react';
 
import { useTranslation } from '../../hooks/useTranslation';
 
export default function DoctorDashboard() { const { currentUser, doctors, patients, appointments, medicalRecords, updateAppointmentStatus, completeConsultation, triggerNotification } = useMedQueue();
 const { t } = useTranslation();
 
/*  State */
const [isMounted, setIsMounted] = useState(false);
 const [isPrintOpen, setIsPrintOpen] = useState(false);
 
/*  Active Doctor Isolated Context // Find doctor corresponding to active user session */
const doctor = doctors.find(d => d.email === currentUser?.email) || doctors[0];
 const doctorId = doctor?.id || 'doc-1';
 
/*  Queue lists */
const today = new Date().toISOString().substring(0, 10);
 const todayAppts = appointments.filter(a => a.doctorId === doctorId && (a.date === today || a.date === '2026-07-02')).map(appt => {
 const pat = patients.find(p => p.id === appt.patientId);
 return { ...appt, patientName: pat ? pat.name : 'Unknown Patient', patientDob: pat ? pat.dob : 'N/A', patientGender: pat ? pat.gender : 'male', patientBlood: pat ? pat.bloodGroup : 'N/A', patientAllergies: pat ? pat.allergies : [] };
 });
 const waitingPatients = todayAppts.filter(a => a.status === 'waiting' || a.status === 'arrived' || a.status === 'booked');
 const completedPatients = todayAppts.filter(a => a.status === 'completed');
 const cancelledPatients = todayAppts.filter(a => a.status === 'cancelled' || a.status === 'no_show');
 
/*  Active Appointment in Consultation */
const activeAppt = todayAppts.find(a => a.status === 'in_consultation');
 const activePatient = activeAppt ? patients.find(p => p.id === activeAppt.patientId) : null;
 
/*  Active Patient Medical history timeline */
const activePatientHistory = activePatient ? medicalRecords.filter(r => r.patientId === activePatient.id) : [];
 
/*  Form inputs for consultation */
const [symptoms, setSymptoms] = useState('');
 const [systolic, setSystolic] = useState('120');
 const [diastolic, setDiastolic] = useState('80');
 const [temp, setTemp] = useState('36.6');
 const [weight, setWeight] = useState('75');
 const [height, setHeight] = useState('178');
 const [diagnosis, setDiagnosis] = useState('');
 const [recommendations, setRecommendations] = useState('');
 const [injections, setInjections] = useState('');
 const [prescriptions, setPrescriptions] = useState<Array<{ medicine: string;
 dose: string;
 frequency: string;
 duration: string }>>([]);
 
/*  Lab and Radiology requests checklists */
const [labRequests, setLabRequests] = useState({ cbc: false, lipid: false, glucose: false, urine: false });
 const [radRequests, setRadRequests] = useState({ xray: false, mri: false, ct: false, ecg: false });
 
/*  AI Assistant Suggestions */
const [aiSuggestions, setAiSuggestions] = useState<any>(null);
 const [aiLoading, setAiLoading] = useState(false);
 useEffect(() => { setIsMounted(true);
 }, []);
 
/* Update symptoms when active patient changes */
 useEffect(() => {
 if (activePatient) { setSymptoms('');
 setDiagnosis('');
 setRecommendations('');
 setInjections('');
 setPrescriptions([]);
 setLabRequests({ cbc: false, lipid: false, glucose: false, urine: false });
 setRadRequests({ xray: false, mri: false, ct: false, ecg: false });
 setAiSuggestions(null);
 }
 }, [activePatient]);
 if (!isMounted) { 
return ( <div className="flex h-screen items-center justify-center bg-background"> <Skeleton variant="rect" className="h-full w-full" /> </div> );
 } 
/*  Queue actions */
const handleCallPatient = (apptId: string) => { updateAppointmentStatus(apptId, 'arrived');
 triggerNotification(doctorId, 'reminder', 'Patient Called', 'The ticket has been announced in the queue.');
 };
 const handleStartConsultation = (apptId: string) => { 
/*  If there is already a patient in consultation, warn */
const existing = todayAppts.find(a => a.status === 'in_consultation');
 if (existing) { triggerNotification(doctorId, 'error', 'Session Occupied', 'Finish active consultation before starting next.');
 return;
 } updateAppointmentStatus(apptId, 'in_consultation');
 triggerNotification(doctorId, 'success', 'Session Started', 'Clinical record opened.');
 };
 const handleSkipPatient = (apptId: string) => { updateAppointmentStatus(apptId, 'no_show');
 triggerNotification(doctorId, 'warning', 'Patient Skipped', 'Ticket moved to No-Show.');
 };
 const handleCancelAppt = (apptId: string) => { updateAppointmentStatus(apptId, 'cancelled');
 triggerNotification(doctorId, 'warning', 'Appointment Cancelled', 'Ticket marked as Cancelled.');
 };
 const handleAddMedicine = (med: Medicine) => { const isExist = prescriptions.some(p => p.medicine === med.name);
 if (isExist) return;
 setPrescriptions(prev => [...prev, { medicine: med.name, dose: med.strength, frequency: 'Once daily', duration: '7 days' }]);
 };
 const handleRemoveMedicine = (idx: number) => { setPrescriptions(prev => prev.filter((_, i) => i !== idx));
 };
 const handleTriggerAI = () => { if (!symptoms.trim()) { triggerNotification(doctorId, 'warning', 'Incomplete Form', 'Input clinical symptoms to consult AI Co-pilot.');
 return;
 } setAiLoading(true);
 setTimeout(() => { setAiLoading(false);
 setAiSuggestions({ diagnoses: [ { code: "I10", name: "Essential Hypertension", probability: "85%" }, { code: "E11", name: "Type 2 Diabetes Mellitus", probability: "45%" }], tests: ["Lipid Profile (Biochemistry)", "HbA1c Blood Test", "Resting ECG"], warnings: ["No drug interaction warnings for bisoprolol / amlodipine."], treatment: "Initiate lifestyle modifications (sodium limit, daily aerobic exercise). Precribe Concor 5mg." });
 }, 1500);
 };
 const handleFinishConsultation = () => { if (!activeAppt) return;
 if (!diagnosis.trim()) { triggerNotification(doctorId, 'warning', 'Missing Diagnosis', 'Select or enter diagnostic codes before ending session.');
 return;
 } 
/*  Open printable summary preview setIsPrintOpen(true);
 */

 };
 const handleSaveConsultation = () => { if (!activeAppt) return;
 
/* Call context completion */
 completeConsultation({ appointmentId: activeAppt.id, patientId: activeAppt.patientId, doctorId, clinicId: doctor?.clinicId || '', diagnosis, prescription: prescriptions, injections: injections.split(',').map(s => s.trim()).filter(s => s !== ''), recommendations, files: [], qrCodeVerificationUrl: `https://verify.medqueue.uz/record/appt-${activeAppt.id}` });
 setIsPrintOpen(false);
 triggerNotification(doctorId, 'success', 'Session Completed', 'Encounter records pushed to history database.');
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Workspace Header */
} <div className="flex items-center justify-between border-b border-border pb-4 no-print transition-colors"> <div className="flex items-center gap-3"> <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center"> <Stethoscope className="h-5 w-5 text-primary" /> </div> <div> <h1 className="text-xl font-bold text-foreground tracking-tight transition-colors"> {t.doctorConsole?.workspaceTitle || 'Clinical Workspace'} </h1> <p className="text-xs text-muted-foreground mt-0.5"> {t.doctorConsole?.cabin || 'Cabin'} #{doctor?.roomNumber} • {t.doctorConsole?.specialty || 'Specialty'}: {doctor?.specialization} </p> </div> </div> {
/* Doctor Stats Mini Box */
} <div className="flex items-center gap-4 text-xs font-semibold transition-colors"> <div className="bg-muted text-muted-foreground border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-muted-foreground"> <Users className="h-4 w-4 text-primary" /> <span>{t.doctorConsole?.waiting || 'Waiting'}: <strong className="text-foreground ">{waitingPatients.length}</strong></span> </div> <div className="bg-muted text-muted-foreground border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-muted-foreground"> <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> <span>{t.doctorConsole?.completedToday || 'Completed Today'}: <strong className="text-foreground ">{completedPatients.length}</strong></span> </div> </div> </div> {
/* Split Workstation layout */
} <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print"> {
/* Left Column: Queue list & Medical History timeline (Col span 5) */
} <div className="lg:col-span-5 flex flex-col gap-6"> {
/* Active Consultation Patient Card */
} {activePatient ? ( <div className="bg-glass text-foreground p-5 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col gap-4 animate-pulse-glow transition-colors"> <div className="flex justify-between items-start"> <div className="flex items-center gap-3"> <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center font-bold text-primary text-lg"> {activePatient.name.charAt(0)} </div> <div> <h3 className="font-bold text-foreground text-base">{activePatient.name}</h3> <span className="text-[10px] text-muted-foreground font-mono mt-0.5">Patient ID: {activePatient.id}</span> </div> </div> <span className="text-[9px] uppercase font-bold text-primary bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded animate-pulse"> {t.doctorConsole?.activeConsultation || 'Active consultation'} </span> </div> {
/* Patient Vitals Summary */
} <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-border/60 font-mono transition-colors"> <div className="flex flex-col gap-0.5"> <span className="text-muted-foreground uppercase font-bold">{t.doctorConsole?.gender || 'Gender'}:</span> <span className="text-foreground font-bold capitalize">{activePatient.gender}</span> </div> <div className="flex flex-col gap-0.5"> <span className="text-muted-foreground uppercase font-bold">{t.doctorConsole?.dob || 'DOB'}:</span> <span className="text-foreground font-bold">{activePatient.dob}</span> </div> <div className="flex flex-col gap-0.5"> <span className="text-muted-foreground uppercase font-bold">{t.doctorConsole?.bloodType || 'Blood type'}:</span> <span className="text-primary font-bold">{activePatient.bloodGroup || 'N/A'}</span> </div> </div> {
/* Allergies Alerts */
} {activePatient.allergies && activePatient.allergies.length > 0 && ( <div className="flex items-start gap-2 p-2.5 bg-rose-500/5 border border-rose-500/20 rounded-xl text-destructive text-xs transition-colors"> <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" /> <div> <span className="font-bold">{t.doctorConsole?.allergiesWarning || 'Clinical Allergies Warning'}:</span> <span className="block mt-0.5 text-secondary-foreground font-semibold truncate"> {activePatient.allergies.join(', ')} </span> </div> </div> )} </div> ) : ( <div className="bg-glass text-foreground p-5 rounded-2xl border border-border/40 text-center shadow-sm dark:shadow-none transition-colors"> <User2 className="h-10 w-10 text-muted-foreground dark:text-muted-foreground mx-auto mb-2" /> <h3 className="text-xs font-bold text-muted-foreground">{t.doctorConsole?.noPatientTitle || 'No Patient in consultation'}</h3> <p className="text-[10px] text-muted-foreground mt-1">{t.doctorConsole?.noPatientSub || "Select a patient from today's queue console below to start."}</p> </div> )} {
/* Today's Queue list console */
} <div className="bg-glass text-foreground p-5 rounded-2xl border border-border/40 flex flex-col gap-4 shadow-sm dark:shadow-none transition-colors"> <h3 className="text-xs font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 transition-colors"> <Clock className="h-4.5 w-4.5 text-muted-foreground" /> {t.doctorConsole?.queueConsole || "Today's Patient Queue Console"} </h3> <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1"> {waitingPatients.length > 0 ? ( waitingPatients.map((appt) => ( <div key={appt.id} className="p-3 bg-muted text-muted-foreground/60 border border-border rounded-xl flex items-center justify-between gap-3 text-xs group hover:border-cyan-500/20 transition-colors"> <div> <div className="flex items-center gap-2"> <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-border dark:border-slate-850 text-primary transition-colors"> {appt.queueNumber} </span> <h4 className="font-bold text-foreground transition-colors">{appt.patientName}</h4> </div> <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 transition-colors"> <Clock className="h-3 w-3" /> {t.doctorConsole?.scheduledTime || 'Scheduled Time'}: {appt.timeSlot} </div> </div> {
/* Control Actions */
} <div className="flex gap-1"> {appt.status !== 'arrived' && appt.status !== 'in_consultation' && ( <button onClick={() => handleCallPatient(appt.id)} className="p-1.5 rounded-lg bg-cyan-500/10 text-primary border border-cyan-500/20 hover:bg-cyan-500/20 transition-all cursor-pointer" title="Announce ticket" > {t.doctorConsole?.btnCall || 'Call'} </button> )} <button onClick={() => handleStartConsultation(appt.id)} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer font-bold" title="Open consultation record" > {t.doctorConsole?.btnStart || 'Start'} </button> <button onClick={() => handleSkipPatient(appt.id)} className="p-1.5 rounded-lg bg-secondary text-secondary-foreground text-muted-foreground dark:text-muted-foreground border border-border /60 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer" title="Skip patient" > {t.doctorConsole?.btnSkip || 'Skip'} </button> </div> </div> )) ) : ( <div className="py-6 text-center text-xs text-muted-foreground"> {t.doctorConsole?.noPending || 'No pending patients waiting.'} </div> )} </div> </div> {
/* Active Patient Medical Timeline */
} {activePatient && ( <div className="bg-glass text-foreground p-5 rounded-2xl border border-border/40 flex flex-col gap-4 shadow-sm dark:shadow-none transition-colors"> <h3 className="text-xs font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 transition-colors"> <History className="h-4.5 w-4.5 text-muted-foreground" /> {t.doctorConsole?.historyTitle || 'Medical Encounters History'} ({activePatientHistory.length}) </h3> <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1"> {activePatientHistory.length > 0 ? ( activePatientHistory.map((rec, i) => ( <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-border dark:border-slate-850 rounded-xl flex flex-col gap-2 text-xs transition-colors"> <div className="flex justify-between items-center text-[10px] text-muted-foreground"> <span className="font-mono font-bold text-primary">{rec.date}</span> <span>{t.doctorConsole?.recordId || 'Record ID'}: {rec.id}</span> </div> <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block">{t.doctorConsole?.diagnosis || 'Diagnosis'}:</span> <p className="text-foreground font-bold mt-0.5 leading-normal transition-colors">{rec.diagnosis}</p> </div> {rec.prescription && rec.prescription.length > 0 && ( <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block">{t.doctorConsole?.prescribedTariffs || 'Prescribed Tariffs'}:</span> <div className="text-[10px] text-muted-foreground mt-1 flex flex-col gap-0.5 transition-colors"> {rec.prescription.map((m, idx) => ( <div key={idx}>• {m.medicine} - {m.dose} ({m.frequency})</div> ))} </div> </div> )} </div> )) ) : ( <div className="py-6 text-center text-xs text-muted-foreground"> {t.doctorConsole?.noPriorHistory || 'No prior clinical history.'} </div> )} </div> </div> )} </div> {
/* Right Column: Consultation Workstation Forms (Col span 7) */
} <div className="lg:col-span-7 flex flex-col gap-6"> {activePatient ? ( <div className="bg-glass text-foreground p-6 rounded-2xl border border-border/40 flex flex-col gap-5 shadow-sm dark:shadow-none transition-colors"> {
/* Workspace Title */
} <div className="flex items-center justify-between border-b border-border pb-3 transition-colors"> <div className="flex items-center gap-2"> <Activity className="h-4.5 w-4.5 text-primary" /> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider transition-colors"> {t.doctorConsole?.formTitle || 'Clinical Entry Worksheet'} </h3> </div> {
/* AI Assist button */
} <Button variant="secondary" size="sm" onClick={handleTriggerAI} isLoading={aiLoading} className="flex items-center gap-1.5 cursor-pointer font-bold border-cyan-500/20 text-primary" > <Sparkles className="h-3.5 w-3.5" /> Consult AI Co-pilot </Button> </div> {
/* Vitals Form fields */
} <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-border dark:border-slate-900 transition-colors"> <div className="flex flex-col gap-1"> <span className="text-[9px] text-muted-foreground uppercase font-bold">{t.doctorConsole?.systolic || 'BP Systolic'}</span> <input type="text" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="bg-transparent border-b border-border text-foreground font-bold focus:border-cyan-500/60 focus:outline-none py-0.5 transition-colors" /> </div> <div className="flex flex-col gap-1"> <span className="text-[9px] text-muted-foreground uppercase font-bold">{t.doctorConsole?.diastolic || 'BP Diastolic'}</span> <input type="text" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="bg-transparent border-b border-border text-foreground font-bold focus:border-cyan-500/60 focus:outline-none py-0.5 transition-colors" /> </div> <div className="flex flex-col gap-1"> <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-0.5"> <Thermometer className="h-3 w-3 text-muted-foreground" /> {t.doctorConsole?.temperature || 'Temp'} (°C) </span> <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} className="bg-transparent border-b border-border text-foreground font-bold focus:border-cyan-500/60 focus:outline-none py-0.5 transition-colors" /> </div> <div className="flex flex-col gap-1"> <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-0.5"> <Scale className="h-3 w-3 text-muted-foreground" /> {t.doctorConsole?.weight || 'Weight'} (kg) </span> <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-transparent border-b border-border text-foreground font-bold focus:border-cyan-500/60 focus:outline-none py-0.5 transition-colors" /> </div> <div className="flex flex-col gap-1"> <span className="text-[9px] text-muted-foreground uppercase font-bold">{t.doctorConsole?.height || 'Height'} (cm)</span> <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} className="bg-transparent border-b border-border text-foreground font-bold focus:border-cyan-500/60 focus:outline-none py-0.5 transition-colors" /> </div> </div> {
/* Symptoms Input */
} <div className="flex flex-col gap-1.5 text-xs"> <label className="text-xs font-semibold text-muted-foreground transition-colors">{t.doctorConsole?.symptoms || 'Clinical Symptoms'}</label> <textarea placeholder="Patient reports headaches, chest tighteness, or fatigue..." value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={2} className="w-full bg-card text-card-foreground/40 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 transition-colors" /> </div> {
/* AI Assistance Panel Output */
} {aiSuggestions && ( <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-xl flex flex-col gap-2.5 text-xs text-secondary-foreground"> <h4 className="font-bold text-cyan-400 flex items-center gap-1"> <Sparkles className="h-4 w-4" /> AI Diagnostics Co-pilot Summary </h4> <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 leading-normal"> <div> <span className="text-[9px] text-muted-foreground font-bold uppercase block">Suggested Diagnoses</span> <div className="flex flex-col gap-1 mt-1"> {aiSuggestions.diagnoses.map((diag: any, i: number) => ( <div key={i} className="text-secondary-foreground flex justify-between"> <span><strong>{diag.code}</strong> - {diag.name}</span> <span className="text-cyan-400 font-bold">{diag.probability}</span> </div> ))} </div> </div> <div> <span className="text-[9px] text-muted-foreground font-bold uppercase block">Recommended Lab Assays</span> <div className="text-muted-foreground mt-1 flex flex-col gap-0.5"> {aiSuggestions.tests.map((t: string, i: number) => ( <div key={i}>• {t}</div> ))} </div> </div> </div> </div> )} {
/* Diagnosis Input */
} <div className="flex flex-col gap-1.5 text-xs"> <label className="text-xs font-semibold text-muted-foreground transition-colors">{t.doctorConsole?.conclusion || 'Clinical Diagnosis (ICD-10 Code + Description)'} *</label> <input type="text" placeholder="e.g. I10 - Essential (primary) hypertension" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full bg-card text-card-foreground/40 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 transition-colors" /> </div> {
/* Medicine Autocomplete and Prescriptions List */
} <div className="flex flex-col gap-3 border-t border-border/40 pt-3 transition-colors"> <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 transition-colors"> {t.doctorConsole?.addMedicine || 'Pharmacy Prescription Dispatcher'} </span> {
/* Autocomplete Input */
} <MedicineSearch onSelect={handleAddMedicine} /> {
/* Prescriptions Stack */
} {prescriptions.length > 0 && ( <div className="flex flex-col gap-2 mt-1"> {prescriptions.map((pres, idx) => ( <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-border dark:border-slate-850 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors"> <div className="font-bold text-foreground ">{pres.medicine}</div> <div className="flex flex-wrap items-center gap-2"> <input type="text" value={pres.dose} onChange={(e) => { const next = [...prescriptions];
 next[idx].dose = e.target.value;
 setPrescriptions(next);
 }} className="w-16 bg-card text-card-foreground border border-border rounded text-xs px-2 py-1 text-center text-foreground transition-colors" placeholder="Dose" /> <input type="text" value={pres.frequency} onChange={(e) => { const next = [...prescriptions];
 next[idx].frequency = e.target.value;
 setPrescriptions(next);
 }} className="w-24 bg-card text-card-foreground border border-border rounded text-xs px-2 py-1 text-center text-foreground transition-colors" placeholder="Frequency" /> <input type="text" value={pres.duration} onChange={(e) => { const next = [...prescriptions];
 next[idx].duration = e.target.value;
 setPrescriptions(next);
 }} className="w-16 bg-card text-card-foreground border border-border rounded text-xs px-2 py-1 text-center text-foreground transition-colors" placeholder="Duration" /> <button type="button" onClick={() => handleRemoveMedicine(idx)} className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer" > <Trash2 className="h-3.5 w-3.5" /> </button> </div> </div> ))} </div> )} </div> {
/* Lab & Radiology Orders checklists */
} <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/40 pt-3 text-xs transition-colors"> {
/* Lab orders */
} <div className="flex flex-col gap-2"> <span className="font-semibold text-muted-foreground transition-colors">{t.doctorConsole?.labRequests || 'Order Laboratory Assays'}</span> <div className="flex flex-col gap-1.5"> {[ { key: 'cbc', label: t.doctorConsole?.cbc || 'Complete Blood Count (CBC)' }, { key: 'lipid', label: t.doctorConsole?.lipid || 'Lipid Panel (Cholesterol)' }, { key: 'glucose', label: t.doctorConsole?.glucose || 'Blood Glucose (HbA1c)' }, { key: 'urine', label: t.doctorConsole?.urine || 'Urine Analysis' }].map(item => ( <label key={item.key} className="flex items-center gap-2 text-secondary-foreground font-medium cursor-pointer transition-colors"> <input type="checkbox" checked={labRequests[item.key as keyof typeof labRequests]} onChange={(e) => setLabRequests(prev => ({ ...prev, [item.key]: e.target.checked }))} className="h-3.5 w-3.5 rounded border-border text-cyan-600 dark:text-cyan-500 bg-transparent focus:ring-0 cursor-pointer transition-colors" /> {item.label} </label> ))} </div> </div> {
/* Radiology orders */
} <div className="flex flex-col gap-2"> <span className="font-semibold text-muted-foreground transition-colors">{t.doctorConsole?.radiology || 'Order Diagnostic Imaging'}</span> <div className="flex flex-col gap-1.5"> {[ { key: 'xray', label: t.doctorConsole?.xray || 'Chest X-Ray' }, { key: 'mri', label: t.doctorConsole?.mri || 'Brain MRI Scan' }, { key: 'ct', label: t.doctorConsole?.ct || 'Abdomen CT Scan' }, { key: 'ecg', label: t.doctorConsole?.ecg || 'Resting ECG Graph' }].map(item => ( <label key={item.key} className="flex items-center gap-2 text-secondary-foreground font-medium cursor-pointer transition-colors"> <input type="checkbox" checked={radRequests[item.key as keyof typeof radRequests]} onChange={(e) => setRadRequests(prev => ({ ...prev, [item.key]: e.target.checked }))} className="h-3.5 w-3.5 rounded border-border text-cyan-600 dark:text-cyan-500 bg-transparent focus:ring-0 cursor-pointer transition-colors" /> {item.label} </label> ))} </div> </div> </div> {
/* Recommendations & Injections */
} <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/40 pt-3 text-xs transition-colors"> <Input id="doc-recom" label={t.doctorConsole?.lifestyle || 'Lifestyle Recommendations'} placeholder="e.g. Sodium restriction <2g/day, low stress..." value={recommendations} onChange={(e) => setRecommendations(e.target.value)} /> <Input id="doc-inject" label={t.doctorConsole?.injections || 'Injections / IV Infusions (comma separated)'} placeholder="e.g. Analgin 2.0 IM, Vitamin C 5.0 IV..." value={injections} onChange={(e) => setInjections(e.target.value)} /> </div> {
/* Complete Action buttons */
} <div className="border-t border-border/40 pt-4 mt-2 flex gap-3 justify-end transition-colors"> <Button variant="primary" onClick={handleFinishConsultation} className="font-bold flex items-center gap-1.5 cursor-pointer" > <Printer className="h-4.5 w-4.5" /> {t.doctorConsole?.endSession || 'Print & Finish Consultation'} </Button> </div> </div> ) : ( <div className="h-80 flex items-center justify-center bg-glass text-foreground rounded-2xl border border-border/40 shadow-sm dark:shadow-none transition-colors"> <EmptyState icon={Stethoscope} title={t.doctorConsole?.noPatientTitle || 'Workspace Idle'} description={t.doctorConsole?.noPatientSub || 'Clinical worksheet opens automatically once a patient session starts.'} /> </div> )} </div> </div> {
/* Printable A4 Report and Verification QR Code Dialog */
} <Dialog isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)} title="Consultation A4 Report Preview" size="xl" > <div className="flex flex-col gap-6"> {
/* Action triggers */
} <div className="flex gap-2 justify-end no-print"> <Button variant="ghost" onClick={() => setIsPrintOpen(false)}> Cancel </Button> <Button variant="primary" onClick={() => window.print()} className="font-bold flex items-center gap-1.5"> <Printer className="h-4 w-4" /> Trigger System Print </Button> <Button variant="primary" onClick={handleSaveConsultation} className="font-bold"> Commit Record & Call Next </Button> </div> {
/* Printable Report body */
} <div className="bg-card text-black p-8 border border-border rounded-xl print-card flex flex-col gap-6 font-sans text-xs"> {
/* Clinic Logo and metadata */
} <div className="flex justify-between items-start border-b-2 border-border pb-5"> <div className="flex items-center gap-3"> <div className="h-12 w-12 rounded-lg bg-card text-card-foreground flex items-center justify-center font-mono text-white text-lg font-bold"> MQ </div> <div> <h2 className="text-base font-extrabold tracking-tight text-foreground">{doctor?.clinicId === 'clinic-2' ? 'Medion Clinic' : 'Akfa Medline'}</h2> <p className="text-[10px] text-muted-foreground font-semibold">{doctor?.clinicId === 'clinic-2' ? 'Istiqbol street, 15, Tashkent' : 'Kichik Halka Yoli, 5A, Tashkent'}</p> </div> </div> <div className="text-right text-[9px] text-muted-foreground font-mono"> <div>Document Ref: MQ-CS-{activeAppt?.id.substring(5, 12).toUpperCase()}</div> <div>Date: {new Date().toISOString().substring(0, 10)}</div> </div> </div> {
/* Doctor and Patient Grid */
} <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs"> <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block">Attending Physician</span> <span className="text-foreground font-bold block mt-1">{doctor?.name}</span> <span className="text-muted-foreground block mt-0.5">{doctor?.specialization} • Cabin #{doctor?.roomNumber}</span> </div> <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block">Patient Credentials</span> <span className="text-foreground font-bold block mt-1">{activePatient?.name}</span> <span className="text-muted-foreground block mt-0.5">DOB: {activePatient?.dob} • Gender: {activePatient?.gender}</span> </div> </div> {
/* Diagnostics Form Details */
} <div className="flex flex-col gap-4"> <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block border-b border-border pb-1">Clinical Diagnosis</span> <p className="text-foreground font-bold text-sm mt-1">{diagnosis}</p> </div> {prescriptions.length > 0 && ( <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block border-b border-border pb-1">Prescribed Pharmacotherapy</span> <table className="w-full text-left mt-2 border-collapse text-xs"> <thead> <tr className="border-b border-border text-muted-foreground font-semibold"> <th className="pb-1">Medication Name</th> <th className="pb-1">Dosage strength</th> <th className="pb-1">Administration Frequency</th> <th className="pb-1 text-right">Duration</th> </tr> </thead> <tbody className="divide-y divide-slate-100 text-foreground"> {prescriptions.map((m, i) => ( <tr key={i}> <td className="py-2 font-bold">{m.medicine}</td> <td className="py-2 font-mono">{m.dose}</td> <td className="py-2">{m.frequency}</td> <td className="py-2 font-mono text-right">{m.duration}</td> </tr> ))} </tbody> </table> </div> )} {recommendations && ( <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block border-b border-border pb-1">Lifestyle Adjustments</span> <p className="text-foreground mt-1 leading-relaxed">{recommendations}</p> </div> )} {injections && ( <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block border-b border-border pb-1">Administered Injections / Infusions</span> <p className="text-slate-850 mt-1 font-semibold">{injections}</p> </div> )} </div> {
/* Footer stamp area and QR Code */
} <div className="flex justify-between items-end border-t border-border pt-6 mt-6"> {
/* QR verification */
} <div className="flex items-center gap-3"> <div className="h-16 w-16 border-2 border-border bg-card text-card-foreground flex items-center justify-center text-[10px] text-white font-mono text-center font-bold"> VERIFY<br />QR </div> <div className="text-[9px] text-muted-foreground max-w-[150px] leading-relaxed"> Scan this QR code to verify this medical report on the MedQueue global registry portal. </div> </div> {
/* Signatures and stamp */
} <div className="flex gap-10"> <div className="text-center text-xs"> <div className="h-10 border-b border-border w-32" /> <span className="text-[9px] text-muted-foreground block mt-1 font-semibold">Doctor Signature</span> </div> <div className="text-center text-xs"> <div className="h-14 w-14 rounded-full border-2 border-dashed border-border flex items-center justify-center text-[9px] text-secondary-foreground font-bold uppercase tracking-wide"> STAMP </div> <span className="text-[9px] text-muted-foreground block mt-1 font-semibold">Clinic Stamp</span> </div> </div> </div> </div> </div> </Dialog> </div> );
 } 
/*  Minimal inline Skeleton component just to satisfy the */

 
/* Minimal inline Skeleton component just to satisfy the import check since Skeleton is imported locally */
function Skeleton({ variant = 'rect', className = '' }: { variant?: 'text' | 'rect' | 'circle';
 className?: string }) { const baseStyle = 'animate-pulse bg-slate-800/60';
 const variants = { text: 'h-4 rounded w-3/4', rect: 'rounded-lg h-24 w-full', circle: 'rounded-full h-12 w-12' };
 
 return <div className={`${baseStyle} ${variants[variant]} ${className}`} />;
  }