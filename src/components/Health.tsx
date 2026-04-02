import React, { useState } from 'react';
import { HealthRecord, Breeder, HealthStatus } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { Plus, X, Heart, Activity, CheckCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface HealthProps {
  healthRecords: HealthRecord[];
  breeders: Breeder[];
  onAdd: (record: Partial<HealthRecord>) => void;
  onUpdate: (id: string, updates: Partial<HealthRecord>) => void;
  onDelete: (id: string) => void;
}

export const Health: React.FC<HealthProps> = ({ healthRecords, breeders, onAdd, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newEval, setNewEval] = useState({ recordId: '', note: '', status: 'Tratamiento' as HealthStatus });
  const [formData, setFormData] = useState<Partial<HealthRecord>>({ manualName: '', symptoms: '', diagnosis: '', treatment: '', status: 'Tratamiento' });

  const addEvolution = (recordId: string) => {
    const record = healthRecords.find(r => r.id === recordId);
    if (!record || !newEval.note) return;
    const evolution = { id: crypto.randomUUID(), date: new Date().toISOString(), note: newEval.note, status: newEval.status };
    onUpdate(recordId, { evolutions: [...(record.evolutions || []), evolution], status: newEval.status });
    setNewEval({ recordId: '', note: '', status: 'Tratamiento' });
  };

  const getStatusColor = (s: string) => s === 'Mejorado' ? 'text-emerald-400' : s === 'Alta' ? 'text-aqua-400' : s === 'Baja' ? 'text-red-400' : 'text-blue-400';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div><h3 className="text-2xl font-bold uppercase tracking-tighter">Bitácora Sanitaria</h3><p className="text-[10px] text-slate-500 uppercase font-black">Historial Clínico por Espécimen</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full w-10 h-10 p-0 font-white">{showForm ? <X size={20} /> : <Plus size={20} />}</Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 text-white animate-in slide-in-from-top-2">
          <form onSubmit={(e) => { e.preventDefault(); onAdd({...formData, date: new Date().toISOString(), evolutions: []}); setShowForm(false); }} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="flex-1 text-white"><Label>Ejemplar / ID</Label><Input value={formData.manualName} onChange={e => setFormData({...formData, manualName: e.target.value})} required className="h-8" /></div>
                <div className="flex-1 text-white"><Label>Estado</Label><Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}><option value="Tratamiento">En Tratamiento</option><option value="Mejorado">Mejorado</option></Select></div>
             </div>
             <div><Label>📍 Síntomas</Label><Input value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} required className="h-8" /></div>
             <div className="grid grid-cols-2 gap-4">
                <div><Label>Diagnóstico</Label><Input value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} className="h-8 py-1" /></div>
                <div><Label>Tratamiento</Label><Input value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} className="h-8 py-1" /></div>
             </div>
             <Button type="submit" className="w-full text-[10px] font-black uppercase">Iniciar Caso Clínico</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-3">
        {healthRecords.map((record) => (
          <Card key={record.id} className={cn("bg-white/5 border border-white/5 overflow-hidden transition-all", expandedId === record.id && "ring-1 ring-aqua-400/30")}>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>
              <div className="flex items-center gap-3">
                 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", expandedId === record.id ? "bg-aqua-400/20 text-aqua-400" : "bg-white/5 text-slate-500")}><Heart size={18} /></div>
                 <div><h4 className="font-bold text-white text-xs uppercase tracking-widest">{record.manualName}</h4><span className={cn("text-[7px] font-black uppercase px-1 rounded bg-slate-900", getStatusColor(record.status))}>{record.status}</span></div>
              </div>
              {expandedId === record.id ? <ChevronUp size={20} className="text-aqua-400" /> : <ChevronDown size={20} className="text-slate-600" />}
            </div>

            {expandedId === record.id && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-3 gap-2 mb-4">
                   <div className="p-2 rounded bg-slate-900 border-b-2 border-red-500/30"><p className="text-[6px] text-slate-600 font-black uppercase">Síntomas</p><p className="text-[10px] text-white italic">"{record.symptoms}"</p></div>
                   <div className="p-2 rounded bg-slate-900 border-b-2 border-blue-500/30"><p className="text-[6px] text-slate-600 font-black uppercase">Diagnóstico</p><p className="text-[10px] text-white font-bold">{record.diagnosis || '-'}</p></div>
                   <div className="p-2 rounded bg-slate-900 border-b-2 border-aqua-400/30"><p className="text-[6px] text-slate-600 font-black uppercase">Tratamiento</p><p className="text-[10px] text-white font-bold">{record.treatment || '-'}</p></div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-[7px] text-slate-600 font-black uppercase flex items-center gap-1"><Activity size={10} /> Evolución Completa:</p>
                  {record.evolutions?.map(evo => (
                    <div key={evo.id} className="bg-slate-950 p-2 rounded border border-white/5 text-[10px]">
                      <div className="flex justify-between items-center text-[6px] font-black uppercase text-slate-500 mb-1"><span>{new Date(evo.date).toLocaleString()}</span><span className={getStatusColor(evo.status)}>{evo.status}</span></div>
                      <p className="text-slate-300 italic">"{evo.note}"</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 border-t border-white/5 pt-3 mb-4">
                  <Input placeholder="Nota evolución..." value={newEval.recordId === record.id ? newEval.note : ''} onChange={e => setNewEval({ ...newEval, recordId: record.id, note: e.target.value })} className="h-8 text-xs bg-slate-900" />
                  <Select className="w-24 h-8 text-[8px] bg-slate-900" value={newEval.recordId === record.id ? newEval.status : 'Tratamiento'} onChange={e => setNewEval({ ...newEval, recordId: record.id, status: e.target.value as HealthStatus })}><option value="Tratamiento">Continua</option><option value="Mejorado">Mejorado</option><option value="Alta">Alta</option></Select>
                  <Button size="sm" className="h-8 px-2" onClick={() => addEvolution(record.id)}><Plus size={16} /></Button>
                </div>

                <div className="flex justify-end gap-2">
                   <Button variant="ghost" onClick={() => onDelete(record.id)} className="h-8 text-[8px] border border-white/5 text-slate-700">BORRAR FICHA</Button>
                   <Button onClick={() => onDelete(record.id)} className="h-8 text-[8px] bg-emerald-600 gap-2 font-bold"><CheckCircle size={14}/> DAR ALTA Y CERRAR</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
