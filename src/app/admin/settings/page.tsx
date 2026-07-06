"use client";
 
import React, { useState, useRef } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { Settings, Download, Upload, Globe, Mail, Database, Info, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function SettingsAdmin() { const { activeLanguage, setLanguage, exportDatabase, importDatabase, triggerNotification, createAuditLog } = useMedQueue();
 const { t } = useTranslation();
 const fileInputRef = useRef<HTMLInputElement>(null);
 
/*  Form states */
const [smtpServer, setSmtpServer] = useState('smtp.medqueue.uz');
 const [smtpPort, setSmtpPort] = useState('587');
 const [smtpUser, setSmtpUser] = useState('no-reply@medqueue.uz');
 
/*  Trigger Backup Download */
const handleBackupExport = () => { const data = exportDatabase();
 const blob = new Blob([data], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `medqueue_backup_${new Date().toISOString().substring(0, 10)}.json`;
 link.click();
 URL.revokeObjectURL(url);
 triggerNotification('user-admin', 'success', (t.adminSettings as any)?.backupExportTitle || 'Backup Exported', (t.adminSettings as any)?.backupExportDesc || 'Local in-memory database downloaded.');
 };
 
/*  Trigger Backup Upload */
const handleBackupImportClick = () => { fileInputRef.current?.click();
 };
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0];
 if (!file) return;
 const reader = new FileReader();
 reader.onload = (event) => { const result = event.target?.result;
 if (typeof result === 'string') { const success = importDatabase(result);
 if (success) { triggerNotification('user-admin', 'success', (t.adminSettings as any)?.backupImportTitle || 'Database Restored', (t.adminSettings as any)?.backupImportDesc || 'System state hydrated successfully from archive.');
 
/*  Reload page to rehydrate UI setTimeout(() => */

 setTimeout(() => { window.location.reload(); }, 1000);
 } else { triggerNotification('user-admin', 'error', (t.adminSettings as any)?.backupErrorTitle || 'Restoration Error', (t.adminSettings as any)?.backupErrorDesc || 'The backup file is invalid or corrupted.');
 } } };
 reader.readAsText(file);
 };
 const handleSmtpSave = (e: React.FormEvent) => { e.preventDefault();
 createAuditLog('UPDATE_SMTP_CONFIG', `${(t.adminSettings as any)?.smtpUpdateLog || 'SMTP Server configuration updated to: '}${smtpServer}`);
 triggerNotification('user-admin', 'success', (t.adminSettings as any)?.configSavedTitle || 'Config Saved', (t.adminSettings as any)?.configSavedDesc || 'SMTP credentials updated successfully.');
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div> <h1 className="text-2xl font-bold text-foreground dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-colors"> {(t.adminSettings as any)?.title || 'Global System Settings'} </h1> <p className="text-xs text-muted-foreground mt-1 transition-colors"> {(t.adminSettings as any)?.subtitle || 'Configure multi-channel communication templates, manage database backups, and check system details.'} </p> </div> {
/* Settings Grid Panels */
} <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {
/* Localization & Backup */
} <div className="flex flex-col gap-6"> {
/* Backups Panel */
} <div className="bg-glass-card text-card-foreground p-5 rounded-2xl flex flex-col gap-4 border border-border/40 shadow-sm dark:shadow-none transition-colors"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2 transition-colors"> <Database className="h-5 w-5 text-primary" /> {(t.adminSettings as any)?.backupConsole || 'Backup & Restoration Console'} </h3> <p className="text-xs text-muted-foreground leading-relaxed transition-colors"> {(t.adminSettings as any)?.backupDesc || 'Export database configurations, clinics, medical staff, patients, and queue transaction logs as a local JSON file.'} </p> <div className="flex flex-wrap gap-3 mt-1"> <Button variant="primary" onClick={handleBackupExport} className="flex items-center gap-2 cursor-pointer font-bold" > <Download className="h-4.5 w-4.5" /> {(t.adminSettings as any)?.exportBackup || 'Create System Backup'} </Button> <Button variant="secondary" onClick={handleBackupImportClick} className="flex items-center gap-2 cursor-pointer font-bold" > <Upload className="h-4.5 w-4.5" /> {(t.adminSettings as any)?.importBackup || 'Restore System State'} </Button> <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" /> </div> <div className="flex items-center gap-2 p-3 bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-100 dark:border-cyan-500/15 rounded-xl text-muted-foreground text-xs mt-1 transition-colors"> <Info className="h-4.5 w-4.5 text-primary flex-shrink-0 transition-colors" /> <span>{(t.adminSettings as any)?.overwriteWarning || 'Restoring backups will overwrite the active session data.'}</span> </div> </div> {
/* Localization Panel */
} <div className="bg-glass-card text-card-foreground p-5 rounded-2xl flex flex-col gap-4 border border-border/40 shadow-sm dark:shadow-none transition-colors"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2 transition-colors"> <Globe className="h-5 w-5 text-primary transition-colors" /> {(t.adminSettings as any)?.languagePrefs || 'Portal Language Preferences'} </h3> <div className="flex items-center gap-3"> {(['en', 'ru', 'uz'] as const).map((lang) => ( <button key={lang} onClick={() => setLanguage(lang)} className={`flex-grow py-3 px-4 rounded-xl border text-xs font-bold transition-all duration-300 uppercase tracking-widest cursor-pointer ${activeLanguage === lang ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/35 text-primary dark:shadow-[0_0_15px_rgba(6,182,212,0.15)] shadow-sm' : 'bg-slate-50 dark:bg-slate-950/40 border-border text-muted-foreground hover:text-secondary-foreground dark:hover:text-foreground hover:bg-accent dark:hover:bg-card text-card-foreground/40'}`} > {lang === 'en' ? 'English (EN)' : lang === 'ru' ? 'Русский (RU)' : "O'zbekcha (UZ)"} </button> ))} </div> </div> </div> {
/* SMTP Mailer and System Info */
} <div className="flex flex-col gap-6"> {
/* SMTP Configuration Form */
} <div className="bg-glass-card text-card-foreground p-5 rounded-2xl flex flex-col gap-4 border border-border/40 shadow-sm dark:shadow-none transition-colors"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2 transition-colors"> <Mail className="h-5 w-5 text-primary transition-colors" /> {(t.adminSettings as any)?.smtpConfig || 'Global SMTP Configuration'} </h3> <form onSubmit={handleSmtpSave} className="flex flex-col gap-4"> <div className="grid grid-cols-2 gap-4"> <Input id="smtp-serv" label={(t.adminSettings as any)?.smtpServer || "SMTP Server Address"} placeholder="smtp.medqueue.uz" value={smtpServer} onChange={(e) => setSmtpServer(e.target.value)} /> <Input id="smtp-port" label={(t.adminSettings as any)?.smtpPort || "SMTP Server Port"} placeholder="587" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} /> </div> <Input id="smtp-email" label={(t.adminSettings as any)?.smtpUser || "Sender Address (No-Reply Email)"} placeholder="no-reply@medqueue.uz" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} /> <Button type="submit" variant="primary" className="w-max mt-1 font-bold cursor-pointer"> {(t.adminSettings as any)?.saveSmtp || 'Save SMTP Config'} </Button> </form> </div> {
/* System Information */
} <div className="bg-glass-card text-card-foreground p-5 rounded-2xl flex flex-col gap-4 border border-border/40 shadow-sm dark:shadow-none transition-colors"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2 transition-colors"> <Info className="h-5 w-5 text-primary transition-colors" /> {(t.adminSettings as any)?.systemEnv || 'SaaS Operational Environment'} </h3> <div className="flex flex-col gap-2 text-xs text-muted-foreground transition-colors"> <div className="flex justify-between border-b border-slate-100 pb-2 transition-colors"> <span>{(t.adminSettings as any)?.coreRelease || 'Core SaaS Release:'}</span> <span className="text-foreground font-bold font-mono transition-colors">v1.2.4-stable</span> </div> <div className="flex justify-between border-b border-slate-100 pb-2 transition-colors"> <span>{(t.adminSettings as any)?.framework || 'Framework Compiler:'}</span> <span className="text-foreground font-semibold transition-colors">Next.js 15.x + React 19.x</span> </div> <div className="flex justify-between border-b border-slate-100 pb-2 transition-colors"> <span>{(t.adminSettings as any)?.tailwind || 'Tailwind Engine version:'}</span> <span className="text-foreground font-semibold transition-colors">v4.0.0</span> </div> <div className="flex justify-between border-b border-slate-100 pb-2 transition-colors"> <span>{(t.adminSettings as any)?.diagnostic || 'Diagnostic Nodes Status:'}</span> <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 transition-colors"> <ShieldCheck className="h-4 w-4" /> {(t.adminSettings as any)?.secure || 'SECURE'} </span> </div> </div> </div> </div> </div> </div> );
 } 