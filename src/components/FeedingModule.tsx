import React from 'react';
import { Feeding } from '../types';
import { Card, Utensils } from './UI';

export const FeedingModule: React.FC<{feedingRecords: Feeding[], onAdd: any}> = ({ feedingRecords }) => {
  return (
    <div className="space-y-4">
      {feedingRecords.map(f => (
        <Card key={f.id} className="flex gap-3">
          <Utensils className="text-gold-500" />
          <p className="text-sm text-white">{f.foodType} - {f.amount}</p>
        </Card>
      ))}
    </div>
  );
};
