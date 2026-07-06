"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../context/MedQueueContext';
 
import { useRouter } from 'next/navigation';
 
import { Input } from '../../components/ui/Input';
 
import { Button } from '../../components/ui/Button';
 
import { Dialog } from '../../components/ui/Dialog';
 
import { Phone, Lock, Activity, ShieldAlert, Globe, ArrowRight } from 'lucide-react';
 
import { useTranslation } from '../../hooks/useTranslation';
 
import { AuthService } from '../../services/authService';
 
export default function Login() { const { login, activeLanguage, setLanguage, triggerNotification } = useMedQueue();
 const { t: globalT } = useTranslation();
 const t = globalT.login;
 const router = useRouter();
 
/*  Login Form States */
const [phone, setPhone] = useState('');
 const [password, setPassword] = useState('');
 const [rememberMe, setRememberMe] = useState(false);
 const [role, setRole] = useState<'super_admin' | 'clinic_director' | 'doctor' | 'patient'>('patient');
 
/*  UI Modal States */
const [isForgotOpen, setIsForgotOpen] = useState(false);
 const [isOtpOpen, setIsOtpOpen] = useState(false);
 const [otpCode, setOtpCode] = useState('');
 const [forgotPhone, setForgotPhone] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 
/*  Form Submit Handler */
const handleLoginSubmit = async (e: React.FormEvent) => { e.preventDefault();
 if (!phone.trim() || !password.trim()) { triggerNotification('system', 'error', 'Authentication Failed', 'Please provide both phone number and password.');
 return;
 } setIsLoading(true);
 
/*  Request Telegram OTP via the new Service Layer */
const res = await AuthService.requestTelegramOTP(phone, role);
 setIsLoading(false);
 if (res.success) { triggerNotification('system', 'success', 'OTP Sent', res.message || 'Kod Telegramingizga yuborildi');
 setIsOtpOpen(true);
 } else { triggerNotification('system', 'error', 'Failed', res.message || 'Could not request Telegram code.');
 } };
 const handleOtpVerify = async (e: React.FormEvent) => { e.preventDefault();
 setIsLoading(true);
 const authRes = await AuthService.verifyOTP(phone, otpCode);
 if (!authRes.success) { setIsLoading(false);
 triggerNotification('system', 'error', 'Verification Failed', authRes.message || "Noto'g'ri kod");
 return;
 } 
/*  After OTP success, complete the actual login process internally */
const success = await login(phone, role);
 setIsLoading(false);
 if (success) { setIsOtpOpen(false);
 triggerNotification('system', 'success', 'Authenticated', authRes.message || 'Muvaffaqiyatli kirdingiz');
 if (role === 'super_admin') router.replace('/admin');
 else if (role === 'clinic_director') router.replace('/director');
 else if (role === 'doctor') router.replace('/doctor');
 else router.replace('/patient');
 } else { setIsOtpOpen(false);
 triggerNotification('system', 'error', 'Access Denied', 'Xatolik yuz berdi.');
 } };
  /* handleQuickFill removed for security */
 const handleForgotSubmit = (e: React.FormEvent) => { e.preventDefault();
 if (!forgotPhone.trim()) return;
 setIsForgotOpen(false);
 triggerNotification('system', 'success', 'Recovery Sent', `Restoration code dispatched to ${forgotPhone}.`);
 setForgotPhone('');
 };
 
return ( <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500"> {
/* Dynamic Background Glow Rings */
} <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" /> <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" /> {
/* Main Container */
} <div className="w-full max-w-md bg-card/80 dark:bg-card border border-border dark:border-cyan-500/15 backdrop-blur-xl rounded-2xl p-8 shadow-2xl dark:shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col gap-6 z-10"> {
/* Brand Header */
} <div className="flex flex-col items-center gap-3 text-center"> <div className="h-14 w-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/35 flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(6,182,212,0.2)]"> <Activity className="h-7 w-7 text-primary" /> </div> <div> <h1 className="font-bold text-2xl text-foreground tracking-tight"> {t.title || 'MedQueue Portal'} </h1> <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto leading-relaxed"> {t.sub || 'Secure access requires Telegram verification'} </p> </div> </div> {
/* Input Form */
} <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4"> <div className="grid grid-cols-2 gap-2 p-1 bg-secondary border border-border rounded-xl"> {(['super_admin', 'clinic_director', 'doctor', 'patient'] as const).map((r) => ( <button key={r} type="button" onClick={() => setRole(r)} className={`text-[10px] py-2 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${role === r ? 'bg-card dark:bg-cyan-500/10 text-primary shadow-sm border border-border dark:border-cyan-500/25' : 'text-muted-foreground hover:text-secondary-foreground dark:hover:text-secondary-foreground border border-transparent' }`} > {r === 'super_admin' ? 'Admin' : r === 'clinic_director' ? 'Director' : r === 'doctor' ? 'Doctor' : 'Patient'} </button> ))} </div> <Input id="login-phone" label={(t as any).phoneLabel || 'Phone Number'} type="tel" placeholder="+998901234567" value={phone} onChange={(e) => setPhone(e.target.value)} icon={<Phone className="h-4.5 w-4.5" />} required /> <Input id="login-password" label={(t as any).passwordLabel || 'Password'} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="h-4.5 w-4.5" />} required /> {
/* Form Actions */
} <div className="flex items-center justify-between text-xs mt-1 px-1"> <label className="flex items-center gap-2 text-muted-foreground font-semibold cursor-pointer"> <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-border text-cyan-500 focus:ring-cyan-500/30 bg-card text-card-foreground" /> {t.remember || 'Remember me'} </label> <button type="button" onClick={() => setIsForgotOpen(true)} className="text-primary hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors font-semibold cursor-pointer" > {t.forgot || 'Forgot password?'} </button> </div> <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-3 font-bold uppercase tracking-wide cursor-pointer py-3 shadow-lg shadow-cyan-500/20" > {(t as any).signInBtn || 'Sign In securely'} </Button> <div className="mt-2 text-center"> <p className="text-xs text-muted-foreground"> New to the clinic? <button type="button" onClick={() => router.push('/register')} className="ml-1 text-primary font-bold hover:underline cursor-pointer" > Register as a Patient </button> </p> </div> </form> {
} <div className="flex justify-center items-center gap-4 text-xs font-bold mt-2 bg-secondary dark:bg-slate-950/50 py-2 rounded-full border border-border/50 w-max mx-auto px-6"> <Globe className="h-3.5 w-3.5 text-muted-foreground" /> <button onClick={() => setLanguage('uz')} className={`cursor-pointer transition-colors ${activeLanguage === 'uz' ? 'text-primary' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'}`} > UZ </button> <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div> <button onClick={() => setLanguage('ru')} className={`cursor-pointer transition-colors ${activeLanguage === 'ru' ? 'text-primary' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'}`} > RU </button> <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div> <button onClick={() => setLanguage('en')} className={`cursor-pointer transition-colors ${activeLanguage === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'}`} > EN </button> </div> </div> {
/* Forgot Password Dialog */
} <Dialog isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} title={t.forgotTitle || 'Reset Password'} > <form onSubmit={handleForgotSubmit} className="flex flex-col gap-5"> <p className="text-sm text-muted-foreground leading-relaxed bg-muted text-muted-foreground/50 p-4 rounded-xl border border-slate-100 "> {t.forgotSub || 'Enter your phone number and we will send a restoration code via Telegram.'} </p> <Input id="forgot-phone" label="Recovery Phone Number" type="tel" placeholder="+998901234567" value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)} icon={<Phone className="h-4.5 w-4.5" />} required /> <div className="flex gap-3 justify-end mt-2"> <Button type="button" variant="ghost" onClick={() => setIsForgotOpen(false)}> Cancel </Button> <Button type="submit" variant="primary"> {t.forgotBtn || 'Send Request'} </Button> </div> </form> </Dialog> {
/* OTP Verification Dialog */
} <Dialog isOpen={isOtpOpen} onClose={() => setIsOtpOpen(false)} title={t.otpTitle || 'Telegram Verification'} > <form onSubmit={handleOtpVerify} className="flex flex-col gap-6"> <div className="flex items-start gap-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl"> <div className="bg-cyan-500/10 p-2 rounded-lg mt-0.5"> <ShieldAlert className="h-5 w-5 text-primary flex-shrink-0" /> </div> <div> <h4 className="text-sm font-bold text-foreground mb-1">Authorization Required</h4> <p className="text-xs text-muted-foreground leading-relaxed"> {t.otpSub || 'A secure 6-digit code has been sent to your registered Telegram bot.'} </p> </div> </div> <div className="px-4"> <label className="text-xs font-bold text-secondary-foreground mb-2 block text-center uppercase tracking-wider"> {t.otpPrompt || 'Enter OTP Code'} </label> <input id="otp-token" type="text" maxLength={6} placeholder="0 0 0 0 0 0" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-muted text-muted-foreground/50 text-foreground placeholder-slate-400 text-3xl font-mono tracking-[1em] text-center border-2 border-border rounded-xl py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all" required autoFocus /> <p className="text-center mt-3 text-[10px] text-muted-foreground dark:text-muted-foreground opacity-50"> Secured by Telegram Bot Integration </p> </div> <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-border"> <Button type="button" variant="ghost" onClick={() => setIsOtpOpen(false)}> Cancel </Button> <Button type="submit" variant="primary" isLoading={isLoading} className="flex items-center gap-2"> {t.otpVerify || 'Verify & Login'} <ArrowRight className="h-4 w-4" /> </Button> </div> </form> </Dialog> </div> );
 } 