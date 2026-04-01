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
    ph: '', temp: '', no2: '', no3: '', gh: '', kh: '', nh3: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ph: Number(formData.ph),
      temp: Number(formData.temp),
      no2: Number(formData.no2),
      no3: Number(formData.no3),
      gh: Number(formData.gh),
      kh: Number(formData.kh),
      nh3: Number(formData.nh3),
      notes: formData.notes,
      date: new Date().toISOString(),
    });
    setFormData({ ph: '', temp: '', no2: '', no3: '', gh: '', kh: '', nh3: '', notes: '' });
    setShowForm(false);
  };

  const chartData = [...waterParams].reverse().map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    PH: p.ph,
    NO2: p.no2,
    Temp: p.temp
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Agua</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" step="0.1" placeholder="PH" value={formData.ph} onChange={e => setFormData({...formData, ph: e.target.value})} />
              <Input type="number" step="0.1" placeholder="Temp" value={formData.temp} onChange={e => setFormData({...formData, temp: e.target.value})} />
            </div>
            <Button type="submit" className="w-full">Guardar</Button>
          </form>
        </Card>
      )}

      <Card className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Line type="monotone" dataKey="PH" stroke="#2dd4bf" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
