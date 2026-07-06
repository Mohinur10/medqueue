"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { Input } from '../../../components/ui/Input';
 
import { mockUsers } from '../../../data/mockData';
 
import { Users, KeyRound, Ban, CheckCircle, Search, Building, Mail, Phone, Eye, Calendar, Clock } from 'lucide-react';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function DirectorsAdmin() { const { clinics, triggerNotification, createAuditLog } = useMedQueue();
 const { t } = useTranslation();
 
/*  State */
const [search, setSearch] = useState('');
 const [isResetOpen, setIsResetOpen] = useState(false);
 const [isDetailsOpen, setIsDetailsOpen] = useState(false);
 const [selectedDirector, setSelectedDirector] = useState<any>(null);
 const [newPassword, setNewPassword] = useState('');
 
/*  Local state for tracking suspended directors in memory */
const [suspendedDirectors, setSuspendedDirectors] = useState<string[]>([]);
 
/*  Filter mockUsers for directors */
const directors = mockUsers .filter(u => u.role === 'clinic_director') .map(dir => { 
/*  Find assigned clinic */
const clinic = clinics.find(c => c.directorId === dir.id || c.id === dir.clinicId);
 const isSuspended = suspendedDirectors.includes(dir.id);
 
return { ...dir, clinicName: clinic ? clinic.name : ((t.adminDirectors as any)?.unassignedClinic || 'Unassigned Clinic'), clinicLogo: clinic ? clinic.logo : '', status: isSuspended ? 'suspended' : 'active', lastLogin: '2026-07-01 10:20:41', loginHistory: [ { date: '2026-07-01 10:20:41', ip: '192.168.1.52' }, { date: '2026-06-30 09:15:22', ip: '192.168.1.52' }] };
 }) .filter(dir => dir.name.toLowerCase().includes(search.toLowerCase()) || dir.email.toLowerCase().includes(search.toLowerCase()) || dir.clinicName.toLowerCase().includes(search.toLowerCase()) );
 const handleToggleSuspend = (id: string, currentStatus: string) => { if (currentStatus === 'active') { setSuspendedDirectors(prev => [...prev, id]);
 createAuditLog('SUSPEND_DIRECTOR', `${(t.adminDirectors as any)?.suspendLog || 'Suspended director ID:'} ${id}`);
 triggerNotification('user-admin', 'warning', (t.adminDirectors as any)?.dirSuspended || 'Director Suspended', `${(t.adminDirectors as any)?.dirSuspendedMsg || 'Director ID'} ${id} ${(t.adminDirectors as any)?.hasBeenSuspended || 'has been suspended'}`);
 } else { setSuspendedDirectors(prev => prev.filter(item => item !== id));
 createAuditLog('ACTIVATE_DIRECTOR', `${(t.adminDirectors as any)?.activateLog || 'Activated director ID:'} ${id}`);
 triggerNotification('user-admin', 'success', (t.adminDirectors as any)?.dirActivated || 'Director Activated', `${(t.adminDirectors as any)?.dirActivatedMsg || 'Director ID'} ${id} ${(t.adminDirectors as any)?.hasBeenActivated || 'has been reactivated'}`);
 } };
 const handleResetSubmit = (e: React.FormEvent) => { e.preventDefault();
 if (!newPassword.trim()) return;
 setIsResetOpen(false);
 createAuditLog('RESET_DIRECTOR_PASSWORD', `Reset password for director: ${selectedDirector?.name}`);
 triggerNotification('user-admin', 'success', (t.adminDirectors as any)?.passUpdated || 'Password Updated', `${(t.adminDirectors as any)?.passUpdatedMsg || 'Temporary login key issued for'} ${selectedDirector?.name}.`);
 setNewPassword('');
 };
 const openResetModal = (dir: any) => { setSelectedDirector(dir);
 setIsResetOpen(true);
 };
 const openDetailsModal = (dir: any) => { setSelectedDirector(dir);
 setIsDetailsOpen(true);
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div> <h1 className="text-2xl font-bold text-foreground dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {(t.adminDirectors as any)?.title || 'Clinic Director Accounts'} </h1> <p className="text-xs text-muted-foreground mt-1 transition-colors"> {(t.adminDirectors as any)?.subtitle || 'Manage clinic director credentials, restrict portal accesses, and audit login telemetry histories.'} </p> </div> {
/* Filter Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass text-foreground p-4 rounded-xl border border-border/40 shadow-sm dark:shadow-none transition-colors"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground dark:text-muted-foreground pointer-events-none transition-colors" /> <input type="text" placeholder={(t.adminDirectors as any)?.searchPlaceholder || 'Search director name / clinic...'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-muted text-muted-foreground/50 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all outline-none" /> </div> </div> {
/* Directors Grid / Table */
} <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> {directors.map((dir) => ( <div key={dir.id} className="bg-glass-card text-card-foreground p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group border border-border dark:border-transparent shadow-sm dark:shadow-none transition-all hover:border-cyan-200 dark:hover:border-transparent"> {
/* Header info */
} <div className="flex items-start justify-between"> <div className="flex items-center gap-3"> <div className="h-12 w-12 rounded-full border border-border bg-slate-50 flex items-center justify-center font-bold text-primary text-lg shadow-none dark:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {dir.name.charAt(0)} </div> <div> <h3 className="font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"> {dir.name} </h3> <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{dir.id}</div> </div> </div> {
/* Status Badge */
} <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border transition-colors ${dir.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-destructive border-rose-200 dark:border-rose-500/20 shadow-none dark:shadow-[0_0_10px_rgba(244,63,94,0.1)]'}`} > {(t.adminClinics as any)?.[`${dir.status}Status`] || dir.status} </span> </div> {
/* Clinic Details */
} <div className="bg-slate-50 dark:bg-slate-950/40 border border-border/60 p-3 rounded-xl flex items-center gap-2.5 transition-colors"> <Building className="h-4.5 w-4.5 text-muted-foreground dark:text-muted-foreground transition-colors" /> <div> <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">{(t.adminDirectors as any)?.assignedClinic || 'Assigned Clinic'}</span> <span className="text-xs text-secondary-foreground font-semibold transition-colors">{dir.clinicName}</span> </div> </div> {
/* Telemetry info */
} <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground border-t border-border/40 pt-3 transition-colors"> <div className="flex flex-col gap-0.5"> <span className="text-muted-foreground">{(t.adminDirectors as any)?.contactEmail || 'Contact Email:'}</span> <span className="text-secondary-foreground font-medium truncate transition-colors">{dir.email}</span> </div> <div className="flex flex-col gap-0.5"> <span className="text-muted-foreground">{(t.adminDirectors as any)?.lastActive || 'Last Active:'}</span> <span className="text-secondary-foreground font-mono transition-colors">{dir.lastLogin}</span> </div> </div> {
/* Actions Bar */
} <div className="flex gap-2 border-t border-border/40 pt-3 mt-1 transition-colors"> <Button variant="ghost" size="sm" onClick={() => openDetailsModal(dir)} className="flex-grow flex items-center justify-center gap-1 cursor-pointer" > <Eye className="h-3.5 w-3.5" /> {(t.adminDirectors as any)?.detailsBtn || 'Details'} </Button> <Button variant="ghost" size="sm" onClick={() => openResetModal(dir)} className="flex-grow flex items-center justify-center gap-1 cursor-pointer" > <KeyRound className="h-3.5 w-3.5" /> {(t.adminDirectors as any)?.resetBtn || 'Reset'} </Button> <button onClick={() => handleToggleSuspend(dir.id, dir.status)} className={`px-3 py-1 text-xs rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${dir.status === 'active' ? 'bg-rose-50 dark:bg-rose-500/10 text-destructive border-rose-200 dark:border-rose-500/25 hover:bg-rose-100 dark:hover:bg-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'}`} > {dir.status === 'active' ? ( <> <Ban className="h-3.5 w-3.5" /> {(t.adminDirectors as any)?.suspendBtn || 'Suspend'} </> ) : ( <> <CheckCircle className="h-3.5 w-3.5" /> {(t.adminDirectors as any)?.activateBtn || 'Activate'} </> )} </button> </div> </div> ))} </div> {
/* Password Reset Modal */
} <Dialog isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} title={`${(t.adminDirectors as any)?.resetTitle || 'Reset Credentials for'} ${selectedDirector?.name}`} > <form onSubmit={handleResetSubmit} className="flex flex-col gap-4"> <p className="text-xs text-muted-foreground leading-relaxed transition-colors"> {(t.adminDirectors as any)?.resetDesc || 'Specify a temporary password for this director account. They will be forced to modify this credential on their subsequent login session.'} </p> <Input id="reset-dpass" label={(t.adminDirectors as any)?.tempPass || 'Temporary Passcode *'} type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /> <div className="flex gap-2 justify-end mt-2"> <Button type="button" variant="ghost" onClick={() => setIsResetOpen(false)}> {(t.adminDirectors as any)?.cancel || 'Cancel'} </Button> <Button type="submit" variant="primary"> {(t.adminDirectors as any)?.commitReset || 'Commit Reset Key'} </Button> </div> </form> </Dialog> {
/* Director Details & Login History Modal */
} <Dialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title={(t.adminDirectors as any)?.profileTelemetry || 'Director Profile Telemetry'} > <div className="flex flex-col gap-5"> {
/* Avatar Profile Grid */
} <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-border/60 transition-colors"> <div className="h-14 w-14 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/35 flex items-center justify-center text-primary text-xl font-bold transition-colors"> {selectedDirector?.name.charAt(0)} </div> <div> <h4 className="font-bold text-foreground text-base transition-colors">{selectedDirector?.name}</h4> <p className="text-xs text-muted-foreground mt-0.5">{selectedDirector?.clinicName}</p> </div> </div> {
/* Details */
} <div className="flex flex-col gap-2.5 text-xs text-secondary-foreground transition-colors"> <div className="flex items-center gap-2"> <Mail className="h-4 w-4 text-muted-foreground dark:text-muted-foreground transition-colors" /> <span>{(t as any).common?.email || 'Email'}: <strong className="text-foreground font-semibold">{selectedDirector?.email}</strong></span> </div> <div className="flex items-center gap-2"> <Phone className="h-4 w-4 text-muted-foreground dark:text-muted-foreground transition-colors" /> <span>{(t as any).common?.phone || 'Phone'}: <strong className="text-foreground font-semibold">{selectedDirector?.phone || ((t.adminDirectors as any)?.notConfigured || 'Not configured')}</strong></span> </div> <div className="flex items-center gap-2"> <Clock className="h-4 w-4 text-muted-foreground dark:text-muted-foreground transition-colors" /> <span>{(t.adminDirectors as any)?.lastActive || 'Last Active'}: <strong className="font-mono text-foreground font-semibold">{selectedDirector?.lastLogin}</strong></span> </div> </div> {
/* History */
} <div className="flex flex-col gap-2"> <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"> <Calendar className="h-4 w-4" /> {(t.adminDirectors as any)?.loginHistory || 'Login History Telemetry'} </h5> <div className="flex flex-col gap-2 divide-y divide-border/40 mt-1 transition-colors"> {selectedDirector?.loginHistory.map((item: any, i: number) => ( <div key={i} className="pt-2 flex justify-between text-xs font-mono text-muted-foreground transition-colors"> <span>{item.date}</span> <span className="text-primary transition-colors">{item.ip}</span> </div> ))} </div> </div> <div className="flex justify-end mt-2 border-t border-border/40 pt-4 transition-colors"> <Button variant="ghost" onClick={() => setIsDetailsOpen(false)}> {(t.adminDirectors as any)?.closeTelemetry || 'Close Telemetry'} </Button> </div> </div> </Dialog> </div> );
 } 