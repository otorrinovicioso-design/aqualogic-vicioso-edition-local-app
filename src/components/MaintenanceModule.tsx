import React, { useState } from 'react';
import { Maintenance } from '../types';
import { Card, Button, Input, Label } from './UI';
import { Plus, X, Wrench, CheckCircle2 } from 'lucide-react';

interface MaintenanceModuleProps {
  maintenanceRecords: Maintenance[];
  onAdd: (record: Partial<Maintenance>) => void;
}

export const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({ maintenanceRecords, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    additives: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: new Date().toISOString(),
    });
    setFormData({ task: '', description: '', additives: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Mantenimiento y Rutinas</h3>
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
            <div>
              <Label>Tarea Realizada</Label>
              <Input value={formData.task} onChange={e => setFormData({...formData, task: e.target.value})} placeholder="Ej: Cambio de agua 30%" required />
            </div>
            <div>
              <Label>Aditivos / Sales / Bacterias</Label>
              <Input value={formData.additives} onChange={e => setFormData({...formData, additives: e.target.value})} placeholder="Ej: 5ml Stability, 2g Sales" />
            </div>
            <div>
              <Label>Notas Adicionales</Label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-aqua-400/50 transition-all min-h-[80px]"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full">Registrar Mantenimiento</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {maintenanceRecords.map((record) => (
          <Card key={record.id} className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400 shrink-0">
              <Wrench size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white truncate">{record.task}</h4>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(record.date).toLocaleString()}</p>
              {record.additives && (
                <p className="text-xs text-aqua-400 mt-1 font-medium">Add: {record.additives}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
