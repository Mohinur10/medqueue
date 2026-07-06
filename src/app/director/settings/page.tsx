"use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { Building, Settings, Clock, MapPin, Globe, Mail, Phone, ShieldCheck, ToggleRight, ToggleLeft } from 'lucide-react';
 
export default function SettingsDirector() { const { t: globalT } = useTranslation();
 const { currentUser, clinics, updateClinicProfile, triggerNotification } = useMedQueue();
 const clinicId = currentUser?.clinicId || 'clinic-1';
 const clinic = clinics.find(c => c.id === clinicId);
 
/*  Form states */
const [cName, setCName] = useState(clinic?.name || '');
 const [cPhone, setCPhone] = useState(clinic?.phone || '');
 const [cEmail, setCEmail] = useState(clinic?.email || '');
 const [cAddress, setCAddress] = useState(clinic?.address || '');
 const [cDesc, setCDesc] = useState(clinic?.description || '');
 const [cLat, setCLat] = useState(clinic?.location.lat.toString() || '41.3112');
 const [cLng, setCLng] = useState(clinic?.location.lng.toString() || '69.2882');
 const [wStart, setWStart] = useState(clinic?.workingHours.start || '08:00');
 const [wEnd, setWEnd] = useState(clinic?.workingHours.end || '18:00');
 
/*  Socials */
const [telegram, setTelegram] = useState(clinic?.socials?.telegram || '');
 const [instagram, setInstagram] = useState(clinic?.socials?.instagram || '');
 const [website, setWebsite] = useState(clinic?.socials?.website || '');
 
/*  Local notification settings toggles */
const [smsAlerts, setSmsAlerts] = useState(true);
 const [tgAlerts, setTgAlerts] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const handleSubmit = (e: React.FormEvent) => { e.preventDefault();
 setIsSaving(true);
 setTimeout(() => { setIsSaving(false);
 updateClinicProfile(clinicId, { name: cName, phone: cPhone, email: cEmail, address: cAddress, description: cDesc, workingHours: { start: wStart, end: wEnd }, location: { lat: parseFloat(cLat), lng: parseFloat(cLng) }, socials: { telegram, instagram, website } });
 triggerNotification(clinicId, 'success', 'Profile Updated', 'Clinic parameters updated successfully.');
 }, 800);
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> Clinic Profile Configuration </h1> <p className="text-xs text-muted-foreground mt-1"> Adjust branding assets, update operational coordinates, and toggle patient alerts. </p> </div> {
/* Grid panels */
} <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {
/* Left: General clinic forms */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl lg:col-span-2 flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <Building className="h-5 w-5 text-cyan-400" /> General Information </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"> <Input id="c-name" label="Clinic Name *" value={cName} onChange={(e) => setCName(e.target.value)} required /> <Input id="c-phone" label="Contact Phone *" value={cPhone} onChange={(e) => setCPhone(e.target.value)} required /> <Input id="c-email" label="Contact Email Address *" value={cEmail} onChange={(e) => setCEmail(e.target.value)} required /> <Input id="c-addr" label="Physical Address *" value={cAddress} onChange={(e) => setCAddress(e.target.value)} required /> </div> <div className="grid grid-cols-2 gap-4 text-xs"> <Input id="c-lat" label="Latitude Coordinate" value={cLat} onChange={(e) => setCLat(e.target.value)} icon={<MapPin className="h-4 w-4" />} /> <Input id="c-lng" label="Longitude Coordinate" value={cLng} onChange={(e) => setCLng(e.target.value)} icon={<MapPin className="h-4 w-4" />} /> </div> <div className="flex flex-col gap-1.5 text-xs"> <label className="text-xs font-semibold text-muted-foreground">Clinic Description</label> <textarea value={cDesc} onChange={(e) => setCDesc(e.target.value)} rows={3} className="w-full bg-card text-card-foreground/40 text-foreground placeholder-slate-500 text-sm border border-border rounded-lg p-3 focus:border-cyan-500/60" /> </div> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2 mt-2"> <Globe className="h-5 w-5 text-cyan-400" /> Socials & Links </h3> <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"> <Input id="c-website" label="Website Domain" value={website} placeholder="e.g. clinic.uz" onChange={(e) => setWebsite(e.target.value)} /> <Input id="c-telegram" label="Telegram Handle" value={telegram} placeholder="e.g. clinic_channel" onChange={(e) => setTelegram(e.target.value)} /> <Input id="c-instagram" label="Instagram Username" value={instagram} placeholder="e.g. clinic.uz" onChange={(e) => setInstagram(e.target.value)} /> </div> <Button type="submit" variant="primary" isLoading={isSaving} className="w-max font-bold mt-2 cursor-pointer" > Save Configuration </Button> </div> {
/* Right: Operational parameters */
} <div className="flex flex-col gap-6"> {
/* Working Hours */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <Clock className="h-5 w-5 text-cyan-400" /> Hours of Operation </h3> <div className="grid grid-cols-2 gap-4"> <Input id="w-start" label="Opening time" type="time" value={wStart} onChange={(e) => setWStart(e.target.value)} /> <Input id="w-end" label="Closing time" type="time" value={wEnd} onChange={(e) => setWEnd(e.target.value)} /> </div> </div> {
/* Alert toggles */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <Settings className="h-5 w-5 text-cyan-400" /> SMS / Telegram Patient Notifications </h3> <div className="flex flex-col gap-3"> <div className="flex justify-between items-center text-xs"> <div> <h4 className="font-bold text-foreground">SMS Booking Alerts</h4> <p className="text-[10px] text-muted-foreground mt-0.5">Send verification details via cellular SMS carriers</p> </div> <button type="button" onClick={() => setSmsAlerts(!smsAlerts)} className="cursor-pointer" > {smsAlerts ? <ToggleRight className="h-6 w-6 text-cyan-400" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />} </button> </div> <div className="flex justify-between items-center text-xs border-t border-border/40 pt-3"> <div> <h4 className="font-bold text-foreground">Telegram Bot Notifications</h4> <p className="text-[10px] text-muted-foreground mt-0.5">Send active queue ticket numbers via Telegram</p> </div> <button type="button" onClick={() => setTgAlerts(!tgAlerts)} className="cursor-pointer" > {tgAlerts ? <ToggleRight className="h-6 w-6 text-cyan-400" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />} </button> </div> </div> </div> </div> </form> </div> );
 } 