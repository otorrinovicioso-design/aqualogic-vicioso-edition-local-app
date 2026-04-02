import React, { useEffect } from 'react';
import { CensusSubgroup, SubgroupType } from '../types';
import { Card, Button, Input } from './UI';
import { Plus, Minus, Info, Users, Baby, Fish } from 'lucide-react';

interface CensusProps {
  censusData: CensusSubgroup[];
  onUpdate: (id: string, quantity: number) => void;
  onInit: (data: Partial<CensusSubgroup>) => void;
}

const VALID_SUBGROUPS: SubgroupType[] = [
  'Reproductores Masculinos',
  'Reproductores Femeninos',
  'Betteras recirculadas',
  'Betta-sorority',
  'Guppys Machos',
  'Guppys Hembras',
  'Alevines'
];

export const Census: React.FC<CensusProps> = ({ censusData, onUpdate, onInit }) => {

  useEffect(() => {
    const existingTypes = censusData.map(c => c.type);
    VALID_SUBGROUPS.forEach(type => {
      if (!existingTypes.includes(type)) {
        onInit({
          type,
          quantity: 0,
          lastUpdated: new Date().toISOString()
        });
      }
    });
  }, [censusData, onInit]);

  const getIconForType = (type: SubgroupType) => {
    switch (type) {
      case 'Alevines': return <Baby size={20} />;
      case 'Reproductores Masculinos': 
      case 'Reproductores Femeninos': return <Users size={20} />;
      case 'Guppys Machos':
      case 'Guppys Hembras': return <Fish size={20} />;
      default: return <Fish size={20} />;
    }
  };

  // Filtrado estricto para limpiar categorías antiguas
  const filteredData = censusData
    .filter(c => VALID_SUBGROUPS.includes(c.type))
    .sort((a,b) => VALID_SUBGROUPS.indexOf(a.type) - VALID_SUBGROUPS.indexOf(b.type));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter">Inventario Vital</h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Registro de Población Activa</p>
      </div>

      <div className="grid gap-3">
        {filteredData.map((item) => (
          <Card key={item.id} className="p-4 flex items-center gap-4 bg-white/5 border border-white/10 group hover:border-aqua-400/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400 group-hover:bg-aqua-400/20 transition-all">
              {getIconForType(item.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-xs truncate uppercase tracking-widest">{item.type}</h4>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-tight">{item.quantity} Ejemplares</p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onUpdate(item.id, Math.max(0, item.quantity - 1))}><Minus size={14} /></Button>
              <div className="w-14"><Input type="number" value={item.quantity} onChange={(e) => onUpdate(item.id, parseInt(e.target.value) || 0)} className="text-center h-8 bg-slate-900 border-white/5 text-white font-bold text-sm" /></div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onUpdate(item.id, item.quantity + 1)}><Plus size={14} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
