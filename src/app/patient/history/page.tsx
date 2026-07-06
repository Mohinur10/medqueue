"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { History, Search, Eye, Printer, FileText, MapPin, Clock, Heart, ClipboardCheck } from 'lucide-react';
 
import { MedicalRecord, Doctor } from '../../../types';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function MedicalHistoryPatient() { const { currentUser, medicalRecords, doctors, clinics, patients } = useMedQueue();
 const { t } = useTranslation();
 const patientId = currentUser?.patientId || 'pat-1';
 const primaryPatient = patients.find(p => p.id === patientId);
 
/*  State */
const [search, setSearch] = useState('');
 const [isPrintOpen, setIsPrintOpen] = useState(false);
 
/*  Isolate records */
const myRecords = medicalRecords .filter(r => r.patientId === patientId) .map(rec => { const doc = doctors.find(d => d.id === rec.doctorId);
 const cl = clinics.find(c => c.id === rec.clinicId);
 
return { ...rec, doctorName: doc ? doc.name : 'Unknown Doctor', doctorSpecialty: doc ? doc.specialization : 'N/A', doctorRoom: doc ? doc.roomNumber : 'N/A', clinicName: cl ? cl.name : 'Unknown Clinic', clinicAddress: cl ? cl.address : '' };
 }) .filter(r => r.diagnosis.toLowerCase().includes(search.toLowerCase()) || r.doctorName.toLowerCase().includes(search.toLowerCase()) || r.clinicName.toLowerCase().includes(search.toLowerCase()) );
 const [selectedRecord, setSelectedRecord] = useState<typeof myRecords[number] | null>(null);
 const openPrintModal = (rec: MedicalRecord) => { 
/*  Map record to selected state */
const mapped = myRecords.find(r => r.id === rec.id) || null;
 setSelectedRecord(mapped);
 setIsPrintOpen(true);
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div className="no-print"> <h1 className="text-2xl font-bold text-foreground drop-shadow-none dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {(t.patientRecords as any)?.title || 'Clinical Encounter History'} </h1> <p className="text-xs text-muted-foreground mt-1 transition-colors"> {(t.patientRecords as any)?.subtitle || 'Review your medical cards, diagnostic histories, lifestyle prescriptions, and clinical logs.'} </p> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass text-foreground border border-border/40 p-4 rounded-xl no-print shadow-sm dark:shadow-none transition-colors"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground pointer-events-none" /> <input type="text" placeholder={(t.patientRecords as any)?.searchPlaceholder || 'Search by diagnosis or medical clinic...'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-muted text-muted-foreground/50 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60 transition-colors" /> </div> </div> {
/* Timeline stream */
} <div className="flex flex-col gap-6 relative pl-6 border-l border-border/65 no-print transition-colors"> {myRecords.length > 0 ? ( myRecords.map((rec) => ( <div key={rec.id} className="relative flex flex-col gap-4 bg-glass text-foreground p-5 rounded-2xl border border-border/40 shadow-sm dark:shadow-none transition-colors group"> {
/* Timeline bubble node indicator */
} <div className="absolute -left-[31px] top-6 h-4 w-4 rounded-full bg-secondary text-secondary-foreground border-2 border-cyan-500/60 flex items-center justify-center transition-colors"> <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" /> </div> {
/* Record metadata */
} <div className="flex justify-between items-start text-xs border-b border-border pb-3 transition-colors"> <div> <span className="font-mono font-bold text-primary">{rec.date}</span> <h3 className="font-bold text-foreground mt-1 text-sm">{rec.clinicName}</h3> </div> <div className="text-right text-[10px] text-muted-foreground font-mono"> <div>{(t.patientRecords as any)?.recordId || 'Record ID'}: {rec.id}</div> <div className="mt-0.5">{(t.patientRecords as any)?.doctor || 'Physician'}: {rec.doctorName}</div> </div> </div> {
/* Diagnosis box */
} <div> <span className="text-[10px] text-muted-foreground font-bold uppercase block">{(t.patientRecords as any)?.diagnosis || 'Diagnosis'}:</span> <p className="text-foreground font-bold mt-1 text-xs">{rec.diagnosis}</p> </div> {
/* Prescription list */
} {rec.prescription && rec.prescription.length > 0 && ( <div> <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1.5">{(t.patientRecords as any)?.prescribed || 'Prescribed Pharmacotherapy'}:</span> <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs"> {rec.prescription.map((m, idx) => ( <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-950/45 border border-border dark:border-slate-900 rounded-xl flex items-center justify-between transition-colors"> <span className="font-bold text-secondary-foreground">{m.medicine}</span> <span className="text-[10px] font-mono text-muted-foreground">{m.dose} ({m.frequency})</span> </div> ))} </div> </div> )} {
/* Recommendations */
} {rec.recommendations && ( <div> <span className="text-[10px] text-muted-foreground font-bold uppercase block">{(t.patientRecords as any)?.recommendations || 'Recommendations'}:</span> <p className="text-secondary-foreground dark:text-muted-foreground mt-1.5 leading-relaxed text-[11px] bg-slate-50 dark:bg-muted/50 p-2.5 border border-border dark:border-slate-900 rounded-xl transition-colors"> {rec.recommendations} </p> </div> )} {
/* Print triggers */
} <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-border transition-colors"> <Button variant="ghost" size="sm" onClick={() => openPrintModal(rec)} className="flex items-center gap-1.5 cursor-pointer text-xs" > <Eye className="h-4 w-4" /> {(t.patientRecords as any)?.viewDetails || 'Open Report Sheet'} </Button> </div> </div> )) ) : ( <div className="bg-glass text-foreground p-8 rounded-2xl border border-border/40 text-center shadow-sm dark:shadow-none transition-colors"> <EmptyState icon={History} title={(t.patientRecords as any)?.emptyTitle || "No encounters recorded"} description={(t.patientRecords as any)?.emptySub || "No clinical logs matched your search parameters."} /> </div> )} </div> {
/* Printable A4 Report dialog */
} <Dialog isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)} title={(t.patientRecords as any)?.reportSheet || "Encounter Report Sheet"} size="xl" > <div className="flex flex-col gap-6"> <div className="flex gap-2 justify-end no-print"> <Button variant="ghost" onClick={() => setIsPrintOpen(false)}> {(t.patientRecords as any)?.close || "Close"} </Button> <Button variant="primary" onClick={() => window.print()} className="font-bold flex items-center gap-1.5"> <Printer className="h-4 w-4" /> {(t.patientRecords as any)?.print || "Trigger System Print"} </Button> </div> {selectedRecord && ( <div className="bg-card text-black p-8 border border-border rounded-xl print-card flex flex-col gap-6 font-sans text-xs"> {
/* Header */
} <div className="flex justify-between items-start border-b-2 border-border pb-5"> <div className="flex items-center gap-3"> <div className="h-12 w-12 rounded-lg bg-card text-card-foreground flex items-center justify-center font-mono text-white text-lg font-bold"> MQ </div> <div> <h2 className="text-base font-extrabold tracking-tight text-foreground"> {selectedRecord.clinicName} </h2> <p className="text-[10px] text-muted-foreground font-semibold">{selectedRecord.clinicAddress}</p> </div> </div> <div className="text-right text-[9px] text-muted-foreground font-mono"> <div>Document Ref: MQ-CS-{selectedRecord.id.toUpperCase()}</div> <div>Date: {selectedRecord.date}</div> </div> </div> {
/* Grid */
} <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs"> <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block">Attending Physician</span> <span className="text-foreground font-bold block mt-1">{selectedRecord.doctorName}</span> <span className="text-muted-foreground block mt-0.5">{selectedRecord.doctorSpecialty} • Cabin #{selectedRecord.doctorRoom}</span> </div> <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block">Patient Credentials</span> <span className="text-foreground font-bold block mt-1">{currentUser?.name}</span> <span className="text-muted-foreground block mt-0.5">DOB: {primaryPatient?.dob || 'N/A'} • Gender: {primaryPatient?.gender || 'N/A'}</span> </div> </div> {
/* Diagnosis details */
} <div className="flex flex-col gap-4"> <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block border-b border-border pb-1">Clinical Diagnosis</span> <p className="text-foreground font-bold text-sm mt-1">{selectedRecord.diagnosis}</p> </div> {selectedRecord.prescription && selectedRecord.prescription.length > 0 && ( <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block border-b border-border pb-1">Prescribed Pharmacotherapy</span> <table className="w-full text-left mt-2 border-collapse text-xs"> <thead> <tr className="border-b border-border text-muted-foreground font-semibold"> <th className="pb-1">Medication Name</th> <th className="pb-1">Strength</th> <th className="pb-1">Frequency</th> <th className="pb-1 text-right">Duration</th> </tr> </thead> <tbody className="divide-y divide-slate-100 text-foreground"> {selectedRecord.prescription.map((m, i) => ( <tr key={i}> <td className="py-2 font-bold">{m.medicine}</td> <td className="py-2 font-mono">{m.dose}</td> <td className="py-2">{m.frequency}</td> <td className="py-2 font-mono text-right">{m.duration}</td> </tr> ))} </tbody> </table> </div> )} {selectedRecord.recommendations && ( <div> <span className="text-[9px] uppercase font-bold text-muted-foreground block border-b border-border pb-1">Lifestyle Adjustments</span> <p className="text-foreground mt-1 leading-relaxed">{selectedRecord.recommendations}</p> </div> )} </div> {
/* Footer Stamp */
} <div className="flex justify-between items-end border-t border-border pt-6 mt-6"> {
/* QR */
} <div className="flex items-center gap-3"> <div className="h-16 w-16 border-2 border-border bg-card text-card-foreground flex items-center justify-center text-[10px] text-white font-mono text-center font-bold"> VERIFY<br />QR </div> <div className="text-[9px] text-muted-foreground max-w-[150px] leading-relaxed"> Scan this QR code to verify this medical report on the MedQueue global registry portal. </div> </div> {
/* Signatures */
} <div className="flex gap-10"> <div className="text-center text-xs"> <div className="h-10 border-b border-border w-32" /> <span className="text-[9px] text-muted-foreground block mt-1 font-semibold">Doctor Signature</span> </div> <div className="text-center text-xs"> <div className="h-14 w-14 rounded-full border-2 border-dashed border-border flex items-center justify-center text-[9px] text-secondary-foreground font-bold uppercase tracking-wide"> STAMP </div> <span className="text-[9px] text-muted-foreground block mt-1 font-semibold">Clinic Stamp</span> </div> </div> </div> </div> )} </div> </Dialog> </div> );
 } 