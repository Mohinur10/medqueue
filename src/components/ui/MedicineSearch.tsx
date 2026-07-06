"use client";
 
import React, { useState, useEffect, useRef } from 'react';
 
import { medicineDatabase } from '../../data/medicineDb';
 
import { Medicine } from '../../types';
 
import { Search, Plus } from 'lucide-react';
 interface MedicineSearchProps { onSelect: (medicine: Medicine) => void;
 placeholder?: string;
 } 
export const MedicineSearch: React.FC<MedicineSearchProps> = ({ onSelect, placeholder = "Search medicine (e.g. Paracetamol, Concor)..." }) => { const [query, setQuery] = useState('');
 const [results, setResults] = useState<Medicine[]>([]);
 const [isOpen, setIsOpen] = useState(false);
 const containerRef = useRef<HTMLDivElement>(null);
 
/* Filter medicines as user types */
useEffect(() => { if (query.trim() === '') { setResults([]);
 return;
 } const filtered = medicineDatabase.filter(med => med.name.toLowerCase().includes(query.toLowerCase()) || med.genericName.toLowerCase().includes(query.toLowerCase()) || med.category.toLowerCase().includes(query.toLowerCase()) );
 setResults(filtered);
 }, [query]);
 
/* Click outside listener */
useEffect(() => { const handleClickOutside = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) { setIsOpen(false);
 } };
 document.addEventListener('mousedown', handleClickOutside);
 
return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);
 const handleSelect = (medicine: Medicine) => { onSelect(medicine);
 setQuery('');
 setIsOpen(false);
 };
 
return ( <div ref={containerRef} className="relative w-full"> <div className="relative flex items-center"> <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" /> <input type="text" value={query} onChange={(e) => { setQuery(e.target.value);
 setIsOpen(true);
 }} onFocus={() => setIsOpen(true)} placeholder={placeholder} className="w-full bg-slate-900/50 text-foreground placeholder-slate-500 text-sm border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 transition-all duration-300 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30" /> </div> {isOpen && query.trim() !== '' && ( <div className="absolute left-0 right-0 mt-2 z-30 max-h-60 overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-lg shadow-[0_4px_25px_rgba(3,7,18,0.7)] backdrop-blur-xl divide-y divide-slate-800/50"> {results.length > 0 ? ( results.map((med) => ( <button key={med.id} type="button" onClick={() => handleSelect(med)} className="w-full text-left p-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors flex items-center justify-between group cursor-pointer" > <div> <div className="text-sm font-semibold text-foreground group-hover:text-cyan-400"> {med.name} </div> <div className="text-xs text-muted-foreground mt-0.5"> {med.genericName} • {med.strength} • {med.form} </div> </div> <div className="h-6 w-6 rounded-lg bg-slate-800/80 group-hover:bg-cyan-500/20 text-muted-foreground group-hover:text-cyan-400 flex items-center justify-center transition-colors"> <Plus className="h-3.5 w-3.5" /> </div> </button> )) ) : ( <div className="p-4 text-center text-sm text-muted-foreground"> No matching medicines found </div> )} </div> )} </div> );
 };
 