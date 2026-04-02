import React from 'react';
import { WaterParameter, Incident, CensusSubgroup } from '../types';
import { Card } from './UI';
import { 
  AlertTriangle, 
  Droplets, 
  Fish, 
  Activity,
  Target,
  TrendingUp,
  Calendar,
  Layers
} from 'lucide-react';

interface DashboardProps {
  censusData: CensusSubgroup[];
  waterParams: WaterParameter[];
  incidents: Incident[];
}

export const Dashboard: React.FC<DashboardProps> = ({ censusData, waterParams, incidents }) => {
  const latestParams = waterParams[0];
  const activeIncidents = incidents.filter(i => !i.resolved);
  const totalStock = censusData.reduce((acc, curr) => acc + curr.quantity, 0);

  // Grouping for the dashboard
  const males = censusData.filter(c => c.type.includes('Masculinos') || c.type.includes('Machos') || c.type === 'Betteras recirculadas');
  const females = censusData.filter(c => c.type.includes('Femeninos') || c.type.includes('Hembras') || c.type === 'Betta-sorority');
  
  const totalMales = males.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalFemales = females.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-aqua-400/10 border-aqua-400/20 p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-aqua-400/20 flex items-center justify-center text-aqua-400">
              <Fish size={20} />
            </div>
            <span className="text-[10px] text-aqua-400 uppercase font-bold tracking-widest">Stock Total</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-display font-bold text-white">{totalStock}</span>
            <div className="flex flex-col items-end text-[8px] text-aqua-400 font-bold uppercase tracking-tighter">
              <span>{totalMales} Machos</span>
              <span>{totalFemales} Hembras</span>
            </div>
          </div>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20 p-4 flex flex-col justify-between h-32">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] text-red-400 uppercase font-bold tracking-widest">Alertas</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-display font-bold text-white">{activeIncidents.length}</span>
            <span className="text-[10px] text-red-400/70 italic uppercase tracking-tighter">Activas</span>
          </div>
        </Card>
      </div>

      {/* Detailed Stock Distribution */}
      <Card className="p-4 bg-white/5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-gold-400" />
            <h3 className="text-xs uppercase font-bold tracking-widest text-white">Distribución por Sexos</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest border-b border-blue-400/20 pb-1">Masculinos / Machos</p>
            {males.map(item => (
               <div key={item.id} className="flex justify-between items-center bg-blue-500/5 p-2 rounded border border-blue-500/10">
                 <span className="text-[9px] text-slate-300 truncate pr-2">{item.type}</span>
                 <span className="text-xs font-bold text-white">{item.quantity}</span>
               </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-bold text-pink-400 uppercase tracking-widest border-b border-pink-400/20 pb-1">Femeninos / Hembras</p>
            {females.map(item => (
               <div key={item.id} className="flex justify-between items-center bg-pink-500/5 p-2 rounded border border-pink-500/10">
                 <span className="text-[9px] text-slate-300 truncate pr-2">{item.type}</span>
                 <span className="text-xs font-bold text-white">{item.quantity}</span>
               </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Water Stats Snapshot */}
      <Card className="p-4 bg-white/5 border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-aqua-400/10 rounded-xl text-aqua-400">
              <Droplets size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Último Análisis</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
            <Calendar size={12} />
            {latestParams?.date ? new Date(latestParams.date).toLocaleDateString() : 'Sin datos'}
          </div>
        </div>
        
        {latestParams ? (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-[8px] text-slate-500 uppercase mb-1">pH</p>
              <p className="text-lg font-bold text-aqua-400">{latestParams.ph}</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] text-slate-500 uppercase mb-1">Temp</p>
              <p className="text-lg font-bold text-gold-500">{latestParams.temp}°</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] text-slate-500 uppercase mb-1">NH3</p>
              <p className={`text-lg font-bold ${latestParams.nh3 > 0 ? 'text-red-500' : 'text-slate-300'}`}>{latestParams.nh3}</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] text-slate-500 uppercase mb-1">NO3</p>
              <p className="text-lg font-bold text-orange-400">{latestParams.no3}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-600 text-[10px] italic py-4 uppercase">No hay lecturas registradas aún.</p>
        )}
      </Card>
      
      <div className="glass p-4 rounded-2xl flex items-center gap-4 border border-aqua-400/20">
        <div className="w-10 h-10 rounded-full bg-aqua-400 flex items-center justify-center text-slate-950 shrink-0">
          <TrendingUp size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-white">AquaGenius Tip</p>
          <p className="text-[10px] text-slate-400 italic">Manten los nitratos por debajo de 20ppm para una coloración óptima.</p>
        </div>
      </div>
    </div>
  );
};
