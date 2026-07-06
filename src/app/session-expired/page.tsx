"use client";
 
import { useTranslation } from '../../hooks/useTranslation';
 
import React from 'react';
 
import { useRouter } from 'next/navigation';
 
import { Button } from '../../components/ui/Button';
 
import { Hourglass, KeyRound } from 'lucide-react';
 
import { useMedQueue } from '../../context/MedQueueContext';
 
export default function SessionExpired() { const { t: globalT } = useTranslation();
 const router = useRouter();
 const { logout } = useMedQueue();
 const handleReauth = () => { logout();
 router.replace('/login');
 };
 
return ( <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden"> {
/* Background glow */
} <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" /> <div className="w-full max-w-md bg-card text-card-foreground/60 border border-amber-500/15 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_40px_rgba(245,158,11,0.1)] flex flex-col items-center text-center gap-6"> {
/* Hourglass Icon */
} <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex items-center justify-center animate-bounce shadow-[0_0_20px_rgba(245,158,11,0.2)]"> <Hourglass className="h-8 w-8 text-amber-400" /> </div> {
/* Text */
} <div> <h1 className="font-bold text-2xl text-foreground tracking-tight"> Session Expired </h1> <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-1.5"> Security Timeout </p> <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-[280px] mx-auto"> For patient confidentiality and system security, inactive clinical connections are automatically terminated after a set duration. </p> </div> {
/* Actions */
} <div className="w-full mt-2"> <Button variant="primary" onClick={handleReauth} className="w-full flex items-center justify-center gap-2 cursor-pointer" > <KeyRound className="h-4 w-4" /> Re-Authenticate Session </Button> </div> </div> </div> );
 } 