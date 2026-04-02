import React, { useState } from 'react';
import { WaterParameter, SubgroupType } from '../types';
import { Card, Button, Input, Label, Select, cn } from './UI';
import { Plus, X, Droplets, TrendingUp, Edit3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WaterParametersProps {
  waterParams: WaterParameter[];
  onAdd: (param: Partial<WaterParameter>) => void;
  onUpdate: (id: string, updates: Partial<WaterParameter>) => void;
}

const SUBGROUPS: SubgroupType[] = [
  'Betteras recirculadas',
  'Betta-sorority',
  'Guppys Machos',
  'Guppys Hembras',
  'Alevines'
];

export const WaterParameters: React.FC<WaterParametersProps> = ({ waterParams, onAdd, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subgroup: 'Betteras recirculadas' as SubgroupType,
    ph: '', gh: '', kh: '', nh3: '', no2: '', no3: '', temp: '', notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      subgroup: formData.subgroup,
      ph: Number(formData.ph),
      gh: Number(formData.gh),
      kh: Number(formData.kh),
      nh3: Number(formData.nh3),
      no2: Number(formData.no2),
      no3: Number(formData.no3),
      temp: Number(formData.temp),
      notes: formData.notes,
      date: new Date().toISOString()
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div><h3 className="text-2xl font-bold">Parámetros Críticos</h3><p className="text-[10px] text-slate-500 uppercase font-black">Medias Técnicas Completas</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full w-10 h-10 p-0">{showForm ? <X size={20} /> : <Plus size={20} />}</Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Subgrupo</Label>
            <Select value={formData.subgroup} onChange={e => setFormData({...formData, subgroup: e.target.value as SubgroupType})}>
              {SUBGROUPS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-white">
              <div><Label>pH</Label><Input type="number" step="0.1" value={formData.ph} onChange={e => setFormData({...formData, ph: e.target.value})} required className="h-8" /></div>
              <div><Label>gH</Label><Input type="number" value={formData.gh} onChange={e => setFormData({...formData, gh: e.target.value})} className="h-8" /></div>
              <div><Label>kH</Label><Input type="number" value={formData.kh} onChange={e => setFormData({...formData, kh: e.target.value})} className="h-8" /></div>
              <div><Label>Temp</Label><Input type="number" step="0.1" value={formData.temp} onChange={e => setFormData({...formData, temp: e.target.value})} required className="h-8" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>NH3</Label><Input type="number" step="0.01" value={formData.nh3} onChange={e => setFormData({...formData, nh3: e.target.value})} className="h-8" /></div>
              <div><Label>NO2</Label><Input type="number" step="0.01" value={formData.no2} onChange={e => setFormData({...formData, no2: e.target.value})} required className="h-8" /></div>
              <div><Label>NO3</Label><Input type="number" step="0.1" value={formData.no3} onChange={e => setFormData({...formData, no3: e.target.value})} required className="h-8" /></div>
            </div>
            <Button type="submit" className="w-full text-[10px] font-black uppercase">Registrar Análisis Técnico</Button>
          </form>
        </Card>
      )}

      {waterParams.map((p) => (
        <Card key={p.id} className="p-4 bg-white/5 border border-white/10 relative text-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-aqua-400 uppercase tracking-widest">{p.subgroup}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase">{new Date(p.date).toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {[ {l:'pH',v:p.ph}, {l:'gH',v:p.gh}, {l:'kH',v:p.kh}, {l:'NH3',v:p.nh3}, {l:'NO2',v:p.no2}, {l:'NO3',v:p.no3}, {l:'T°',v:p.temp} ].map(m => (
              <div key={m.l} className="bg-slate-900 border border-white/5 p-1 rounded text-center"><p className="text-[6px] text-slate-500 uppercase font-black">{m.l}</p><p className="text-[10px] font-bold">{m.v || '-'}</p></div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
