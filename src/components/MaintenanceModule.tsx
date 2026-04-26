import React, { useState } from 'react';
import { Maintenance, Breeding } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { Plus, X, Wrench, ChevronDown, ChevronUp, History, Layers } from 'lucide-react';

interface MaintenanceModuleProps {
  maintenanceRecords: Maintenance[];
  breedingProjects: Breeding[];
  onAdd: (maintenance: Partial<Maintenance>) => void;
}

const STATIC_CATEGORIES = [
  'Reproductores Masculinos',
  'Reproductores Femeninos',
  'Betteras recirculadas',
  'Betta-sorority',
  'Guppys Machos',
  'Guppys Hembras'
];

export const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({ maintenanceRecords = [], breedingProjects = [], onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    task: '',
    category: 'Betteras recirculadas',
    type: 'Cambio de Agua',
    volume: '',
    description: ''
  });

  const activeProjects = (breedingProjects || []).filter(p => !p.isFinished);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, date: new Date().toISOString() });
    setFormData({ task: '', category: 'Betteras recirculadas', type: 'Cambio de Agua', volume: '', description: '' });
    setShowForm(false);
  };

  const getWeekRange = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(d.setDate(diff + 6)); // Sunday
    
    const fmt = (dt: Date) => dt.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    const sortKey = monday.toISOString().split('T')[0];
    return { label: `Semana ${fmt(monday)} al ${fmt(sunday)}`, sortKey };
  };

  const grouped = maintenanceRecords.reduce((acc, curr) => {
    const d = new Date(curr.date);
    const { label, sortKey } = getWeekRange(d);
    if (!acc[label]) acc[label] = { records: [], sortKey };
    acc[label].records.push(curr);
    return acc;
  }, {} as Record<string, { records: Maintenance[], sortKey: string }>);

  const weekLabels = Object.keys(grouped).sort((a,b) => 
     grouped[b].sortKey.localeCompare(grouped[a].sortKey)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div><h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Mantenimiento</h3><p className="text-[10px] text-slate-500 uppercase font-black uppercase tracking-widest font-white">Operaciones de Sistema / Proyecto</p></div>
        <Button variant={showForm ? 'secondary' : 'primary'} size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full w-10 h-10 p-0 text-white font-white transition-all shadow-lg"><Plus size={20} className={cn("transition-transform", showForm && "rotate-45")} /></Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white/5 border border-white/10 animate-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Ubicación / Proyecto</Label>
               <Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <optgroup label="Sistemas Generales" className="bg-slate-900 border-white/5 font-white uppercase shadow-lg">
                    {STATIC_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  {activeProjects.length > 0 && (
                    <optgroup label="Proyectos de Cría Activos" className="bg-slate-900 border-white/5 font-white uppercase shadow-lg text-white">
                       {activeProjects.map(p => (<option key={p.id} value={`Cria: ${p.pairName}`}>{p.pairName}</option>))}
                    </optgroup>
                  )}
               </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div><Label>Tarea</Label><Select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}><option value="Cambio de Agua">Cambio de Agua</option><option value="Sifonado">Sifonado</option><option value="Limpieza Filtro">Limpieza Filtro</option><option value="Poda / Plantado">Poda / Plantado</option><option value="Otro">Otro</option></Select></div>
               <div><Label>Volumen / Detalle</Label><Input value={formData.volume} onChange={e => setFormData({...formData, volume: e.target.value})} placeholder="Ej: 20%" className="h-9 py-1" /></div>
            </div>
            <Button type="submit" className="w-full h-10 font-bold uppercase tracking-widest text-[10px] bg-aqua-400 text-slate-950 font-black">Registrar Operación</Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {weekLabels.map((label, idx) => {
          const isExpanded = expandedWeeks.includes(label);
          const { records } = grouped[label];
          return (
            <div key={label} className="space-y-2">
              <button onClick={() => setExpandedWeeks(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label])} className={cn("w-full flex justify-between items-center px-4 py-2 rounded-xl border transition-all text-white", isExpanded ? "bg-white/10 border-white/10" : "bg-white/5 border-white/5 opacity-50")}>
                <div className="flex items-center gap-3"><History size={16} className={isExpanded ? "text-aqua-400" : "text-slate-600"} /><span className="text-[10px] font-black uppercase tracking-widest font-white">{label}</span><span className="text-[8px] bg-white/5 px-2 py-0.5 rounded-full text-slate-500 font-bold">{records.length} Tareas</span></div>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isExpanded && (
                <div className="space-y-2 pl-2 border-l-2 border-white/5 ml-4 animate-in slide-in-from-top-2">
                  {records.map(rec => (
                    <Card key={rec.id} className="p-3 bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-aqua-400/10 flex items-center justify-center text-aqua-400 shrink-0 font-white uppercase shadow-lg"><Wrench size={14} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5"><h4 className="font-bold text-white text-[10px] uppercase tracking-wide">{rec.type}</h4><span className="text-[8px] text-slate-600 font-bold">{new Date(rec.date).toLocaleDateString()}</span></div>
                        <p className="text-[8px] text-slate-500 font-black uppercase flex items-center gap-1.5"><Layers size={10} className="text-slate-700" /> {rec.category} {rec.volume && <span className="text-aqua-400/70 font-bold font-white uppercase">• {rec.volume}</span>}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
