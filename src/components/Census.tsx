import React from 'react';
import { CensusSubgroup, Breeding, Breeder } from '../types';
import { Card, Button, Input, cn } from './UI';
import { Users, Plus, Minus, History, Trash2, Fish } from 'lucide-react';

interface CensusProps {
  censusData: CensusSubgroup[];
  breedingProjects: Breeding[];
  breeders: Breeder[];
  onUpdate: (id: string, quantity: number) => void;
  onInit: (data: Partial<CensusSubgroup>) => void;
}

const DEFAULT_GROUPS = [
  'Reproductores Masculinos',
  'Reproductores Femeninos',
  'Betteras recirculadas',
  'Betta-sorority',
  'Guppys Machos',
  'Guppys Hembras',
  'Alevines'
];

export const Census: React.FC<CensusProps> = ({ censusData = [], breedingProjects = [], breeders = [], onUpdate, onInit }) => {

  const getSubgroupQuantity = (type: string) => {
    const fromCensus = (censusData || []).find(c => c.type === type)?.quantity || 0;
    if (type === 'Reproductores Masculinos') { return fromCensus + (breeders || []).filter(b => b.sex === 'Macho').length; }
    if (type === 'Reproductores Femeninos') { return fromCensus + (breeders || []).filter(b => b.sex === 'Hembra').length; }
    return fromCensus;
  };

  const handleManualUpdate = (type: string, delta: number) => {
    const existing = censusData.find(c => c.type === type);
    if (existing) { onUpdate(existing.id, Math.max(0, existing.quantity + delta)); } 
    else { onInit({ type: type as any, quantity: Math.max(0, delta), lastUpdated: new Date().toISOString() }); }
  };

  const activeProjectNames = (breedingProjects || []).filter(p => !p.fase || p.fase !== 'Finalizado').map(p => p.nombre);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-white uppercase shadow-lg shadow-lg">
      <Card className="p-6 bg-slate-900/50 border-white/5 shadow-xl font-white uppercase shadow-lg shadow-lg">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5 font-white uppercase shadow-lg shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-aqua-400/20 flex items-center justify-center text-aqua-400 shadow-lg shadow-lg"><Users size={24} /></div>
          <div><h2 className="text-lg font-bold text-white tracking-widest shadow-lg shadow-lg">CONTROL DE CENSO</h2><p className="text-[10px] text-slate-500 font-black tracking-[0.2em] shadow-lg shadow-lg">GESTIÓN DE POBLACIÓN ACTIVA</p></div>
        </div>
        <div className="space-y-4 font-white uppercase shadow-lg shadow-lg">
          <p className="text-[10px] text-aqua-400/60 font-black tracking-widest pl-1 mb-2 shadow-lg shadow-lg">CATEGORÍAS ESTÁNDAR</p>
          {DEFAULT_GROUPS.map((group) => {
            const qty = getSubgroupQuantity(group);
            return (
              <div key={group} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 group hover:border-aqua-400/30 transition-all shadow-lg shadow-lg shadow-lg">
                <div className="flex flex-col shadow-lg shadow-lg"><span className="text-[11px] font-bold text-slate-300 tracking-wider shadow-lg shadow-lg">{group}</span>{(group === 'Reproductores Masculinos' || group === 'Reproductores Femeninos') && (<span className="text-[7px] text-slate-600 font-black shadow-lg shadow-lg">INCLUYE FICHAS TÉCNICAS</span>)}</div>
                <div className="flex items-center gap-4 shadow-lg shadow-lg shadow-lg">
                  <button onClick={() => handleManualUpdate(group, -1)} className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/50 transition-all shadow-lg shadow-lg active:scale-90 shadow-lg shadow-lg"><Minus size={16} /></button>
                  <div className="w-12 text-center shadow-lg shadow-lg"><span className="text-xl font-display font-bold text-white shadow-lg shadow-lg shadow-lg">{qty}</span></div>
                  <button onClick={() => handleManualUpdate(group, 1)} className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-aqua-400 hover:border-aqua-400/50 transition-all shadow-lg shadow-lg active:scale-90 shadow-lg shadow-lg"><Plus size={16} /></button>
                </div>
              </div>
            );
          })}
          {activeProjectNames.length > 0 && (
            <>
              <div className="pt-6 font-white uppercase shadow-lg shadow-lg"><p className="text-[10px] text-aqua-400/60 font-black tracking-widest pl-1 mb-2 shadow-lg shadow-lg shadow-lg">PROYECTOS DE CRÍA ACTIVOS</p></div>
              {activeProjectNames.map((projectName) => {
                const qty = getSubgroupQuantity(projectName);
                return (
                  <div key={projectName} className="flex items-center justify-between p-4 bg-aqua-400/5 rounded-2xl border border-aqua-400/10 group hover:border-aqua-400/30 transition-all shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                    <div className="flex items-center gap-3 shadow-lg shadow-lg shadow-lg"><Fish size={14} className="text-aqua-400 shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg" /><span className="text-[11px] font-bold text-white tracking-wider shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">{projectName}</span></div>
                    <div className="flex items-center gap-4 shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                      <button onClick={() => handleManualUpdate(projectName, -1)} className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-red-400 transition-all shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg"><Minus size={16} /></button>
                      <div className="w-12 text-center shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg"><span className="text-xl font-display font-bold text-white shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">{qty}</span></div>
                      <button onClick={() => handleManualUpdate(projectName, 1)} className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-aqua-400 transition-all shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg"><Plus size={16} /></button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
