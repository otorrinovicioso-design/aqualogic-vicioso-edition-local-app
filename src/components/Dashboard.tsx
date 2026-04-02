import React, { useState } from 'react';
import { WaterParameter, Incident, CensusSubgroup, HealthRecord } from '../types';
import { Card, Button, Input, Label, cn } from './UI';
import { 
  AlertTriangle, 
  Droplets, 
  Fish, 
  Layers,
  Calendar,
  Settings,
  Lock,
  RotateCcw,
  ShieldCheck,
  X,
  Trash2,
  Stethoscope
} from 'lucide-react';

interface DashboardProps {
  censusData: CensusSubgroup[];
  waterParams: WaterParameter[];
  incidents: Incident[];
  healthRecords: HealthRecord[];
  onSystemReset: (keys: Record<string, boolean>) => void;
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

export const Dashboard: React.FC<DashboardProps> = ({ 
  censusData = [], 
  waterParams = [], 
  incidents = [], 
  healthRecords = [],
  onSystemReset 
}) => {
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
  
  const manualAlerts = (incidents || []).filter(i => !i.resolved);
  const sickFishAlerts = (healthRecords || []).filter(h => h.status === 'Tratamiento' || h.status === 'Mejorado');
  const waterToxicityAlerts = latestParams ? [
    ...(latestParams.nh3 && latestParams.nh3 > 0 ? ['Amoniaco Detectado'] : []),
    ...(latestParams.no2 && latestParams.no2 > 0.25 ? ['Nitritos Elevados'] : [])
  ] : [];

  const totalAlertCount = manualAlerts.length + sickFishAlerts.length + waterToxicityAlerts.length;

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
        <Card className="p-4 h-32 flex flex-col justify-between bg-aqua-400/5 border-aqua-400/10 shadow-lg shadow-aqua-400/5">
           <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-aqua-400/20 flex items-center justify-center text-aqua-400"><Fish size={20} /></div><span className="text-[10px] text-aqua-400 font-bold uppercase tracking-widest">STOCK TOTAL</span></div>
           <div className="flex items-end justify-between"><div className="flex flex-col"><span className="text-3xl font-display font-bold text-white font-white">{totalStock}</span><span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">EJEMPLARES</span></div><div className="text-[9px] text-aqua-400/80 font-bold uppercase text-right leading-none space-y-0.5 font-white uppercase"><p>{totalMales} M</p><p>{totalFemales} H</p></div></div>
        </Card>

        <Card className={cn("p-4 h-32 flex flex-col justify-between border transition-all duration-500", totalAlertCount > 0 ? "bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "bg-white/5 border-white/10")}>
           <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", totalAlertCount > 0 ? "bg-red-500 text-slate-950 shadow-lg animate-pulse" : "bg-white/10 text-slate-700 font-white")}>
                <AlertTriangle size={20} />
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", totalAlertCount > 0 ? "text-red-500 font-black" : "text-white/50 font-white")}>ALARMAS</span>
           </div>
           
           <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className={cn("text-3xl font-display font-bold tracking-widest transition-colors", totalAlertCount > 0 ? "text-red-500" : "text-white font-white")}>
                  {totalAlertCount}
                </span>
                <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest font-white uppercase">SITUACIONES</span>
              </div>
              
              <div className="text-right">
                 {totalAlertCount > 0 ? (
                    <div className="flex flex-col gap-0.5 text-[7px] font-black uppercase text-red-500/80 tracking-tighter font-white uppercase">
                       {sickFishAlerts.length > 0 && <span className="flex items-center gap-1 justify-end"><Stethoscope size={8} /> {sickFishAlerts.length} ENFERMOS</span>}
                       {waterToxicityAlerts.length > 0 && <span>AGUA TÓXICA</span>}
                       {manualAlerts.length > 0 && <span>{manualAlerts.length} SUCESOS</span>}
                    </div>
                 ) : (
                    <span className="text-[10px] text-emerald-500 font-black italic tracking-widest uppercase font-white uppercase">OK</span>
                 )}
              </div>
           </div>
        </Card>
      </div>

      <Card className="p-5 bg-white/5 border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 text-white font-white uppercase"><Layers size={18} className="text-gold-400 opacity-80" /><h3 className="text-xs font-black tracking-widest">Resumen de Inventario</h3></div>
        <div className="grid grid-cols-2 gap-6 pb-2">
           {[ {l:'POBLACIÓN MACHO', d:males, c:'text-blue-500/40', b:'bg-blue-500/5 border-blue-500/10'}, {l:'POBLACIÓN HEMBRA', d:females, c:'text-pink-500/40', b:'bg-pink-500/5 border-pink-500/10'} ].map(group => (
              <div key={group.l} className="space-y-3">
                 <p className={cn("text-[8px] font-black uppercase tracking-widest", group.c)}>{group.l}</p>
                 {group.d.map(item => (
                    <div key={item.id} className={cn("flex justify-between items-center p-2 rounded-lg border", group.b)}><span className="text-[9px] text-slate-400 font-bold uppercase truncate">{item.type}</span><span className="text-xs font-bold text-white font-white">{item.quantity}</span></div>
                 ))}
              </div>
           ))}
        </div>
        {censusData.filter(c => c.type === 'Alevines').map(item => (
          <div key={item.id} className="mt-4 pt-4 border-t border-white/5 font-white uppercase">
             <div className="flex justify-between items-center bg-aqua-400/5 p-3 rounded-xl border border-aqua-400/10 cursor-default">
               <div className="flex items-center gap-3 text-aqua-400 font-white uppercase"><Fish size={18} /><span className="text-[10px] font-bold uppercase tracking-widest">Alevines Totales</span></div>
               <span className="text-xl font-display font-bold text-white font-white">{item.quantity}</span>
             </div>
          </div>
        ))}
      </Card>

      <Card className="p-5 bg-white/5 border border-white/5 transition-opacity hover:opacity-100">
        <div className="flex justify-between font-white uppercase mb-4 text-white"><div className="flex items-center gap-2"><Droplets size={16} className="text-aqua-400" /><span className="text-[10px] font-black uppercase tracking-widest">Último Análisis</span></div><span className="text-[8px] text-slate-700 font-white">{latestParams ? new Date(latestParams.date).toLocaleString() : '---'}</span></div>
        {latestParams ? (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 font-white uppercase">
            {[ {l:'pH',v:latestParams.ph,c:'text-aqua-400'}, {l:'T°',v:latestParams.temp,c:'text-white font-white font-white'}, {l:'gH',v:latestParams.gh,c:'text-slate-400 font-white font-white'}, {l:'kH',v:latestParams.kh,c:'text-slate-400 font-white font-white'}, {l:'NH3',v:latestParams.nh3,c:latestParams.nh3 > 0 ? 'text-red-500 animate-pulse' : 'text-slate-500 font-white'}, {l:'NO2',v:latestParams.no2,c:latestParams.no2 > 0.25 ? 'text-red-500 animate-pulse' : 'text-slate-500 font-white'}, {l:'NO3',v:latestParams.no3,c:'text-orange-400 font-white font-white'} ].map(m => (
              <div key={m.l} className="text-center bg-slate-900 border border-white/5 p-2 rounded-xl"><p className="text-[7px] text-slate-600 uppercase font-black mb-1">{m.l}</p><p className={cn("text-xs font-bold font-white", m.c)}>{m.v ?? '-'}</p></div>
            ))}
          </div>
        ) : ( <p className="text-center py-4 text-[10px] text-slate-800 font-bold uppercase italic font-white">Sin registros registrados</p> )}
      </Card>

      <div className="flex justify-center pt-8 border-t border-white/5 font-white uppercase">
        <button onClick={() => setShowResetModal(true)} className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-700 hover:text-aqua-400 transition-colors tracking-[0.2em] group">
          <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> 
          MANTENIMIENTO DE SISTEMA
        </button>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300 font-white uppercase shadow-lg">
          <Card className="w-full max-w-sm bg-slate-900 border-white/10 p-6 relative shadow-2xl font-white uppercase shadow-lg">
            <button onClick={() => { setShowResetModal(false); setResetStep('password'); }} className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors"><X size={20} /></button>
            <div className="text-center mb-6">
               <div className="w-12 h-12 bg-aqua-400/10 rounded-full flex items-center justify-center mx-auto mb-3 text-aqua-400"><ShieldCheck size={24} /></div>
               <h3 className="text-white font-bold uppercase tracking-widest text-sm">Panel de Restauración</h3>
               <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Reset Selectivo de Datos</p>
            </div>
            {resetStep === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 font-white uppercase shadow-lg">
                <div className="space-y-2 text-white font-white uppercase shadow-lg">
                  <Label>Código Maestro</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <Input type="password" placeholder="••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-12 text-center text-lg tracking-[1em] font-bold bg-slate-950 border-white/5 shadow-lg" autoFocus />
                  </div>
                  {error && <p className="text-[9px] text-red-500 font-black text-center uppercase animate-bounce">{error}</p>}
                </div>
                <Button type="submit" className="w-full h-12 font-black tracking-widest text-[10px] bg-aqua-400 text-slate-950 font-white uppercase shadow-lg">ENTRAR</Button>
              </form>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                 <div className="grid grid-cols-2 gap-2 text-white font-white uppercase shadow-lg">
                    {[
                      {id:'census', label:'Censo Stock'}, {id:'water', label:'Agua'}, {id:'health', label:'Hist. Salud'}, {id:'breeding', label:'Bitac. Cría'},
                      {id:'maintenance', label:'Mantenim.'}, {id:'feeding', label:'Aliment.'}, {id:'losses', label:'Hist. Bajas'}, {id:'incidents', label:'Alertas'},
                      {id:'breeders', label:'REPRODUCTORES', color:'text-red-400 font-black'}
                    ].map(item => (
                      <label key={item.id} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all font-white uppercase shadow-lg">
                        <input type="checkbox" checked={(resetSelection as any)[item.id]} onChange={e => setResetSelection({...resetSelection, [item.id]: e.target.checked})} className="w-4 h-4 rounded border-white/20 bg-slate-900 text-aqua-400 font-white uppercase" />
                        <span className={cn("text-[8px] font-black uppercase truncate", item.color || "text-slate-500")}>{item.label}</span>
                      </label>
                    ))}
                 </div>
                 <div className="pt-6 border-t border-white/5 space-y-3 font-white uppercase shadow-lg">
                    <Button onClick={handleExecuteReset} className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-12 flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 font-white uppercase shadow-lg"><Trash2 size={16} /> CONFIRMAR RESET</Button>
                    <button onClick={() => setResetStep('password')} className="w-full text-[8px] font-black uppercase text-slate-600 hover:text-white tracking-widest font-white uppercase shadow-lg font-white uppercase">VOLVER</button>
                 </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
