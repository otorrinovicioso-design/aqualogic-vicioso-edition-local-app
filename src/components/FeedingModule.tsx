import React, { useState } from 'react';
import { Feeding } from '../types';
import { Card, Button, Input, Label, cn } from './UI';
import { Plus, X, Utensils, Calendar } from 'lucide-react';

interface FeedingModuleProps {
  feedingRecords: Feeding[];
  onAdd: (record: Partial<Feeding>) => void;
}

const getWeekRange = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    start: monday,
    end: sunday,
    label: `Semana ${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`
  };
};

export const FeedingModule: React.FC<FeedingModuleProps> = ({ feedingRecords = [], onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    foodType: '',
    amount: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: new Date().toISOString(),
    });
    setFormData({ foodType: '', amount: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-white">
        <div>
          <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Alimentación</h3>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest font-white">Registro de Comidas</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
          size="sm" 
          onClick={() => setShowForm(!showForm)}
          className="rounded-full w-10 h-10 p-0 shadow-lg"
        >
          {showForm ? <X size={20} className="rotate-0 transition-transform" /> : <Plus size={20} />}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300 border-white/10 bg-white/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Alimento</Label>
                <Input value={formData.foodType} onChange={e => setFormData({...formData, foodType: e.target.value})} placeholder="Ej: Artemia Viva" required />
              </div>
              <div>
                <Label>Cantidad / Frecuencia</Label>
                <Input value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Ej: 2 veces/día" required />
              </div>
            </div>
            <div>
              <Label>Notas</Label>
              <Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Ej: Comieron con avidez" />
            </div>
            <Button type="submit" className="w-full h-10 font-bold uppercase text-[10px] tracking-widest bg-aqua-400 text-slate-950 hover:bg-aqua-300">Registrar Alimentación</Button>
          </form>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(
          [...(feedingRecords || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .reduce((acc, record) => {
              const week = getWeekRange(record.date).label;
              if (!acc[week]) acc[week] = [];
              acc[week].push(record);
              return acc;
            }, {} as Record<string, Feeding[]>)
        ).map(([weekLabel, records]) => {
          const isExpanded = !!expandedWeeks[weekLabel];
          
          return (
            <div key={weekLabel} className="space-y-3">
              <button 
                onClick={() => setExpandedWeeks({ ...expandedWeeks, [weekLabel]: !isExpanded })}
                className="flex items-center gap-2 w-full text-left group"
              >
                <div className={cn("w-1 h-4 bg-gold-400 rounded-full transition-all", !isExpanded && "h-2 bg-slate-700")} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-gold-400 transition-colors">
                  {weekLabel}
                </span>
                <div className="h-px flex-1 bg-white/5 mx-2" />
                <span className="text-[8px] font-bold text-slate-600">{records.length} REGISTROS</span>
              </button>

              {isExpanded && (
                <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  {records.map((record) => (
                    <Card key={record.id} className="p-4 flex items-center gap-4 bg-white/5 border-white/5 hover:border-white/10 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                        <Utensils size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white truncate text-sm">{record.foodType}</h4>
                          <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 bg-white/5 rounded-full">{record.amount}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">{new Date(record.date).toLocaleString()}</p>
                        {record.notes && (
                          <p className="text-xs text-slate-400 mt-1 italic">"{record.notes}"</p>
                        )}
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
