"use client";
 
import React, { useState } from 'react';
 
import { useRouter } from 'next/navigation';
 
import { useMedQueue } from '../../context/MedQueueContext';
 
import { Input } from '../../components/ui/Input';
 
import { Button } from '../../components/ui/Button';
 
import { Dialog } from '../../components/ui/Dialog';
 
import { Shield, UserPlus, Phone, Calendar, ArrowRight, ShieldAlert, Globe } from 'lucide-react';
 
import { useTranslation } from '../../hooks/useTranslation';
 
import { AuthService } from '../../services/authService';
 
import Link from 'next/link';
 
export default function RegisterPage() { const router = useRouter();
 const { activeLanguage, setLanguage, triggerNotification } = useMedQueue();
 const { t: globalT } = useTranslation();
 const t = globalT.register || {};
 
/*  Form State */
const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', dob: '', gender: 'MALE', password: '' });
 
/*  UI State */
const [isLoading, setIsLoading] = useState(false);
 const [isOtpOpen, setIsOtpOpen] = useState(false);
 const [otpCode, setOtpCode] = useState('');
 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };
 const handleRegisterInit = async (e: React.FormEvent) => { e.preventDefault();
 if (!formData.phone || !formData.password) { triggerNotification('system', 'error', 'Missing Fields', 'Iltimos telefon raqam va parolni kiriting.');
 return;
 } setIsLoading(true);
 
/*  Request Telegram OTP for Registration via Service Layer */
const res = await AuthService.registerPatient({ phone: formData.phone, password: formData.password });
 setIsLoading(false);
 if (res.success) { triggerNotification('system', 'success', 'Verification Required', res.message || 'Kod yuborildi');
 setIsOtpOpen(true);
 } else { triggerNotification('system', 'error', 'Registration Failed', res.message || 'Xatolik yuz berdi');
 } };
 const handleOtpVerify = async (e: React.FormEvent) => { e.preventDefault();
 setIsLoading(true);
 
/*  Verify OTP */
const authRes = await AuthService.verifyOTP(formData.phone, otpCode);
 setIsLoading(false);
 if (authRes.success) { setIsOtpOpen(false);
 triggerNotification('system', 'success', 'Account Activated', 'Tasdiqlandi. Iltimos login qiling.');
 router.push('/login');
 } else { triggerNotification('system', 'error', 'Verification Failed', authRes.message || "Kod noto'g'ri");
 } };
 
return ( <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden transition-colors duration-500 py-10 p-4"> {
/* Dynamic Background Glow Rings */
} <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" /> <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" /> <div className="z-10 w-full max-w-lg p-8 bg-card/80 dark:bg-card backdrop-blur-xl border border-border dark:border-cyan-500/15 rounded-3xl shadow-2xl dark:shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col gap-6"> {
/* Brand Header */
} <div className="flex flex-col items-center gap-3 text-center"> <div className="h-14 w-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/35 flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(6,182,212,0.2)]"> <UserPlus className="h-7 w-7 text-primary" /> </div> <div> <h1 className="font-bold text-2xl text-foreground tracking-tight"> {t.title || 'Create an Account'} </h1> <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto leading-relaxed"> {t.sub || 'Join MedQueue to book appointments securely via Telegram Verification.'} </p> </div> </div> <form onSubmit={handleRegisterInit} className="flex flex-col gap-5"> {
/* Grid for Name */
} <div className="grid grid-cols-2 gap-4"> <Input id="reg-firstname" label={t.firstName || 'First Name'} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" /> <Input id="reg-lastname" label={t.lastName || 'Last Name'} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" /> </div> <div className="grid grid-cols-1 gap-4"> <Input id="reg-phone" label={t.phoneLabel || 'Phone Number'} type="tel" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone className="h-4.5 w-4.5" />} placeholder="+998 90 123 45 67" required /> </div> <div className="grid grid-cols-2 gap-4"> <Input id="reg-dob" label={t.dobLabel || 'Date of Birth'} type="date" name="dob" value={formData.dob} onChange={handleChange} icon={<Calendar className="h-4.5 w-4.5" />} /> <div className="flex flex-col gap-1.5"> <label className="text-[11px] font-bold text-secondary-foreground uppercase tracking-wider ml-1"> {t.genderLabel || 'Gender'} </label> <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-card text-card-foreground/50 text-foreground placeholder-slate-400 text-sm border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/60 focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium" > <option value="MALE">{t.genderMale || 'Male'}</option> <option value="FEMALE">{t.genderFemale || 'Female'}</option> </select> </div> </div> <Input id="reg-password" label={t.passwordLabel || 'Secure Password'} type="password" name="password" value={formData.password} onChange={handleChange} icon={<Shield className="h-4.5 w-4.5" />} placeholder="••••••••" required /> <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3.5 mt-2 font-bold uppercase tracking-wide shadow-lg shadow-cyan-500/20" > {t.registerBtn || 'Register Account'} <ArrowRight className="h-4 w-4 ml-2" /> </Button> </form> <div className="pt-5 border-t border-border/80 text-center"> <p className="text-xs font-semibold text-muted-foreground"> {t.alreadyHave || 'Already have an account?'} <Link href="/login" className="ml-1.5 text-primary hover:text-cyan-700 dark:hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors"> {t.signInLink || 'Sign in'} </Link> </p> </div> {
/* Language Selection */
} <div className="flex justify-center items-center gap-4 text-xs font-bold bg-secondary dark:bg-card/50 py-2 rounded-full border border-border/50 w-max mx-auto px-6 mt-2"> <Globe className="h-3.5 w-3.5 text-muted-foreground" /> <button onClick={() => setLanguage('uz')} className={`cursor-pointer transition-colors ${activeLanguage === 'uz' ? 'text-primary' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'}`}>UZ</button> <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div> <button onClick={() => setLanguage('ru')} className={`cursor-pointer transition-colors ${activeLanguage === 'ru' ? 'text-primary' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'}`}>RU</button> <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div> <button onClick={() => setLanguage('en')} className={`cursor-pointer transition-colors ${activeLanguage === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'}`}>EN</button> </div> </div> {
/* OTP Verification Dialog for Registration */
} <Dialog isOpen={isOtpOpen} onClose={() => setIsOtpOpen(false)} title={t.otpTitle || 'Telegram Verification'} > <form onSubmit={handleOtpVerify} className="flex flex-col gap-6"> <div className="flex items-start gap-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl"> <div className="bg-cyan-500/10 p-2 rounded-lg mt-0.5"> <ShieldAlert className="h-5 w-5 text-primary flex-shrink-0" /> </div> <div> <h4 className="text-sm font-bold text-foreground mb-1">Verify Your Identity</h4> <p className="text-xs text-muted-foreground leading-relaxed"> {t.otpSub || 'A secure 6-digit code has been sent to your Telegram bot. Please enter it below to complete registration.'} </p> </div> </div> <div className="px-4"> <label className="text-xs font-bold text-secondary-foreground mb-2 block text-center uppercase tracking-wider"> {t.otpPrompt || 'Enter OTP Code'} </label> <input type="text" maxLength={6} placeholder="0 0 0 0 0 0" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-muted text-muted-foreground/50 text-foreground placeholder-slate-400 text-3xl font-mono tracking-[1em] text-center border-2 border-border rounded-xl py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all" required autoFocus /> <p className="text-center mt-3 text-[10px] text-muted-foreground opacity-50"> Secured by Telegram Bot Integration </p> </div> <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-border"> <Button type="button" variant="ghost" onClick={() => setIsOtpOpen(false)}> Cancel </Button> <Button type="submit" variant="primary" isLoading={isLoading} className="flex items-center gap-2"> {t.otpVerify || 'Verify & Complete'} <Shield className="h-4 w-4" /> </Button> </div> </form> </Dialog> </div> );
 } 