"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMedQueue } from '../context/MedQueueContext';

export default function Home() {
  const router = useRouter();
  const { currentUser, activeRole } = useMedQueue();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    const role = activeRole || currentUser.role;
    if (role === 'super_admin') {
      router.replace('/admin');
    } else if (role === 'clinic_director') {
      router.replace('/director');
    } else if (role === 'doctor') {
      router.replace('/doctor');
    } else {
      router.replace('/patient');
    }
  }, [currentUser, activeRole, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
        <p className="text-muted-foreground font-semibold uppercase tracking-widest text-xs">Loading MedQueue...</p>
      </div>
    </div>
  );
}
