"use client";
 
import React, { useEffect, useState } from 'react';
 
import { useMedQueue } from '../../context/MedQueueContext';
 
import { useRouter } from 'next/navigation';
 
import { Activity } from 'lucide-react';
 
export default function DoctorLayout({ children }: { children: React.ReactNode }) { const { currentUser, activeRole } = useMedQueue();
 const router = useRouter();
 const [isAuthorized, setIsAuthorized] = useState(false);
 useEffect(() => { 
/* Check if user session has doctor scope */
 if (!currentUser || activeRole !== 'doctor') { router.replace('/unauthorized');
 } else { setIsAuthorized(true);
 } }, [currentUser, activeRole, router]);
 if (!isAuthorized) { 
return ( <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-background"> <div className="flex flex-col items-center gap-3"> <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center animate-spin"> <Activity className="h-5 w-5 text-cyan-400" /> </div> <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider"> Verifying Scope Credentials... </span> </div> </div> );
 } 
return ( <div className="h-[calc(100vh-64px)] overflow-y-auto"> {children} </div> );
 }
