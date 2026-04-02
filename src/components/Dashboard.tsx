import React, { useState } from 'react';
import { WaterParameter, Incident, CensusSubgroup, HealthRecord } from '../types';
import { Card, Button, Input, Label, cn } from './UI';
import { 
  AlertTriangle, 
  Droplets, 
  Fish, 
  Layers,
  Settings,
  Lock,
  ShieldCheck,
  X,
  Trash2
} from 'lucide-react';

interface DashboardProps {
  censusData: CensusSubgroup[];
  waterParams: WaterParameter[];
  healthRecords: HealthRecord[];
  incidents: Incident[];
  onSystemReset: (keys: Record<string, boolean>) => void;
}

const VALID_SUBGROUPS = [
  'Reproductores Masculinos',
  'Reproductores Femeninos',
  'Betteras recirculadas',
  'Betta-sorority',
  'Guppys Machos',
  'Guppys Hembras',
  'Alevines Betta',
  'Alevines Guppys'
];

export const Dashboard: React.FC<DashboardProps> = ({ censusData = [], waterParams = [], healthRecords = [], incidents = [], onSystemReset }) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<'password' | 'selection'>('password');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [resetSelection, setResetSelection] = useState({
    census: true,
    water: true,
    health: true,
    breeding: true,
    maintenance: true,
    feeding: true,
    losses: true,
    incidents: true,
    breeders: false 
  });

  const latestParams = (waterParams && waterParams.length > 0) ? waterParams[0] : null;
  const activeIncidents = (incidents || []).filter(i => !i.resolved);
  
  // SMART ALERTS LOGIC
  const waterAlerts = latestParams ? (
    (latestParams.ph && (latestParams.ph < 6.5 || latestParams.ph > 8.5)) ||
    (latestParams.no2 && latestParams.no2 > 0.25) ||
    (latestParams.nh3 && latestParams.nh3 > 0)
  ) : false;

  const sickCount = (healthRecords || []).filter((h: any) => h.status === 'treating').length;
  const totalAlertsCount = activeIncidents.length + sickCount + (waterAlerts ? 1 : 0);

  const filteredCensus = (censusData || []).filter(c => VALID_SUBGROUPS.includes(c.type));
  const totalStock = filteredCensus.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  
  const males = filteredCensus.filter(c => 
    c.type === 'Reproductores Masculinos' || c.type === 'Betteras recirculadas' || c.type === 'Guppys Machos'
  );
  const females = filteredCensus.filter(c => 
    c.type === 'Reproductores Femeninos' || c.type === 'Betta-sorority' || c.type === 'Guppys Hembras'
  );
  
  const totalMales = males.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const totalFemales = females.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setResetStep('selection');
      setError('');
    } else {
      setError('Código Incorrecto');
      setPassword('');
    }
  };

  const handleExecuteReset = () => {
    if (window.confirm('¿Está ABSOLUTAMENTE SEGURO? Esta acción es irreversible.')) {
      onSystemReset(resetSelection);
      setShowResetModal(false);
      setResetStep('password');
      setPassword('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 h-32 flex flex-col justify-between bg-aqua-400/5 border-aqua-400/10">
           <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-aqua-400/20 flex items-center justify-center text-aqua-400"><Fish size={20} /></div><span className="text-[10px] text-aqua-400 font-bold uppercase tracking-widest">STOCK TOTAL</span></div>
           <div className="flex items-end justify-between"><div className="flex flex-col"><span className="text-3xl font-display font-bold text-white">{totalStock}</span><span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">EJEMPLARES</span></div><div className="text-[9px] text-aqua-400/80 font-bold uppercase text-right"><p>{totalMales} M</p><p>{totalFemales} H</p></div></div>
        </Card>
        <Card className={cn("p-4 h-32 flex flex-col justify-between border transition-all", totalAlertsCount > 0 ? "bg-red-500/10 border-red-500/20 shadow-lg shadow-red-500/5" : "bg-white/5 border-white/10")}>
           <div className="flex items-center gap-3"><div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold", totalAlertsCount > 0 ? "bg-red-500 text-slate-950 shadow-lg" : "bg-white/10 text-slate-700")}><AlertTriangle size={20} /></div><span className={cn("text-[10px] font-bold uppercase tracking-widest", totalAlertsCount > 0 ? "text-red-500 font-black" : "text-white/50")}>ALERTAS</span></div>
           <div className="flex items-end justify-between"><div className="flex flex-col"><span className="text-3xl font-display font-bold text-white tracking-widest">{totalAlertsCount}</span><span className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">CASOS</span></div>{totalAlertsCount === 0 && <span className="text-[10px] text-emerald-500 font-bold italic tracking-widest uppercase font-white uppercase">OK</span>}</div>
        </Card>
      </div>

      <Card className="p-5 bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 text-white font-white uppercase"><Layers size={18} className="text-gold-400 opacity-80" /><h3 className="text-xs font-black tracking-widest">Inventario</h3></div>
        <div className="grid grid-cols-2 gap-6 pb-2">
           {[ {l:'MACHO / MASCULINOS', d:males, c:'text-blue-500/40', b:'bg-blue-500/5 border-blue-500/10'}, {l:'HEMBRA / FEMENINOS', d:females, c:'text-pink-500/40', b:'bg-pink-500/5 border-pink-500/10'} ].map(group => (
              <div key={group.l} className="space-y-3">
                 <p className={cn("text-[8px] font-black uppercase tracking-widest", group.c)}>{group.l}</p>
                 {group.d.map(item => (
                    <div key={item.id} className={cn("flex justify-between items-center p-2 rounded-lg border", group.b)}><span className="text-[9px] text-slate-400 font-bold uppercase truncate">{item.type}</span><span className="text-xs font-bold text-white">{item.quantity}</span></div>
                 ))}
              </div>
           ))}
        </div>
        {filteredCensus.filter(c => c.type.includes('Alevines')).map(item => (
          <div key={item.id} className="mt-4 pt-4 border-t border-white/5">
             <div className="flex justify-between items-center bg-aqua-400/5 p-3 rounded-xl border border-aqua-400/10 cursor-default">
               <div className="flex items-center gap-3 text-aqua-400"><Fish size={18} /><span className="text-[10px] font-bold uppercase tracking-widest">{item.type} en Crecimiento</span></div>
               <span className="text-xl font-display font-bold text-white">{item.quantity}</span>
             </div>
          </div>
        ))}
      </Card>

      <Card className="p-5 bg-white/5 border border-white/5 transition-opacity hover:opacity-100">
        <div className="flex justify-between font-white uppercase mb-4 text-white"><div className="flex items-center gap-2"><Droplets size={16} className="text-aqua-400" /><span className="text-[10px] font-black uppercase tracking-widest">Calidad del Agua</span></div><span className="text-[8px] text-slate-700">{latestParams ? new Date(latestParams.date).toLocaleString() : '---'}</span></div>
        {latestParams ? (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {[ {l:'pH',v:latestParams.ph,c:'text-aqua-400 font-white'}, {l:'T°',v:latestParams.temp,c:'text-white font-white'}, {l:'gH',v:latestParams.gh,c:'text-slate-400 font-white'}, {l:'kH',v:latestParams.kh,c:'text-slate-400 font-white'}, {l:'NH3',v:latestParams.nh3,c:'text-orange-500 font-white'}, {l:'NO2',v:latestParams.no2,c:'text-red-500/80 font-white'}, {l:'NO3',v:latestParams.no3,c:'text-orange-400 font-white'} ].map(m => (
              <div key={m.l} className="text-center bg-slate-900 border border-white/5 p-2 rounded-xl"><p className="text-[7px] text-slate-700 uppercase font-black mb-1">{m.l}</p><p className={cn("text-xs font-bold font-white", m.c)}>{m.v ?? '-'}</p></div>
            ))}
          </div>
        ) : ( <p className="text-center py-4 text-[10px] text-slate-800 font-bold uppercase italic font-white">Sin registros técnicos</p> )}
      </Card>

      {/* MODAL TRIGGER */}
      <div className="flex justify-center pt-8 border-t border-white/5">
        <button 
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-700 hover:text-aqua-400 transition-colors tracking-[0.2em] group"
        >
          <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> 
          MANTENIMIENTO DE SISTEMA
        </button>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <Card className="w-full max-w-sm bg-slate-900 border-white/10 p-6 relative shadow-2xl">
            <button onClick={() => { setShowResetModal(false); setResetStep('password'); }} className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors"><X size={20} /></button>
            <div className="text-center mb-6">
               <div className="w-12 h-12 bg-aqua-400/10 rounded-full flex items-center justify-center mx-auto mb-3 text-aqua-400"><ShieldCheck size={24} /></div>
               <h3 className="text-white font-bold uppercase tracking-widest text-sm">Panel de Restauración</h3>
               <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Modo Mantenimiento Activo</p>
            </div>

            {resetStep === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2 text-white">
                  <Label>Código Maestro</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <Input type="password" placeholder="••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-12 text-center text-lg tracking-[1em] font-bold bg-slate-950 border-white/5" autoFocus />
                  </div>
                  {error && <p className="text-[9px] text-red-500 font-black text-center uppercase animate-bounce">{error}</p>}
                </div>
                <Button type="submit" className="w-full h-12 font-black tracking-widest text-[10px] bg-aqua-400 text-slate-950">DESBLOQUEAR SISTEMA</Button>
              </form>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                 <div className="grid grid-cols-2 gap-2 text-white font-white uppercase shadow-lg">
                    {[
                      {id:'census', label:'Censo Stock'}, {id:'water', label:'Agua'}, {id:'health', label:'Hist. Salud'}, {id:'breeding', label:'Bitac. Cría'},
                      {id:'maintenance', label:'Mantenim.'}, {id:'feeding', label:'Aliment.'}, {id:'losses', label:'Hist. Bajas'}, {id:'incidents', label:'Alertas'},
                      {id:'breeders', label:'REPRODUCTORES', color:'text-red-400 font-black'}
                    ].map(item => (
                      <label key={item.id} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all shadow-lg font-white">
                        <input type="checkbox" checked={(resetSelection as any)[item.id]} onChange={e => setResetSelection({...resetSelection, [item.id]: e.target.checked})} className="w-4 h-4 rounded border-white/20 bg-slate-900 text-aqua-400" />
                        <span className={cn("text-[8px] font-black uppercase truncate", item.color || "text-slate-500")}>{item.label}</span>
                      </label>
                    ))}
                 </div>
                 <div className="pt-6 border-t border-white/5 space-y-3">
                    <Button onClick={handleExecuteReset} className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-12 flex items-center justify-center gap-2 shadow-lg shadow-red-600/10"><Trash2 size={16} /> EJECUTAR LIMPIEZA TOTAL</Button>
                    <button onClick={() => setResetStep('password')} className="w-full text-[8px] font-black uppercase text-slate-600 hover:text-white tracking-widest">ATRÁS</button>
                 </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
