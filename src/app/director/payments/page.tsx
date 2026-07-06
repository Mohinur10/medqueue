"use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Receipt, Search, Landmark, Edit, DollarSign, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
 interface ClinicPriceItem { id: string;
 serviceName: string;
 dept: string;
 price: number;
 } 
export default function PaymentsDirector() { const { t: globalT } = useTranslation();
 const { currentUser, payments, patients, triggerNotification, createAuditLog } = useMedQueue();
 const clinicId = currentUser?.clinicId || 'clinic-1';
 
/*  State */
const [search, setSearch] = useState('');
 const [isSavingPrice, setIsSavingPrice] = useState(false);
 
/*  Price List state */
const [prices, setPrices] = useState<ClinicPriceItem[]>([ { id: 'pr-1', serviceName: 'Cardiology Consultation', dept: 'Cardiology', price: 150000 }, { id: 'pr-2', serviceName: 'Pediatric Diagnostics', dept: 'Pediatrics', price: 120000 }, { id: 'pr-3', serviceName: 'Neurology Consultation', dept: 'Neurology', price: 180000 }, { id: 'pr-4', serviceName: 'General Checkup', dept: 'General Therapy', price: 90000 }]);
 
/*  Editing price */
const [editPriceId, setEditPriceId] = useState<string | null>(null);
 const [editPriceVal, setEditPriceVal] = useState('');
 
/*  Isolate payments */
const clinicPayments = payments .filter(p => p.clinicId === clinicId) .map(p => { const pat = patients.find(patItem => patItem.id === p.patientId);
 
return { ...p, patientName: pat ? pat.name : 'Unknown Patient' };
 }) .filter(p => p.patientName.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) );
 const handleEditPrice = (item: ClinicPriceItem) => { setEditPriceId(item.id);
 setEditPriceVal(item.price.toString());
 };
 const handleSavePrice = (id: string) => { if (!editPriceVal.trim() || isNaN(Number(editPriceVal))) return;
 setPrices(prev => prev.map(item => { if (item.id === id) { createAuditLog('UPDATE_CLINIC_PRICE', `Updated price for ${item.serviceName} to ${editPriceVal} UZS`);
 
return { ...item, price: Number(editPriceVal) };
 } 
return item;
 }));
 setEditPriceId(null);
 setEditPriceVal('');
 triggerNotification(clinicId, 'success', 'Price Updated', 'Clinic consultation tariff updated.');
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> Clinic Billing & Tariffs </h1> <p className="text-xs text-muted-foreground mt-1"> Configure consultation fees, access invoice summaries, and track payment receipts. </p> </div> {
/* Grid splits */
} <div className="grid grid-cols-1 xl:grid-cols-3 gap-6"> {
/* Left: Clinic Payments Table */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl xl:col-span-2 flex flex-col gap-4"> <div className="flex justify-between items-center border-b border-border pb-3"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2"> <Receipt className="h-4.5 w-4.5 text-cyan-400" /> Local Clinic Invoice Stream </h3> <div className="relative w-48"> <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" /> <input type="text" placeholder={globalT.navbar?.searchPlaceholder || 'Search'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card text-card-foreground/50 text-foreground placeholder-slate-500 text-[10px] border border-border rounded-lg py-1.5 pl-8 pr-3 focus:border-cyan-500/60" /> </div> </div> {clinicPayments.length > 0 ? ( <div className="overflow-x-auto"> <table className="w-full text-left border-collapse text-xs"> <thead> <tr className="border-b border-border text-muted-foreground text-[10px] font-bold uppercase tracking-wider"> <th className="pb-2">Invoice ID</th> <th className="pb-2">Patient</th> <th className="pb-2">Details</th> <th className="pb-2 text-right">Amount</th> <th className="pb-2">Status</th> </tr> </thead> <tbody className="divide-y divide-slate-800/40"> {clinicPayments.map((pay) => ( <tr key={pay.id} className="hover:bg-card text-card-foreground/10 transition-colors"> <td className="py-3 font-mono text-[9px] text-muted-foreground">{pay.id}</td> <td className="py-3 font-bold text-foreground">{pay.patientName}</td> <td className="py-3 text-muted-foreground max-w-[150px] truncate">{pay.description}</td> <td className="py-3 font-mono font-bold text-foreground text-right">{pay.amount.toLocaleString()} UZS</td> <td className="py-3"> <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1 w-max ${pay.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : pay.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`} > {pay.status === 'success' ? <CheckCircle className="h-2.5 w-2.5" /> : pay.status === 'failed' ? <XCircle className="h-2.5 w-2.5" /> : <AlertCircle className="h-2.5 w-2.5" />} {pay.status} </span> </td> </tr> ))} </tbody> </table> </div> ) : ( <EmptyState icon={Receipt} title="No Invoices logged" description="No local payments matching search constraints." /> )} </div> {
/* Right: Tariff Pricing List config */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <Landmark className="h-5 w-5 text-cyan-400" /> Tariff configurations </h3> <div className="flex flex-col gap-3"> {prices.map((item) => ( <div key={item.id} className="p-3.5 bg-card text-card-foreground/60 border border-border/80 rounded-xl flex items-center justify-between gap-3 text-xs"> <div> <h4 className="font-bold text-foreground">{item.serviceName}</h4> <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">{item.dept}</span> </div> <div className="flex items-center gap-2"> {editPriceId === item.id ? ( <div className="flex items-center gap-1"> <input type="text" value={editPriceVal} onChange={(e) => setEditPriceVal(e.target.value)} className="w-20 bg-slate-50 dark:bg-slate-950 text-foreground text-xs border border-cyan-500/50 rounded py-1 px-1.5 focus:outline-none" /> <button onClick={() => handleSavePrice(item.id)} className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 px-1 py-1 cursor-pointer" > Save </button> </div> ) : ( <> <span className="font-mono font-bold text-cyan-400">{item.price.toLocaleString()} UZS</span> <button onClick={() => handleEditPrice(item)} className="text-muted-foreground hover:text-cyan-400 p-1 cursor-pointer" > <Edit className="h-3.5 w-3.5" /> </button> </> )} </div> </div> ))} </div> </div> </div> </div> );
 } 