import React, { useState } from 'react';
import { Incident } from '../types';
import { Card, AlertTriangle } from './UI';

export const Incidents: React.FC<{incidents: Incident[], onAdd: any}> = ({ incidents }) => {
  return (
    <div className="space-y-4">
      {incidents.map(i => (
        <Card key={i.id} className="flex gap-3 border-l-4 border-red-500">
          <AlertTriangle className="text-red-500" />
          <div>
            <h4 className="font-bold text-white">{i.title}</h4>
            <p className="text-xs text-slate-500">{i.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
