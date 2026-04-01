import React, { useState } from 'react';
import { Breeding, Animal } from '../types';
import { Card, Button, Input, Select, Label } from './UI';
import { GitBranch } from 'lucide-react';

export const BreedingModule: React.FC<{breedingRecords: Breeding[], animals: Animal[], onAdd: any}> = ({ breedingRecords, animals, onAdd }) => {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <GitBranch className="text-gold-500" />
        <h3 className="font-bold text-white">Reproducción</h3>
      </div>
      <p className="text-xs text-slate-500 mt-2 italic">Módulo de cría activo localmente.</p>
    </Card>
  );
};
