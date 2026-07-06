"use client";
 
import React from 'react';
 
import { useRouter } from 'next/navigation';
 
import { Button } from '../components/ui/Button';
 
import { AlertCircle, Home } from 'lucide-react';
 
export default function NotFound() { const router = useRouter();
 
return ( <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden"> {
/* Background glow */
} <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" /> <div className="w-full max-w-md bg-card text-card-foreground/60 border border-cyan-500/15 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.1)] flex flex-col items-center text-center gap-6"> {
/* Warning Icon */
} <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.2)]"> <AlertCircle className="h-8 w-8 text-cyan-400" /> </div> {
/* Text */
} <div> <h1 className="font-bold text-2xl text-foreground tracking-tight"> Page Not Found </h1> <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mt-1.5"> Error Code: 404 </p> <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-[280px] mx-auto"> The clinic directory path or record you attempted to request does not exist or has been relocated. </p> </div> {
/* Actions */
} <div className="w-full mt-2"> <Button variant="primary" onClick={() => router.replace('/')} className="w-full flex items-center justify-center gap-2 cursor-pointer" > <Home className="h-4 w-4" /> Return to Safety </Button> </div> </div> </div> );
 } 