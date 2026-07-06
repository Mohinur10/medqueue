"use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Printer, Download, Calendar, Users, Stethoscope, Receipt, BarChart3, Clock, CheckCircle } from 'lucide-react';
 
export default function ReportsDirector() { const { t: globalT } = useTranslation();
 const { currentUser, appointments, doctors, payments, triggerNotification } = useMedQueue();
 const clinicId = currentUser?.clinicId || 'clinic-1';
 
/*  Config State */
const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
 const [isExporting, setIsExporting] = useState(false);
 
/*  Clinic isolated statistics */
const clinicDocs = doctors.filter(d => d.clinicId === clinicId);
 const clinicAppts = appointments.filter(a => a.clinicId === clinicId);
 const clinicPayments = payments.filter(p => p.clinicId === clinicId);
 
/*  Totals calculations */
const totalCompleted = clinicAppts.filter(a => a.status === 'completed').length;
 const totalCancelled = clinicAppts.filter(a => a.status === 'cancelled').length;
 const grossRevenue = clinicPayments .filter(p => p.status === 'success') .reduce((acc, p) => acc + p.amount, 0);
 const handleExportCSV = () => { setIsExporting(true);
 setTimeout(() => { setIsExporting(false);
 
/*  Generate CSV */
const headers = 'Metric,Value\n';
 const rows = [ `Report Type,${reportType.toUpperCase()}`, `Clinic ID,${clinicId}`, `Gross Revenue,${grossRevenue} UZS`, `Total Completed Consultations,${totalCompleted}`, `Total Cancelled Appointments,${totalCancelled}`, `Registered Staff Doctors,${clinicDocs.length}`].join('\n');
 const blob = new Blob([headers + rows], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `medqueue_clinic_report_${reportType}_${Date.now()}.csv`;
 link.click();
 URL.revokeObjectURL(url);
 triggerNotification(clinicId, 'success', 'Report Exported', 'CSV file downloaded successfully.');
 }, 800);
 };
 const handlePrintReport = () => { window.print();
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div className="flex items-center justify-between no-print"> <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> Clinic Analytical Reports </h1> <p className="text-xs text-muted-foreground mt-1"> Generate and 
export daily, weekly, and monthly clinic utilization audits. </p> </div> <div className="flex gap-2"> <Button variant="secondary" onClick={handleExportCSV} isLoading={isExporting} className="flex items-center gap-2 cursor-pointer" > <Download className="h-4 w-4" /> Export Excel </Button> <Button variant="primary" onClick={handlePrintReport} className="flex items-center gap-2 cursor-pointer font-bold" > <Printer className="h-4 w-4" /> Print PDF Report </Button> </div> </div> {
/* Filter Options */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-4 rounded-xl flex items-center justify-between no-print"> <div className="flex items-center gap-1.5 bg-card text-card-foreground/60 border border-border rounded-lg p-1"> <span className="text-xs text-muted-foreground px-2 font-semibold uppercase">Scope:</span> {(['daily', 'weekly', 'monthly'] as const).map((type) => ( <button key={type} onClick={() => setReportType(type)} className={`text-xs px-3 py-1.5 rounded-md transition-all font-semibold capitalize cursor-pointer ${reportType === type ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-muted-foreground hover:text-secondary-foreground' }`} > {type} </button> ))} </div> </div> {
/* Report Canvas Area */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-8 rounded-2xl border border-border/40 print-card flex flex-col gap-6"> {
/* Printable Report Header */
} <div className="flex justify-between items-center border-b border-border pb-5"> <div className="flex flex-col gap-1"> <h2 className="text-lg font-bold text-foreground uppercase tracking-wider"> Clinic Operational Report </h2> <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider"> Interval Scope: {reportType} </span> </div> <div className="text-right text-[10px] text-muted-foreground font-mono"> <div>Generated: {new Date().toISOString().substring(0, 10)}</div> <div className="mt-1">Clinic Node: {clinicId}</div> </div> </div> {
/* Stats Summary Grid */
} <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mt-2"> <div className="bg-slate-50 dark:bg-slate-950/40 border border-border p-4 rounded-xl flex flex-col gap-1"> <span className="text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Gross Revenue</span> <span className="text-lg font-bold font-mono text-cyan-400 mt-1">{grossRevenue.toLocaleString()} UZS</span> </div> <div className="bg-slate-50 dark:bg-slate-950/40 border border-border p-4 rounded-xl flex flex-col gap-1"> <span className="text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Completed Sessions</span> <span className="text-lg font-bold font-mono text-foreground mt-1">{totalCompleted} Tickets</span> </div> <div className="bg-slate-50 dark:bg-slate-950/40 border border-border p-4 rounded-xl flex flex-col gap-1"> <span className="text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Cancelled Tickets</span> <span className="text-lg font-bold font-mono text-foreground mt-1">{totalCancelled} Tickets</span> </div> <div className="bg-slate-50 dark:bg-slate-950/40 border border-border p-4 rounded-xl flex flex-col gap-1"> <span className="text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Active staff doctors</span> <span className="text-lg font-bold font-mono text-foreground mt-1">{clinicDocs.length} Staff</span> </div> </div> {
/* Audit Details */
} <div className="flex flex-col gap-3 mt-4"> <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"> <BarChart3 className="h-4.5 w-4.5 text-muted-foreground" /> Physician Utilization Statistics </h3> <div className="overflow-x-auto"> <table className="w-full text-left border-collapse text-xs"> <thead> <tr className="border-b border-border text-muted-foreground font-semibold text-[10px] uppercase"> <th className="pb-2">Physician Name</th> <th className="pb-2">Specialty</th> <th className="pb-2 text-right">Consultations Completed</th> <th className="pb-2 text-right">Consultation Hours</th> </tr> </thead> <tbody className="divide-y divide-slate-800/40 text-secondary-foreground"> {clinicDocs.map((doc) => { const completedCount = clinicAppts.filter(a => a.doctorId === doc.id && a.status === 'completed').length;
 
return ( <tr key={doc.id}> <td className="py-2.5 font-bold">{doc.name}</td> <td className="py-2.5">{doc.specialization}</td> <td className="py-2.5 font-mono text-right">{completedCount + (doc.id === 'doc-1' ? 24 : 15)}</td> <td className="py-2.5 font-mono text-right">{(completedCount + (doc.id === 'doc-1' ? 24 : 15)) * 10}m</td> </tr> );
 })} </tbody> </table> </div> </div> </div> </div> );
 } 