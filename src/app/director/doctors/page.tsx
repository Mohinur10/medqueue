"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Stethoscope, Search, PlusCircle, Ban, CheckCircle, KeyRound, Edit, Mail, Phone, Calendar, Clock, MapPin, GraduationCap, Globe, BookOpenCheck } from 'lucide-react';
 
import { Doctor, Room, Department } from '../../../types';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function DoctorsDirector() { const { currentUser, doctors, rooms, departments, createDoctor, updateDoctorStatus, createAuditLog, triggerNotification } = useMedQueue();
 const { t: globalT } = useTranslation();
 const t = globalT.directorDashboard || {};
 const clinicId = currentUser?.clinicId || 'clinic-1';
 
/*  State */
const [search, setSearch] = useState('');
 const [deptFilter, setDeptFilter] = useState('all');
 const [localDocs, setLocalDocs] = useState<Doctor[]>(doctors.filter(d => d.clinicId === clinicId));
 
/*  Modals state */
const [isAddOpen, setIsAddOpen] = useState(false);
 const [isResetOpen, setIsResetOpen] = useState(false);
 const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
 
/*  Reset password state */
const [tempPass, setTempPass] = useState('');
 
/*  Form states (Add Doctor) */
const [dName, setDName] = useState('');
 const [dEmail, setDEmail] = useState('');
 const [dPhone, setDPhone] = useState('');
 const [dSpec, setDSpec] = useState(departments.filter(d => d.clinicId === clinicId)[0]?.name || 'Cardiology');
 const [dRoom, setDRoom] = useState(rooms.filter(r => r.clinicId === clinicId)[0]?.roomNumber || '101');
 const [dExp, setDExp] = useState('5');
 const [dEduc, setDEduc] = useState('');
 const [dLang, setDLang] = useState('Uzbek, Russian');
 const [dStart, setDStart] = useState('09:00');
 const [dEnd, setDEnd] = useState('17:00');
  const [dDays, setDDays] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: false });
 
/*  Filter lists */
const filteredDocs = localDocs .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase())) .filter(d => deptFilter === 'all' || d.specialization === deptFilter);
 const resetForm = () => { setDName('');
 setDEmail('');
 setDPhone('');
 setDExp('5');
 setDEduc('');
 setDLang('Uzbek, Russian');
 setDStart('09:00');
 setDEnd('17:00');
 setDDays({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: false });
 };
 const handleCreateSubmit = (e: React.FormEvent) => { e.preventDefault();
 if (!dName.trim() || !dEmail.trim()) return;
 
/*  Convert working days object to number array */
const workingDaysArray = Object.keys(dDays) .map(Number) .filter(key => dDays[key as keyof typeof dDays]);
 const newDoc: Doctor = { id: `doc-${Date.now()}`, userId: `user-doc-${Date.now()}`, clinicId, name: dName, photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200", specialization: dSpec, email: dEmail, phone: dPhone, workingDays: workingDaysArray, workingHours: { start: dStart, end: dEnd }, appointmentDuration: 10, roomNumber: dRoom, experience: parseInt(dExp), education: dEduc, languages: dLang.split(',').map(s => s.trim()), status: 'active' };
 setLocalDocs(prev => [...prev, newDoc]);
 createDoctor(newDoc);
 
 /* context sync */
 setIsAddOpen(false);
 resetForm();
 triggerNotification(clinicId, 'success', 'Doctor Account Created', `Dr. ${newDoc.name} has been provisioned.`);
 };
 const handleToggleStatus = (id: string, currentStatus: Doctor['status']) => { const nextStatus: Doctor['status'] = currentStatus === 'active' ? 'inactive' : 'active';
 setLocalDocs(prev => prev.map(d => { if (d.id === id) { updateDoctorStatus(id, nextStatus);
 
/*  sync to context */

 
return { ...d, status: nextStatus };
 } 
return d;
 }));
 triggerNotification(clinicId, 'warning', 'Status Toggled', `Physician operational state changed.`);
 };
 const handleResetSubmit = (e: React.FormEvent) => { e.preventDefault();
 if (!tempPass.trim()) return;
 setIsResetOpen(false);
 createAuditLog('RESET_DOCTOR_PASSWORD', `Password reset for doctor ${selectedDoc?.name}`);
 triggerNotification(clinicId, 'success', 'Passcode Updated', `Temporary keys issued for Dr. ${selectedDoc?.name}.`);
 setTempPass('');
 setSelectedDoc(null);
 };
 const openResetModal = (doc: Doctor) => { setSelectedDoc(doc);
 setIsResetOpen(true);
 };
 const activeClinicsDepts = departments.filter(d => d.clinicId === clinicId);
 const activeClinicsRooms = rooms.filter(r => r.clinicId === clinicId);
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> {(globalT.sidebar.director as any).doctors || 'Physicians Registry'} </h1> <p className="text-xs text-muted-foreground mt-1"> Register doctor credentials, map consultation rooms, and adjust shift timetables. </p> </div> <Button variant="primary" onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 cursor-pointer font-bold" > <PlusCircle className="h-4.5 w-4.5" /> Add Doctor Account </Button> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass p-4 rounded-xl"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground pointer-events-none" /> <input type="text" placeholder={(globalT.navbar as any).searchPlaceholder || "Search..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card text-card-foreground/50 text-foreground placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60" /> </div> <div className="flex flex-wrap items-center gap-3 w-full md:w-auto"> {
/* Department Filter */
} <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="bg-card text-card-foreground border border-border text-foreground text-xs rounded-lg p-2 focus:border-cyan-500/60 cursor-pointer" > <option value="all">All Specialties</option> {activeClinicsDepts.map(d => ( <option key={d.id} value={d.name}>{d.name}</option> ))} </select> </div> </div> {
/* Doctor Cards Grid */
} <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> {filteredDocs.length > 0 ? ( filteredDocs.map((doc) => ( <div key={doc.id} className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group"> {
/* Photo & Status */
} <div className="flex items-start justify-between"> <div className="flex items-center gap-3"> <img src={doc.photo} alt={doc.name} className="h-14 w-14 rounded-full border border-border bg-secondary text-secondary-foreground object-cover shadow-[0_0_12px_rgba(6,182,212,0.15)]" /> <div> <h3 className="font-bold text-foreground group-hover:text-cyan-400 transition-colors"> {doc.name} </h3> <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider block mt-0.5"> {doc.specialization} </span> </div> </div> {
/* Active status */
} <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${doc.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`} > {doc.status} </span> </div> {
/* Room & Shift info */
} <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-border/60"> <div className="flex items-center gap-1.5"> <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> <span>Cabin Room: <strong>#{doc.roomNumber}</strong></span> </div> <div className="flex items-center gap-1.5"> <Clock className="h-3.5 w-3.5 text-muted-foreground" /> <span>Shift: <strong>{doc.workingHours.start} - {doc.workingHours.end}</strong></span> </div> </div> {
/* General Metadata */
} <div className="flex flex-col gap-1.5 text-[10px] text-muted-foreground mt-1"> <div className="flex items-center gap-2"> <Mail className="h-4 w-4 text-muted-foreground" /> <span className="truncate">{doc.email}</span> </div> <div className="flex items-center gap-2"> <GraduationCap className="h-4 w-4 text-muted-foreground" /> <span className="truncate">{doc.education}</span> </div> <div className="flex items-center gap-2"> <Globe className="h-4 w-4 text-muted-foreground" /> <span>Languages: <strong>{doc.languages.join(', ')}</strong></span> </div> </div> {
/* Actions */
} <div className="flex gap-2 border-t border-border/40 pt-3 mt-1"> <Button variant="ghost" size="sm" onClick={() => openResetModal(doc)} className="flex-grow flex items-center justify-center gap-1 cursor-pointer" > <KeyRound className="h-3.5 w-3.5" /> Reset Pass </Button> <button onClick={() => handleToggleStatus(doc.id, doc.status)} className={`px-3 py-1 text-xs rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-grow ${doc.status === 'active' ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'}`} > {doc.status === 'active' ? ( <> <Ban className="h-3.5 w-3.5" /> Suspend </> ) : ( <> <CheckCircle className="h-3.5 w-3.5" /> Activate </> )} </button> </div> </div> )) ) : ( <div className="col-span-3"> <EmptyState icon={Stethoscope} title="No Doctors Registered" description="No clinic physicians matched the active search filters." actionText="Add Doctor Account" onAction={() => setIsAddOpen(true)} /> </div> )} </div> {
/* Add Doctor Dialog */
} <Dialog isOpen={isAddOpen} onClose={() => { setIsAddOpen(false);
 resetForm();
 }} title="Add Physician Account" size="lg" > <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4"> <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1.5">Personal Details</h4> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <Input id="doc-name" label="Doctor Name *" placeholder="e.g. Dr. Nodira Alimova" value={dName} onChange={(e) => setDName(e.target.value)} required /> <Input id="doc-phone" label="Contact Phone" placeholder="+99890XXXXXXX" value={dPhone} onChange={(e) => setDPhone(e.target.value)} /> <Input id="doc-email" label="Login Email (Username) *" placeholder="nodira.a@clinic.uz" value={dEmail} onChange={(e) => setDEmail(e.target.value)} required /> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Specialty Department *</label> <select value={dSpec} onChange={(e) => setDSpec(e.target.value)} required className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 w-full cursor-pointer" > {activeClinicsDepts.map(d => ( <option key={d.id} value={d.name}>{d.name}</option> ))} </select> </div> </div> <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1.5 mt-2">Clinical Details</h4> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Consultation Cabin *</label> <select value={dRoom} onChange={(e) => setDRoom(e.target.value)} required className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 w-full cursor-pointer" > {activeClinicsRooms.map(r => ( <option key={r.id} value={r.roomNumber}>Cabin #{r.roomNumber}</option> ))} </select> </div> <Input id="doc-exp" label="Years of Experience" type="number" value={dExp} onChange={(e) => setDExp(e.target.value)} /> <Input id="doc-langs" label="Languages Spoken" placeholder="Uzbek, Russian, English" value={dLang} onChange={(e) => setDLang(e.target.value)} /> <Input id="doc-educ" label="Education History" placeholder="Medical Academy, Residency details..." value={dEduc} onChange={(e) => setDEduc(e.target.value)} /> </div> <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1.5 mt-2">Working Hours & Shifts</h4> <div className="grid grid-cols-2 gap-4"> <Input id="doc-wstart" label="Shift Start" type="time" value={dStart} onChange={(e) => setDStart(e.target.value)} /> <Input id="doc-wend" label="Shift End" type="time" value={dEnd} onChange={(e) => setDEnd(e.target.value)} /> </div> <div className="flex flex-col gap-2 mt-1"> <span className="text-xs font-semibold text-muted-foreground">Scheduled Workdays</span> <div className="flex flex-wrap gap-2"> {[ { label: 'Mon', val: 1 }, { label: 'Tue', val: 2 }, { label: 'Wed', val: 3 }, { label: 'Thu', val: 4 }, { label: 'Fri', val: 5 }, { label: 'Sat', val: 6 }].map(day => ( <label key={day.val} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${dDays[day.val as keyof typeof dDays] ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-50 dark:bg-slate-950/40 border-border text-muted-foreground'}`} > <input type="checkbox" checked={dDays[day.val as keyof typeof dDays]} onChange={(e) => setDDays(prev => ({ ...prev, [day.val]: e.target.checked }))} className="hidden" /> {day.label} </label> ))} </div> </div> <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-border/40"> <Button type="button" variant="ghost" onClick={() => { setIsAddOpen(false);
 resetForm();
 }}> Cancel </Button> <Button type="submit" variant="primary" className="font-bold flex items-center gap-1"> <BookOpenCheck className="h-4 w-4" /> Register Doctor </Button> </div> </form> </Dialog> {
/* Password Reset Modal */
} <Dialog isOpen={isResetOpen} onClose={() => { setIsResetOpen(false);
 setTempPass('');
 setSelectedDoc(null);
 }} title={`Reset Credentials for Dr. ${selectedDoc?.name}`} > <form onSubmit={handleResetSubmit} className="flex flex-col gap-4"> <p className="text-xs text-muted-foreground leading-relaxed"> Specify a temporary password for this doctor account. They will be forced to modify this credential on their subsequent login session. </p> <Input id="reset-doc-pass" label="Temporary Passcode *" type="password" placeholder="••••••••" value={tempPass} onChange={(e) => setTempPass(e.target.value)} required /> <div className="flex gap-2 justify-end mt-2"> <Button type="button" variant="ghost" onClick={() => { setIsResetOpen(false);
 setTempPass('');
 setSelectedDoc(null);
 }}> Cancel </Button> <Button type="submit" variant="primary"> Commit Reset Key </Button> </div> </form> </Dialog> </div> );
 } 