import React, { useState } from 'react';
import { Feeding } from '../types';
import { Card, Button, Input, Label } from './UI';
import { Plus, X, Utensils } from 'lucide-react';

interface FeedingModuleProps {
  feedingRecords: Feeding[];
  onAdd: (record: Partial<Feeding>) => void;
}

export const FeedingModule: React.FC<FeedingModuleProps> = ({ feedingRecords, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    foodType: '',
    amount: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: new Date().toISOString(),
    });
    setFormData({ foodType: '', amount: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Registro de Alimentación</h3>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Alimento</Label>
                <Input value={formData.foodType} onChange={e => setFormData({...formData, foodType: e.target.value})} placeholder="Ej: Artemia Viva" required />
              </div>
              <div>
                <Label>Cantidad / Frecuencia</Label>
                <Input value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Ej: 2 veces/día" required />
              </div>
            </div>
            <div>
              <Label>Notas</Label>
              <Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Ej: Comieron con avidez" />
            </div>
            <Button type="submit" className="w-full">Registrar Alimentación</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {feedingRecords.map((record) => (
          <Card key={record.id} className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
              <Utensils size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white truncate">{record.foodType}</h4>
                <span className="text-[10px] text-slate-500">{record.amount}</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(record.date).toLocaleString()}</p>
              {record.notes && (
                <p className="text-xs text-slate-400 mt-1 italic">"{record.notes}"</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
