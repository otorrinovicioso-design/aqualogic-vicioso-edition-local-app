import React, { useState } from 'react';
import { 
  Animal, 
  Species, 
  Status, 
  MovementType 
} from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { 
  Plus, 
  X, 
  Search, 
  Filter, 
  Fish, 
  ChevronRight,
  MoreVertical,
  History,
  Trash2
} from 'lucide-react';

interface CensusProps {
  animals: Animal[];
  onAdd: (animal: Partial<Animal>) => void;
  onDelete: (id: string) => void;
}

export const Census: React.FC<CensusProps> = ({ animals, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    species: 'Betta' as Species,
    traits: '',
    movementType: 'Entrada' as MovementType,
  });

  const filteredAnimals = animals.filter(a => 
    a.name.toLowerCase().includes(filter.toLowerCase()) ||
    a.species.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onAdd({
        name: formData.name,
        species: formData.species,
        traits: formData.traits,
        status: formData.movementType === 'Salida' ? 'Baja' : 'Activo',
        entryDate: new Date().toISOString(),
      });
      setFormData({ name: '', species: 'Betta', traits: '', movementType: 'Entrada' });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding animal:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Censo y Población</h3>
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
              <Label>Nombre del Ejemplar / Registro</Label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ej: B-01 Blue Mask" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Especie / Variedad</Label>
                <Select 
                  value={formData.species} 
                  onChange={e => setFormData({...formData, species: e.target.value as Species})}
                >
                  <option value="Betta">Betta Splendens</option>
                  <option value="Guppy">Guppy (Poecilia)</option>
                  <option value="Otro">Otro</option>
                </Select>
              </div>
              <div>
                <Label>Tipo de Movimiento</Label>
                <Select 
                  value={formData.movementType} 
                  onChange={e => setFormData({...formData, movementType: e.target.value as MovementType})}
                >
                  <option value="Entrada">Entrada (Compra/Cría)</option>
                  <option value="Salida">Salida (Venta/Baja)</option>
                </Select>
              </div>
            </div>
            <div>
              <Label>Rasgos / Notas Genéticas</Label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-aqua-400/50 transition-all min-h-[80px]"
                placeholder="Ej: Halfmoon, Sangre Cooper, excelente apertura"
                value={formData.traits}
                onChange={e => setFormData({...formData, traits: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full">Registrar Movimiento</Button>
          </form>
        </Card>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o especie..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-aqua-400 transition-colors"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="sm" className="px-3">
          <Filter size={16} />
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredAnimals.map((animal) => (
          <Card key={animal.id} className="p-4 group hover:bg-white/[0.07] transition-all">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                animal.status === 'Activo' ? "bg-aqua-400/10 text-aqua-400" : "bg-slate-800 text-slate-500"
              )}>
                <Fish size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white truncate">{animal.name}</h4>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    animal.status === 'Activo' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {animal.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{animal.species}</p>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-600 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <History size={12} />
                    {new Date(animal.entryDate).toLocaleDateString()}
                  </span>
                  {animal.traits && (
                    <span className="truncate max-w-[150px]">• {animal.traits}</span>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-400 hover:bg-red-500/10 border-none p-2"
                onClick={() => onDelete(animal.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
