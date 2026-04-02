import React, { useEffect } from 'react';
import { CensusSubgroup, SubgroupType, Breeding } from '../types';
import { Card, Button, Input } from './UI';
import { Plus, Minus, Baby, Fish, Calendar } from 'lucide-react';

interface CensusProps {
  censusData: CensusSubgroup[];
  breedingProjects: Breeding[]; 
  onUpdate: (id: string, quantity: number) => void;
  onInit: (data: Partial<CensusSubgroup>) => void;
}

const VALID_SUBGROUPS: SubgroupType[] = [
  'Reproductores Masculinos', 'Reproductores Femeninos', 'Betteras recirculadas', 'Betta-sorority', 'Guppys Machos', 'Guppys Hembras', 'Alevines Betta', 'Alevines Guppys'
];

export const Census: React.FC<CensusProps> = ({ censusData, breedingProjects, onUpdate, onInit }) => {
  useEffect(() => {
    const existing = censusData.map(c => c.type);
    VALID_SUBGROUPS.forEach(type => {
      if (!existing.includes(type)) onInit({ type, quantity: 0, lastUpdated: new Date().toISOString() });
    });
  }, [censusData, onInit]);

  const latestSpawn = breedingProjects
    .filter(p => p.spawnDate && !p.isFinished)
    .sort((a, b) => new Date(b.spawnDate!).getTime() - new Date(a.spawnDate!).getTime())[0];

  const filteredData = censusData
    .filter(c => VALID_SUBGROUPS.includes(c.type))
    .sort((a,b) => VALID_SUBGROUPS.indexOf(a.type) - VALID_SUBGROUPS.indexOf(b.type));

  return (
    <div className="space-y-6">
      <div><h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter">Censo Vital</h3><p className="text-[10px] text-slate-500 uppercase font-black">Control de Población Activa</p></div>
      <div className="grid gap-3">
        {filteredData.map((item) => (
          <Card key={item.id} className="p-4 flex flex-col gap-4 bg-white/5 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400 transition-all">{item.type.includes('Alevines') ? <Baby size={20} /> : <Fish size={20} />}</div>
              <div className="flex-1 min-w-0"><h4 className="font-bold text-white text-[10px] font-white uppercase tracking-widest truncate">{item.type}</h4><p className="text-[14px] font-bold text-white uppercase">{item.quantity} EJEMPLARES</p></div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onUpdate(item.id, Math.max(0, item.quantity - 1))}><Minus size={14} /></Button>
                <div className="w-12"><Input type="number" value={item.quantity} onChange={(e) => onUpdate(item.id, parseInt(e.target.value) || 0)} className="text-center h-8 bg-slate-900 border-white/5 text-white font-bold" /></div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onUpdate(item.id, item.quantity + 1)}><Plus size={14} /></Button>
              </div>
            </div>
            {item.type.includes('Alevines') && (
              <div className="p-2 rounded bg-slate-900 border border-white/5 flex items-center justify-between text-[8px] font-black uppercase text-aqua-400">
                <div className="flex items-center gap-1.5"><Calendar size={10}/> Desove</div>
                <div className="text-white">{latestSpawn ? new Date(latestSpawn.spawnDate!).toLocaleDateString() : 'SIN PENDIENTES'}</div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
