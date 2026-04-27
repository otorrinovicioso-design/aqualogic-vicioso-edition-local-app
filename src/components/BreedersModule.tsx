import React, { useState } from 'react';
import { Breeder, Species } from '../types';
import { Card, Button, Input, Label, Select } from './UI';
import { Plus, X, Star, MapPin, Calendar, Trash2 } from 'lucide-react';

interface BreedersModuleProps {
  breeders: Breeder[];
  onAdd: (breeder: Partial<Breeder>) => void;
  onDelete: (id: string) => void;
}

export const BreedersModule: React.FC<BreedersModuleProps> = ({ breeders, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Breeder>>({
    name: '',
    species: 'Betta',
    sex: 'Macho',
    traits: '',
    provenance: '',
    status: 'Activo'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      entryDate: new Date().toISOString(),
    });
    setFormData({ name: '', species: 'Betta', sex: 'Macho', traits: '', provenance: '', status: 'Activo' });
    setShowForm(false);
  };

  // Filtrar para mostrar solo reproductores activos en la lista principal
  const activeBreeders = breeders.filter(b => b.status === 'Activo');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div>
          <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Reproductores Elite</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black font-white">Seguimiento Individual de Ejemplares</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
          size="sm" 
          onClick={() => setShowForm(!showForm)}
          className="rounded-full w-10 h-10 p-0 text-white shadow-lg"
        >
          {showForm ? <X size={20} className="transition-transform" /> : <Plus size={20} />}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300 border-white/10 bg-white/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre / ID</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Ej: Blue Dragon M1" 
                  required 
                />
              </div>
              <div>
                <Label>Sexo</Label>
                <Select 
                  value={formData.sex} 
                  onChange={e => setFormData({...formData, sex: e.target.value as any})}
                >
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Especie</Label>
                <Select 
                  value={formData.species} 
                  onChange={e => setFormData({...formData, species: e.target.value as Species})}
                >
                  <option value="Betta">Betta</option>
                  <option value="Guppy">Guppy</option>
                  <option value="Otro">Otro</option>
                </Select>
              </div>
              <div>
                <Label>Procedencia (Origen)</Label>
                <Input 
                  value={formData.provenance} 
                  onChange={e => setFormData({...formData, provenance: e.target.value})} 
                  placeholder="Ej: Criadero X / Import" 
                />
              </div>
            </div>

            <div>
              <Label>Características / Genética</Label>
              <Input 
                value={formData.traits} 
                onChange={e => setFormData({...formData, traits: e.target.value})} 
                placeholder="Ej: Halfmoon, Escama Dragón, Portador de Rojo" 
              />
            </div>

            <Button type="submit" className="w-full h-10 font-bold uppercase text-[10px] tracking-widest bg-aqua-400 text-slate-950">Registrar Reproductor</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {activeBreeders.length === 0 ? (
          <p className="text-center text-slate-500 py-10 italic">No hay reproductores activos registrados.</p>
        ) : (
          activeBreeders.map((breeder) => (
            <Card key={breeder.id} className="relative overflow-hidden group bg-white/5 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  breeder.sex === 'Macho' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'
                }`}>
                  <Star size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-lg font-display uppercase tracking-tighter">{breeder.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{breeder.species} • {breeder.sex}</p>
                    </div>
                    <button 
                      onClick={() => onDelete(breeder.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase">
                      <MapPin size={14} className="text-aqua-400" />
                      <span>Procedencia: <span className="text-slate-200">{breeder.provenance || 'No especificada'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase">
                      <Star size={14} className="text-gold-400" />
                      <span>Rasgos: <span className="text-slate-200">{breeder.traits}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase">
                      <Calendar size={14} />
                      <span>Ingreso: {new Date(breeder.entryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 p-4">
                <span className="px-2 py-1 bg-aqua-400/10 text-aqua-400 rounded-md text-[8px] font-bold uppercase">
                  {breeder.status}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
