"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Receipt, Search, Filter, ArrowUpRight, CheckCircle, XCircle, AlertCircle, Calendar, Download } from 'lucide-react';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function PaymentsAdmin() { const { payments, clinics } = useMedQueue();
 const { t } = useTranslation();
 
/*  State */
const [search, setSearch] = useState('');
 const [methodFilter, setMethodFilter] = useState<'all' | 'card' | 'cash' | 'transfer'>('all');
 const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all');
 
/*  Sort state */
const [sortField, setSortField] = useState<'timestamp' | 'amount'>('timestamp');
 const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
 
/*  Filter payments list */
const filteredPayments = payments .map(p => { const clinic = clinics.find(c => c.id === p.clinicId);
 
return { ...p, clinicName: clinic ? clinic.name : ((t.adminPayments as any)?.unknownClinic || 'Unknown Clinic') };
 }) .filter(p => p.clinicName.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) ) .filter(p => methodFilter === 'all' || p.method === methodFilter) .filter(p => statusFilter === 'all' || p.status === statusFilter) .sort((a, b) => { let comparison = 0;
 if (sortField === 'amount') comparison = a.amount - b.amount;
 else comparison = a.timestamp.localeCompare(b.timestamp);
 
return sortOrder === 'asc' ? comparison : -comparison;
 });
 const handleExport = () => { 
/*  Generate CSV contents */
const headers = 'Transaction ID,Clinic Center,Amount,Currency,Status,Method,Timestamp,Description\n';
 const rows = filteredPayments.map(p => `"${p.id}","${p.clinicName}",${p.amount},"${p.currency}","${p.status}","${p.method}","${p.timestamp}","${p.description}"` ).join('\n');
 const blob = new Blob([headers + rows], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `medqueue_payments_report_${Date.now()}.csv`;
 link.click();
 URL.revokeObjectURL(url);
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {(t.adminPayments as any)?.title || 'SaaS Billing & Invoices'} </h1> <p className="text-xs text-muted-foreground mt-1 transition-colors"> {(t.adminPayments as any)?.subtitle || 'Global network transaction receipts, subscription dues, and financial telemetry logs.'} </p> </div> <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2 cursor-pointer" > <Download className="h-4 w-4" /> {(t.adminPayments as any)?.exportBtn || 'Export CSV Report'} </Button> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass text-foreground p-4 rounded-xl border border-border/40 shadow-sm dark:shadow-none transition-colors"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground dark:text-muted-foreground pointer-events-none transition-colors" /> <input type="text" placeholder={(t.adminPayments as any)?.searchPlaceholder || 'Search payments by clinic / ID...'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-muted text-muted-foreground/50 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all outline-none" /> </div> <div className="flex flex-wrap items-center gap-3 w-full md:w-auto"> {
/* Method Filter */
} <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value as any)} className="bg-muted text-muted-foreground border border-border text-secondary-foreground text-xs rounded-lg p-2 focus:border-cyan-500/60 transition-colors cursor-pointer outline-none" > <option value="all">{(t.adminPayments as any)?.allMethods || 'All Methods'}</option> <option value="card">{(t.adminPayments as any)?.card || 'Card Checkout'}</option> <option value="cash">{(t.adminPayments as any)?.cash || 'Cash Pay'}</option> <option value="transfer">{(t.adminPayments as any)?.transfer || 'Bank Transfer'}</option> </select> {
/* Status Filter */
} <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-muted text-muted-foreground border border-border text-secondary-foreground text-xs rounded-lg p-2 focus:border-cyan-500/60 transition-colors cursor-pointer outline-none" > <option value="all">{(t.adminPayments as any)?.allStatuses || 'All Statuses'}</option> <option value="success">{(t.adminPayments as any)?.success || 'Success'}</option> <option value="failed">{(t.adminPayments as any)?.failed || 'Failed'}</option> <option value="pending">{(t.adminPayments as any)?.pending || 'Pending'}</option> </select> </div> </div> {
/* Table grid */
} <div className="bg-glass text-foreground rounded-2xl overflow-hidden border border-border/40 shadow-sm dark:shadow-none transition-colors"> {filteredPayments.length > 0 ? ( <div className="overflow-x-auto"> <table className="w-full text-left border-collapse"> <thead> <tr className="border-b border-border bg-muted text-muted-foreground/40 text-muted-foreground text-[10px] font-bold uppercase tracking-wider transition-colors"> <th className="p-4">{(t.adminPayments as any)?.tableColId || 'Transaction ID'}</th> <th className="p-4">{(t.adminPayments as any)?.tableColClinic || 'Clinic Center'}</th> <th className="p-4">{(t.adminPayments as any)?.tableColDate || 'Date & Time'}</th> <th className="p-4">{(t.adminPayments as any)?.tableColMethod || 'Payment Method'}</th> <th className="p-4">{(t.adminPayments as any)?.tableColDesc || 'Description'}</th> <th className="p-4 text-right">{(t.adminPayments as any)?.tableColAmount || 'Amount (UZS)'}</th> <th className="p-4">{(t.adminPayments as any)?.tableColStatus || 'Status'}</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs transition-colors"> {filteredPayments.map((pay) => ( <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-card text-card-foreground/25 transition-colors"> {
/* ID */
} <td className="p-4 font-mono text-[10px] text-muted-foreground transition-colors"> {pay.id} </td> {
/* Clinic Center */
} <td className="p-4 font-bold text-foreground transition-colors"> {pay.clinicName} </td> {
/* Date */
} <td className="p-4 text-muted-foreground flex items-center gap-1.5 font-mono text-[10px] transition-colors"> <Calendar className="h-3.5 w-3.5 text-muted-foreground dark:text-muted-foreground transition-colors" /> {pay.timestamp} </td> {
/* Method */
} <td className="p-4 text-secondary-foreground font-semibold uppercase transition-colors"> {(t.adminPayments as any)?.[pay.method] || pay.method} </td> {
/* Description */
} <td className="p-4 text-muted-foreground max-w-xs truncate transition-colors"> {pay.description} </td> {
/* Amount */
} <td className="p-4 font-mono font-bold text-foreground text-right transition-colors"> {pay.amount.toLocaleString()} UZS </td> {
/* Status */
} <td className="p-4"> <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1 w-max transition-colors ${pay.status === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : pay.status === 'failed' ? 'bg-rose-50 dark:bg-rose-500/10 text-destructive border-rose-200 dark:border-rose-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'}`} > {pay.status === 'success' ? <CheckCircle className="h-3 w-3" /> : pay.status === 'failed' ? <XCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />} {(t.adminPayments as any)?.[pay.status] || pay.status} </span> </td> </tr> ))} </tbody> </table> </div> ) : ( <div className="p-8"> <EmptyState icon={Receipt} title={(t.adminPayments as any)?.emptyTitle || 'No Invoices Recorded'} description={(t.adminPayments as any)?.emptyDesc || 'No SaaS billing invoices matched your search criteria.'} /> </div> )} </div> </div> );
 } 