import React, { useState } from 'react';
import { HealthRecord, Animal } from '../types';
import { Card, Button, Input, Select, Label } from './UI';
import { Plus, X, HeartPulse } from 'lucide-react';

interface HealthProps {
  healthRecords: HealthRecord[];
  animals: Animal[];
  onAdd: (record: Partial<HealthRecord>) => void;
}

export const Health: React.FC<HealthProps> = ({ healthRecords, animals, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    animalId: '', observations: '', diagnosis: '', treatment: '', dosage: '', duration: '', result: 'En tratamiento' as HealthRecord['result'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: new Date().toISOString(),
    });
    setFormData({
      animalId: '', observations: '', diagnosis: '', treatment: '', dosage: '', duration: '', result: 'En tratamiento',
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Bitácora Sanitaria</h3>
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
              <Label>Ejemplar</Label>
              <Select value={formData.animalId} onChange={e => setFormData({...formData, animalId: e.target.value})} required>
                <option value="">Seleccionar ejemplar...</option>
                {animals.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.species})</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Diagnóstico Presuntivo</Label>
                <Input value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} required />
              </div>
              <div>
                <Label>Tratamiento</Label>
                <Input value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} required />
              </div>
            </div>
            <Button type="submit" className="w-full">Registrar Caso</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {healthRecords.map((record) => {
          const animal = animals.find(a => a.id === record.animalId);
          return (
            <Card key={record.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                    <HeartPulse size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{animal?.name || 'Ejemplar Desconocido'}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 italic">"{record.observations}"</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
