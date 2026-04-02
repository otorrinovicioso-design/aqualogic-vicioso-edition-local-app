import React from 'react';
import { WaterParameter, Incident, CensusSubgroup } from '../types';
import { Card, cn } from './UI';
import { 
  AlertTriangle, 
  Droplets, 
  Fish, 
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
  'Alevines',
  'Desoves'
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
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-aqua-400/10 border-aqua-400/20 p-4 h-32 flex flex-col justify-between transition-all hover:bg-aqua-400/15">
           <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-aqua-400/20 flex items-center justify-center text-aqua-400"><Fish size={20} /></div><span className="text-[10px] text-aqua-400 font-bold uppercase tracking-widest">STOCK TOTAL</span></div>
           <div className="flex items-end justify-between"><div className="flex flex-col"><span className="text-3xl font-display font-bold text-white">{totalStock}</span><span className="text-[8px] text-slate-500 uppercase font-black mt-1 tracking-tighter">Ejemplares Vitales</span></div><div className="text-[9px] text-aqua-400/80 font-bold uppercase text-right opacity-80"><p>{totalMales} M</p><p>{totalFemales} H</p></div></div>
        </Card>
        <Card className={cn("p-4 h-32 flex flex-col justify-between transition-all border bg-red-500/10 border-red-500/20")}>
           <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500"><AlertTriangle size={20} /></div><span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">ALERTAS ACTIVAS</span></div>
           <div className="flex items-end justify-between"><div className="flex flex-col"><span className="text-3xl font-display font-bold text-white">{activeIncidents.length}</span><span className="text-[9px] text-red-500/80 font-bold uppercase tracking-widest">Sucesos Críticos</span></div>{activeIncidents.length === 0 && <span className="text-[10px] text-emerald-500 font-bold uppercase italic tracking-widest">OK</span>}</div>
        </Card>
      </div>

      {/* Inventory Breakdown */}
      <Card className="p-5 bg-white/5 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 text-white"><Layers size={18} className="text-gold-400" /><h3 className="text-xs uppercase font-black tracking-widest">Inventario de Sistema</h3></div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
           {[ {l:'MACHO / MASCULINOS', d:males, c:'text-blue-400/50', b:'bg-blue-500/5 border-blue-500/10'}, {l:'HEMBRA / FEMENINOS', d:females, c:'text-pink-400/50', b:'bg-pink-500/5 border-pink-500/10'} ].map(group => (
              <div key={group.l} className="space-y-3">
                 <p className={cn("text-[8px] font-black uppercase tracking-widest mb-1", group.c)}>{group.l}</p>
                 {group.d.map(item => (
                    <div key={item.id} className={cn("flex justify-between items-center p-2 rounded-lg border", group.b)}><span className="text-[9px] text-slate-400 font-bold uppercase truncate pr-4">{item.type}</span><span className="text-xs font-bold text-white">{item.quantity}</span></div>
                 ))}
              </div>
           ))}
        </div>
        <div className="mt-6 pt-4 border-t border-white/5">
           {filteredCensus.filter(c => c.type === 'Alevines').map(item => (
             <div key={item.id} className="flex justify-between items-center bg-aqua-400/5 p-3 rounded-xl border border-aqua-400/10 animate-pulse transition-all hover:bg-aqua-400/10">
               <div className="flex items-center gap-3 text-aqua-400"><Fish size={18} /><span className="text-[10px] font-bold uppercase tracking-widest">Alevines en Crecimiento</span></div>
               <span className="text-xl font-display font-bold text-white">{item.quantity}</span>
             </div>
           ))}
        </div>
      </Card>

      {/* Water Status Summary */}
      <Card className="p-5 bg-white/5 border border-white/5">
        <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><Droplets size={20} className="text-aqua-400" /><span className="text-[10px] font-bold text-white uppercase tracking-widest">Calidad del Agua</span></div><div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} />{latestParams ? new Date(latestParams.date).toLocaleString() : 'PENDIENTE'}</div></div>
        {latestParams ? (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
            {[ {l:'pH',v:latestParams.ph,c:'text-aqua-400'}, {l:'T°',v:latestParams.temp,c:'text-white font-white font-white'}, {l:'gH',v:latestParams.gh,c:'text-slate-400 font-white'}, {l:'kH',v:latestParams.kh,c:'text-slate-400 font-white'}, {l:'NH3',v:latestParams.nh3,c:'text-orange-500 font-white'}, {l:'NO2',v:latestParams.no2,c:'text-slate-500 font-white'}, {l:'NO3',v:latestParams.no3,c:'text-orange-400 font-white'} ].map(m => (
              <div key={m.l} className="text-center group border border-white/5 bg-slate-900/50 p-2 rounded-xl"><p className="text-[7px] text-slate-700 uppercase font-black mb-1">{m.l}</p><p className={cn("text-xs font-bold leading-none", m.c)}>{m.v || '-'}</p></div>
            ))}
          </div>
        ) : ( <p className="text-center py-4 text-[10px] text-slate-800 font-black uppercase tracking-widest animate-pulse italic">Sin registros técnicos</p> )}
      </Card>
    </div>
  );
};
