"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Users, PlusCircle, Search, Trash2, Heart, ShieldAlert, ShieldCheck, Mail, Calendar, Eye } from 'lucide-react';
 
import { Patient, MedicalRecord } from '../../../types';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function FamilyManagerPatient() { const { currentUser, patients, medicalRecords, addFamilyMember, triggerNotification } = useMedQueue();
 const { t } = useTranslation();
 const ownerId = currentUser?.patientId || 'pat-1';
 const primaryPatient = patients.find(p => p.id === ownerId);
 
/*  State */
const [isAddOpen, setIsAddOpen] = useState(false);
 const [isDetailsOpen, setIsDetailsOpen] = useState(false);
 
/*  Selected relative for records view */
const [selectedRelative, setSelectedRelative] = useState<Patient | null>(null);
 
/*  Form inputs */
const [fName, setFName] = useState('');
 const [fDob, setFDob] = useState('');
 const [fGender, setFGender] = useState<'male' | 'female'>('male');
 const [fRel, setFRel] = useState<Patient['relationship']>('child');
 
/*  Filter family members (where familyOwnerId matches patient's primary ID) */
const family = patients.filter(p => p.familyOwnerId === ownerId);
 const handleAddSubmit = (e: React.FormEvent) => { e.preventDefault();
 if (!fName.trim() || !fDob) return;
 addFamilyMember({ name: fName, dob: fDob, gender: fGender, phone: currentUser?.phone || '', email: '', bloodGroup: 'Not Tested', allergies: [] }, fRel);
 setIsAddOpen(false);
 
/*  Reset setFName('');
 setFDob('');
 setFGender('male');
 setFRel('child');
 triggerNotification(currentUser?.id || 'system', 'success', 'Profile Registered', `Family member profile created successfully.`);
 */

 };
 const openRelativeRecords = (member: Patient) => { setSelectedRelative(member);
 setIsDetailsOpen(true);
 };
 const relativeHistory = medicalRecords.filter(r => r.patientId === selectedRelative?.id);
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Page Title */
} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-none dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {(t.patientFamily as any)?.title || 'Family Profile Registry'} </h1> <p className="text-xs text-muted-foreground mt-1 transition-colors"> {(t.patientFamily as any)?.subtitle || 'Register relatives, switch health timeline profiles, and book appointments on their behalf.'} </p> </div> <Button variant="primary" onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 cursor-pointer font-bold" > <PlusCircle className="h-4.5 w-4.5" /> {(t.patientFamily as any)?.addMember || 'Add Family Member'} </Button> </div> {
/* Grid List */
} <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> {
/* Owner profile card */
} <div className="bg-glass-card text-card-foreground p-5 rounded-2xl border border-border dark:border-cyan-500/25 flex flex-col gap-4 shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.08)] relative overflow-hidden transition-all"> <div className="flex justify-between items-start"> <div className="flex items-center gap-3"> <div className="h-11 w-11 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center font-bold text-primary text-lg"> {currentUser?.name?.charAt(0)} </div> <div> <h3 className="font-bold text-foreground ">{currentUser?.name}</h3> <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{ownerId}</span> </div> </div> <span className="text-[9px] uppercase font-bold text-primary bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 px-2 py-0.5 rounded"> {(t.patientFamily as any)?.primaryProfile || 'Primary Profile'} </span> </div> <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-border/60 font-mono transition-colors"> <div>{(t.patientFamily as any)?.gender || 'Gender:'} <span className="text-foreground capitalize font-bold">{primaryPatient?.gender || 'male'}</span></div> <div>{(t.patientFamily as any)?.dob || 'DOB:'} <span className="text-foreground font-bold">{primaryPatient?.dob || '1990-05-15'}</span></div> </div> </div> {
/* Relatives cards */
} {family.length > 0 ? ( family.map((member) => ( <div key={member.id} className="bg-glass text-foreground p-5 rounded-2xl border border-border/40 flex flex-col gap-4 justify-between relative group hover:border-cyan-500/50 dark:hover:border-cyan-500/15 transition-all shadow-sm dark:shadow-none"> <div className="flex justify-between items-start"> <div className="flex items-center gap-3"> <div className="h-11 w-11 rounded-full bg-secondary text-secondary-foreground border border-border flex items-center justify-center font-bold text-muted-foreground text-lg transition-colors"> {member.name.charAt(0)} </div> <div> <h3 className="font-bold text-foreground ">{member.name}</h3> <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{member.id}</span> </div> </div> <span className="text-[9px] uppercase font-bold text-muted-foreground bg-secondary text-secondary-foreground/60 border border-border px-2 py-0.5 rounded transition-colors"> {member.relationship ? ((t.patientFamily as any)?.[member.relationship] || member.relationship) : 'Self'} </span> </div> <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-border/60 font-mono transition-colors"> <div>{(t.patientFamily as any)?.gender || 'Gender:'} <span className="text-foreground capitalize font-bold">{member.gender}</span></div> <div>{(t.patientFamily as any)?.dob || 'DOB:'} <span className="text-foreground font-bold">{member.dob}</span></div> </div> <div className="pt-2 border-t border-border/50 flex gap-2"> <Button variant="ghost" size="sm" className="flex-1 flex justify-center items-center gap-2 text-xs" onClick={() => { setSelectedRelative(member);
 setIsDetailsOpen(true);
 }} > <Eye className="h-3.5 w-3.5" /> {(t.patientFamily as any)?.medicalHistory || 'Medical History'} </Button> </div> </div> )) ) : ( <div className="col-span-full"> <EmptyState icon={Users} title={(t.patientFamily as any)?.emptyTitle || "No family members found"} description={(t.patientFamily as any)?.emptySub || "Add relatives to manage their healthcare records."} /> </div> )} </div> {
/* Add Family Member Dialog */
} <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={(t.patientFamily as any)?.addRelative || "Register Family Member Profile"} > <form onSubmit={handleAddSubmit} className="flex flex-col gap-4"> <Input id="f-name" label={`${(t.patientFamily as any)?.fullName || "Full Name"} *`} placeholder="e.g. Malika Karimova" value={fName} onChange={(e) => setFName(e.target.value)} required /> <Input id="f-dob" label="Date of Birth *" type="date" value={fDob} onChange={(e) => setFDob(e.target.value)} required /> <div className="grid grid-cols-2 gap-4"> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-secondary-foreground dark:text-muted-foreground">{(t.patientFamily as any)?.gender || "Gender"} *</label> <select value={fGender} onChange={(e) => setFGender(e.target.value as any)} required className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer w-full transition-colors" > <option value="male">Male</option> <option value="female">Female</option> </select> </div> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-secondary-foreground dark:text-muted-foreground">{(t.patientFamily as any)?.relationship || "Relationship"} *</label> <select value={fRel} onChange={(e) => setFRel(e.target.value as any)} required className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer w-full transition-colors" > <option value="spouse">{(t.patientFamily as any)?.spouse || "Spouse"}</option> <option value="child">{(t.patientFamily as any)?.child || "Child"}</option> <option value="parent">{(t.patientFamily as any)?.parent || "Parent"}</option> <option value="sibling">{(t.patientFamily as any)?.sibling || "Sibling"}</option> </select> </div> </div> <div className="flex gap-2 justify-end mt-2"> <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}> {(t.patientFamily as any)?.cancel || "Cancel"} </Button> <Button type="submit" variant="primary" className="font-bold"> {(t.patientFamily as any)?.saveMember || "Register Profile"} </Button> </div> </form> </Dialog> {
/* Medical History Details Dialog */
} <Dialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title={`${(t.patientFamily as any)?.medicalHistory || "Medical File"}: ${selectedRelative?.name}`} size="lg" > <div className="flex flex-col gap-5 text-xs text-secondary-foreground"> <div className="bg-slate-50 dark:bg-slate-950/40 border border-border p-4 rounded-xl flex flex-col gap-3 max-h-80 overflow-y-auto transition-colors"> {relativeHistory.length > 0 ? ( relativeHistory.map((rec) => ( <div key={rec.id} className="p-3 bg-card text-card-foreground/60 border border-border rounded-xl flex flex-col gap-2 leading-relaxed transition-colors shadow-sm dark:shadow-none"> <div className="flex justify-between items-center text-[10px] text-muted-foreground"> <span className="font-mono font-bold text-primary">{rec.date}</span> <span>ID: {rec.id}</span> </div> <div> <strong className="text-foreground ">Diagnosis:</strong> {rec.diagnosis} </div> {rec.prescription && rec.prescription.length > 0 && ( <div> <strong className="text-foreground">Pharmacotherapy:</strong> <div className="text-[10px] text-muted-foreground pl-2"> {rec.prescription.map((m, idx) => ( <div key={idx}>• {m.medicine} - {m.dose} ({m.frequency})</div> ))} </div> </div> )} {rec.recommendations && ( <div> <strong className="text-foreground">Lifestyle Recommendations:</strong> <p className="text-muted-foreground leading-normal text-[10px] mt-0.5">{rec.recommendations}</p> </div> )} </div> )) ) : ( <div className="py-6 text-center text-muted-foreground"> No past clinical records logged for this relative. </div> )} </div> <div className="flex justify-end pt-2"> <Button variant="ghost" onClick={() => setIsDetailsOpen(false)}> Close File </Button> </div> </div> </Dialog> </div> );
 } 