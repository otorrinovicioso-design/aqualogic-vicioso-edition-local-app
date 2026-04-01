import React, { useState } from 'react';
import { Maintenance } from '../types';
import { Card, Button, Input, Label } from './UI';
import { Wrench } from 'lucide-react';

export const MaintenanceModule: React.FC<{maintenanceRecords: Maintenance[], onAdd: any}> = ({ maintenanceRecords, onAdd }) => {
  const [task, setTask] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    onAdd({ task, date: new Date().toISOString() });
    setTask('');
  };
  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input placeholder="Nueva tarea..." value={task} onChange={e => setTask(e.target.value)} />
        <Button size="sm">Add</Button>
      </form>
    </Card>
  );
};
