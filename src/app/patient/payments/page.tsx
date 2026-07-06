"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Receipt, Search, Download, CheckCircle, XCircle, AlertCircle, Calendar, CreditCard, RefreshCcw } from 'lucide-react';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import { PaymentModal } from '../../../components/ui/PaymentModal';
 
export default function PaymentsPatient() { const { currentUser, payments, clinics, triggerNotification } = useMedQueue();
 const { t } = useTranslation();
 const patientId = currentUser?.patientId || 'pat-1';
 
/*  State */
const [search, setSearch] = useState('');
 
/*  Payment Modal State */
const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
 const [activeInvoice, setActiveInvoice] = useState<{ id: string, amount: number } | null>(null);
 const handleOpenPayment = (id: string, amount: number) => { setActiveInvoice({ id, amount });
 setIsPaymentModalOpen(true);
 };
 const handleClosePayment = () => { setIsPaymentModalOpen(false);
 setActiveInvoice(null);
 };
 
/*  Isolate payments */
const myPayments = payments .filter(p => p.patientId === patientId) .map(p => { const cl = clinics.find(c => c.id === p.clinicId);
 
return { ...p, clinicName: cl ? cl.name : 'Unknown Clinic' };
 }) .filter(p => p.description.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.clinicName.toLowerCase().includes(search.toLowerCase()) );
 const handleDownloadReceipt = (payId: string) => { triggerNotification(currentUser?.id || 'system', 'success', 'Receipt Printed', `Receipt for invoice #${payId} prepared.`);
 window.print();
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div className="no-print"> <h1 className="text-2xl font-bold text-foreground drop-shadow-none dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {t.patientBilling?.title || 'Invoices & Statements'} </h1> <p className="text-xs text-muted-foreground mt-1 transition-colors"> {t.patientBilling?.subtitle || 'Review transaction logs, download print receipts, and check transaction status.'} </p> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass text-foreground border border-border/40 p-4 rounded-xl no-print shadow-sm dark:shadow-none transition-colors"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground pointer-events-none" /> <input type="text" placeholder={t.patientBilling?.searchPlaceholder || "Search by invoice ID or clinic..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-muted text-muted-foreground/50 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60 transition-colors" /> </div> </div> {
/* Invoice stream table */
} <div className="bg-glass text-foreground rounded-2xl overflow-hidden border border-border/40 shadow-sm dark:shadow-none transition-colors print-card"> {
/* Printable Report Header */
} <div className="p-5 border-b border-border bg-muted text-muted-foreground/40 flex justify-between items-center transition-colors"> <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2"> <Receipt className="h-4.5 w-4.5 text-primary" /> {t.patientBilling?.transactionStream || 'Billing Transaction Stream'} </h3> <span className="text-[10px] text-muted-foreground font-mono no-print">{t.patientBilling?.patient || 'Patient:'} {currentUser?.name}</span> </div> {myPayments.length > 0 ? ( <div className="overflow-x-auto"> <table className="w-full text-left border-collapse text-xs"> <thead> <tr className="border-b border-border text-muted-foreground text-[10px] font-bold uppercase tracking-wider transition-colors"> <th className="p-4">{t.patientBilling?.invoiceId || 'Invoice ID'}</th> <th className="p-4">{t.patientBilling?.clinicDesc || 'Clinic / Description'}</th> <th className="p-4">{t.patientBilling?.timestamp || 'Timestamp'}</th> <th className="p-4 text-right">{t.patientBilling?.amountPaid || 'Amount Paid'}</th> <th className="p-4">{t.patientBilling?.status || 'Status'}</th> <th className="p-4 text-right no-print">{t.patientBilling?.actions || 'Actions'}</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-secondary-foreground"> {myPayments.map((pay) => ( <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-card text-card-foreground/10 transition-colors"> <td className="p-4 font-mono text-[9px] text-muted-foreground">{pay.id}</td> <td className="p-4"> <div className="font-bold text-foreground ">{pay.clinicName}</div> <div className="text-[10px] text-muted-foreground mt-0.5">{pay.description}</div> </td> <td className="p-4 font-mono text-muted-foreground">{pay.timestamp}</td> <td className="p-4 font-mono font-bold text-cyan-400 text-right">{pay.amount.toLocaleString()} UZS</td> <td className="p-4"> <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1 w-max ${pay.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : pay.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : pay.status === 'refunded' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`} > {pay.status === 'success' ? <CheckCircle className="h-2.5 w-2.5" /> : pay.status === 'failed' ? <XCircle className="h-2.5 w-2.5" /> : pay.status === 'refunded' ? <RefreshCcw className="h-2.5 w-2.5" /> : <AlertCircle className="h-2.5 w-2.5" />} {(t.patientBilling as any)?.[pay.status] || pay.status} </span> </td> <td className="p-4 text-right no-print flex items-center justify-end gap-2"> {((pay.status as 'pending' | 'success' | 'failed' | 'refunded') === 'pending' || (pay.status as 'pending' | 'success' | 'failed' | 'refunded') === 'failed') && ( <Button variant="primary" size="sm" onClick={() => handleOpenPayment(pay.id, pay.amount)} className="flex items-center gap-1.5 cursor-pointer bg-cyan-500 hover:bg-cyan-600 border-transparent shadow-[0_0_10px_rgba(6,182,212,0.3)]" > <CreditCard className="h-4 w-4" /> {t.patientBilling?.payNow || 'Pay Now'} </Button> )} <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(pay.id)} className="flex items-center gap-1.5 cursor-pointer" > <Download className="h-4 w-4" /> {t.patientBilling?.printReceipt || 'Print Receipt'} </Button> </td> </tr> ))} </tbody> </table> </div> ) : ( <div className="p-8"> <EmptyState icon={Receipt} title={t.patientBilling?.emptyTitle || "No Invoices logged"} description={t.patientBilling?.emptySub || "No transaction receipts matches search constraints."} /> </div> )} </div> <PaymentModal isOpen={isPaymentModalOpen} onClose={handleClosePayment} invoiceId={activeInvoice?.id || ''} amount={activeInvoice?.amount || 0} /> </div> );
 } 