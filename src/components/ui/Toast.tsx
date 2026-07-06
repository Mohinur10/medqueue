"use client";
 
import React, { useEffect, useState } from 'react';
 
import { useMedQueue } from '../../context/MedQueueContext';
 
import { X, CheckCircle, AlertTriangle, AlertCircle, Bell } from 'lucide-react';
 
import { AnimatePresence, motion } from 'framer-motion';
 
export const ToastContainer: React.FC = () => { const { notifications } = useMedQueue();
 const [activeToasts, setActiveToasts] = useState<typeof notifications>([]);
 
/* Capture new notifications and render them as temporary toasts */
useEffect(() => { if (notifications.length > 0) { const latest = notifications[0];
 
/* notifications are unshifted (newest first) Check if it's already in active lists to prevent duplicates on state updates */
setActiveToasts(prev => { if (prev.some(t => t.id === latest.id)) 
return prev;
 
return [latest, ...prev].slice(0, 5);
 
/*  Max 5 toasts stacked */

 });
 
/* Auto-remove toast after 4 seconds */
const timer = setTimeout(() => { setActiveToasts(prev => prev.filter(t => t.id !== latest.id));
 }, 4000);
 
return () => clearTimeout(timer);
 } }, [notifications]);
 const removeToast = (id: string) => { setActiveToasts(prev => prev.filter(t => t.id !== id));
 };
 
return ( <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full no-print"> <AnimatePresence> {activeToasts.map((toast) => { const config = { success: { border: 'border-emerald-200 dark:border-emerald-500/30', bg: 'bg-card text-card-foreground/80', text: 'text-emerald-600 dark:text-emerald-400', glow: 'shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.15)]', icon: <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" /> }, warning: { border: 'border-amber-200 dark:border-amber-500/30', bg: 'bg-card text-card-foreground/80', text: 'text-amber-600 dark:text-amber-400', glow: 'shadow-sm dark:shadow-[0_0_15px_rgba(245,158,11,0.15)]', icon: <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" /> }, error: { border: 'border-rose-200 dark:border-rose-500/30', bg: 'bg-card text-card-foreground/80', text: 'text-destructive', glow: 'shadow-sm dark:shadow-[0_0_15px_rgba(244,63,94,0.15)]', icon: <AlertCircle className="h-5 w-5 text-destructive" /> }, reminder: { border: 'border-blue-200 dark:border-blue-500/30', bg: 'bg-card text-card-foreground/80', text: 'text-blue-600 dark:text-blue-400', glow: 'shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.15)]', icon: <Bell className="h-5 w-5 text-blue-500 dark:text-blue-400" /> } }[toast.type];
 
return ( <motion.div key={toast.id} layout initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }} className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${config.border} ${config.bg} ${config.glow}`} > <div className="flex-shrink-0 mt-0.5"> {config.icon} </div> <div className="flex-grow"> <h4 className="text-sm font-semibold text-foreground "> {toast.title} </h4> <p className="text-xs text-muted-foreground mt-1"> {toast.message} </p> </div> <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground p-0.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors" > <X className="h-4 w-4" /> </button> </motion.div> );
 })} </AnimatePresence> </div> );
 };
 