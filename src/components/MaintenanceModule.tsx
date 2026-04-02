import React, { useState } from 'react';
import { Maintenance, MaintenanceType } from '../types';
import { Card, Button, Input, Select, Label } from './UI';
import { Plus, X, Tool, Calendar, Droplet, Settings } from 'lucide-react';

interface MaintenanceModuleProps {
  maintenanceRecords: Maintenance[];
  onAdd: (record: Partial<Maintenance>) => void;
}

const DEFAULT_CATEGORIES = [
  'Cambio de Agua',
  'Limpieza de Filtro',
  'Limpieza de Cristales',
  'Aditivo / Buffer',
  'Sifonado',
  'Poda de Plantas',
  'Chequeo de Equipo'
];

export const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({ maintenanceRecords, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Maintenance>>({
    task: '',
    category: 'Cambio de Agua',
    type: 'Cambio de Agua',
    volume: 0,
    description: ''
  });

  // Get unique categories from existing records + defaults
  const existingCategories = Array.from(new Set([
    ...DEFAULT_CATEGORIES,
    ...maintenanceRecords.map(r => r.category).filter(Boolean)
  ]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: new Date().toISOString(),
    });
    setFormData({ task: '', category: 'Cambio de Agua', type: 'Cambio de Agua', volume: 0, description: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-display font-bold text-white">Mantenimiento</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Tareas y Operaciones Técnicas</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
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
                <Label>Categoría</Label>
                <input 
                  list="maintenance-categories"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-aqua-400/50 transition-all text-sm"
                  placeholder="Ej: Cambio de Agua"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                />
                <datalist id="maintenance-categories">
                  {existingCategories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
              </div>
              <div>
                <Label>Volumen (L) / Cantidad</Label>
                <Input 
                  type="number" 
                  value={formData.volume} 
                  onChange={e => setFormData({...formData, volume: parseFloat(e.target.value)})} 
                  placeholder="Opcional"
                />
              </div>
            </div>
            
            <div>
              <Label>Tarea Realizada</Label>
              <Input 
                value={formData.task} 
                onChange={e => setFormData({...formData, task: e.target.value})} 
                placeholder="Ej: Cambio 30% agua ósmosis" 
                required 
              />
            </div>

            <div>
              <Label>Descripción Detallada</Label>
              <Input 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Detalles adicionales..." 
              />
            </div>

            <Button type="submit" className="w-full">Registrar Mantenimiento</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {maintenanceRecords.length === 0 ? (
          <p className="text-center text-slate-500 py-10 italic">No hay registros de mantenimiento.</p>
        ) : (
          maintenanceRecords.map((record) => (
            <Card key={record.id} className="p-4 bg-white/5 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400 shrink-0">
                {record.category?.includes('Agua') ? <Droplet size={20} /> : <Settings size={20} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white truncate text-sm">{record.task}</h4>
                    <span className="px-2 py-0.5 rounded bg-aqua-400/10 text-aqua-400 text-[8px] font-bold uppercase tracking-widest">
                      {record.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(record.date).toLocaleDateString()}</span>
                </div>
                
                {record.description && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {record.description}
                  </p>
                )}

                {record.volume && record.volume > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                    <Droplet size={12} className="text-aqua-400" />
                    <span>Volumen: {record.volume} Litros</span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
