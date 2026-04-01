import React from 'react';
import { 
  Fish, 
  Droplets, 
  AlertTriangle, 
  Activity, 
  Calendar,
  TrendingUp,
  HeartPulse,
  Wrench
} from 'lucide-react';
import { Card } from './UI';
import { Animal, WaterParameter, Incident } from '../types';

interface DashboardProps {
  animals: Animal[];
  waterParams: WaterParameter[];
  incidents: Incident[];
}

export const Dashboard: React.FC<DashboardProps> = ({ animals, waterParams, incidents }) => {
  const activeIncidents = incidents.filter(i => i.status === 'Abierto');
  const latestParams = waterParams[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-4">
        <Card variant="aqua" className="relative overflow-hidden group">
          <Fish className="mb-4 text-aqua-400 group-hover:scale-110 transition-transform" size={24} />
          <p className="text-3xl font-display font-bold text-white">{animals.length}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Ejemplares</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Fish size={80} />
          </div>
        </Card>

        <Card variant="gold" className="relative overflow-hidden group">
          <AlertTriangle className="mb-4 text-gold-500 group-hover:scale-110 transition-transform" size={24} />
          <p className="text-3xl font-display font-bold text-white">{activeIncidents.length}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Alertas Activas</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle size={80} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-aqua-400" />
              Últimos Parámetros
            </h4>
            {latestParams && (
              <span className="text-[10px] text-slate-500">
                {new Date(latestParams.date).toLocaleDateString()}
              </span>
            )}
          </div>
          
          {latestParams ? (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase mb-1">PH</p>
                <p className="text-xl font-display font-bold text-aqua-400">{latestParams.ph}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Temp</p>
                <p className="text-xl font-display font-bold text-gold-500">{latestParams.temp}°C</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase mb-1">NO3</p>
                <p className="text-xl font-display font-bold text-red-400">{latestParams.no3}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase mb-1">NH3</p>
                <p className="text-xl font-display font-bold text-emerald-400">{latestParams.nh3}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs italic">
              No hay registros de parámetros aún.
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-gold-500" />
            Estado del Sistema
          </h4>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <HeartPulse size={14} className="text-red-400" />
                <span className="text-xs text-slate-300">Salud General</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Óptimo</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Wrench size={14} className="text-aqua-400" />
                <span className="text-xs text-slate-300">Rutinas Mantenimiento</span>
              </div>
              <span className="text-[10px] font-bold text-gold-500 uppercase">Al día</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs text-slate-300">Próxima Limpieza</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Mañana</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
