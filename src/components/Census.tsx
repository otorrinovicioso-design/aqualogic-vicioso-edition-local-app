import React, { useEffect } from 'react';
import { CensusSubgroup, SubgroupType } from '../types';
import { Card, Button, Input } from './UI';
import { Plus, Minus, Info, Users, Baby, Fish } from 'lucide-react';

interface CensusProps {
  censusData: CensusSubgroup[];
  onUpdate: (id: string, quantity: number) => void;
  onInit: (data: Partial<CensusSubgroup>) => void;
}

const DEFAULT_SUBGROUPS: SubgroupType[] = [
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
    DEFAULT_SUBGROUPS.forEach(type => {
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
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-display font-bold text-white">Población General</h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest text-white font-bold font-white">Inventario por Subgrupos</p>
      </div>

      <div className="grid gap-3">
        {censusData.length === 0 ? (
          <div className="text-center text-slate-500 py-10 animate-pulse">Inicializando categorías...</div>
        ) : (
          censusData.slice().sort((a,b) => a.type.localeCompare(b.type)).map((item) => (
            <Card key={item.id} className="p-4 flex items-center gap-4 bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-aqua-400/10 flex items-center justify-center text-aqua-400">
                {getIconForType(item.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{item.type}</h4>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Stock: {item.quantity} ejemplares
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-lg h-8 w-8 p-0"
                  onClick={() => onUpdate(item.id, Math.max(0, item.quantity - 1))}
                >
                  <Minus size={14} />
                </Button>
                
                <div className="w-16">
                  <Input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => onUpdate(item.id, parseInt(e.target.value) || 0)}
                    className="text-center py-1 px-1 h-8 bg-slate-900 border-white/10"
                  />
                </div>

                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-lg h-8 w-8 p-0"
                  onClick={() => onUpdate(item.id, item.quantity + 1)}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
