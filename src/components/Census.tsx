import React, { useState } from 'react';
import { Animal, Species, MovementType } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { Plus, X, Fish } from 'lucide-react';

interface CensusProps {
  animals: Animal[];
  onAdd: (animal: Partial<Animal>) => void;
  onDelete: (id: string) => void;
}

export const Census: React.FC<CensusProps> = ({ animals, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Betta' as Species,
    traits: '',
    movementType: 'Entrada' as MovementType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      species: formData.species,
      traits: formData.traits,
      status: formData.movementType === 'Salida' ? 'Baja' : 'Activo',
      entryDate: new Date().toISOString(),
    });
    setFormData({ name: '', species: 'Betta', traits: '', movementType: 'Entrada' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Censo y Población</h3>
        <Button variant={showForm ? 'ghost' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre / ID</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Especie</Label>
                <Select value={formData.species} onChange={e => setFormData({...formData, species: e.target.value as Species})}>
                  <option value="Betta">Betta</option>
                  <option value="Guppy">Guppy</option>
                  <option value="Otro">Otro</option>
                </Select>
              </div>
              <div>
                <Label>Movimiento</Label>
                <Select value={formData.movementType} onChange={e => setFormData({...formData, movementType: e.target.value as MovementType})}>
                  <option value="Entrada">Entrada</option>
                  <option value="Salida">Salida</option>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Registrar</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {animals.map((animal) => (
          <Card key={animal.id} className="flex items-center gap-4 p-4">
            <Fish className="text-aqua-400" />
            <div className="flex-1">
              <h4 className="font-bold text-white">{animal.name}</h4>
              <p className="text-xs text-slate-500">{animal.species} • {animal.status}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
