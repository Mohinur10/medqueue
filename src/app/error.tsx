"use client";
 
import React, { useEffect } from 'react';
 
import { Button } from '../components/ui/Button';
 
import { ShieldAlert, RefreshCw } from 'lucide-react';
 
export default function GlobalError({ error, reset, }: { error: Error & { digest?: string };
 reset: () => void;
 }) { useEffect(() => { 
/*  Log the error to an analytics service console.error(error);
 */

 }, [error]);
 
return ( <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden"> {
/* Background glow */
} <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" /> <div className="w-full max-w-md bg-card text-card-foreground/60 border border-rose-500/15 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_40px_rgba(244,63,94,0.1)] flex flex-col items-center text-center gap-6"> {
/* Error Icon */
} <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/35 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.2)]"> <ShieldAlert className="h-8 w-8 text-rose-400" /> </div> {
/* Text */
} <div> <h1 className="font-bold text-2xl text-foreground tracking-tight"> System Error </h1> <p className="text-xs text-rose-400 font-bold uppercase tracking-wider mt-1.5"> Error Code: 500 Internal Crash </p> <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-[280px] mx-auto"> The database stream encountered an unexpected boundary crash. Try resetting the active portal layout. </p> </div> {
/* Actions */
} <div className="w-full mt-2"> <Button variant="danger" onClick={() => reset()} className="w-full flex items-center justify-center gap-2 cursor-pointer" > <RefreshCw className="h-4 w-4" /> Reset Portal Layout </Button> </div> </div> </div> );
 } 