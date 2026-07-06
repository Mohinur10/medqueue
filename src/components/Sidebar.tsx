"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../context/MedQueueContext';
 
import { usePathname, useRouter } from 'next/navigation';
 
import { useTranslation } from '../hooks/useTranslation';
 
import { LayoutDashboard, Building, Users, BrainCircuit, Receipt, Terminal, Settings, ChevronLeft, ChevronRight, Stethoscope, Calendar, FileHeart, UserSquare2, Sliders, Printer, FolderHeart, BookOpen, Layers } from 'lucide-react';
 
export const Sidebar: React.FC = () => { const { activeRole } = useMedQueue();
 const router = useRouter();
 const pathname = usePathname();
 const [isCollapsed, setIsCollapsed] = useState(false);
 const { t } = useTranslation();
 if (!activeRole) 
return null;
 
/*  Define links mapping based on user role */
const getNavLinks = () => { switch (activeRole) { case 'super_admin': 
return [ { name: t.sidebar.admin.dashboard, path: '/admin', icon: LayoutDashboard }, { name: t.sidebar.admin.clinics, path: '/admin/clinics', icon: Building }, { name: t.sidebar.admin.directors, path: '/admin/directors', icon: UserSquare2 }, { name: t.sidebar.admin.aiTower, path: '/admin/ai-tower', icon: BrainCircuit }, { name: t.sidebar.admin.payments, path: '/admin/payments', icon: Receipt }, { name: t.sidebar.admin.logs, path: '/admin/logs', icon: Terminal }, { name: t.sidebar.admin.articles, path: '/admin/articles', icon: BookOpen }, { name: t.sidebar.admin.settings, path: '/admin/settings', icon: Settings },];
 case 'clinic_director': 
return [ { name: t.sidebar.director.dashboard, path: '/director', icon: LayoutDashboard }, { name: t.sidebar.director.departments, path: '/director/departments', icon: Layers }, { name: t.sidebar.director.doctors, path: '/director/doctors', icon: Stethoscope }, { name: t.sidebar.director.schedules, path: '/director/schedules', icon: Calendar }, { name: t.sidebar.director.patients, path: '/director/patients', icon: Users }, { name: t.sidebar.director.queueSettings, path: '/director/queue-settings', icon: Sliders }, { name: t.sidebar.director.payments, path: '/director/payments', icon: Receipt }, { name: t.sidebar.director.reports, path: '/director/reports', icon: Printer }, { name: t.sidebar.director.settings, path: '/director/settings', icon: Settings },];
 case 'doctor': 
return [ { name: t.sidebar.doctor.console, path: '/doctor', icon: Stethoscope }, { name: t.sidebar.doctor.patients, path: '/doctor/patients', icon: FolderHeart }, { name: t.sidebar.doctor.calendar, path: '/doctor/calendar', icon: Calendar }, { name: t.sidebar.doctor.aiCopilot, path: '/doctor/ai-assistant', icon: BrainCircuit },];
 case 'patient': 
return [ { name: t.sidebar.patient.dashboard, path: '/patient', icon: LayoutDashboard }, { name: t.sidebar.patient.book, path: '/patient/book', icon: Calendar }, { name: t.sidebar.patient.family, path: '/patient/family', icon: Users }, { name: t.sidebar.patient.records, path: '/patient/history', icon: FileHeart }, { name: t.sidebar.patient.billing, path: '/patient/payments', icon: Receipt },];
 default: 
return [];
 } };
 const links = getNavLinks();
 
return ( <aside className={`bg-card/80 border-r border-border transition-all duration-300 flex flex-col justify-between sticky top-16 h-[calc(100vh-64px)] z-30 backdrop-blur-md no-print ${isCollapsed ? 'w-16' : 'w-64'}`} > {
/* Menu Header / Collapse button */
} <div className="flex flex-col flex-grow"> <div className="flex items-center justify-end p-4 border-b border-border/40"> <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded-md bg-secondary text-secondary-foreground border border-border text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors cursor-pointer" > {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />} </button> </div> {
/* Links Panel */
} <nav className="p-3 flex flex-col gap-1.5 flex-grow"> {links.map((link) => { const Icon = link.icon;
 
/* Check if active: exact path match or starts with path (excluding root dashboards) */
const isActive = pathname === link.path || (link.path !== '/admin' && link.path !== '/director' && link.path !== '/doctor' && link.path !== '/patient' && pathname.startsWith(link.path));
 
return ( <button key={link.path} onClick={() => router.push(link.path)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-cyan-500/10 to-transparent border-r-2 border-cyan-500 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:text-foreground' } ${isCollapsed ? 'justify-center' : 'justify-start'} `} > <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} /> {!isCollapsed && ( <span className="truncate">{link.name}</span> )} </button> );
 })} </nav> </div> {
/* Role Footer */
} {!isCollapsed && ( <div className="p-4 border-t border-slate-800/40 bg-muted/50 flex flex-col gap-1"> <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Access Scope</span> <span className="text-xs font-bold text-foreground truncate"> {activeRole?.replace('_', ' ').toUpperCase()} </span> </div> )} </aside> );
 };
 