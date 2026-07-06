"use client";
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { Input } from '../../../components/ui/Input';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { BookOpen, Search, PlusCircle, Edit, Trash2, CheckCircle, Globe, PenTool, Calendar, BookOpenCheck } from 'lucide-react';
 
import { Article } from '../../../types';
 
export default function ArticlesAdmin() { const { t: globalT } = useTranslation();
 const { articles, triggerNotification, createAuditLog } = useMedQueue();
 
/*  Articles state */
const [localArticles, setLocalArticles] = useState<Article[]>(articles);
 const [search, setSearch] = useState('');
 const [catFilter, setCatFilter] = useState<string>('all');
 const [statusFilter, setStatusFilter] = useState<string>('all');
 
/*  Dialog state */
const [isOpen, setIsOpen] = useState(false);
 const [isEdit, setIsEdit] = useState(false);
 const [selectedArt, setSelectedArt] = useState<Article | null>(null);
 
/*  Form states */
const [title, setTitle] = useState('');
 const [category, setCategory] = useState<Article['category']>('general');
 const [content, setContent] = useState('');
 const [status, setStatus] = useState<'draft' | 'published'>('draft');
 
/*  Filter logic */
const filteredArticles = localArticles .filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase())) .filter(a => catFilter === 'all' || a.category === catFilter) .filter(a => statusFilter === 'all' || a.status === statusFilter);
 const resetForm = () => { setTitle('');
 setCategory('general');
 setContent('');
 setStatus('draft');
 setSelectedArt(null);
 };
 const handleCreateTrigger = () => { setIsEdit(false);
 resetForm();
 setIsOpen(true);
 };
 const handleEditTrigger = (art: Article) => { setIsEdit(true);
 setSelectedArt(art);
 setTitle(art.title);
 setCategory(art.category);
 setContent(art.content);
 setStatus(art.status);
 setIsOpen(true);
 };
 const handleSubmit = (e: React.FormEvent) => { e.preventDefault();
 if (!title.trim() || !content.trim()) return;
 if (isEdit && selectedArt) { 
/* Update */
 setLocalArticles(prev => prev.map(a => { 
 if (a.id === selectedArt.id) { createAuditLog('EDIT_ARTICLE', `Edited educational article: ${title}`);
 
return { ...a, title, category, content, status };
 } 
return a;
 }));
 triggerNotification('user-admin', 'success', 'Article Updated', `Successfully updated article: ${title}`);
 } else { 
/* Create */
const newArt: Article = { 
        id: `art-${Date.now()}`, 
        title, 
        category, 
        content, 
        authorName: "Admin", /* Logged in Super Admin */
        status: status,
        publishedAt: new Date().toISOString().substring(0, 10),
        readTime: `${Math.ceil(content.split(' ').length / 150)} min read` 
      };
 setLocalArticles(prev => [newArt, ...prev]);
 createAuditLog('CREATE_ARTICLE', `Created new article: ${title}`);
 triggerNotification('user-admin', 'success', 'Article Published', `Registered new article: ${title}`);
 } setIsOpen(false);
 resetForm();
 };
 const handleDelete = (id: string) => { const deleted = localArticles.find(a => a.id === id);
 setLocalArticles(prev => prev.filter(a => a.id !== id));
 createAuditLog('DELETE_ARTICLE', `Deleted article: ${deleted?.title || id}`);
 triggerNotification('user-admin', 'success', 'Article Removed', 'The article was deleted from CMS list.');
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header Banner */
} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> Patient Education CMS </h1> <p className="text-xs text-muted-foreground mt-1"> Create, draft, and publish wellness guides and clinic announcements to patient dashboards. </p> </div> <Button variant="primary" onClick={handleCreateTrigger} className="flex items-center gap-2 cursor-pointer font-bold" > <PlusCircle className="h-4.5 w-4.5" /> Compose New Article </Button> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass p-4 rounded-xl"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground pointer-events-none" /> <input type="text" placeholder={globalT.navbar?.searchPlaceholder || 'Search'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card text-card-foreground/50 text-foreground placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60" /> </div> <div className="flex flex-wrap items-center gap-3 w-full md:w-auto"> {
/* Category Filter */
} <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="bg-card text-card-foreground border border-border text-secondary-foreground text-xs rounded-lg p-2 focus:border-cyan-500/60 cursor-pointer" > <option value="all">All Categories</option> <option value="wellness">Wellness & Health</option> <option value="cardiology">Cardiology</option> <option value="pediatrics">Pediatrics</option> <option value="general">General Medicine</option> <option value="announcement">Announcements</option> </select> {
/* Status Filter */
} <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-card text-card-foreground border border-border text-secondary-foreground text-xs rounded-lg p-2 focus:border-cyan-500/60 cursor-pointer" > <option value="all">All Statuses</option> <option value="published">Published</option> <option value="draft">Drafts Only</option> </select> </div> </div> {
/* Grid List */
} <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {filteredArticles.length > 0 ? ( filteredArticles.map((art) => ( <div key={art.id} className="bg-glass-card text-card-foreground border border-border dark:border-cyan-500/12 shadow-sm dark:shadow-none hover:border-cyan-500/30 dark:hover:border-cyan-500/35 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group"> {
/* Header */
} <div className="flex items-start justify-between"> <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded"> {art.category} </span> <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${art.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-muted-foreground border-slate-500/20'}`} > {art.status} </span> </div> {
/* Title & Content */
} <div> <h3 className="font-bold text-foreground text-base group-hover:text-cyan-400 transition-colors leading-snug"> {art.title} </h3> <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3"> {art.content} </p> </div> {
/* Footer details */
} <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/40 pt-4 mt-1"> <div className="flex items-center gap-3"> <span>Author: <strong>{art.authorName}</strong></span> <span className="flex items-center gap-1"> <Calendar className="h-3 w-3" /> {art.publishedAt} </span> </div> <span>{art.readTime}</span> </div> {
/* Action Overlays */
} <div className="flex gap-2 justify-end mt-2 border-t border-border/40 pt-3"> <Button variant="ghost" size="sm" onClick={() => handleEditTrigger(art)} className="flex items-center gap-1 cursor-pointer" > <Edit className="h-3.5 w-3.5" /> Edit </Button> <Button variant="ghost" size="sm" onClick={() => handleDelete(art.id)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent cursor-pointer" > <Trash2 className="h-3.5 w-3.5" /> Delete </Button> </div> </div> )) ) : ( <div className="col-span-2"> <EmptyState icon={BookOpen} title="No Articles Published" description="No educational content met the active filter metrics." actionText="Compose New Article" onAction={handleCreateTrigger} /> </div> )} </div> {
/* Compose/Edit Article Dialog Modal */
} <Dialog isOpen={isOpen} onClose={() => { setIsOpen(false);
 resetForm();
 }} title={isEdit ? `Edit Article: ${selectedArt?.title}` : "Compose New Educational Resource"} size="lg" > <form onSubmit={handleSubmit} className="flex flex-col gap-4"> <Input id="art-title" label="Article Title *" placeholder="e.g. Navigating Pediatric Cold Seasons" value={title} onChange={(e) => setTitle(e.target.value)} required /> <div className="grid grid-cols-2 gap-4"> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Category Tag *</label> <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer" > <option value="wellness">Wellness & Vitality</option> <option value="cardiology">Cardiology / Heart</option> <option value="pediatrics">Pediatrics / Kids</option> <option value="general">General Medicine</option> <option value="announcement">Announcement</option> </select> </div> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Draft Status *</label> <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer" > <option value="draft">Save as Local Draft</option> <option value="published">Publish Globally Immediate</option> </select> </div> </div> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Article Content (Markdown Ready) *</label> <textarea placeholder="Write the health guide content here..." value={content} onChange={(e) => setContent(e.target.value)} rows={8} required className="w-full bg-card text-card-foreground/40 text-foreground placeholder-slate-500 text-sm border border-border rounded-lg p-3 focus:border-cyan-500/60" /> </div> <div className="flex gap-2 justify-end mt-2"> <Button type="button" variant="ghost" onClick={() => { setIsOpen(false);
 resetForm();
 }}> Cancel </Button> <Button type="submit" variant="primary" className="font-bold flex items-center gap-1"> <PenTool className="h-4 w-4" /> {isEdit ? "Save Configuration" : "Publish Article"} </Button> </div> </form> </Dialog> </div> );
 } 