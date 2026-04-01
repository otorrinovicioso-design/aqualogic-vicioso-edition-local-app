import React from 'react';
import { Fish, Droplets, AlertTriangle, Activity } from 'lucide-react';
import { Card } from './UI';
import { Animal, WaterParameter, Incident } from '../types';

export const Dashboard: React.FC<{animals: Animal[], waterParams: WaterParameter[], incidents: Incident[]}> = ({ animals, waterParams, incidents }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <Fish className="text-aqua-400 mb-2" />
        <p className="text-2xl font-bold text-white">{animals.length}</p>
        <p className="text-xs text-slate-500 uppercase">Peces</p>
      </Card>
      <Card className="p-4">
        <AlertTriangle className="text-gold-500 mb-2" />
        <p className="text-2xl font-bold text-white">{incidents.length}</p>
        <p className="text-xs text-slate-500 uppercase">Alertas</p>
      </Card>
    </div>
  );
};
