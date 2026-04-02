import React, { useState } from 'react';
import { HealthRecord, Breeder, HealthStatus } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { Plus, X, Heart, Activity, Calendar } from 'lucide-react';

interface HealthProps {
  healthRecords: HealthRecord[];
  breeders: Breeder[];
  onAdd: (record: Partial<HealthRecord>) => void;
  onUpdate: (id: string, updates: Partial<HealthRecord>) => void;
}

export const Health: React.FC<HealthProps> = ({ healthRecords, breeders, onAdd, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [newEval, setNewEval] = useState({ recordId: '', note: '', status: 'Tratamiento' as HealthStatus });
  const [formData, setFormData] = useState<Partial<HealthRecord>>({ manualName: '', symptoms: '', diagnosis: '', treatment: '', status: 'Tratamiento' });

  const addEvolution = (recordId: string) => {
    const record = healthRecords.find(r => r.id === recordId);
    if (!record || !newEval.note) return;
    const evolution = { id: crypto.randomUUID(), date: new Date().toISOString(), note: newEval.note, status: newEval.status };
    onUpdate(recordId, { evolutions: [...(record.evolutions || []), evolution], status: newEval.status });
    setNewEval({ recordId: '', note: '', status: 'Tratamiento' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div><h3 className="text-2xl font-bold">Bitácora Sanitaria</h3><p className="text-[10px] text-slate-500 uppercase font-black">Historial Clínico Permanente</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full w-10 h-10 p-0">{showForm ? <X size={20} /> : <Plus size={20} />}</Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 text-white animate-in slide-in-from-top-2 duration-300">
          <form onSubmit={(e) => { e.preventDefault(); onAdd({...formData, date: new Date().toISOString(), evolutions: []}); setShowForm(false); }} className="space-y-4">
            <Label>Ejemplar</Label><Input value={formData.manualName} onChange={e => setFormData({...formData, manualName: e.target.value})} required className="h-8" />
            <Label>Síntomas Iniciales</Label><Input value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} required className="h-8" />
            <Button type="submit" className="w-full text-[10px] font-black uppercase">Abrir Caso Clínico</Button>
          </form>
        </Card>
      )}

      {healthRecords.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
        <Card key={record.id} className="p-4 bg-white/5 border border-white/5 relative text-white">
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400"><Heart size={20} /></div>
              <div><h4 className="font-bold text-xs uppercase tracking-widest">{record.manualName}</h4><span className="text-[7px] px-1 rounded bg-slate-900 border border-white/10 text-aqua-400 uppercase font-bold">{record.status}</span></div>
            </div>
            {record.status !== 'Alta' && <Button variant="ghost" size="sm" className="h-6 text-[8px] border border-aqua-400/20 text-aqua-400" onClick={() => onUpdate(record.id, { status: 'Alta' })}>DAR ALTA</Button>}
          </div>

          {/* FIX: Historial de evolución ahora es visible y scrollable */}
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
            <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Evolución Histórica:</p>
            {record.evolutions?.map(evo => (
              <div key={evo.id} className="bg-slate-950 p-2 rounded border border-white/5 text-[10px]">
                <div className="flex justify-between items-center text-slate-500 text-[6px] font-black uppercase mb-1">
                   <span>{new Date(evo.date).toLocaleString()}</span>
                   <span className="text-aqua-400">{evo.status}</span>
                </div>
                <p className="italic text-slate-300">"{evo.note}"</p>
              </div>
            ))}
          </div>

          {record.status !== 'Alta' && (
            <div className="flex gap-2 border-t border-white/5 pt-3">
              <Input placeholder="Nueva nota..." value={newEval.recordId === record.id ? newEval.note : ''} onChange={e => setNewEval({ ...newEval, recordId: record.id, note: e.target.value })} className="h-8 text-xs bg-slate-900" />
              <Button size="sm" className="h-8 px-2" onClick={() => addEvolution(record.id)}><Plus size={16} /></Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
