import React, { useState } from 'react';
import { WaterParameter } from '../types';
import { Card, Button, Input, Label, cn } from './UI';
import { Plus, X, Droplets, TrendingUp, Edit3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WaterParametersProps {
  waterParams: WaterParameter[];
  onAdd: (param: Partial<WaterParameter>) => void;
  onUpdate: (id: string, updates: Partial<WaterParameter>) => void;
}

export const WaterParameters: React.FC<WaterParametersProps> = ({ waterParams, onAdd, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    ph: '',
    gh: '',
    kh: '',
    nh3: '',
    no2: '',
    no3: '',
    temp: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ph: Number(formData.ph),
      gh: Number(formData.gh),
      kh: Number(formData.kh),
      nh3: Number(formData.nh3),
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

    setFormData({ ph: '', gh: '', kh: '', nh3: '', no2: '', no3: '', temp: '', notes: '' });
    setShowForm(false);
  };

  const startEdit = (param: WaterParameter) => {
    setFormData({
      ph: String(param.ph),
      gh: String(param.gh),
      kh: String(param.kh),
      nh3: String(param.nh3),
      no2: String(param.no2),
      no3: String(param.no3),
      temp: String(param.temp),
      notes: param.notes || '',
    });
    setEditingId(param.id);
    setShowForm(true);
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
        <div>
          <h3 className="text-2xl font-display font-bold text-white">Parámetros Críticos</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Control Químico del Ecosistema</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
          size="sm" 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingId(null);
              setFormData({ ph: '', gh: '', kh: '', nh3: '', no2: '', no3: '', temp: '', notes: '' });
            }
          }}
          className="rounded-full w-10 h-10 p-0"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-bold text-aqua-400">{editingId ? 'Editar Medición' : 'Nueva Medición'}</h4>
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
            <Button type="submit" className="w-full">{editingId ? 'Guardar Cambios' : 'Registrar Lectura'}</Button>
          </form>
        </Card>
      )}

      {waterParams.length > 0 && (
        <Card className="p-4 h-[250px]">
          <div className="flex items-center gap-2 mb-4 text-aqua-400">
            <TrendingUp size={18} />
            <span className="text-sm font-bold uppercase tracking-wider text-[10px]">Tendencias</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} hide />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ fontSize: '10px' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="PH" stroke="#2dd4bf" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Temp" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="NO3" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="grid gap-4">
        {waterParams.map((p) => (
          <Card key={p.id} className="p-4 bg-white/5 border border-white/5 relative group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-aqua-400/10 flex items-center justify-center text-aqua-400">
                  <Droplets size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {new Date(p.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => startEdit(p)}
                className="p-2 text-slate-500 hover:text-aqua-400 transition-colors rounded-lg bg-white/5 opacity-0 group-hover:opacity-100"
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-slate-900/50 p-2 rounded-lg text-center border border-white/5">
                <p className="text-[8px] text-slate-500 uppercase mb-1">pH</p>
                <p className="text-xs font-bold text-white">{p.ph}</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg text-center border border-white/5">
                <p className="text-[8px] text-slate-500 uppercase mb-1">Temp</p>
                <p className="text-xs font-bold text-white">{p.temp}°C</p>
              </div>
              <div className={cn(
                "p-2 rounded-lg text-center border",
                p.no2 > 0.1 ? "bg-red-500/10 border-red-500/20" : "bg-slate-900/50 border-white/5"
              )}>
                <p className="text-[8px] text-slate-500 uppercase mb-1">NO2</p>
                <p className={cn("text-xs font-bold", p.no2 > 0.1 ? "text-red-400" : "text-white")}>{p.no2}</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg text-center border border-white/5">
                <p className="text-[8px] text-slate-500 uppercase mb-1">NO3</p>
                <p className="text-xs font-bold text-white">{p.no3}</p>
              </div>
            </div>
            
            {p.notes && (
              <p className="mt-3 text-[10px] text-slate-400 italic px-2 py-1 bg-white/5 rounded-md border-l-2 border-aqua-400/50">
                "{p.notes}"
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
