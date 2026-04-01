import React, { useState } from 'react';
import { Breeding, Animal } from '../types';
import { Card, Button, Input, Select, Label } from './UI';
import { Plus, X, GitBranch, Target } from 'lucide-react';

interface BreedingModuleProps {
  breedingRecords: Breeding[];
  animals: Animal[];
  onAdd: (record: Partial<Breeding>) => void;
}

export const BreedingModule: React.FC<BreedingModuleProps> = ({ breedingRecords, animals, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pairName: '',
    maleId: '',
    femaleId: '',
    geneticGoals: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      startDate: new Date().toISOString(),
      status: 'En Proceso',
      fryCount: 0,
    });
    setFormData({ pairName: '', maleId: '', femaleId: '', geneticGoals: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Reproducción y Genética</h3>
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
              <Label>Nombre de la Pareja / Proyecto</Label>
              <Input value={formData.pairName} onChange={e => setFormData({...formData, pairName: e.target.value})} placeholder="Ej: Proyecto Blue HM" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Macho (Padre)</Label>
                <Select value={formData.maleId} onChange={e => setFormData({...formData, maleId: e.target.value})} required>
                  <option value="">Seleccionar...</option>
                  {animals.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Hembra (Madre)</Label>
                <Select value={formData.femaleId} onChange={e => setFormData({...formData, femaleId: e.target.value})} required>
                  <option value="">Seleccionar...</option>
                  {animals.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label>Objetivos Genéticos</Label>
              <Input value={formData.geneticGoals} onChange={e => setFormData({...formData, geneticGoals: e.target.value})} placeholder="Ej: Mejorar apertura caudal" />
            </div>
            <Button type="submit" className="w-full">Registrar Cruce</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {breedingRecords.map((record) => {
          const male = animals.find(a => a.id === record.maleId);
          const female = animals.find(a => a.id === record.femaleId);
          return (
            <Card key={record.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                    <GitBranch size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{record.pairName}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Iniciado: {new Date(record.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20">
                  {record.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">Padre</p>
                  <p className="text-xs font-medium text-white">{male?.name || 'N/A'}</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">Madre</p>
                  <p className="text-xs font-medium text-white">{female?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-aqua-400">
                <Target size={14} />
                <span>Meta: {record.geneticGoals}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
