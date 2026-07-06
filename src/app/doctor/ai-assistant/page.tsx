"use client";
 
import React, { useState } from 'react';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Sparkles, Search, BrainCircuit, Activity, AlertTriangle, CheckCircle, FileText, TrendingUp } from 'lucide-react';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
export default function AIAssistantPage() { const { t } = useTranslation();
 const [symptoms, setSymptoms] = useState('');
 const [loading, setLoading] = useState(false);
 const [result, setResult] = useState<any>(null);
 const handleAnalyze = (e: React.FormEvent) => { e.preventDefault();
 if (!symptoms.trim()) return;
 setLoading(true);
 setTimeout(() => { setLoading(false);
 setResult({ summary: "The patient presents symptoms highly congruent with cardiometabolic dysregulation, presenting elevated blood pressure risk profiles. Urgent diagnostic tests suggested to establish baseline constraints.", diagnoses: [ { code: "I10", name: "Essential Hypertension", confidence: "92%" }, { code: "E11", name: "Type 2 Diabetes Mellitus", confidence: "64%" }, { code: "I25.9", name: "Chronic Ischemic Heart Disease", confidence: "30%" }], tests: [ { name: "Lipid Profile Panel", type: "Biochemistry" }, { name: "Resting ECG Graph", type: "Radiology" }, { name: "HbA1c Blood Assay", type: "Blood count" }], risks: [ { name: "Cardiovascular Load", level: "High", color: "text-rose-400" }, { name: "Neuropathy Development", level: "Moderate", color: "text-amber-400" }], interactions: "Bisoprolol shows moderate synergy with Amlodipine. Monitor resting pulse rates carefully to avoid bradycardia." });
 }, 1200);
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.15)] flex items-center gap-2 transition-colors"> <BrainCircuit className="h-6 w-6 text-primary" /> {t.doctorAi?.title || 'AI Clinical Co-pilot'} </h1> <p className="text-xs text-muted-foreground mt-1"> {t.doctorAi?.subtitle || 'Consult machine learning models to map chief complaints, check drug interactions, and request diagnostic schedules.'} </p> </div> {
/* Main layout */
} <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"> {
/* Left Input (Col span 5) */
} <form onSubmit={handleAnalyze} className="lg:col-span-5 bg-glass text-foreground p-5 rounded-2xl border border-border/40 shadow-sm dark:shadow-none flex flex-col gap-4 transition-colors"> <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2 flex items-center gap-1 transition-colors"> <Sparkles className="h-4 w-4 text-primary" /> {t.doctorAi?.inputTitle || 'Symptoms & Symptoms History Input'} </h3> <div className="flex flex-col gap-1.5 text-xs"> <label className="text-secondary-foreground dark:text-muted-foreground font-semibold transition-colors">{t.doctorAi?.labelInput || 'Enter Symptoms Description *'}</label> <textarea placeholder={t.doctorAi?.placeholder || "e.g. Patient presents with elevated systolic pressure of 145/95, complaints of chronic vertigo, sleep apnea, or chest pressure..."} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={6} required className="w-full bg-muted text-muted-foreground/40 text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-sm border border-border rounded-lg p-3 focus:border-cyan-500/60 transition-colors" /> </div> <Button type="submit" variant="primary" isLoading={loading} className="w-full font-bold flex items-center justify-center gap-1.5 cursor-pointer" > <BrainCircuit className="h-4 w-4" /> {t.doctorAi?.btnAnalyze || 'Analyze Symptoms'} </Button> </form> {
/* Right Output (Col span 7) */
} <div className="lg:col-span-7 flex flex-col gap-6"> {result ? ( <div className="bg-glass text-foreground p-6 rounded-2xl border border-cyan-500/20 shadow-sm dark:shadow-none flex flex-col gap-5 transition-colors"> {
/* Clinical summary */
} <div> <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider transition-colors">{t.doctorAi?.summaryTitle || 'Clinical Insight Summary'}</h4> <p className="text-xs text-secondary-foreground leading-relaxed mt-1.5 bg-slate-50 dark:bg-slate-950/30 p-3 rounded-lg border border-border dark:border-slate-850 transition-colors"> {result.summary} </p> </div> {
/* Suggestions grid */
} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {
/* Diagnoses */
} <div className="flex flex-col gap-2"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block border-b border-border pb-1 transition-colors">{t.doctorAi?.diagnosesTitle || 'Differential Diagnoses'}</span> <div className="flex flex-col gap-2 mt-1"> {result.diagnoses.map((diag: any, i: number) => ( <div key={i} className="text-xs flex justify-between items-center"> <span className="text-foreground font-semibold transition-colors"> <strong className="text-primary font-mono mr-1">{diag.code}</strong> - {diag.name} </span> <span className="text-[10px] bg-muted text-muted-foreground border border-border text-primary px-1.5 py-0.5 rounded font-mono font-bold transition-colors"> {diag.confidence} </span> </div> ))} </div> </div> {
/* Lab recommendations */
} <div className="flex flex-col gap-2"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block border-b border-border pb-1 transition-colors">{t.doctorAi?.assaysTitle || 'Recommended Assays'}</span> <div className="flex flex-col gap-2 mt-1"> {result.tests.map((test: any, i: number) => ( <div key={i} className="text-xs flex justify-between"> <span className="text-foreground font-bold transition-colors">{test.name}</span> <span className="text-[9px] text-muted-foreground font-semibold">{test.type}</span> </div> ))} </div> </div> </div> {
/* Risks & Drug interaction Warnings */
} <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/40 pt-3 transition-colors"> {
/* Risks */
} <div className="flex flex-col gap-2"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">{t.doctorAi?.riskTitle || 'Risk Indicators'}</span> <div className="flex flex-col gap-2 mt-1"> {result.risks.map((risk: any, i: number) => ( <div key={i} className="text-xs flex justify-between"> <span className="text-foreground font-semibold transition-colors">{risk.name}</span> <span className={`font-bold uppercase tracking-wider text-[10px] ${risk.color}`}>{risk.level}</span> </div> ))} </div> </div> {
/* Interactions */
} <div className="flex flex-col gap-2"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block flex items-center gap-1 text-amber-500 dark:text-amber-400 transition-colors"> <AlertTriangle className="h-3.5 w-3.5" /> {t.doctorAi?.warnsTitle || 'Drug Interaction Warns'} </span> <p className="text-[10px] text-secondary-foreground dark:text-muted-foreground leading-normal mt-1 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/10 p-2 rounded-lg transition-colors"> {result.interactions} </p> </div> </div> </div> ) : ( <div className="h-72 flex items-center justify-center bg-glass text-foreground rounded-2xl border border-border/40 shadow-sm dark:shadow-none transition-colors"> <EmptyState icon={BrainCircuit} title={t.doctorAi?.emptyTitle || 'AI Idle'} description={t.doctorAi?.emptySub || 'Analysis details will populate here once you submit clinical symptoms.'} /> </div> )} </div> </div> </div> );
 } 