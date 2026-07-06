"use client";
 
import React from 'react';
 
import { MedQueueProvider, useMedQueue } from '../context/MedQueueContext';
 
import { ThemeProvider } from 'next-themes';
 
import { Navbar } from '../components/Navbar';
 
import { Sidebar } from '../components/Sidebar';
 
import { ToastContainer } from '../components/ui/Toast';
 
import { usePathname, useRouter } from 'next/navigation';
 const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => { const { currentUser, activeRole, isNavigating, setIsNavigating } = useMedQueue();
 const pathname = usePathname();
 const router = useRouter();
 const bypassLayoutPaths = [ '/login', '/register', '/unauthorized', '/session-expired', '/404', '/500'];
 const isBypassPath = bypassLayoutPaths.includes(pathname) || pathname === '/login';
 
/* Handle Navigation End */
React.useEffect(() => {
  if (isNavigating) setIsNavigating(false);
}, [pathname]);

/* The Strict Role-Based Access Control (RBAC) Route Guard was removed here. It is now securely enforced via Next.js Edge Middleware. */
 if (isBypassPath || !currentUser) { 
return ( <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300"> {children} <ToastContainer /> </div> );
 } 
return ( <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300"> <Navbar /> <div className="flex flex-row flex-grow"> <Sidebar /> <main className="flex-grow p-6 overflow-y-auto h-[calc(100vh-64px)] bg-background relative transition-colors duration-300"> {children} </main> </div> <ToastContainer /> </div> );
 };
 
export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
return ( <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}> <MedQueueProvider> <AppShell>{children}</AppShell> </MedQueueProvider> </ThemeProvider> );
 };
 