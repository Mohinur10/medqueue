"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Users, Search, Eye, Mail, Phone, Calendar, Heart, ShieldAlert, FileText } from 'lucide-react';
 
import { Patient, MedicalRecord } from '../../../types';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function PatientsDoctorDirectory() { const { patients, medicalRecords } = useMedQueue();
 const { t } = useTranslation();
 
/*  State */
const [search, setSearch] = useState('');
 const [isDetailsOpen, setIsDetailsOpen] = useState(false);
 const [selectedPat, setSelectedPat] = useState<Patient | null>(null);
 const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) );
 const openDetailsModal = (pat: Patient) => { setSelectedPat(pat);
 setIsDetailsOpen(true);
 };
 
/*  Find selected patient's history across all clinics */
const patientHistory = medicalRecords.filter(r => r.patientId === selectedPat?.id);
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {(t.doctorPatients as any)?.title || 'Clinical Patient Registry'} </h1> <p className="text-xs text-muted-foreground mt-1"> {(t.doctorPatients as any)?.subtitle || 'Search patient records globally to review diagnostic timelines and pre-existing conditions.'} </p> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass text-foreground p-4 rounded-xl border border-border/40 shadow-sm dark:shadow-none transition-colors"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground dark:text-muted-foreground pointer-events-none transition-colors" /> <input type="text" placeholder={(t.doctorPatients as any)?.searchPlaceholder || "Search by name, phone number, or ID..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-muted text-muted-foreground/50 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60 transition-colors" /> </div> </div> {
/* Table grid */
} <div className="bg-glass text-foreground rounded-2xl overflow-hidden border border-border/40 shadow-sm dark:shadow-none transition-colors"> {filteredPatients.length > 0 ? ( <div className="overflow-x-auto"> <table className="w-full text-left border-collapse"> <thead> <tr className="border-b border-border bg-muted text-muted-foreground/40 text-muted-foreground text-[10px] font-bold uppercase tracking-wider transition-colors"> <th className="p-4">{(t.doctorPatients as any)?.thName || 'Patient Name'}</th> <th className="p-4">{(t.doctorPatients as any)?.thContact || 'Contact Info'}</th> <th className="p-4">{(t.doctorPatients as any)?.thDobGender || 'DOB / Gender'}</th> <th className="p-4">{(t.doctorPatients as any)?.thBlood || 'Blood Group'}</th> <th className="p-4">{(t.doctorPatients as any)?.thAllergies || 'Allergies'}</th> <th className="p-4 text-right">{(t.doctorPatients as any)?.thActions || 'Actions'}</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs transition-colors"> {filteredPatients.map((pat) => ( <tr key={pat.id} className="hover:bg-slate-50 dark:hover:bg-card text-card-foreground/25 transition-colors"> {
/* Name */
} <td className="p-4"> <div className="font-bold text-foreground ">{pat.name}</div> <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{pat.id}</div> </td> {
/* Contact */
} <td className="p-4"> <div className="text-secondary-foreground font-semibold">{pat.email}</div> <div className="text-muted-foreground font-mono mt-0.5">{pat.phone}</div> </td> {
/* DOB / Gender */
} <td className="p-4 text-muted-foreground font-medium"> <div>{pat.dob}</div> <div className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{pat.gender}</div> </td> {
/* Blood Group */
} <td className="p-4 font-mono font-bold text-primary"> {pat.bloodGroup || (t.doctorPatients as any)?.notTested || 'Not Tested'} </td> {
/* Allergies */
} <td className="p-4"> {pat.allergies && pat.allergies.length > 0 ? ( <div className="flex flex-wrap gap-1"> {pat.allergies.map((alg, i) => ( <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-destructive font-bold transition-colors" > {alg} </span> ))} </div> ) : ( <span className="text-muted-foreground dark:text-muted-foreground font-semibold">{(t.doctorPatients as any)?.noAllergies || 'No known allergies'}</span> )} </td> {
/* Actions */
} <td className="p-4 text-right"> <Button variant="ghost" size="sm" onClick={() => openDetailsModal(pat)} className="flex items-center gap-1.5 ml-auto cursor-pointer border border-border dark:border-transparent text-muted-foreground hover:bg-accent dark:hover:bg-card/5 transition-colors" > <Eye className="h-4 w-4" /> {(t.doctorPatients as any)?.btnPreview || 'Preview File'} </Button> </td> </tr> ))} </tbody> </table> </div> ) : ( <div className="p-8"> <EmptyState icon={Users} title={(t.doctorPatients as any)?.emptyTitle || 'No Patients Found'} description={(t.doctorPatients as any)?.emptySub || 'No registered patient records matched your active query.'} /> </div> )} </div> {
/* Patient File Modal Dialog */
} <Dialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title={`${(t.doctorPatients as any)?.modalTitle || 'Patient File'}: ${selectedPat?.name}`} size="lg" > <div className="flex flex-col gap-6"> {
/* Demographic summary parameters */
} <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950/45 p-4 rounded-xl border border-border/60 text-xs transition-colors"> <div> <span className="text-muted-foreground font-semibold block uppercase tracking-wider">{(t.doctorPatients as any)?.lblDob || 'DOB'}:</span> <span className="text-foreground font-mono font-bold mt-1 block">{selectedPat?.dob}</span> </div> <div> <span className="text-muted-foreground font-semibold block uppercase tracking-wider">{(t.doctorPatients as any)?.lblGender || 'Gender'}:</span> <span className="text-foreground font-bold mt-1 block capitalize">{selectedPat?.gender}</span> </div> <div> <span className="text-muted-foreground font-semibold block uppercase tracking-wider">{(t.doctorPatients as any)?.lblBlood || 'Blood Group'}:</span> <span className="text-primary font-mono font-bold mt-1 block">{selectedPat?.bloodGroup || 'N/A'}</span> </div> <div> <span className="text-muted-foreground font-semibold block uppercase tracking-wider">{(t.doctorPatients as any)?.lblAllergies || 'Allergies'}:</span> <span className="text-foreground font-bold mt-1 block truncate"> {selectedPat?.allergies?.join(', ') || 'None'} </span> </div> </div> {
/* Historical Consultation Timeline */
} <div className="flex flex-col gap-3"> <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 transition-colors"> <FileText className="h-4.5 w-4.5 text-muted-foreground" /> {(t.doctorPatients as any)?.historyTitle || 'Global Medical Encounters Timeline'} ({patientHistory.length}) </h3> <div className="flex flex-col gap-4 divide-y divide-border/40 transition-colors"> {patientHistory.length > 0 ? ( patientHistory.map((rec) => ( <div key={rec.id} className="pt-4 flex flex-col gap-3"> {
/* Meta info */
} <div className="flex justify-between items-center text-xs"> <span className="text-primary font-mono font-bold">{rec.date}</span> <span className="text-muted-foreground font-semibold">{(t.doctorPatients as any)?.recordId || 'Record ID'}: <strong className="font-mono text-foreground ">{rec.id}</strong></span> </div> {
/* Diagnosis card */
} <div className="bg-slate-50 dark:bg-slate-950/30 border border-border p-3 rounded-xl transition-colors"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">{(t.doctorPatients as any)?.diagnosis || 'Diagnosis'}</span> <p className="text-foreground font-bold mt-1 text-xs">{rec.diagnosis}</p> </div> {
/* Recommendations / Prescriptions */
} <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"> <div> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">{(t.doctorPatients as any)?.prescriptions || 'Prescriptions'}</span> <div className="flex flex-col gap-1 mt-1.5"> {rec.prescription.map((med, i) => ( <div key={i} className="p-2 bg-slate-50 dark:bg-muted/50 border border-border dark:border-slate-900 rounded text-foreground transition-colors"> <strong>{med.medicine}</strong> - {med.dose} ({med.frequency} for {med.duration}) </div> ))} </div> </div> <div> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">{(t.doctorPatients as any)?.recommendations || 'Recommendations'}</span> <p className="text-secondary-foreground dark:text-muted-foreground mt-1.5 leading-relaxed bg-slate-50 dark:bg-slate-950/10 p-2 border border-slate-100 dark:border-transparent rounded transition-colors"> {rec.recommendations || (t.doctorPatients as any)?.noRecommendations || 'No lifestyle adjustments specified.'} </p> </div> </div> </div> )) ) : ( <div className="py-6 text-center text-xs text-muted-foreground"> {(t.doctorPatients as any)?.noHistory || 'No historical consultation files recorded.'} </div> )} </div> </div> <div className="flex justify-end mt-4 pt-3 border-t border-border/40 transition-colors"> <Button variant="ghost" onClick={() => setIsDetailsOpen(false)} className="border border-border dark:border-transparent"> {(t.doctorPatients as any)?.btnClose || 'Close File Preview'} </Button> </div> </div> </Dialog> </div> );
 } 