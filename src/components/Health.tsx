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
    animalId: '', observations: '', diagnosis: '', treatment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, date: new Date().toISOString() });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Salud</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </Button>
      </div>

      {healthRecords.map(record => (
        <Card key={record.id} className="p-4">
          <div className="flex gap-3">
            <HeartPulse className="text-red-400" />
            <div>
              <p className="font-bold text-white">{record.diagnosis}</p>
              <p className="text-xs text-slate-500">{record.treatment}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
