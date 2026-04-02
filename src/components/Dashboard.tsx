import React, { useState } from 'react';
import { WaterParameter, Incident, CensusSubgroup, HealthRecord, Breeder } from '../types';
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
  breeders: Breeder[];
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
  breeders = [],
  onSystemReset 
}) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<'password' | 'selection'>('password');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [resetSelection, setResetSelection] = useState({
    census: true, water: true, health: true, breeding: true, maintenance: true,
    feeding: true, losses: true, incidents: true, breeders: false 
  });

  const latestParams = (waterParams && waterParams.length > 0) ? waterParams[0] : null;

  const manualAlerts = (incidents || []).filter(i => !i.resolved);
  const sickFishAlerts = (healthRecords || []).filter(h => h.status === 'Tratamiento' || h.status === 'Mejorado');
  const waterToxicityAlerts = latestParams ? [
    ...(latestParams.nh3 && latestParams.nh3 > 0 ? ['NH3'] : []),
    ...(latestParams.no2 && latestParams.no2 > 0.25 ? ['NO2'] : [])
  ] : [];
  const totalAlertCount = manualAlerts.length + sickFishAlerts.length + waterToxicityAlerts.length;

  const filteredCensus = (censusData || []).filter(c => VALID_SUBGROUPS.includes(c.type));
  
  const breederMalesCount = (breeders || []).filter(b => b.sex === 'Macho').length;
  const breederFemalesCount = (breeders || []).filter(b => b.sex === 'Hembra').length;

  const totalMales = breederMalesCount + filteredCensus
    .filter(c => c.type === 'Betteras recirculadas' || c.type === 'Guppys Machos')
    .reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    
  const totalFemales = breederFemalesCount + filteredCensus
    .filter(c => c.type === 'Betta-sorority' || c.type === 'Guppys Hembras')
    .reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  const fryTotal = filteredCensus.filter(c => c.type === 'Alevines').reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const totalStock = totalMales + totalFemales + fryTotal;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') { setResetStep('selection'); setError(''); }
    else { setError('Código Incorrecto'); setPassword(''); }
  };

  const handleExecuteReset = () => {
    if (window.confirm('¿Está ABSOLUTAMENTE SEGURO?')) {
      onSystemReset(resetSelection);
      setShowResetModal(false);
      setResetStep('password');
      setPassword('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 shadow-lg">
      <div className="grid grid-cols-2 gap-4 shadow-lg">
        <Card className="p-4 h-32 flex flex-col justify-between bg-aqua-400/5 border-aqua-400/10 shadow-lg shadow-lg">
           <div className="flex items-center gap-3 shadow-lg"><div className="w-8 h-8 rounded-lg bg-aqua-400/20 flex items-center justify-center text-aqua-400 shadow-lg"><Fish size={20} /></div><span className="text-[10px] text-aqua-400 font-bold uppercase tracking-widest shadow-lg">STOCK TOTAL</span></div>
           <div className="flex items-end justify-between font-white uppercase shadow-lg shadow-lg"><div className="flex flex-col shadow-lg"><span className="text-3xl font-display font-bold text-white shadow-lg shadow-lg">{totalStock}</span><span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1 shadow-lg">EJEMPLARES</span></div><div className="text-[9px] text-aqua-400/80 font-bold uppercase text-right leading-none space-y-0.5 shadow-lg"><p>{totalMales} M</p><p>{totalFemales} H</p></div></div>
        </Card>

        <Card className={cn("p-4 h-32 flex flex-col justify-between border transition-all duration-500 shadow-lg", totalAlertCount > 0 ? "bg-red-500/10 border-red-500/30 shadow-red-500/10 shadow-lg shadow-lg" : "bg-white/5 border-white/10 shadow-lg shadow-lg")}>
           <div className="flex items-center gap-3 shadow-lg font-white uppercase"><div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-lg", totalAlertCount > 0 ? "bg-red-500 text-slate-950 shadow-lg animate-pulse shadow-lg" : "bg-white/10 text-slate-700 font-white uppercase shadow-lg shadow-lg")}><AlertTriangle size={20} /></div><span className={cn("text-[10px] font-bold uppercase tracking-widest shadow-lg", totalAlertCount > 0 ? "text-red-500 font-black shadow-lg shadow-lg" : "text-white/50 shadow-lg")}>ALARMAS</span></div>
           <div className="flex items-end justify-between font-white uppercase shadow-lg shadow-lg">
              <div className="flex flex-col shadow-lg shadow-lg"><span className={cn("text-3xl font-display font-bold tracking-widest shadow-lg shadow-lg", totalAlertCount > 0 ? "text-red-500 shadow-lg shadow-lg" : "text-white shadow-lg shadow-lg shadow-lg shadow-lg")}>{totalAlertCount}</span><span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest shadow-lg">SITUACIONES</span></div>
              <div className="text-right shadow-lg shadow-lg">
                {totalAlertCount > 0 ? (
                  <div className="flex flex-col gap-0.5 text-[7px] font-black uppercase text-red-500/80 tracking-tighter shadow-lg font-white uppercase shadow-lg shadow-lg">
                    {sickFishAlerts.length > 0 && <span className="shadow-lg">{sickFishAlerts.length} ENFERMOS</span>}
                    {waterToxicityAlerts.length > 0 && <span className="shadow-lg">AGUA TÓXICA</span>}
                    {manualAlerts.length > 0 && <span className="shadow-lg">{manualAlerts.length} SUCESOS</span>}
                  </div>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-black italic tracking-widest uppercase font-white uppercase shadow-lg shadow-lg">SISTEMA OK</span>
                )}
              </div>
           </div>
        </Card>
      </div>

      <Card className="p-5 bg-white/5 border border-white/10 shadow-xl font-white uppercase shadow-lg shadow-lg">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 text-white font-white uppercase shadow-lg shadow-lg"><Layers size={18} className="text-gold-400 opacity-80 shadow-lg font-white uppercase shadow-lg shadow-lg" /><h3 className="text-xs font-black tracking-widest shadow-lg">Resumen de Inventario</h3></div>
        <div className="grid grid-cols-2 gap-6 pb-2 font-white uppercase shadow-lg shadow-lg">
           {[ {l:'Población Macho', q: totalMales, c:'text-blue-500/40', b:'bg-blue-500/5 border-blue-500/10'}, {l:'Población Hembra', q: totalFemales, c:'text-pink-500/40', b:'bg-pink-500/5 border-pink-500/10'} ].map(group => (
              <div key={group.l} className="space-y-3 font-white uppercase shadow-lg text-center shadow-lg">
                 <p className={cn("text-[8px] font-black uppercase tracking-widest font-white shadow-lg shadow-lg shadow-lg", group.c)}>{group.l}</p>
                 <div className={cn("p-4 rounded-xl border font-white uppercase shadow-lg shadow-lg shadow-lg", group.b)}>
                   <span className="text-2xl font-display font-bold text-white shadow-lg shadow-lg font-white shadow-lg">{group.q}</span>
                 </div>
              </div>
           ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 font-white uppercase shadow-lg shadow-lg">
           <div className="flex justify-between items-center bg-aqua-400/5 p-3 rounded-xl border border-aqua-400/10 cursor-default font-white uppercase shadow-lg shadow-lg shadow-lg">
             <div className="flex items-center gap-3 text-aqua-400 font-white uppercase shadow-lg shadow-lg"><Fish size={18} /><span className="text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-lg">Alevines</span></div>
             <span className="text-xl font-display font-bold text-white shadow-lg shadow-lg shadow-lg">{fryTotal}</span>
           </div>
        </div>
      </Card>

      <Card className="p-5 bg-white/5 border border-white/5 transition-opacity hover:opacity-100 shadow-xl font-white uppercase shadow-lg shadow-lg">
        <div className="flex justify-between font-white uppercase mb-4 text-white shadow-lg shadow-lg"><div className="flex items-center gap-2 shadow-lg shadow-lg shadow-lg"><Droplets size={16} className="text-aqua-400 shadow-lg shadow-lg shadow-lg" /><span className="text-[10px] font-black uppercase tracking-widest shadow-lg shadow-lg">Último Análisis</span></div><span className="text-[8px] text-slate-700 shadow-lg shadow-lg shadow-lg">{latestParams ? new Date(latestParams.date).toLocaleString() : '---'}</span></div>
        {latestParams ? (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 font-white uppercase shadow-lg shadow-lg shadow-lg">
            {[ {l:'pH',v:latestParams.ph,c:'text-aqua-400'}, {l:'T°',v:latestParams.temp,c:'text-white shadow-lg shadow-lg font-white shadow-lg shadow-lg'}, {l:'gH',v:latestParams.gh,c:'text-slate-400 shadow-lg shadow-lg font-white shadow-lg shadow-lg'}, {l:'kH',v:latestParams.kh,c:'text-slate-400 shadow-lg shadow-lg font-white shadow-lg shadow-lg'}, {l:'NH3',v:latestParams.nh3,c:latestParams.nh3 > 0 ? 'text-red-500 animate-pulse shadow-lg' : 'text-slate-500 shadow-lg shadow-lg font-white shadow-lg shadow-lg'}, {l:'NO2',v:latestParams.no2,c:latestParams.no2 > 0.25 ? 'text-red-500 animate-pulse shadow-lg' : 'text-slate-500 shadow-lg shadow-lg font-white shadow-lg shadow-lg'}, {l:'NO3',v:latestParams.no3,c:'text-orange-400 shadow-lg shadow-lg font-white shadow-lg shadow-lg'} ].map(m => (
              <div key={m.l} className="text-center bg-slate-900 border border-white/5 p-2 rounded-xl shadow-lg shadow-lg shadow-lg"><p className="text-[7px] text-slate-600 uppercase font-black mb-1 shadow-lg shadow-lg shadow-lg">{m.l}</p><p className={cn("text-xs font-bold font-white shadow-lg shadow-lg shadow-lg", m.c)}>{m.v ?? '-'}</p></div>
            ))}
          </div>
        ) : ( <p className="text-center py-4 text-[10px] text-slate-800 font-bold uppercase italic shadow-lg shadow-lg shadow-lg font-white shadow-lg shadow-lg">Sin registros registrados</p> )}
      </Card>

      <div className="flex justify-center pt-8 border-t border-white/5 font-white uppercase shadow-lg shadow-lg shadow-lg">
        <button onClick={() => setShowResetModal(true)} className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-700 hover:text-aqua-400 transition-colors tracking-[0.2em] group shadow-lg shadow-lg shadow-lg shadow-lg">
          <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500 shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg" /> MANTENIMIENTO DE SISTEMA
        </button>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300 font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg">
          <Card className="w-full max-w-sm bg-slate-900 border-white/10 p-6 relative shadow-2xl font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
            <button onClick={() => { setShowResetModal(false); setResetStep('password'); }} className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors shadow-lg shadow-lg shadow-lg shadow-lg"><X size={20} /></button>
            <div className="text-center mb-6 shadow-lg shadow-lg shadow-lg shadow-lg">
               <div className="w-12 h-12 bg-aqua-400/10 rounded-full flex items-center justify-center mx-auto mb-3 text-aqua-400 shadow-lg shadow-lg shadow-lg"><ShieldCheck size={24} /></div>
               <h3 className="text-white font-bold uppercase tracking-widest text-sm shadow-lg shadow-lg shadow-lg">Panel de Restauración</h3>
               <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 shadow-lg shadow-lg shadow-lg">Reset Selectivo de Datos</p>
            </div>
            {resetStep === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                <div className="space-y-2 text-white font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                  <Label>Código Maestro</Label>
                  <div className="relative shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 shadow-lg shadow-lg shadow-lg shadow-lg" size={16} />
                    <Input type="password" placeholder="••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-12 text-center text-lg tracking-[1em] font-bold bg-slate-950 border-white/5 shadow-lg shadow-lg shadow-lg shadow-lg" autoFocus />
                  </div>
                  {error && <p className="text-[9px] text-red-500 font-black text-center uppercase animate-bounce shadow-lg shadow-lg shadow-lg shadow-lg">{error}</p>}
                </div>
                <Button type="submit" className="w-full h-12 font-black tracking-widest text-[10px] bg-aqua-400 text-slate-950 font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg">ENTRAR</Button>
              </form>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-200 shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                 <div className="grid grid-cols-2 gap-2 text-white font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                    {[
                      {id:'census', label:'Censo Stock'}, {id:'water', label:'Agua'}, {id:'health', label:'Hist. Salud'}, {id:'breeding', label:'Bitac. Cría'},
                      {id:'maintenance', label:'Mantenim.'}, {id:'feeding', label:'Aliment.'}, {id:'losses', label:'Hist. Bajas'}, {id:'incidents', label:'Alertas'},
                      {id:'breeders', label:'REPRODUCTORES', color:'text-red-400 font-black shadow-lg shadow-lg shadow-lg shadow-lg'}
                    ].map(item => (
                      <label key={item.id} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                        <input type="checkbox" checked={(resetSelection as any)[item.id]} onChange={e => setResetSelection({...resetSelection, [item.id]: e.target.checked})} className="w-4 h-4 rounded border-white/20 bg-slate-900 text-aqua-400 font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg" />
                        <span className={cn("text-[8px] font-black uppercase truncate shadow-lg shadow-lg shadow-lg shadow-lg", item.color || "text-slate-500 shadow-lg shadow-lg shadow-lg shadow-lg")}>{item.label}</span>
                      </label>
                    ))}
                 </div>
                 <div className="pt-6 border-t border-white/5 space-y-3 font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">
                    <Button onClick={handleExecuteReset} className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-12 flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg"><Trash2 size={16} /> CONFIRMAR RESET</Button>
                    <button onClick={() => setResetStep('password')} className="w-full text-[8px] font-black uppercase text-slate-600 hover:text-white tracking-widest font-white uppercase shadow-lg shadow-lg shadow-lg font-white uppercase shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg shadow-lg">VOLVER</button>
                 </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
