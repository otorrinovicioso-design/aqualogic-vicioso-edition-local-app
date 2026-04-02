import React, { useState } from 'react';
import { Breeding, Breeder } from '../types';
import { Card, Button, Input, Select, Label } from './UI';
import { Plus, X, Heart, Microscope, Target, Baby, Users } from 'lucide-react';

interface BreedingModuleProps {
  breedingRecords: Breeding[];
  breeders: Breeder[];
  onAdd: (record: Partial<Breeding>) => void;
}

export const BreedingModule: React.FC<BreedingModuleProps> = ({ breedingRecords, breeders, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Breeding>>({
    pairName: '',
    maleId: '',
    femaleId: '',
    traitsSought: '',
    geneticGoals: '',
    status: 'Iniciado'
  });

  const males = breeders.filter(b => b.sex === 'Macho' && b.status === 'Activo');
  const females = breeders.filter(b => b.sex === 'Hembra' && b.status === 'Activo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      startDate: new Date().toISOString(),
    });
    setFormData({ pairName: '', maleId: '', femaleId: '', traitsSought: '', geneticGoals: '', status: 'Iniciado' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div>
          <h3 className="text-2xl font-display font-bold font-white">Genética y Desoves</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Control de Selección y Cría</p>
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
            <h4 className="font-bold text-aqua-400">Nuevo Emparejamiento</h4>
            
            <div>
              <Label>Nombre de la Prole / Proyecto</Label>
              <Input 
                value={formData.pairName} 
                onChange={e => setFormData({...formData, pairName: e.target.value})} 
                placeholder="Ej: Proyecto Dragón Azul 2024" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Padre (Macho Elite)</Label>
                <Select value={formData.maleId} onChange={e => setFormData({...formData, maleId: e.target.value})} required>
                  <option value="">Seleccionar Macho...</option>
                  {males.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </Select>
              </div>
              <div>
                <Label>Madre (Hembra Elite)</Label>
                <Select value={formData.femaleId} onChange={e => setFormData({...formData, femaleId: e.target.value})} required>
                  <option value="">Seleccionar Hembra...</option>
                  {females.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Select>
              </div>
            </div>

            <div>
              <Label>Objetivo Genético / Rasgos Buscados</Label>
              <Input 
                value={formData.geneticGoals} 
                onChange={e => setFormData({...formData, geneticGoals: e.target.value})} 
                placeholder="Ej: Mayor apertura caudal, color sólido" 
              />
            </div>

            <Button type="submit" className="w-full">Registrar Desove</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {breedingRecords.length === 0 ? (
          <p className="text-center text-slate-500 py-10 italic">No hay registros de cría activos.</p>
        ) : (
          breedingRecords.sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((record) => {
            const male = breeders.find(b => b.id === record.maleId);
            const female = breeders.find(b => b.id === record.femaleId);

            return (
              <Card key={record.id} className="relative bg-white/5 border border-white/5 overflow-hidden group">
                {/* Visual Connector */}
                <div className="absolute top-0 left-0 w-1 h-full bg-pink-500/50" />
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                        <Heart size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-md">{record.pairName}</h4>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Iniciado: {new Date(record.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-center">
                      <p className="text-[8px] text-blue-400 uppercase font-bold mb-1">Padre</p>
                      <p className="text-xs text-white font-bold truncate">{male?.name || 'Desconocido'}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-pink-500/5 border border-pink-500/10 text-center">
                      <p className="text-[8px] text-pink-400 uppercase font-bold mb-1">Madre</p>
                      <p className="text-xs text-white font-bold truncate">{female?.name || 'Desconocida'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg border border-white/5">
                    <Target size={14} className="text-aqua-400" />
                    <span className="text-[10px] text-slate-400 truncate">
                      <strong className="text-slate-200">Meta:</strong> {record.geneticGoals}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="px-2 py-1 rounded bg-white/5 text-slate-500 text-[8px] font-bold uppercase tracking-widest border border-white/10">
                      Estado: {record.status}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-pink-400 font-bold uppercase tracking-widest">
                      <Baby size={14} />
                      <span>{record.fryCount || 0} Alevines</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
