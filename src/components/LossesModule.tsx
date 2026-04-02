import React, { useState } from 'react';
import { Loss, SubgroupType, CensusSubgroup } from '../types';
import { Card, Button, Input, Select, Label } from './UI';
import { MinusCircle, X, Trash2, ShoppingCart } from 'lucide-react';

interface LossesModuleProps {
  losses: Loss[];
  censusData: CensusSubgroup[];
  onAdd: (loss: Partial<Loss>) => void;
  onUpdateCensus: (subgroupType: SubgroupType, delta: number) => void;
}

export const LossesModule: React.FC<LossesModuleProps> = ({ losses, censusData, onAdd, onUpdateCensus }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Loss>>({ quantity: 1, subgroup: 'Alevines', type: 'Muerte' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, date: new Date().toISOString() });
    onUpdateCensus(formData.subgroup as SubgroupType, -(formData.quantity || 0));
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div><h3 className="text-2xl font-bold">Bajas y Salidas</h3><p className="text-[10px] text-slate-500 uppercase font-bold">Control de Mortalidad y Ventas</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full w-10 h-10 p-0">{showForm ? <X size={20} /> : <MinusCircle size={20} />}</Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Cantidad</Label><Input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} /></div>
              <div><Label>Tipo</Label><Select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}><option value="Muerte">Muerte</option><option value="Venta">Venta</option></Select></div>
            </div>
            <div><Label>Subgrupo</Label><Select value={formData.subgroup} onChange={e => setFormData({...formData, subgroup: e.target.value as SubgroupType})}>{censusData.map(c => <option key={c.id} value={c.type}>{c.type}</option>)}</Select></div>
            <Button type="submit" className="w-full bg-red-600">Registrar Salida</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {losses.map((loss) => (
          <Card key={loss.id} className="p-4 bg-white/5 border border-white/5 flex items-center gap-4 text-white">
            <div className={loss.type === 'Muerte' ? 'text-red-500' : 'text-green-500'}>{loss.type === 'Muerte' ? <Trash2 /> : <ShoppingCart />}</div>
            <div><h4 className="font-bold text-sm">{loss.quantity} {loss.subgroup}</h4><p className="text-[8px] text-slate-500 uppercase">{loss.type} - {new Date(loss.date).toLocaleDateString()}</p></div>
          </Card>
        ))}
      </div>
    </div>
  );
};
