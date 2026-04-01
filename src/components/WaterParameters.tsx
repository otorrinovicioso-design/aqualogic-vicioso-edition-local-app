import React, { useState } from 'react';
import { WaterParameter } from '../types';
import { Card, Button, Input, Label, cn } from './UI';
import { Plus, X, Droplets, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WaterParametersProps {
  waterParams: WaterParameter[];
  onAdd: (param: Partial<WaterParameter>) => void;
}

export const WaterParameters: React.FC<WaterParametersProps> = ({ waterParams, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ph: '', gh: '', kh: '', nh3: '', no2: '', no3: '', temp: '', notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ph: Number(formData.ph),
      gh: Number(formData.gh),
      kh: Number(formData.kh),
      nh3: Number(formData.nh3),
      no2: Number(formData.no2),
      no3: Number(formData.no3),
      temp: Number(formData.temp),
      notes: formData.notes,
      date: new Date().toISOString(),
    });
    setFormData({ ph: '', gh: '', kh: '', nh3: '', no2: '', no3: '', temp: '', notes: '' });
    setShowForm(false);
  };

  const chartData = [...waterParams].reverse().map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    PH: p.ph,
    NO2: p.no2,
    NO3: p.no3,
    Temp: p.temp
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Parámetros del Agua</h3>
        <Button 
          variant={showForm ? 'ghost' : 'primary'} 
          size="sm" 
          onClick={() => setShowForm(!showForm)}
          className="rounded-full w-10 h-10 p-0"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label>PH</Label>
                <Input type="number" step="0.1" value={formData.ph} onChange={e => setFormData({...formData, ph: e.target.value})} required />
              </div>
              <div>
                <Label>Temp (°C)</Label>
                <Input type="number" step="0.1" value={formData.temp} onChange={e => setFormData({...formData, temp: e.target.value})} required />
              </div>
              <div>
                <Label>NO2</Label>
                <Input type="number" step="0.01" value={formData.no2} onChange={e => setFormData({...formData, no2: e.target.value})} required />
              </div>
              <div>
                <Label>NO3</Label>
                <Input type="number" step="0.1" value={formData.no3} onChange={e => setFormData({...formData, no3: e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>GH</Label>
                <Input type="number" value={formData.gh} onChange={e => setFormData({...formData, gh: e.target.value})} required />
              </div>
              <div>
                <Label>KH</Label>
                <Input type="number" value={formData.kh} onChange={e => setFormData({...formData, kh: e.target.value})} required />
              </div>
              <div>
                <Label>NH3</Label>
                <Input type="number" step="0.01" value={formData.nh3} onChange={e => setFormData({...formData, nh3: e.target.value})} required />
              </div>
            </div>
            <div>
              <Label>Notas / Acciones Correctivas</Label>
              <Input placeholder="Ej: Añadido buffer PH" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
            <Button type="submit" className="w-full">Guardar Registro</Button>
          </form>
        </Card>
      )}

      <Card className="p-4 h-[300px]">
        <div className="flex items-center gap-2 mb-4 text-aqua-400">
          <TrendingUp size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">Tendencias</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="PH" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Temp" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="NO3" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-4">
        {waterParams.slice(0, 5).map((p) => (
          <Card key={p.id} className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400">
                <Droplets size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{new Date(p.date).toLocaleString()}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-sm font-bold text-white">PH: {p.ph}</span>
                  <span className="text-sm font-bold text-white">{p.temp}°C</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
