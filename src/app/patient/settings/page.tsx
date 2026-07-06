"use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { User2, Settings, ShieldAlert, Heart, Globe, KeyRound, CheckCircle } from 'lucide-react';
 
export default function SettingsPatient() { const { t: globalT } = useTranslation();
 const { currentUser, patients, triggerNotification, createAuditLog } = useMedQueue();
 const patientId = currentUser?.patientId || 'pat-1';
 const primaryPatient = patients.find(p => p.id === patientId);
 
/*  Form states */
const [pName, setPName] = useState(currentUser?.name || '');
 const [pPhone, setPPhone] = useState(currentUser?.phone || '');
 const [pEmail, setPEmail] = useState(currentUser?.email || '');
 const [pDob, setPDob] = useState(primaryPatient?.dob || '1995-10-10');
 const [pGender, setPGender] = useState(primaryPatient?.gender || 'male');
 const [emergencyName, setEmergencyName] = useState('Dilshod Karimov');
 const [emergencyPhone, setEmergencyPhone] = useState('+998901234567');
 const [insurancePolicy, setInsurancePolicy] = useState('POL-993-982-AA');
 const [insuranceProvider, setInsuranceProvider] = useState('Uzbekinvest Insurance');
 
/*  Change password */
const [oldPass, setOldPass] = useState('');
 const [newPass, setNewPass] = useState('');
 const [isSaving, setIsSaving] = useState(false);
 const [isSavingPass, setIsSavingPass] = useState(false);
 const handleSaveProfile = (e: React.FormEvent) => { e.preventDefault();
 setIsSaving(true);
 setTimeout(() => { setIsSaving(false);
 createAuditLog('UPDATE_PATIENT_PROFILE', 'Updated profile metadata');
 triggerNotification(currentUser?.id || 'system', 'success', 'Profile Updated', 'Your profile details were saved.');
 }, 800);
 };
 const handleChangePass = (e: React.FormEvent) => { e.preventDefault();
 if (!oldPass.trim() || !newPass.trim()) return;
 setIsSavingPass(true);
 setTimeout(() => { setIsSavingPass(false);
 setOldPass('');
 setNewPass('');
 createAuditLog('CHANGE_PATIENT_PASSWORD', 'Updated security passcode');
 triggerNotification(currentUser?.id || 'system', 'success', 'Password Updated', 'Your security passcode was changed.');
 }, 800);
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> Patient Account & Profile </h1> <p className="text-xs text-muted-foreground mt-1"> Adjust contact preferences, register emergency contacts, and modify security passwords. </p> </div> {
/* Grid forms */
} <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {
/* Left: General patient form (Col span 2) */
} <div className="lg:col-span-2 bg-glass p-5 rounded-2xl border border-border/40 flex flex-col gap-5"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <User2 className="h-5 w-5 text-cyan-400" /> General Information </h3> <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-xs"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <Input id="p-name" label="Full Name *" value={pName} onChange={(e) => setPName(e.target.value)} required /> <Input id="p-phone" label="Contact Phone *" value={pPhone} onChange={(e) => setPPhone(e.target.value)} required /> <Input id="p-email" label="Contact Email Address *" value={pEmail} onChange={(e) => setPEmail(e.target.value)} required /> <Input id="p-dob" label="Date of Birth *" type="date" value={pDob} onChange={(e) => setPDob(e.target.value)} required /> </div> <div className="flex flex-col gap-1.5 mt-2"> <label className="text-xs font-semibold text-muted-foreground">Biological Gender *</label> <select value={pGender} onChange={(e) => setPGender(e.target.value as any)} required className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer w-full" > <option value="male">Male</option> <option value="female">Female</option> </select> </div> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2 mt-4"> <Heart className="h-5 w-5 text-cyan-400" /> Emergency Contacts </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <Input id="p-emerg-name" label="Emergency Contact Person" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} /> <Input id="p-emerg-phone" label="Emergency Contact Phone" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} /> </div> <Button type="submit" variant="primary" isLoading={isSaving} className="w-max font-bold mt-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]" > Save Configuration </Button> </form> </div> {
/* Right: Insurance & Security password */
} <div className="flex flex-col gap-6"> {
/* Insurance */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl border border-border/40 flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <Settings className="h-5 w-5 text-cyan-400" /> Insurance Placeholder </h3> <div className="flex flex-col gap-3 text-xs"> <Input id="p-ins-prov" label="Insurance Provider" value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} /> <Input id="p-ins-policy" label="Policy Reference ID" value={insurancePolicy} onChange={(e) => setInsurancePolicy(e.target.value)} /> </div> </div> {
/* Security password reset */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl border border-border/40 flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <KeyRound className="h-5 w-5 text-cyan-400" /> Adjust Account Passcode </h3> <form onSubmit={handleChangePass} className="flex flex-col gap-3 text-xs"> <Input id="p-old-pass" label="Current Password *" type="password" placeholder="••••••••" value={oldPass} onChange={(e) => setOldPass(e.target.value)} required /> <Input id="p-new-pass" label="New Password *" type="password" placeholder="••••••••" value={newPass} onChange={(e) => setNewPass(e.target.value)} required /> <Button type="submit" variant="primary" isLoading={isSavingPass} className="w-full mt-2 font-bold cursor-pointer" > Change Passcode </Button> </form> </div> </div> </div> </div> );
 } 