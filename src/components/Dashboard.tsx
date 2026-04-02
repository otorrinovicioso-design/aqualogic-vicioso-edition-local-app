import React from 'react';
import { WaterParameter, Incident, CensusSubgroup, HealthRecord } from '../types';
import { Card, cn } from './UI';
import { AlertTriangle, Droplets, Fish, Layers, Calendar, Heart } from 'lucide-react';

interface DashboardProps {
  censusData: CensusSubgroup[];
  waterParams: WaterParameter[];
  healthRecords: HealthRecord[];
}

const VALID_SUBGROUPS = ['Reproductores Masculinos', 'Reproductores Femeninos', 'Betteras recirculadas', 'Betta-sorority', 'Guppys Machos', 'Guppys Hembras', 'Alevines'];

export const Dashboard: React.FC<DashboardProps> = ({ censusData, waterParams, healthRecords }) => {
  const latestParams = waterParams[0];
  const sickCount = healthRecords.length;
  // ALERTA AGUA: NH3 o NO2 elevados (> 0.25)
  const toxicWater = latestParams && (latestParams.nh3 > 0.25 || latestParams.no2 > 0.25);
  const totalAlerts = sickCount + (toxicWater ? 1 : 0);

  const filteredCensus = censusData.filter(c => VALID_SUBGROUPS.includes(c.type));
  const totalStock = filteredCensus.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-aqua-400/10 border-aqua-400/20 p-4 h-32 flex flex-col justify-between transition-all hover:bg-aqua-400/15">
           <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-aqua-400/20 flex items-center justify-center text-aqua-400"><Fish size={20} /></div><span className="text-[10px] text-aqua-400 font-bold uppercase tracking-widest">STOCK TOTAL</span></div>
           <div className="flex items-end justify-between"><div className="flex flex-col"><span className="text-3xl font-display font-bold text-white">{totalStock}</span><span className="text-[8px] text-slate-500 font-white uppercase mt-0.5 tracking-tighter">Ejemplares Vitales</span></div></div>
        </Card>
        <Card className={cn("p-4 h-32 flex flex-col justify-between transition-all border", totalAlerts > 0 ? "bg-red-500/20 border-red-500/40" : "bg-white/5 border-white/10 opacity-70")}>
           <div className="flex items-center gap-3"><div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", totalAlerts > 0 ? "bg-red-500 text-slate-950 font-bold" : "bg-white/10 text-slate-600")}><AlertTriangle size={20} /></div><span className={cn("text-[10px] font-bold uppercase tracking-widest", totalAlerts > 0 ? "text-red-500" : "text-slate-600")}>ALERTAS CRÍTICAS</span></div>
           <div className="flex items-end justify-between">
              <div className="flex flex-col"><span className={cn("text-3xl font-display font-bold", totalAlerts > 0 ? "text-white" : "text-slate-800")}>{totalAlerts}</span>
                <div className="flex gap-2 mt-0.5">
                  {sickCount > 0 && <span className="text-[7px] text-red-500 font-black uppercase tracking-tighter">{sickCount} ENFERMOS</span>}
                  {toxicWater && <span className="text-[7px] text-orange-500 font-black uppercase tracking-tighter animate-pulse">AGUA TÓXICA</span>}
                </div>
              </div>
              {totalAlerts === 0 && <span className="text-[8px] text-emerald-500 font-black uppercase italic tracking-widest">OK</span>}
           </div>
        </Card>
      </div>

      <Card className="p-5 bg-white/5 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 text-white"><Layers size={18} className="text-gold-400" /><h3 className="text-xs uppercase font-black tracking-widest">Inventario de Sistema</h3></div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
           {['Masculinos', 'Femeninos'].map(sex => (
              <div key={sex} className="space-y-3">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{sex === 'Masculinos' ? 'Stock Machos' : 'Stock Hembras'}</p>
                 {filteredCensus.filter(c => sex === 'Masculinos' ? (c.type.includes('Macho') || c.type.includes('recirculada') || c.type.includes('re-m')) : (c.type.includes('Hembra') || c.type.includes('sorority') || c.type.includes('re-f'))).map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5"><span className="text-[9px] text-slate-400 font-black uppercase truncate pr-4">{item.type}</span><span className="text-xs font-bold text-white">{item.quantity}</span></div>
                 ))}
                 {sex === 'Femeninos' && filteredCensus.filter(c => c.type === 'Alevines').map(item => (<div key={item.id} className="flex justify-between items-center bg-aqua-400/10 p-2 rounded-lg border border-aqua-400/20"><span className="text-[9px] text-aqua-400 font-black uppercase truncate pr-4">{item.type}</span><span className="text-xs font-bold text-white">{item.quantity}</span></div>))}
              </div>
           ))}
        </div>
      </Card>

      <Card className="p-5 bg-white/5 border border-white/10">
        <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><Droplets size={20} className="text-aqua-400" /><span className="text-[10px] font-bold text-white uppercase tracking-widest">Último Análisis Técnico</span></div><div className="text-[8px] text-slate-600 font-black flex items-center gap-1.5"><Calendar size={12} />{latestParams ? new Date(latestParams.date).toLocaleString() : 'PENDIENTE'}</div></div>
        {latestParams ? (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
            {[ {l:'pH',v:latestParams.ph,c:'text-aqua-400'}, {l:'T°',v:latestParams.temp,c:'text-white font-white'}, {l:'gH',v:latestParams.gh,c:'text-slate-400'}, {l:'kH',v:latestParams.kh,c:'text-slate-400'}, {l:'NH3',v:latestParams.nh3,c:latestParams.nh3 > 0.25 ? 'text-red-500 animate-pulse' : 'text-orange-500'}, {l:'NO2',v:latestParams.no2,c:latestParams.no2 > 0.25 ? 'text-red-500 animate-pulse' : 'text-slate-500'}, {l:'NO3',v:latestParams.no3,c:'text-orange-400'} ].map(m => (
              <div key={m.l} className="text-center group border border-white/5 bg-slate-900/50 p-2 rounded-xl"><p className="text-[7px] text-slate-700 uppercase font-black mb-1">{m.l}</p><p className={cn("text-xs font-bold leading-none", m.c)}>{m.v || '-'}</p></div>
            ))}
          </div>
        ) : ( <p className="text-center py-4 text-[10px] text-slate-800 font-black uppercase tracking-widest animate-pulse italic">Sin registros registrados</p> )}
      </Card>
    </div>
  );
};
