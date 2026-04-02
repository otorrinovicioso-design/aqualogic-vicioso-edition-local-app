import React, { useState } from 'react';
import { Loss, SubgroupType, CensusSubgroup, Breeder } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { MinusCircle, X, Trash2, ShoppingCart, Info, Star } from 'lucide-react';

interface LossesModuleProps {
  losses: Loss[];
  censusData: CensusSubgroup[];
  breeders: Breeder[];
  onAdd: (loss: Partial<Loss>) => void;
  onUpdateCensus: (subgroupType: SubgroupType, delta: number) => void;
  onUpdateBreeder: (id: string, updates: Partial<Breeder>) => void;
}

const VALID_SUBGROUPS: SubgroupType[] = [
  'Reproductores Masculinos', 'Reproductores Femeninos', 'Betteras recirculadas', 'Betta-sorority', 'Guppys Machos', 'Guppys Hembras', 'Alevines'
];

export const LossesModule: React.FC<LossesModuleProps> = ({ losses, censusData, breeders, onAdd, onUpdateCensus, onUpdateBreeder }) => {
  const [showForm, setShowForm] = useState(false);
  const [isElite, setIsElite] = useState(false);
  const [formData, setFormData] = useState<Partial<Loss>>({ quantity: 1, subgroup: 'Alevines', type: 'Muerte', breederId: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isElite && formData.breederId) {
       const b = breeders.find(x => x.id === formData.breederId);
       if (b) {
          const type = b.sex === 'Macho' ? 'Reproductores Masculinos' : 'Reproductores Femeninos';
          onAdd({ ...formData, date: new Date().toISOString(), quantity: 1, subgroup: type });
          onUpdateBreeder(b.id, { status: 'Baja' });
          onUpdateCensus(type, -1);
       }
    } else {
       onAdd({ ...formData, date: new Date().toISOString() });
       onUpdateCensus(formData.subgroup as SubgroupType, -(formData.quantity || 0));
    }
    setShowForm(false);
    setIsElite(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div><h3 className="text-2xl font-bold uppercase tracking-tighter">Bajas y Salidas</h3><p className="text-[10px] text-slate-500 uppercase font-bold">Control de Mortalidad y Ventas</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full w-10 h-10 p-0">{showForm ? <X size={20} /> : <MinusCircle size={20} />}</Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-4">
               <button type="button" onClick={() => setIsElite(false)} className={cn("flex-1 py-1.5 rounded-lg border text-[8px] font-black uppercase transition-all", !isElite ? "bg-aqua-400 text-slate-950" : "bg-white/5 text-slate-500")}>Censo General</button>
               <button type="button" onClick={() => setIsElite(true)} className={cn("flex-1 py-1.5 rounded-lg border text-[8px] font-black uppercase transition-all", isElite ? "bg-orange-500 text-slate-950" : "bg-white/5 text-slate-500")}>Reproductor Elite</button>
            </div>
            {isElite ? (
               <div><Label>Seleccionar Reproductor</Label><Select value={formData.breederId} onChange={e => setFormData({...formData, breederId: e.target.value})} required><option value="">Elegir...</option>{breeders.filter(b => b.status === 'Activo').map(b => (<option key={b.id} value={b.id}>{b.name} ({b.traits})</option>))}</Select></div>
            ) : (
               <div className="grid grid-cols-2 gap-4">
                  <div><Label>Cantidad</Label><Input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} min="1" required /></div>
                  <div><Label>Subgrupo</Label><Select value={formData.subgroup} onChange={e => setFormData({...formData, subgroup: e.target.value as SubgroupType})} required>{VALID_SUBGROUPS.map(t => (<option key={t} value={t}>{t}</option>))}</Select></div>
               </div>
            )}
            <div className="grid grid-cols-2 gap-4">
               <div><Label>Tipo</Label><Select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}><option value="Muerte">Muerte</option><option value="Venta">Venta</option></Select></div>
               <div className="flex-1"><Label>Detalle</Label><Input value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Opcional" /></div>
            </div>
            <Button type="submit" className="w-full bg-red-600 font-bold uppercase text-[10px]">Registrar Salida Definitiva</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-3">
        {losses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((loss) => (
          <Card key={loss.id} className="p-4 bg-white/5 border border-white/5 flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", loss.type === 'Muerte' ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500")}>{loss.type === 'Muerte' ? <Trash2 size={20} /> : <ShoppingCart size={20} />}</div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between"><h4 className="font-bold text-white text-[11px] uppercase">{loss.quantity} {loss.type}</h4><span className="text-[8px] text-slate-600 uppercase font-black">{new Date(loss.date).toLocaleDateString()}</span></div>
               <p className="text-[9px] text-slate-500 font-black uppercase flex items-center gap-1">{loss.subgroup} {loss.breederId && breeders.find(b => b.id === loss.breederId) && <span className="text-orange-400">• <Star size={8} /> {breeders.find(b => b.id === loss.breederId)?.name}</span>}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
