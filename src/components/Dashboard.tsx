import React from 'react';
import { WaterParameter, Incident, CensusSubgroup } from '../types';
import { Card } from './UI';
import { 
  AlertTriangle, 
  Droplets, 
  Fish, 
  Activity,
  Layers,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  censusData: CensusSubgroup[];
  waterParams: WaterParameter[];
  incidents: Incident[];
}

const VALID_SUBGROUPS = [
  'Reproductores Masculinos',
  'Reproductores Femeninos',
  'Betteras recirculadas',
  'Betta-sorority',
  'Guppys Machos',
  'Guppys Hembras',
  'Alevines'
];

export const Dashboard: React.FC<DashboardProps> = ({ censusData, waterParams, incidents }) => {
  const latestParams = waterParams[0];
  const activeIncidents = incidents.filter(i => !i.resolved);
  
  const filteredCensus = censusData.filter(c => VALID_SUBGROUPS.includes(c.type));
  const totalStock = filteredCensus.reduce((acc, curr) => acc + curr.quantity, 0);

  const males = filteredCensus.filter(c => 
    c.type === 'Reproductores Masculinos' || 
    c.type === 'Betteras recirculadas' || 
    c.type === 'Guppys Machos'
  );
  const females = filteredCensus.filter(c => 
    c.type === 'Reproductores Femeninos' || 
    c.type === 'Betta-sorority' || 
    c.type === 'Guppys Hembras'
  );
  
  const totalMales = males.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalFemales = females.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-aqua-400/10 border-aqua-400/20 p-4 h-32 flex flex-col justify-between">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-aqua-400/20 flex items-center justify-center text-aqua-400"><Fish size={20} /></div><span className="text-[10px] text-aqua-400 uppercase font-bold tracking-widest">STOCK TOTAL</span></div>
          <div className="flex items-end justify-between"><span className="text-3xl font-display font-bold text-white">{totalStock}</span><div className="text-[9px] text-aqua-400/80 font-bold uppercase text-right leading-none"><p>{totalMales} M</p><p>{totalFemales} H</p></div></div>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20 p-4 h-32 flex flex-col justify-between">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500"><AlertTriangle size={20} /></div><span className="text-[10px] text-red-500 uppercase font-bold tracking-widest">ALERTAS</span></div>
          <div className="flex items-end justify-between"><span className="text-3xl font-display font-bold text-white">{activeIncidents.length}</span><span className="text-[9px] text-red-500/80 font-bold uppercase tracking-widest">ACTUAL</span></div>
        </Card>
      </div>

      <Card className="p-5 bg-white/5 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2"><Layers size={18} className="text-gold-400" /><h3 className="text-xs uppercase font-black tracking-widest text-white">Inventario Detallado</h3></div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-3">
            <p className="text-[8px] font-black text-blue-400/50 uppercase tracking-widest mb-1">Macho / Masculinos</p>
            {males.map(item => (<div key={item.id} className="flex justify-between items-center bg-blue-500/5 p-2 rounded-lg border border-blue-500/10"><span className="text-[9px] text-slate-400 font-bold uppercase truncate pr-4">{item.type}</span><span className="text-xs font-bold text-white tracking-tighter">{item.quantity}</span></div>))}
          </div>
          <div className="space-y-3">
            <p className="text-[8px] font-black text-pink-400/50 uppercase tracking-widest mb-1">Hembra / Femeninos</p>
            {females.map(item => (<div key={item.id} className="flex justify-between items-center bg-pink-500/5 p-2 rounded-lg border border-pink-500/10"><span className="text-[9px] text-slate-400 font-bold uppercase truncate pr-4">{item.type}</span><span className="text-xs font-bold text-white tracking-tighter">{item.quantity}</span></div>))}
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-white/5 border border-white/5">
        <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><Droplets size={20} className="text-aqua-400" /><span className="text-[10px] font-bold text-white uppercase tracking-widest">Análisis Técnico</span></div><div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} />{latestParams ? new Date(latestParams.date).toLocaleString() : 'PENDIENTE'}</div></div>
        {latestParams ? (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
            {[ {l:'pH',v:latestParams.ph,c:'text-aqua-400'}, {l:'T°',v:latestParams.temp,c:'text-white'}, {l:'gH',v:latestParams.gh,c:'text-slate-400'}, {l:'kH',v:latestParams.kh,c:'text-slate-400'}, {l:'NH3',v:latestParams.nh3,c:'text-orange-500'}, {l:'NO2',v:latestParams.no2,c:'text-red-500'}, {l:'NO3',v:latestParams.no3,c:'text-orange-400'} ].map(m => (
              <div key={m.l} className="text-center group"><p className="text-[7px] text-slate-600 uppercase font-black mb-1">{m.l}</p><p className={`text-sm font-bold ${m.c}`}>{m.v || '-'}</p></div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest animate-pulse italic">Sin registros de parámetros técnicos</p>
        )}
      </Card>
    </div>
  );
};
