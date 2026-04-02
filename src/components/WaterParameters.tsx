import React, { useState } from 'react';
import { WaterParameter, Breeding } from '../types';
import { Card, Button, Input, Label, Select, cn } from './UI';
import { Plus, X, Droplets, Edit3 } from 'lucide-react';

interface WaterParametersProps {
  waterParams: WaterParameter[];
  breedingProjects: Breeding[]; 
  onAdd: (param: Partial<WaterParameter>) => void;
  onUpdate: (id: string, updates: Partial<WaterParameter>) => void;
}

const STATIC_SYSTEMS = [
  'Reproductores Masculinos',
  'Reproductores Femeninos',
  'Betteras recirculadas',
  'Betta-sorority',
  'Guppys Machos',
  'Guppys Hembras'
];

export const WaterParameters: React.FC<WaterParametersProps> = ({ waterParams = [], breedingProjects = [], onAdd, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const activeProjects = (breedingProjects || []).filter(p => !p.isFinished);
  
  const [formData, setFormData] = useState({
    subgroup: 'Betteras recirculadas',
    ph: '', gh: '', kh: '', nh3: '', no2: '', no3: '', temp: '', notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      subgroup: formData.subgroup,
      ph: formData.ph ? Number(formData.ph) : undefined,
      gh: formData.gh ? Number(formData.gh) : undefined,
      kh: formData.kh ? Number(formData.kh) : undefined,
      nh3: formData.nh3 ? Number(formData.nh3) : undefined,
      no2: formData.no2 ? Number(formData.no2) : undefined,
      no3: formData.no3 ? Number(formData.no3) : undefined,
      temp: formData.temp ? Number(formData.temp) : undefined,
      notes: formData.notes,
    };

    if (editingId) {
      onUpdate(editingId, data as any);
      setEditingId(null);
    } else {
      onAdd({ ...data, date: new Date().toISOString() });
    }

    setFormData({ subgroup: 'Betteras recirculadas', ph: '', gh: '', kh: '', nh3: '', no2: '', no3: '', temp: '', notes: '' });
    setShowForm(false);
  };

  const startEdit = (param: WaterParameter) => {
    setFormData({
      subgroup: param.subgroup || 'Betteras recirculadas',
      ph: String(param.ph ?? ''), gh: String(param.gh ?? ''), kh: String(param.kh ?? ''),
      nh3: String(param.nh3 ?? ''), no2: String(param.no2 ?? ''), no3: String(param.no3 ?? ''),
      temp: String(param.temp ?? ''), notes: param.notes || '',
    });
    setEditingId(param.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div><h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Parámetros</h3><p className="text-[10px] text-slate-500 uppercase font-black uppercase tracking-widest font-white">Análisis por Sistema o Proyecto</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => { setShowForm(!showForm); if (showForm) setEditingId(null); }} className="rounded-full w-10 h-10 p-0 text-white shadow-lg"><Plus size={20} className={cn("transition-transform", showForm && "rotate-45")} /></Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 animate-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Ubicación / Proyecto</Label>
               <Select value={formData.subgroup} onChange={e => setFormData({...formData, subgroup: e.target.value})}>
                  <optgroup label="Sistemas Generales" className="bg-slate-900">
                    {STATIC_SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  {activeProjects.length > 0 && (
                    <optgroup label="Proyectos Activos (Alevines)" className="bg-slate-900">
                      {activeProjects.map(p => (<option key={p.id} value={`Cria: ${p.pairName}`}>{p.pairName}</option>))}
                    </optgroup>
                  )}
               </Select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
              <div><Label>pH</Label><Input type="number" step="0.1" value={formData.ph} onChange={e => setFormData({...formData, ph: e.target.value})} className="h-8 py-1" /></div>
              <div><Label>gH</Label><Input type="number" step="1" value={formData.gh} onChange={e => setFormData({...formData, gh: e.target.value})} className="h-8 py-1" /></div>
              <div><Label>kH</Label><Input type="number" step="1" value={formData.kh} onChange={e => setFormData({...formData, kh: e.target.value})} className="h-8 py-1" /></div>
              <div><Label>Temp</Label><Input type="number" step="0.1" value={formData.temp} onChange={e => setFormData({...formData, temp: e.target.value})} className="h-8 py-1" /></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div><Label>NH3 (Am)</Label><Input type="number" step="0.01" value={formData.nh3} onChange={e => setFormData({...formData, nh3: e.target.value})} className="h-8 py-1" /></div>
              <div><Label>NO2 (Nitri)</Label><Input type="number" step="0.01" value={formData.no2} onChange={e => setFormData({...formData, no2: e.target.value})} className="h-8 py-1" /></div>
              <div><Label>NO3 (Nitra)</Label><Input type="number" step="0.1" value={formData.no3} onChange={e => setFormData({...formData, no3: e.target.value})} className="h-8 py-1" /></div>
            </div>
            <Button type="submit" className="w-full h-10 font-bold uppercase text-[10px] tracking-widest bg-aqua-400 text-slate-950">Guardar Análisis Parcial</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-3">
        {waterParams.map((p) => (
          <Card key={p.id} className="p-4 bg-white/5 border border-white/5 relative group hover:border-white/10 transition-all cursor-default">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-aqua-400/10 flex items-center justify-center text-aqua-400 font-white uppercase"><Droplets size={16} /></div><div><span className="text-[10px] text-white font-bold uppercase tracking-widest">{p.subgroup}</span>{p.subgroup.includes('Cria:') && <span className="ml-2 text-[7px] bg-aqua-400/20 text-aqua-400 px-1.5 rounded-full font-black uppercase">PROYECTO</span>}<p className="text-[8px] text-slate-500 uppercase font-bold">{new Date(p.date).toLocaleString()}</p></div></div>
              <button onClick={() => startEdit(p)} className="p-2 text-slate-600 hover:text-aqua-400 opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 size={14} /></button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {[ {l:'pH',v:p.ph,c:'text-aqua-400'}, {l:'T°',v:p.temp,c:'text-white font-white'}, {l:'gH',v:p.gh,c:'text-slate-400 font-white'}, {l:'kH',v:p.kh,c:'text-slate-400 font-white'}, {l:'NH3',v:p.nh3,c:'text-orange-400 font-white'}, {l:'NO2',v:p.no2,c:p.no2 && p.no2 > 0.25 ? 'text-red-500' : 'text-slate-500 font-white'}, {l:'NO3',v:p.no3,c:'text-orange-400 font-white'} ].map(m => (
                <div key={m.l} className="bg-slate-900 border border-white/5 p-1 rounded-lg text-center"><p className="text-[7px] text-slate-600 uppercase font-black mb-0.5">{m.l}</p><p className={cn("text-[10px] font-bold font-white", m.c)}>{m.v ?? '-'}</p></div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
