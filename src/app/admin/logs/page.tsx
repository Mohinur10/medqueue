"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Terminal, Search, Download, Trash2, Calendar, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function AuditLogsAdmin() { const { auditLogs, triggerNotification, createAuditLog } = useMedQueue();
 const { t } = useTranslation();
 
/*  Filters State */
const [search, setSearch] = useState('');
 const [actionFilter, setActionFilter] = useState('all');
 const [roleFilter, setRoleFilter] = useState('all');
 
/*  Filter logs list */
const filteredLogs = auditLogs .filter(log => log.details.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase()) || log.userId.toLowerCase().includes(search.toLowerCase()) ) .filter(log => actionFilter === 'all' || log.action === actionFilter) .filter(log => roleFilter === 'all' || log.userRole === roleFilter);
 
/*  Extract unique actions for filter dropdown */
const uniqueActions = Array.from(new Set(auditLogs.map(l => l.action)));
 const handleExportCSV = () => { const headers = 'Log ID,Timestamp,User ID,User Role,Action,Details,IP Address\n';
 const rows = filteredLogs.map(log => `"${log.id}","${log.timestamp}","${log.userId}","${log.userRole}","${log.action}","${log.details}","${log.ipAddress}"` ).join('\n');
 const blob = new Blob([headers + rows], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `medqueue_audit_logs_${Date.now()}.csv`;
 link.click();
 URL.revokeObjectURL(url);
 triggerNotification('user-admin', 'success', (t.adminLogs as any)?.exportSuccess || 'Export Success', (t.adminLogs as any)?.csvExportMsg || 'Audit logs downloaded in CSV format.');
 };
 const handleExportJSON = () => { const jsonString = JSON.stringify(filteredLogs, null, 2);
 const blob = new Blob([jsonString], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `medqueue_audit_logs_${Date.now()}.json`;
 link.click();
 URL.revokeObjectURL(url);
 triggerNotification('user-admin', 'success', (t.adminLogs as any)?.exportSuccess || 'Export Success', (t.adminLogs as any)?.jsonExportMsg || 'Audit logs downloaded in JSON format.');
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {(t.adminLogs as any)?.title || 'Security Audit Logs'} </h1> <p className="text-xs text-muted-foreground mt-1 transition-colors"> {(t.adminLogs as any)?.subtitle || 'System audit trail. Raw administrative telemetry, auth events, and clinic configuration logs.'} </p> </div> <div className="flex gap-2"> <Button variant="secondary" size="sm" onClick={handleExportCSV} className="flex items-center gap-1.5 cursor-pointer font-semibold" > <Download className="h-4 w-4" /> {(t.adminLogs as any)?.exportCSVBtn || 'CSV Log'} </Button> <Button variant="secondary" size="sm" onClick={handleExportJSON} className="flex items-center gap-1.5 cursor-pointer font-semibold" > <Download className="h-4 w-4" /> {(t.adminLogs as any)?.exportJSONBtn || 'JSON Log'} </Button> </div> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass text-foreground p-4 rounded-xl border border-border/40 shadow-sm dark:shadow-none transition-colors"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground dark:text-muted-foreground pointer-events-none transition-colors" /> <input type="text" placeholder={(t.adminLogs as any)?.searchPlaceholder || 'Search details / user ID...'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-muted text-muted-foreground/50 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all outline-none" /> </div> <div className="flex flex-wrap items-center gap-3 w-full md:w-auto"> {
/* Action Filter */
} <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="bg-muted text-muted-foreground border border-border text-secondary-foreground text-xs rounded-lg p-2 focus:border-cyan-500/60 transition-colors cursor-pointer outline-none" > <option value="all">{(t.adminLogs as any)?.allActions || 'All Actions'}</option> {uniqueActions.map(act => ( <option key={act} value={act}>{act}</option> ))} </select> {
/* Role Filter */
} <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-muted text-muted-foreground border border-border text-secondary-foreground text-xs rounded-lg p-2 focus:border-cyan-500/60 transition-colors cursor-pointer outline-none" > <option value="all">{(t.adminLogs as any)?.allRoles || 'All Roles Scope'}</option> <option value="super_admin">{(t.adminLogs as any)?.superAdmins || 'Super Admins'}</option> <option value="clinic_director">{(t.adminLogs as any)?.clinicDirectors || 'Clinic Directors'}</option> <option value="doctor">{(t.adminLogs as any)?.doctors || 'Doctors'}</option> <option value="patient">{(t.adminLogs as any)?.patients || 'Patients'}</option> </select> </div> </div> {
/* Terminal Audit Log Console */
} <div className="bg-slate-100 dark:bg-slate-950 border border-border rounded-2xl p-6 font-mono text-xs shadow-sm dark:shadow-2xl relative overflow-hidden flex flex-col gap-4 transition-colors"> {
/* Terminal Header */
} <div className="flex items-center justify-between border-b border-border /80 pb-3 no-print transition-colors"> <div className="flex items-center gap-1.5"> <span className="h-3 w-3 rounded-full bg-rose-500" /> <span className="h-3 w-3 rounded-full bg-amber-500" /> <span className="h-3 w-3 rounded-full bg-emerald-500" /> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-3 flex items-center gap-1.5 transition-colors"> <Terminal className="h-4 w-4" /> medqueue_audit_stream.sh </span> </div> <span className="text-[10px] text-secondary-foreground dark:text-muted-foreground font-semibold transition-colors">{filteredLogs.length} {(t.adminLogs as any)?.recordsHydrated || 'Records Hydrated'}</span> </div> {
/* Console stream content */
} <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-2 divide-y divide-slate-200 dark:divide-slate-900/60 transition-colors"> {filteredLogs.length > 0 ? ( filteredLogs.map((log) => ( <div key={log.id} className="pt-3.5 pb-1 flex flex-col md:flex-row md:items-start justify-between gap-3 text-secondary-foreground transition-colors"> <div className="flex flex-col gap-1.5 flex-grow"> <div className="flex flex-wrap items-center gap-2"> <span className="text-primary font-bold text-[10px] tracking-wide transition-colors"> [{log.timestamp}] </span> <span className="text-destructive font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded bg-card text-card-foreground border border-border transition-colors"> {log.action} </span> <span className="text-muted-foreground font-semibold transition-colors">{(t.adminLogs as any)?.user || 'User:'}</span> <span className="text-foreground font-bold transition-colors">{log.userId}</span> </div> <p className="text-muted-foreground text-xs leading-relaxed pl-1 border-l-2 border-border transition-colors"> {log.details} </p> </div> <div className="flex flex-col md:items-end justify-between gap-1 text-[10px] text-muted-foreground font-semibold"> <div className="flex items-center gap-1.5 uppercase"> <span>{(t.adminLogs as any)?.roleScope || 'Role Scope:'}</span> <span className="text-indigo-600 dark:text-indigo-400 font-bold transition-colors">{log.userRole.replace('_', ' ')}</span> </div> <div className="flex items-center gap-1.5"> <span>{(t.adminLogs as any)?.ipNodes || 'IP Nodes:'}</span> <span className="text-muted-foreground font-mono transition-colors">{log.ipAddress}</span> </div> </div> </div> )) ) : ( <div className="py-12"> <EmptyState icon={Terminal} title={(t.adminLogs as any)?.emptyTitle || 'Log Stream Empty'} description={(t.adminLogs as any)?.emptyDesc || 'No operational audit entries matched active filter constraints.'} /> </div> )} </div> </div> </div> );
 } 