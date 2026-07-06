"use client";
 
import React, { useState, useEffect } from 'react';
 
import { useMedQueue } from '../context/MedQueueContext';
 
import { Bell, Globe, LogOut, ShieldAlert, User as UserIcon, Activity, Sun, Moon } from 'lucide-react';
 
import { useRouter } from 'next/navigation';
 
import { useTranslation } from '../hooks/useTranslation';
 
import { useTheme } from 'next-themes';
 
import { GlobalSearch } from './GlobalSearch';
 
export const Navbar: React.FC = () => { const { currentUser, activeRole, developerMode, login, logout, activeLanguage, setLanguage, notifications, markNotificationsAsRead, isNavigating, setIsNavigating } = useMedQueue();
 const { t } = useTranslation();
 const { theme, setTheme } = useTheme();
 const [mounted, setMounted] = useState(false);
 const router = useRouter();
 const [showLangMenu, setShowLangMenu] = useState(false);
 const [showNotifMenu, setShowNotifMenu] = useState(false);
 const [showProfileMenu, setShowProfileMenu] = useState(false);
 useEffect(() => { setMounted(true);
 }, []);
 const unreadCount = notifications.filter(n => !n.read).length;
 const handleRoleSwitch = async (role: 'super_admin' | 'clinic_director' | 'doctor' | 'patient') => { let email = '';
 switch (role) { case 'super_admin': email = 'admin@medqueue.uz';
 break;
 case 'clinic_director': email = 'director@shifo.uz';
 break;
 case 'doctor': email = 'doctor.toshmatov@medqueue.uz';
 break;
 case 'patient': email = 'patient.karimov@medqueue.uz';
 break;
 } setIsNavigating(true);
  const success = await login(email, role);
  if (success) { 
 /*  Use soft redirect with transition state */
 if (role === 'super_admin') router.replace('/admin');
  else if (role === 'clinic_director') router.replace('/director');
  else if (role === 'doctor') router.replace('/doctor');
  else router.replace('/patient');
  } else {
    setIsNavigating(false);
  } };
 const handleLogout = () => { logout();
 router.push('/login');
 };
 const langNames = { en: 'English (EN)', ru: 'Русский (RU)', uz: "O'zbekcha (UZ)" };
 
return ( <nav className="h-16 border-b border-border bg-card/80 dark:bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 no-print transition-colors duration-300"> {
/* Brand / Logo */
} <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}> <div className="h-8 w-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/35 flex items-center justify-center shadow-sm dark:shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-colors"> <Activity className="h-4 w-4 text-primary" /> </div> <span className="font-bold text-lg text-foreground tracking-tight transition-colors"> Med<span className="text-primary drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-colors">Queue</span> </span> </div> {
/* Global Search Omnibar */
} {currentUser && ( <div className="flex-grow flex justify-center px-8"> <GlobalSearch /> </div> )} {
/* Action Bar */
} <div className="flex items-center gap-4"> {
/* Role Switcher (For Demo grading) */
} {developerMode && ( <div className="flex items-center bg-secondary text-secondary-foreground/60 border border-border rounded-lg p-1 transition-colors"> <span className="text-xs text-muted-foreground px-2 font-semibold uppercase hidden md:inline">Demo Role:</span> {(['super_admin', 'clinic_director', 'doctor', 'patient'] as const).map((role) => ( <button key={role} onClick={() => handleRoleSwitch(role)} className={`text-xs px-2.5 py-1 rounded-md transition-all duration-300 font-semibold cursor-pointer ${activeRole === role ? 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/20 shadow-sm' : 'text-muted-foreground hover:text-secondary-foreground dark:hover:text-foreground hover:bg-slate-200 ' }`} > {role === 'super_admin' ? t.navbar.superAdmin : role === 'clinic_director' ? t.navbar.clinicDirector : role === 'doctor' ? t.navbar.doctor : t.navbar.patient} </button> ))} </div> )} {
/* Theme Toggle */
} <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-9 w-9 rounded-lg bg-secondary text-secondary-foreground/60 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:bg-slate-200 transition-colors cursor-pointer" > {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} </button> {
/* Language Selector */
} <div className="relative"> <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 h-9 px-3 rounded-lg bg-secondary text-secondary-foreground/60 border border-border text-secondary-foreground hover:bg-slate-200 transition-colors cursor-pointer" > <Globe className="h-4.5 w-4.5" /> <span className="text-xs font-semibold uppercase">{activeLanguage}</span> </button> {showLangMenu && ( <div className="absolute top-12 right-0 w-40 bg-card text-card-foreground border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50"> {(['en', 'ru', 'uz'] as const).map(lang => ( <button key={lang} onClick={() => { setLanguage(lang);
 setShowLangMenu(false);
 }} className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${activeLanguage === lang ? 'bg-cyan-50 dark:bg-cyan-500/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-slate-50 ' }`} > {langNames[lang]} </button> ))} </div> )} </div> {
/* Notifications Bell */
} <div className="relative"> <button onClick={() => setShowNotifMenu(!showNotifMenu)} className="h-9 w-9 rounded-lg bg-secondary text-secondary-foreground/60 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:bg-slate-200 transition-colors relative cursor-pointer" > <Bell className="h-4 w-4" /> {unreadCount > 0 && ( <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-950"> {unreadCount} </span> )} </button> {showNotifMenu && ( <div className="absolute top-12 right-0 w-80 bg-card text-card-foreground border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50"> <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted text-muted-foreground/50"> <span className="font-semibold text-sm text-foreground ">{t.navbar?.notifications || 'Notifications'}</span> {unreadCount > 0 && ( <button onClick={markNotificationsAsRead} className="text-[10px] text-primary hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold cursor-pointer" > Mark read </button> )} </div> <div className="max-h-[300px] overflow-y-auto"> {notifications.length === 0 ? ( <div className="p-8 text-center text-muted-foreground text-xs"> {t.navbar?.noNotifications || 'No new notifications'} </div> ) : ( notifications.map(notif => ( <div key={notif.id} className={`p-4 border-b border-border/30 last:border-0 transition-colors ${notif.read ? 'bg-card dark:bg-transparent opacity-60' : 'bg-secondary'}`} > <div className="flex items-start gap-3"> <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${notif.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''} ${notif.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''} ${notif.type === 'error' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : ''} ${notif.type === 'reminder' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : ''} `} /> <div className="flex flex-col gap-1"> <span className="text-xs font-semibold text-foreground ">{notif.title}</span> <span className="text-[11px] text-muted-foreground leading-relaxed">{notif.message}</span> <span className="text-[9px] text-muted-foreground dark:text-muted-foreground mt-1">{new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> </div> </div> </div> )) )} </div> </div> )} </div> {
/* Profile Dropper */
} {currentUser && ( <div className="relative"> <button onClick={() => { setShowProfileMenu(!showProfileMenu);
 setShowLangMenu(false);
 setShowNotifMenu(false);
 }} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-card transition-colors text-left cursor-pointer" > <img src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80"} alt="Avatar" 
 className="h-8 w-8 rounded-full border border-border bg-secondary" /> <div className="hidden lg:block"> <div className="text-xs font-bold text-foreground line-clamp-1">{currentUser.name}</div> <div className="text-[10px] font-medium text-cyan-400/80 tracking-wide uppercase mt-0.5"> {activeRole?.replace('_', ' ')} </div> </div> </button> {showProfileMenu && ( <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl py-1 z-50"> <div className="px-4 py-2 border-b border-border"> <p className="text-[10px] text-muted-foreground font-semibold uppercase">Account ID</p> <p className="text-xs text-foreground font-mono mt-0.5">{currentUser.id}</p> </div> <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer" > <LogOut className="h-4 w-4" /> {t.navbar.signOut} </button> </div> )} </div> )} </div> </nav> );
 };
 