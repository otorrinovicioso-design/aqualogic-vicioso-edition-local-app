import React, { useState } from 'react';
import { Incident } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { Plus, X, AlertTriangle, Clock } from 'lucide-react';

interface IncidentsProps {
  incidents: Incident[];
  onAdd: (record: Partial<Incident>) => void;
}

export const Incidents: React.FC<IncidentsProps> = ({ incidents, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Media' as Incident['severity'],
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: new Date().toISOString(),
      status: 'Abierto',
    });
    setFormData({ title: '', description: '', severity: 'Media', location: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Incidencias y Alertas</h3>
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
              <Label>Título de la Incidencia</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej: Fuga en Filtro Principal" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gravedad</Label>
                <Select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value as Incident['severity']})}>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </Select>
              </div>
              <div>
                <Label>Ubicación / Acuario</Label>
                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Ej: Batería A-01" required />
              </div>
            </div>
            <div>
              <Label>Descripción Detallada</Label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all min-h-[100px]"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">Reportar Incidencia</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="p-4 border-l-4 border-l-red-500/50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className={cn(
                  incident.severity === 'Crítica' ? "text-red-500" : "text-orange-400"
                )} />
                <h4 className="font-bold text-white">{incident.title}</h4>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-slate-400">
                {incident.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{incident.description}</p>
            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{new Date(incident.date).toLocaleString()}</span>
              </div>
              <span>Ubicación: {incident.location}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
