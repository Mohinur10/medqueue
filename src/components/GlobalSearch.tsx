
/* eslint-disable */
 "use client";
 
import React, { useState, useEffect, useRef } from 'react';
 
import { Search, User, Building, BookOpen, ChevronRight } from 'lucide-react';
 
import { useMedQueue } from '../context/MedQueueContext';
 
import { useTranslation } from '../hooks/useTranslation';
 
import { useRouter } from 'next/navigation';
 
export const GlobalSearch: React.FC = () => { const [query, setQuery] = useState('');
 const [isOpen, setIsOpen] = useState(false);
 const { clinics, doctors, patients, articles, activeRole } = useMedQueue();
 const { t } = useTranslation();
 const router = useRouter();
 const searchRef = useRef<HTMLDivElement>(null);
 
  /* Close when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
 } };
 document.addEventListener('mousedown', handleClickOutside);
 
return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);
 const results = { clinics: clinics.filter(c => c.name.toLowerCase().includes(query.toLowerCase())), doctors: doctors.filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.specialization.toLowerCase().includes(query.toLowerCase())), patients: activeRole === 'super_admin' || activeRole === 'clinic_director' || activeRole === 'doctor' ? patients.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) : [], articles: articles.filter(a => a.title.toLowerCase().includes(query.toLowerCase())) };
 const totalResults = results.clinics.length + results.doctors.length + results.patients.length + results.articles.length;
 const handleNavigate = (path: string) => { setIsOpen(false);
 setQuery('');
 router.push(path);
 };
 
return ( <div className="relative hidden md:block w-72" ref={searchRef}> <div className="relative flex items-center"> <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" /> <input type="text" value={query} onChange={(e) => { setQuery(e.target.value);
 if (e.target.value.length > 1) setIsOpen(true);
 else setIsOpen(false);
 }} onFocus={() => { if (query.length > 1) setIsOpen(true);
 }} placeholder={t.navbar?.searchPlaceholder || "Search..."} className="w-full bg-secondary text-secondary-foreground/60 border border-border rounded-lg pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors" /> </div> {isOpen && query.length > 1 && ( <div className="absolute top-full mt-2 w-96 bg-card text-card-foreground border border-border rounded-lg shadow-2xl overflow-hidden z-50"> <div className="max-h-96 overflow-y-auto"> {totalResults === 0 ? ( <div className="p-4 text-center text-xs text-muted-foreground">No results found for "{query}"</div> ) : ( <div className="py-2"> {
/* Clinics */
} {results.clinics.length > 0 && ( <div className="mb-2"> <div className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary text-secondary-foreground/50">Clinics</div> {results.clinics.map(c => ( <div key={c.id} onClick={() => handleNavigate(activeRole === 'super_admin' ? '/admin/clinics' : '/')} className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center justify-between group"> <div className="flex items-center gap-2"> <Building className="h-4 w-4 text-cyan-500" /> <span className="text-xs text-secondary-foreground ">{c.name}</span> </div> <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /> </div> ))} </div> )} {
/* Doctors */
} {results.doctors.length > 0 && ( <div className="mb-2"> <div className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary text-secondary-foreground/50">Doctors</div> {results.doctors.map(d => ( <div key={d.id} onClick={() => handleNavigate(activeRole === 'super_admin' ? '/admin/doctors' : activeRole === 'clinic_director' ? '/director/doctors' : '/')} className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center justify-between group"> <div className="flex items-center gap-2"> <User className="h-4 w-4 text-emerald-500" /> <div> <div className="text-xs text-secondary-foreground ">{d.name}</div> <div className="text-[10px] text-muted-foreground">{d.specialization}</div> </div> </div> <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /> </div> ))} </div> )} {
/* Patients */
} {results.patients.length > 0 && ( <div className="mb-2"> <div className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary text-secondary-foreground/50">Patients</div> {results.patients.map(p => ( <div key={p.id} onClick={() => handleNavigate(activeRole === 'doctor' ? '/doctor/patients' : '/')} className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center justify-between group"> <div className="flex items-center gap-2"> <User className="h-4 w-4 text-blue-500" /> <span className="text-xs text-secondary-foreground ">{p.name}</span> </div> <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /> </div> ))} </div> )} {
/* Articles */
} {results.articles.length > 0 && ( <div className="mb-0"> <div className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary text-secondary-foreground/50">Articles</div> {results.articles.map(a => ( <div key={a.id} onClick={() => handleNavigate('/patient')} className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center justify-between group"> <div className="flex items-center gap-2"> <BookOpen className="h-4 w-4 text-amber-500" /> <div> <div className="text-xs text-secondary-foreground line-clamp-1">{a.title}</div> <div className="text-[10px] text-muted-foreground">{a.category}</div> </div> </div> <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /> </div> ))} </div> )} </div> )} </div> </div> )} </div> );
 };
 