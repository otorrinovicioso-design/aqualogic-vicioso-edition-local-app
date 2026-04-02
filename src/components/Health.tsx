import React, { useState } from 'react';
import { HealthRecord, Breeder } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { Plus, X, Heart, Shield, Activity, Edit3, User } from 'lucide-react';

interface HealthProps {
  healthRecords: HealthRecord[];
  breeders: Breeder[];
  onAdd: (record: Partial<HealthRecord>) => void;
  onUpdate: (id: string, updates: Partial<HealthRecord>) => void;
}

export const Health: React.FC<HealthProps> = ({ healthRecords, breeders, onAdd, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HealthRecord>>({
    manualName: '',
    symptoms: '', // Primera acápite
    diagnosis: '',
    treatment: '',
    status: 'Tratamiento',
    observations: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd({
        ...formData,
        date: new Date().toISOString(),
      });
    }
    setFormData({ manualName: '', symptoms: '', diagnosis: '', treatment: '', status: 'Tratamiento', observations: '' });
    setShowForm(false);
  };

  const startEdit = (record: HealthRecord) => {
    setFormData(record);
    setEditingId(record.id);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Mejorado': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Recuperado': return 'text-aqua-400 bg-aqua-400/10 border-aqua-400/20';
      case 'Baja': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div>
          <h3 className="text-2xl font-display font-bold">Bitácora Sanitaria</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Seguimiento de Salud y Tratamientos</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
          size="sm" 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingId(null);
              setFormData({ manualName: '', symptoms: '', diagnosis: '', treatment: '', status: 'Tratamiento', observations: '' });
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
            <h4 className="font-bold text-aqua-400">{editingId ? 'Actualizar Ficha' : 'Nueva Ficha Sanitaria'}</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre Ejemplar (Manual)</Label>
                <Input 
                  value={formData.manualName} 
                  onChange={e => setFormData({...formData, manualName: e.target.value})} 
                  placeholder="Ej: Macho Azul / Betta R-1" 
                  required 
                />
              </div>
              <div>
                <Label>Estado Actual</Label>
                <Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value="Tratamiento">En Tratamiento</option>
                  <option value="Mejorado">Mejorado</option>
                  <option value="Recuperado">Recuperado (Sano)</option>
                  <option value="Baja">Baja (Mortalidad)</option>
                </Select>
              </div>
            </div>

            <div>
              <Label>📌 Síntomas (Observados)</Label>
              <Input 
                value={formData.symptoms} 
                onChange={e => setFormData({...formData, symptoms: e.target.value})} 
                placeholder="Ej: Aletas retraídas, nado errático"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Diagnóstico</Label>
                <Input 
                  value={formData.diagnosis} 
                  onChange={e => setFormData({...formData, diagnosis: e.target.value})} 
                  placeholder="Opcional" 
                />
              </div>
              <div>
                <Label>Tratamiento / Protocolo</Label>
                <Input 
                  value={formData.treatment} 
                  onChange={e => setFormData({...formData, treatment: e.target.value})} 
                  placeholder="Ej: Azul de Metileno 2 gotas/L" 
                />
              </div>
            </div>

            <div>
              <Label>Notas de Seguimiento</Label>
              <Input value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} placeholder="Seguimiento diario..." />
            </div>

            <Button type="submit" className="w-full">{editingId ? 'Actualizar Seguimiento' : 'Registrar Caso Clínico'}</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {healthRecords.length === 0 ? (
          <p className="text-center text-slate-500 py-10 italic">No hay casos sanitarios activos.</p>
        ) : (
          healthRecords.map((record) => (
            <Card key={record.id} className="bg-white/5 border border-white/5 p-4 overflow-hidden relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs tracking-widest">{record.manualName || 'Sin Nombre'}</h4>
                    <span className={cn(
                      "inline-block px-1.5 py-0.5 mt-1 rounded text-[8px] font-bold uppercase tracking-widest border",
                      getStatusColor(record.status || 'Tratamiento')
                    )}>
                      {record.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEdit(record)}
                    className="p-2 text-slate-600 hover:text-aqua-400 opacity-0 group-hover:opacity-100 transition-all bg-white/5 rounded-lg"
                  >
                    <Edit3 size={16} />
                  </button>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(record.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg border-l-4 border-aqua-400/50 mb-3">
                <p className="text-[8px] text-slate-500 uppercase mb-1 font-bold">Resumen de síntomas:</p>
                <p className="text-sm text-slate-100 font-medium italic">"{record.symptoms}"</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex gap-2 items-center text-slate-400">
                  <Shield size={14} className="text-gold-400" />
                  <span>Dx: {record.diagnosis || 'Ninguno'}</span>
                </div>
                <div className="flex gap-2 items-center text-slate-400">
                  <Activity size={14} className="text-blue-400" />
                  <span>Tx: {record.treatment || 'Ninguno'}</span>
                </div>
              </div>

              {record.observations && (
                <div className="mt-4 p-2 bg-white/5 rounded-lg text-[10px] text-slate-400">
                  <strong className="text-slate-300">Seguimiento:</strong> {record.observations}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
