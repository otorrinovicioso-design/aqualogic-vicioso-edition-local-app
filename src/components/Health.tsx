import React, { useState } from 'react';
import { HealthRecord, Breeder, HealthStatus } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { Plus, X, Heart, Activity, CheckCircle, Calendar } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, date: new Date().toISOString(), evolutions: [] });
    setFormData({ manualName: '', symptoms: '', diagnosis: '', treatment: '', status: 'Tratamiento' });
    setShowForm(false);
  };

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
        <div><h3 className="text-2xl font-bold">Bitácora Sanitaria</h3><p className="text-[10px] text-slate-500 uppercase font-bold">Evolución Clínica</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full w-10 h-10 p-0">{showForm ? <X size={20} /> : <Plus size={20} />}</Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nombre Ejemplar</Label><Input value={formData.manualName} onChange={e => setFormData({...formData, manualName: e.target.value})} required /></div>
              <div><Label>Estado Inicial</Label><Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}><option value="Tratamiento">Tratamiento</option><option value="Mejorado">Mejorado</option></Select></div>
            </div>
            <div><Label>Síntomas</Label><Input value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} required /></div>
            <Button type="submit" className="w-full">Registrar Caso</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-6">
        {healthRecords.map((record) => (
          <Card key={record.id} className="p-4 bg-white/5 border border-white/5 relative text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400"><Heart size={20} /></div>
                <div><h4 className="font-bold uppercase text-xs">{record.manualName}</h4><span className="text-[8px] px-1 bg-aqua-400/10 text-aqua-400 rounded uppercase">{record.status}</span></div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 text-[10px] text-aqua-400 border border-aqua-400/20" onClick={() => onUpdate(record.id, { status: 'Alta' })}>DAR ALTA</Button>
            </div>
            <div className="space-y-3">
               {record.evolutions?.map(evo => (
                 <div key={evo.id} className="p-2 rounded bg-white/5 text-xs"><p className="text-slate-500 text-[8px]">{new Date(evo.date).toLocaleString()}</p><p>{evo.note}</p></div>
               ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
               <Input placeholder="Evolución..." value={newEval.recordId === record.id ? newEval.note : ''} onChange={e => setNewEval({ ...newEval, recordId: record.id, note: e.target.value })} className="bg-slate-900" />
               <Button size="sm" onClick={() => addEvolution(record.id)}><Plus size={16} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
