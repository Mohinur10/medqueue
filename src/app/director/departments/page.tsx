"use client";
 
import React, { useState } from 'react';
 
import { useMedQueue } from '../../../context/MedQueueContext';
 
import { Button } from '../../../components/ui/Button';
 
import { Input } from '../../../components/ui/Input';
 
import { Dialog } from '../../../components/ui/Dialog';
 
import { EmptyState } from '../../../components/ui/EmptyState';
 
import { Layers, PlusCircle, Search, Edit2, Trash2, MapPin, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
 
import { useTranslation } from '../../../hooks/useTranslation';
 
import { Department, Room } from '../../../types';
 
export default function DepartmentsDirector() { const { currentUser, departments, rooms, doctors, createDepartment, createAuditLog, triggerNotification } = useMedQueue();
 const { t } = useTranslation();
 const clinicId = currentUser?.clinicId || 'clinic-1';
 
/*  State */
const [search, setSearch] = useState('');
 const [localDepts, setLocalDepts] = useState<Department[]>(departments.filter(d => d.clinicId === clinicId));
 const [localRooms, setLocalRooms] = useState<Room[]>(rooms.filter(r => r.clinicId === clinicId));
 
/*  Modals state */
const [isDeptOpen, setIsDeptOpen] = useState(false);
 const [isRoomOpen, setIsRoomOpen] = useState(false);
 
/*  Form states */
const [dName, setDName] = useState('');
 const [dCode, setDCode] = useState('');
 const [dDesc, setDDesc] = useState('');
 const [rNum, setRNum] = useState('');
 const [rDept, setRDept] = useState(localDepts[0]?.id || '');
 const [rStatus, setRStatus] = useState<Room['status']>('available');
 const filteredDepts = localDepts.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase()) );
 const handleCreateDept = (e: React.FormEvent) => { e.preventDefault();
 if (!dName.trim() || !dCode.trim()) return;
 const newDept: Department = { id: `dept-${Date.now()}`, clinicId, name: dName, code: dCode.toUpperCase(), description: dDesc };
 setLocalDepts(prev => [...prev, newDept]);
 createDepartment(newDept);
 
/*  updates context setIsDeptOpen(false);
 // Reset setDName('');
 setDCode('');
 setDDesc('');
 triggerNotification(clinicId, 'success', 'Department Created', `Successfully added department ${newDept.name}`);
 */

 };
 const handleCreateRoom = (e: React.FormEvent) => { e.preventDefault();
 if (!rNum.trim() || !rDept) return;
 const newRoom: Room = { id: `room-${Date.now()}`, clinicId, roomNumber: rNum, status: rStatus, departmentId: rDept };
 setLocalRooms(prev => [...prev, newRoom]);
 setIsRoomOpen(false);
 
/*  Reset setRNum('');
 setRStatus('available');
 createAuditLog('CREATE_ROOM', `Created room number ${rNum}`);
 triggerNotification(clinicId, 'success', 'Room Created', `Successfully provisioned room ${rNum}`);
 */

 };
 const handleDeleteDept = (id: string) => { const deleted = localDepts.find(d => d.id === id);
 setLocalDepts(prev => prev.filter(d => d.id !== id));
 createAuditLog('DELETE_DEPARTMENT', `Deleted department: ${deleted?.name || id}`);
 triggerNotification(clinicId, 'success', 'Department Removed', 'The department was deleted from listings.');
 };
 const handleDeleteRoom = (id: string) => { setLocalRooms(prev => prev.filter(r => r.id !== id));
 createAuditLog('DELETE_ROOM', `Deleted room ID: ${id}`);
 triggerNotification(clinicId, 'success', 'Room Removed', 'The room was deleted from clinic grid.');
 };
 
return ( <div className="flex flex-col gap-6 w-full pb-10"> {
/* Header */
} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-foreground drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]"> {t.directorDepartments?.title || 'Departments & Consultation Rooms'} </h1> <p className="text-xs text-muted-foreground mt-1"> {t.directorDepartments?.subtitle || 'Configure clinical departments, allocate consultation rooms, and map medical staff cabins.'} </p> </div> <div className="flex gap-2"> <Button variant="secondary" onClick={() => setIsRoomOpen(true)} className="flex items-center gap-2 cursor-pointer" > <PlusCircle className="h-4.5 w-4.5" /> {t.directorDepartments?.addRoomBtn || 'Add Room'} </Button> <Button variant="primary" onClick={() => setIsDeptOpen(true)} className="flex items-center gap-2 cursor-pointer font-bold" > <PlusCircle className="h-4.5 w-4.5" /> {t.directorDepartments?.addDeptBtn || 'Add Department'} </Button> </div> </div> {
/* Filter and Search Bar */
} <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-glass p-4 rounded-xl"> <div className="relative w-full md:max-w-xs"> <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground pointer-events-none" /> <input type="text" placeholder="Search department name / code..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card text-card-foreground/50 text-foreground placeholder-slate-500 text-xs border border-border rounded-lg py-2 pl-10 pr-4 focus:border-cyan-500/60" /> </div> </div> {
/* Departments Grid */
} <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> <div className="flex flex-col gap-5 w-full"> <div className="bg-card text-card-foreground border border-border rounded-xl p-4 flex justify-between items-center shadow-[0_0_15px_rgba(6,182,212,0.05)]"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2"> <Layers className="h-5 w-5 text-cyan-400" /> {t.directorDepartments?.clinicalDepts || 'Clinical Departments'} ({filteredDepts.length}) </h3> </div> <div className="max-h-[450px] overflow-y-auto pr-2 divide-y divide-border/40"> {filteredDepts.length > 0 ? ( filteredDepts.map((dept) => { const docCount = doctors.filter(d => d.specialization.toLowerCase() === dept.name.toLowerCase() && d.clinicId === clinicId).length;
 
return ( <div key={dept.id} className="pt-3 pb-1 flex justify-between items-start text-xs group"> <div> <div className="flex items-center gap-2"> <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-secondary-foreground"> {dept.code} </span> <span className="text-foreground font-bold ml-2 text-sm">{dept.name}</span> </div> <p className="text-xs text-muted-foreground mt-2">{dept.description}</p> <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center"> <span className="text-[10px] text-muted-foreground"> {t.directorDepartments?.staff || 'Staff'}: <span className="font-bold text-cyan-400/80">{docCount} {t.directorDepartments?.physiciansAllocated || 'Physicians allocated'}</span> </span> </div> </div> <button onClick={() => handleDeleteDept(dept.id)} className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer opacity-0 group-hover:opacity-100" > <Trash2 className="h-3.5 w-3.5" /> </button> </div> );
 }) ) : ( <EmptyState icon={Layers} title={t.directorDepartments?.noDeptsTitle || "No Departments Provisioned"} description={t.directorDepartments?.noDeptsDesc || "No clinic departments met your search parameters."} /> )} </div> </div> <div className="flex flex-col gap-5 w-full"> <div className="bg-card text-card-foreground border border-border rounded-xl p-4 flex justify-between items-center shadow-[0_0_15px_rgba(6,182,212,0.05)]"> <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2"> <MapPin className="h-5 w-5 text-cyan-400" /> {t.directorDepartments?.roomsOccupancies || 'Physical Rooms & Occupancies'} ({localRooms.length}) </h3> </div> <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[450px] overflow-y-auto pr-2"> {localRooms.length > 0 ? ( localRooms.map((room) => { const dept = localDepts.find(d => d.id === room.departmentId);
 const roomDoc = doctors.find(d => d.roomNumber === room.roomNumber && d.clinicId === clinicId);
 const statusColor = room.status === 'available' ? 'bg-emerald-500' : room.status === 'occupied' ? 'bg-rose-500' : 'bg-slate-600';
 
return ( <div key={room.id} className="bg-card text-card-foreground/60 border border-border p-4 rounded-xl flex flex-col justify-between group relative overflow-hidden transition-all hover:border-cyan-500/20"> <div className="flex justify-between items-start"> <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{t.directorDepartments?.cabin || 'CABIN'}</span> <div className={`h-2 w-2 rounded-full shadow-[0_0_8px_currentColor] ${statusColor}`} /> </div> <span className="text-2xl font-extrabold font-mono text-foreground my-2">#{room.roomNumber}</span> <div className="flex flex-col gap-1 mt-1 border-t border-border/60 pt-2"> <span className="text-[10px] text-muted-foreground">{t.directorDepartments?.dept || 'Dept'}: <span className="font-semibold text-foreground">{dept ? dept.code : 'General'}</span></span> <span className="text-[10px] text-muted-foreground truncate">{t.directorDepartments?.staff || 'Staff'}: <span className="font-semibold text-foreground">{roomDoc ? roomDoc.name.split(' ').slice(1).join(' ') : (t.directorDepartments?.vacant || 'Vacant')}</span></span> </div> <button onClick={() => handleDeleteRoom(room.id)} className="absolute top-2 right-2 p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer opacity-0 group-hover:opacity-100" > <Trash2 className="h-3 w-3" /> </button> </div> );
 }) ) : ( <div className="col-span-3"> <EmptyState icon={MapPin} title={t.directorDepartments?.noRoomsTitle || "No Cabins Created"} description={t.directorDepartments?.noRoomsDesc || "No consultation rooms have been configured for this clinic."} /> </div> )} </div> </div> </div> {
/* Add Department Dialog */
} <Dialog isOpen={isDeptOpen} onClose={() => setIsDeptOpen(false)} title={t.directorDepartments?.addDeptBtn || "Add Department"} > <form onSubmit={handleCreateDept} className="flex flex-col gap-4"> <Input id="dept-name" label="Department Name *" placeholder="e.g. Cardiology" value={dName} onChange={(e) => setDName(e.target.value)} required /> <Input id="dept-code" label="Department Code (Abbreviation) *" placeholder="e.g. CARD" maxLength={4} value={dCode} onChange={(e) => setDCode(e.target.value)} required /> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Description</label> <textarea placeholder="Provide information about services in this department..." value={dDesc} onChange={(e) => setDDesc(e.target.value)} rows={3} className="w-full bg-card text-card-foreground/40 text-foreground placeholder-slate-500 text-xs border border-border rounded-lg p-3 focus:border-cyan-500/60" /> </div> <div className="flex gap-2 justify-end mt-2"> <Button type="button" variant="ghost" onClick={() => setIsDeptOpen(false)}> Cancel </Button> <Button type="submit" variant="primary" className="font-bold"> Create Department </Button> </div> </form> </Dialog> {
/* Add Room Dialog */
} <Dialog isOpen={isRoomOpen} onClose={() => setIsRoomOpen(false)} title="Provision Cabin / Room" > <form onSubmit={handleCreateRoom} className="flex flex-col gap-4"> <Input id="room-num" label="Room/Cabin Number *" placeholder="e.g. 101" value={rNum} onChange={(e) => setRNum(e.target.value)} required /> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Associated Department *</label> <select value={rDept} onChange={(e) => setRDept(e.target.value)} required className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer w-full" > {localDepts.map(d => ( <option key={d.id} value={d.id}>{d.name} ({d.code})</option> ))} </select> </div> <div className="flex flex-col gap-1.5"> <label className="text-xs font-semibold text-muted-foreground">Initial Cabin Status *</label> <select value={rStatus} onChange={(e) => setRStatus(e.target.value as any)} required className="bg-card text-card-foreground text-sm border border-border rounded-lg p-2.5 focus:border-cyan-500/60 cursor-pointer w-full" > <option value="available">Available (Open for shifts)</option> <option value="occupied">Occupied</option> <option value="maintenance">Maintenance / Blocked</option> </select> </div> <div className="flex gap-2 justify-end mt-2"> <Button type="button" variant="ghost" onClick={() => setIsRoomOpen(false)}> Cancel </Button> <Button type="submit" variant="primary" className="font-bold"> Provision Cabin Room </Button> </div> </form> </Dialog> </div> );
 } 