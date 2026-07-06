"use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Users, Search, Eye, Mail, Phone, Calendar, Heart, ShieldAlert, FileText, Download, CheckCircle } from 'lucide-react';
 
import { Patient, MedicalRecord } from '../../../types';
 
export default function PatientsDirector() { const { t: globalT } = useTranslation();
 const { currentUser, patients, medicalRecords, triggerNotification } = useMedQueue();
 const clinicId = currentUser?.clinicId || 'clinic-1';
 
/*  State */
const [search, setSearch] = useState('');
 const [isDetailsOpen, setIsDetailsOpen] = useState(false);
 const [selectedPat, setSelectedPat] = useState<Patient | null>(null);
 
/*  Isolate patients who have records or appointments in this clinic */
const clinicPatIds = Array.from(new Set([ ...medicalRecords.filter(r => r.clinicId === clinicId).map(r => r.patientId), 'pat-1', 'pat-2', 'pat-3', 'pat-4' 
/* pre-filled mock patients for demo */
]));
const clinicPatients = patients .filter(p => clinicPatIds.includes(p.id)) .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()) );
 const openDetailsModal = (pat: Patient) => { setSelectedPat(pat);
 setIsDetailsOpen(true);
 };
 
/*  Find selected patient's history in this clinic */
const patientHistory = medicalRecords.filter( r => r.patientId === selectedPat?.id && r.clinicId === clinicId );
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> Patient Directory </h1> <p className="text-xs text-muted-foreground mt-1"> Access local patient files, medical records, and demographic profiles. </p> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass p-4 rounded-xl"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground pointer-events-none" /> <input type="text" placeholder={globalT.navbar?.searchPlaceholder || 'Search'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card text-card-foreground/50 text-foreground placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60" /> </div> </div> {
/* Table grid */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-2xl overflow-hidden border border-border/40"> {clinicPatients.length > 0 ? ( <div className="overflow-x-auto"> <table className="w-full text-left border-collapse"> <thead> <tr className="border-b border-border bg-muted text-muted-foreground/40 text-muted-foreground text-[10px] font-bold uppercase tracking-wider"> <th className="p-4">Patient Name</th> <th className="p-4">Contact Info</th> <th className="p-4">DOB / Gender</th> <th className="p-4">Blood Group</th> <th className="p-4">Allergies</th> <th className="p-4 text-right">Actions</th> </tr> </thead> <tbody className="divide-y divide-border/50 text-xs"> {clinicPatients.map((pat) => ( <tr key={pat.id} className="hover:bg-accent dark:hover:bg-card text-card-foreground/25 transition-colors"> {
/* Name */
} <td className="p-4"> <div className="font-bold text-foreground">{pat.name}</div> <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{pat.id}</div> </td> {
/* Contact */
} <td className="p-4"> <div className="text-secondary-foreground font-semibold">{pat.email}</div> <div className="text-muted-foreground font-mono mt-0.5">{pat.phone}</div> </td> {
/* DOB / Gender */
} <td className="p-4 text-muted-foreground font-medium"> <div>{pat.dob}</div> <div className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{pat.gender}</div> </td> {
/* Blood Group */
} <td className="p-4 font-mono font-bold text-cyan-400"> {pat.bloodGroup || 'Not Tested'} </td> {
/* Allergies */
} <td className="p-4"> {pat.allergies && pat.allergies.length > 0 ? ( <div className="flex flex-wrap gap-1"> {pat.allergies.map((alg, i) => ( <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold" > {alg} </span> ))} </div> ) : ( <span className="text-muted-foreground font-semibold">No known allergies</span> )} </td> {
/* Actions */
} <td className="p-4 text-right"> <Button variant="ghost" size="sm" onClick={() => openDetailsModal(pat)} className="flex items-center gap-1.5 ml-auto cursor-pointer" > <Eye className="h-4 w-4" /> Open File </Button> </td> </tr> ))} </tbody> </table> </div> ) : ( <div className="p-8"> <EmptyState icon={Users} title="No Patients Found" description="No patient files matched your active search query." /> </div> )} </div> {
/* Patient File Modal Dialog */
} <Dialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title={`Patient File: ${selectedPat?.name}`} size="lg" > <div className="flex flex-col gap-6"> {
/* Top Panel: Demographic parameters */
} <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950/45 p-4 rounded-xl border border-border/60 text-xs"> <div> <span className="text-muted-foreground font-semibold block uppercase tracking-wider">DOB:</span> <span className="text-foreground font-mono font-bold mt-1 block">{selectedPat?.dob}</span> </div> <div> <span className="text-muted-foreground font-semibold block uppercase tracking-wider">Gender:</span> <span className="text-foreground font-bold mt-1 block capitalize">{selectedPat?.gender}</span> </div> <div> <span className="text-muted-foreground font-semibold block uppercase tracking-wider">Blood Group:</span> <span className="text-cyan-400 font-mono font-bold mt-1 block">{selectedPat?.bloodGroup || 'N/A'}</span> </div> <div> <span className="text-muted-foreground font-semibold block uppercase tracking-wider">Allergies:</span> <span className="text-foreground font-bold mt-1 block truncate"> {selectedPat?.allergies?.join(', ') || 'None'} </span> </div> </div> {
/* Clinical Consultations History */
} <div className="flex flex-col gap-3"> <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"> <FileText className="h-4.5 w-4.5 text-muted-foreground" /> Local Clinic Encounter History ({patientHistory.length}) </h3> <div className="flex flex-col gap-4 divide-y divide-border/40"> {patientHistory.length > 0 ? ( patientHistory.map((rec) => ( <div key={rec.id} className="pt-4 flex flex-col gap-3"> {
/* Meta info */
} <div className="flex justify-between items-center text-xs"> <span className="text-cyan-400 font-mono font-bold">{rec.date}</span> <span className="text-muted-foreground font-semibold">Record ID: <strong className="font-mono">{rec.id}</strong></span> </div> {
/* Diagnosis card */
} <div className="bg-slate-50 dark:bg-slate-950/30 border border-border p-3 rounded-xl"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Diagnosis</span> <p className="text-foreground font-bold mt-1 text-xs">{rec.diagnosis}</p> </div> {
/* Recommendations / Prescriptions */
} <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"> <div> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Prescriptions</span> <div className="flex flex-col gap-1 mt-1.5"> {rec.prescription.map((med, i) => ( <div key={i} className="p-2 bg-slate-50 dark:bg-muted/50 border border-border dark:border-slate-900 rounded text-secondary-foreground"> <strong>{med.medicine}</strong> - {med.dose} ({med.frequency} for {med.duration}) </div> ))} </div> </div> <div> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Recommendations</span> <p className="text-muted-foreground mt-1.5 leading-relaxed bg-slate-50 dark:bg-slate-950/10 p-2 border border-transparent rounded"> {rec.recommendations || 'No lifestyle adjustments specified.'} </p> </div> </div> </div> )) ) : ( <div className="py-6 text-center text-xs text-muted-foreground"> No historical consultation files found for this clinic. </div> )} </div> </div> <div className="flex justify-end mt-4 pt-3 border-t border-border/40"> <Button variant="ghost" onClick={() => setIsDetailsOpen(false)}> Close File </Button> </div> </div> </Dialog> </div> );
 } 