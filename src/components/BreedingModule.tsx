import React, { useState } from 'react';
import { Breeding, Breeder, CensusSubgroup, SubgroupType } from '../types';
import { Card, Button, Input, Select, Label } from './UI';
import { Plus, X, Heart, Target, Baby, CheckCircle, History, Calendar, Layout } from 'lucide-react';

interface BreedingModuleProps {
  breedingRecords: Breeding[];
  breeders: Breeder[];
  censusData: CensusSubgroup[];
  onAdd: (record: Partial<Breeding>) => void;
  onUpdate: (id: string, updates: Partial<Breeding>) => void;
  onUpdateCensus: (type: SubgroupType, delta: number) => void;
}

export const BreedingModule: React.FC<BreedingModuleProps> = ({ 
  breedingRecords, 
  breeders, 
  censusData, 
  onAdd, 
  onUpdate, 
  onUpdateCensus 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState<string | null>(null);
  const [finishStats, setFinishStats] = useState({ males: 0, females: 0 });
  const [formData, setFormData] = useState<Partial<Breeding>>({
    pairName: '',
    maleId: '',
    femaleId: '',
    geneticGoals: '',
    status: 'Iniciado',
    spawnDate: ''
  });

  const males = breeders.filter(b => b.sex === 'Macho' && b.status === 'Activo');
  const females = breeders.filter(b => b.sex === 'Hembra' && b.status === 'Activo');

  const activeProjects = breedingRecords.filter(r => !r.isFinished);
  const finishedProjects = breedingRecords.filter(r => r.isFinished);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      startDate: new Date().toISOString(),
      isFinished: false
    });
    setFormData({ pairName: '', maleId: '', femaleId: '', geneticGoals: '', status: 'Iniciado', spawnDate: '' });
    setShowForm(false);
  };

  const handleUpdateFry = (id: string, count: number, oldCount: number) => {
    onUpdate(id, { fryCount: count });
    onUpdateCensus('Alevines', count - (oldCount || 0));
  };

  const finalizeProject = (id: string) => {
    const record = breedingRecords.find(r => r.id === id);
    if (!record) return;

    onUpdateCensus('Alevines', -(record.fryCount || 0));
    onUpdateCensus('Betteras recirculadas', finishStats.males);
    onUpdateCensus('Betta-sorority', finishStats.females);

    onUpdate(id, { 
      isFinished: true, 
      status: 'Terminado',
      finishDate: new Date().toISOString()
    });

    setShowFinishModal(null);
    setFinishStats({ males: 0, females: 0 });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center text-white">
        <div>
          <h3 className="text-2xl font-display font-bold">Genética y Desoves</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Proyectos de Cría</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} size="sm" 
          onClick={() => setShowForm(!showForm)}
          className="rounded-full w-10 h-10 p-0"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <h4 className="font-bold text-aqua-400">Nuevo Emparejamiento</h4>
            <div className="grid grid-cols-1 gap-4">
              <Label>Nombre del Proyecto</Label>
              <Input value={formData.pairName} onChange={e => setFormData({...formData, pairName: e.target.value})} required placeholder="Ej: Proyecto Draggon Azul 2024" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Padre (Macho Elite)</Label>
                <Select value={formData.maleId} onChange={e => setFormData({...formData, maleId: e.target.value})} required>
                  <option value="">Macho...</option>
                  {males.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </Select>
              </div>
              <div>
                <Label>Madre (Hembra Elite)</Label>
                <Select value={formData.femaleId} onChange={e => setFormData({...formData, femaleId: e.target.value})} required>
                  <option value="">Hembra...</option>
                  {females.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Fecha Desove</Label><Input type="date" value={formData.spawnDate} onChange={e => setFormData({...formData, spawnDate: e.target.value})} /></div>
              <div><Label>Estado</Label><Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}><option value="Iniciado">Iniciado</option><option value="Nido">Nido</option><option value="Eclosión">Eclosión</option><option value="Alevines">Alevines</option></Select></div>
            </div>
            <Button type="submit" className="w-full">Registrar Desove</Button>
          </form>
        </Card>
      )}

      {/* ACTIVE PROJECTS */}
      <div className="space-y-4">
        {activeProjects.map((record) => (
          <Card key={record.id} className="relative bg-white/5 border border-white/5 p-4 overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-pink-500" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400"><Heart size={20} /></div>
                <div><h4 className="font-bold text-white uppercase text-md">{record.pairName}</h4></div>
              </div>
              <Button size="sm" className="bg-emerald-600 h-8 text-[10px]" onClick={() => setShowFinishModal(record.id)}>TERMINAR</Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-4">
                <div className="flex-1"><Label className="text-[8px] uppercase">Alevines Logrados</Label><Input type="number" value={record.fryCount || 0} onChange={e => handleUpdateFry(record.id, parseInt(e.target.value) || 0, record.fryCount || 0)} className="bg-slate-900 text-center text-aqua-400" /></div>
                <div className="flex-1"><Label className="text-[8px] uppercase">Estado Actual</Label><Select value={record.status} onChange={e => onUpdate(record.id, { status: e.target.value as any })} className="bg-slate-900 text-[10px]"><option value="Iniciado">Iniciado</option><option value="Nido">Nido</option><option value="Eclosión">Eclosión</option><option value="Alevines">Alevines</option></Select></div>
              </div>
            </div>
            {showFinishModal === record.id && (
              <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col justify-center p-6 text-white">
                <h4 className="font-bold text-aqua-400 mb-4">Finalizar Proyecto</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><Label>Machos</Label><Input type="number" value={finishStats.males} onChange={e => setFinishStats({...finishStats, males: parseInt(e.target.value) || 0})} className="bg-blue-900/20" /></div>
                  <div><Label>Hembras</Label><Input type="number" value={finishStats.females} onChange={e => setFinishStats({...finishStats, females: parseInt(e.target.value) || 0})} className="bg-pink-900/20" /></div>
                </div>
                <Button className="w-full bg-emerald-600" onClick={() => finalizeProject(record.id)}>DISTRIBUIR EN CENSO</Button>
                <Button variant="ghost" onClick={() => setShowFinishModal(null)} className="mt-2">Cancelar</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
