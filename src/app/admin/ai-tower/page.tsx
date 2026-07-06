"use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState, useEffect } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { BrainCircuit, Cpu, ShieldCheck, Play, Square, Settings, Sliders, TrendingUp } from 'lucide-react';
 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
 
import { Skeleton } from '../../../components/ui/Skeleton';
 
export default function AiControlTower() { const { t: globalT } = useTranslation();
 const { triggerNotification, createAuditLog } = useMedQueue();
 const [isMounted, setIsMounted] = useState(false);
 
/*  AI Configurations State */
const [aiEnabled, setAiEnabled] = useState(true);
 const [diagnosisEnabled, setDiagnosisEnabled] = useState(true);
 const [triageEnabled, setTriageEnabled] = useState(false);
 const [tokenBudget, setTokenBudget] = useState(50);
 
/*  in millions */
const [selectedModel, setSelectedModel] = useState('medical-gemini-3.5-flash');
 useEffect(() => { setIsMounted(true);
 }, []);
 if (!isMounted) { 
return ( <div className="flex flex-col gap-6 w-full"> <Skeleton variant="rect" className="h-40" /> <Skeleton variant="rect" className="h-80" /> </div> );
 } const handleToggleAi = () => { const nextState = !aiEnabled;
 setAiEnabled(nextState);
 createAuditLog('TOGGLE_AI_ENGINE', `Set global AI engine active status to: ${nextState}`);
 triggerNotification( 'user-admin', nextState ? 'success' : 'warning', nextState ? 'AI Core Online' : 'AI Core Suspended', nextState ? 'Global clinical diagnostics tools have resumed.' : 'AI modules are globally offline.' );
 };
 
/*  Mock Telemetry Data */
const latencyData = [ { day: 'Mon', latency: 45 }, { day: 'Tue', latency: 42 }, { day: 'Wed', latency: 38 }, { day: 'Thu', latency: 51 }, { day: 'Fri', latency: 44 }, { day: 'Sat', latency: 32 }, { day: 'Sun', latency: 30 }];
 const successRateData = [ { day: 'Mon', success: 99.7 }, { day: 'Tue', success: 99.8 }, { day: 'Wed', success: 99.9 }, { day: 'Thu', success: 99.6 }, { day: 'Fri', success: 99.8 }, { day: 'Sat', success: 99.9 }, { day: 'Sun', success: 99.9 }];
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> AI Control Tower </h1> <p className="text-xs text-muted-foreground mt-1"> Global medical NLP routing telemetry, ICD-10 categorization nodes, and model parameter scopes. </p> </div> {
/* Global Toggle button */
} <button onClick={handleToggleAi} className={`px-4 py-2 text-xs rounded-lg border font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${aiEnabled ? 'bg-rose-500/10 text-rose-400 border-rose-500/35 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35 hover:bg-emerald-500/20'}`} > {aiEnabled ? ( <> <Square className="h-4 w-4 fill-current" /> Suspend AI Core </> ) : ( <> <Play className="h-4 w-4 fill-current" /> Activate AI Core </> )} </button> </div> {
/* Main configuration and overview cards */
} <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {
/* Core Status */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <BrainCircuit className="h-5 w-5 text-cyan-400" /> Core Core Engine Metrics </h3> <div className="flex flex-col gap-3"> <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-border/60"> <span className="text-xs text-muted-foreground">Core Service State</span> <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${aiEnabled ? 'text-emerald-400' : 'text-muted-foreground'}`} > <span className={`h-2 w-2 rounded-full ${aiEnabled ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} /> {aiEnabled ? 'Online / Stable' : 'Suspended'} </span> </div> <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/40 pb-2.5 mt-1"> <span>Primary Node Model:</span> <span className="text-foreground font-bold font-mono">Gemini 3.5 Flash</span> </div> <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/40 pb-2.5"> <span>Token Usage Daily Budget:</span> <span className="text-foreground font-bold font-mono">1.2M / {tokenBudget}M tokens</span> </div> <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/40 pb-2.5"> <span>Active Routing Clinics:</span> <span className="text-foreground font-bold font-mono">Akfa Medline, Medion</span> </div> </div> </div> {
/* NLP Sub-engines */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <Sliders className="h-5 w-5 text-cyan-400" /> NLP Sub-Module Parameters </h3> <div className="flex flex-col gap-4"> {
/* Diagnosis NLP */
} <div className="flex items-center justify-between"> <div> <h4 className="text-xs font-bold text-foreground">ICD-10 Clinical Diagnostics</h4> <p className="text-[10px] text-muted-foreground mt-0.5">Enables AI consultation autocomplete codes</p> </div> <input type="checkbox" disabled={!aiEnabled} checked={diagnosisEnabled && aiEnabled} onChange={(e) => setDiagnosisEnabled(e.target.checked)} className="h-4 w-4 rounded border-border text-cyan-500 bg-card text-card-foreground focus:ring-0 disabled:opacity-50 cursor-pointer" /> </div> {
/* Queue Triage NLP */
} <div className="flex items-center justify-between border-t border-border/40 pt-3"> <div> <h4 className="text-xs font-bold text-foreground">Automated Patient Triage</h4> <p className="text-[10px] text-muted-foreground mt-0.5">Categorizes queue priorities based on patient details</p> </div> <input type="checkbox" disabled={!aiEnabled} checked={triageEnabled && aiEnabled} onChange={(e) => setTriageEnabled(e.target.checked)} className="h-4 w-4 rounded border-border text-cyan-500 bg-card text-card-foreground focus:ring-0 disabled:opacity-50 cursor-pointer" /> </div> </div> </div> {
/* Global thresholds */
} <div className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-5 rounded-2xl flex flex-col gap-4"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2"> <Settings className="h-5 w-5 text-cyan-400" /> Global Token Limits </h3> <div className="flex flex-col gap-4"> <div className="flex flex-col gap-1.5"> <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1"> <span>Daily Token Budget (M):</span> <span className="text-cyan-400 font-mono">{tokenBudget} M Tokens</span> </div> <input type="range" min="10" max="100" step="5" value={tokenBudget} onChange={(e) => setTokenBudget(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400" /> </div> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Node API Model Routing</label> <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="bg-card text-card-foreground border border-border text-secondary-foreground text-xs rounded-lg p-2.5 focus:border-cyan-500/60 w-full" > <option value="medical-gemini-3.5-flash">Gemini 3.5 Flash (Medical Tuned)</option> <option value="medical-gemini-3.5-pro">Gemini 3.5 Pro (Clinical Decision Node)</option> </select> </div> </div> </div> </div> {
/* Recharts Analytics Charts */
} <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {
/* Latency History */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl flex flex-col gap-4"> <div className="flex justify-between items-center"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2"> <Cpu className="h-4.5 w-4.5 text-muted-foreground" /> API Response Latencies (ms) </h3> <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Avg: 42ms</span> </div> <div className="h-64 w-full mt-2"> <ResponsiveContainer width="100%" height="100%"> <LineChart data={latencyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}> <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" /> <XAxis dataKey="day" stroke="#64748b" fontSize={10} /> <YAxis stroke="#64748b" fontSize={10} /> <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} labelStyle={{ color: '#94a3b8', fontSize: 11 }} itemStyle={{ color: '#06b6d4', fontSize: 12 }} /> <Line type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ strokeWidth: 2 }} /> </LineChart> </ResponsiveContainer> </div> </div> {
/* Success Rate accuracy */
} <div className="bg-glass text-foreground border border-border dark:border-cyan-500/15 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] p-5 rounded-2xl flex flex-col gap-4"> <div className="flex justify-between items-center"> <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2"> <ShieldCheck className="h-4.5 w-4.5 text-muted-foreground" /> Categorization Success Accuracy (%) </h3> <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">Avg: 99.8%</span> </div> <div className="h-64 w-full mt-2"> <ResponsiveContainer width="100%" height="100%"> <AreaChart data={successRateData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}> <defs> <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1"> <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/> <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/> </linearGradient> </defs> <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" /> <XAxis dataKey="day" stroke="#64748b" fontSize={10} /> <YAxis stroke="#64748b" fontSize={10} domain={[99.0, 100.0]} /> <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} labelStyle={{ color: '#94a3b8', fontSize: 11 }} itemStyle={{ color: '#22c55e', fontSize: 12 }} /> <Area type="monotone" dataKey="success" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorSuccess)" /> </AreaChart> </ResponsiveContainer> </div> </div> </div> </div> );
 } 