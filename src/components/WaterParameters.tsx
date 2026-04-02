import React, { useState } from 'react';
import { WaterParameter, SubgroupType } from '../types';
import { Card, Button, Input, Label, Select, cn } from './UI';
import { Plus, X, Droplets, TrendingUp, Edit3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subgroup: 'Betteras recirculadas' as SubgroupType,
    ph: '',
    temp: '',
    no2: '',
    no3: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      subgroup: formData.subgroup,
      ph: Number(formData.ph),
      no2: Number(formData.no2),
      no3: Number(formData.no3),
      temp: Number(formData.temp),
      notes: formData.notes,
    };

    if (editingId) {
      onUpdate(editingId, data);
      setEditingId(null);
    } else {
      onAdd({ ...data, date: new Date().toISOString() });
    }

    setShowForm(false);
  };

  const chartData = [...waterParams].reverse().map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    PH: p.ph,
    NO3: p.no3,
    Temp: p.temp
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div><h3 className="text-2xl font-bold">Parámetros</h3><p className="text-[10px] text-slate-500 uppercase font-bold">Control por Subgrupo</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full w-10 h-10 p-0 text-white">{showForm ? <X size={20} /> : <Plus size={20} />}</Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Subgrupo</Label>
            <Select value={formData.subgroup} onChange={e => setFormData({...formData, subgroup: e.target.value as SubgroupType})}>
              {SUBGROUPS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>PH</Label><Input type="number" step="0.1" value={formData.ph} onChange={e => setFormData({...formData, ph: e.target.value})} required /></div>
              <div><Label>Temp</Label><Input type="number" step="0.1" value={formData.temp} onChange={e => setFormData({...formData, temp: e.target.value})} required /></div>
            </div>
            <Button type="submit" className="w-full">Registrar</Button>
          </form>
        </Card>
      )}

      {waterParams.length > 0 && (
        <Card className="p-4 h-[250px] bg-slate-950/50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} hide />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="PH" stroke="#2dd4bf" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="grid gap-4">
        {waterParams.map((p) => (
          <Card key={p.id} className="p-4 bg-white/5 border border-white/5 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase">{p.subgroup || 'General'}</span>
              <span className="text-[8px] text-slate-500">{new Date(p.date).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white/5 p-1 rounded font-bold">{p.ph} pH</div>
              <div className="bg-white/5 p-1 rounded font-bold">{p.temp}°C</div>
              <div className="bg-white/5 p-1 rounded font-bold">{p.no2} NO2</div>
              <div className="bg-white/5 p-1 rounded font-bold">{p.no3} NO3</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
