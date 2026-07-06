"use client";
 
import React, { useEffect } from 'react';
 
import { X } from 'lucide-react';
 
import { AnimatePresence, motion } from 'framer-motion';
 interface DialogProps { isOpen: boolean;
 onClose: () => void;
 title: string;
 children: React.ReactNode;
 size?: 'sm' | 'md' | 'lg' | 'xl';
 } 
export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children, size = 'md' }) => { 
/* Lock scroll when open */
useEffect(() => { if (isOpen) { document.body.style.overflow = 'hidden';
 } else { document.body.style.overflow = 'unset';
 } 
return () => { document.body.style.overflow = 'unset';
 };
 }, [isOpen]);
 
/* Escape key support */
useEffect(() => { const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose();
 };
 if (isOpen) { window.addEventListener('keydown', handleEscape);
 } 
return () => window.removeEventListener('keydown', handleEscape);
 }, [isOpen, onClose]);
 const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
 
return ( <AnimatePresence> {isOpen && ( <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto no-print"> {
/* Backdrop */
} <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/80 backdrop-blur-sm" /> {
/* Modal Container */
} <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} transition={{ type: 'spring', damping: 25, stiffness: 350 }} className={`relative w-full ${sizes[size]} bg-card text-card-foreground/90 border border-border dark:border-cyan-500/20 shadow-xl dark:shadow-[0_0_40px_rgba(6,182,212,0.25)] rounded-2xl overflow-hidden backdrop-blur-xl z-10 flex flex-col`} > {
/* Header */
} <div className="flex items-center justify-between p-5 border-b border-border"> <h3 className="text-lg font-bold text-foreground drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]"> {title} </h3> <button onClick={onClose} className="text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground p-1 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" > <X className="h-5 w-5" /> </button> </div> {
/* Content */
} <div className="p-6 overflow-y-auto max-h-[75vh]"> {children} </div> </motion.div> </div> )} </AnimatePresence> );
 };
 