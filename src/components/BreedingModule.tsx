import React, { useState } from 'react';
import { Breeding, Breeder, CensusSubgroup, SubgroupType } from '../types';
import { Card, Button, Input, Select, Label, cn } from './UI';
import { Plus, X, Heart, Target, Baby, CheckCircle, History, Calendar, Layout } from 'lucide-react';

interface BreedingModuleProps {
  breedingRecords: Breeding[];
  breeders: Breeder[];
  censusData: CensusSubgroup[];
  onAdd: (record: Partial<Breeding>) => void;
  onUpdate: (id: string, updates: Partial<Breeding>) => void;
  onUpdateCensus: (type: SubgroupType, delta: number) => void;
}

export const BreedingModule: React.FC<BreedingModuleProps> = ({ 
  breedingRecords, 
  breeders, 
  censusData, 
  onAdd, 
  onUpdate, 
  onUpdateCensus 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState<string | null>(null);
  const [finishStats, setFinishStats] = useState({ males: 0, females: 0 });
  const [formData, setFormData] = useState<Partial<Breeding>>({
    pairName: '',
    maleId: '',
    femaleId: '',
    geneticGoals: '',
    status: 'Iniciado',
    spawnDate: ''
  });

  // FIX: Using original 'M' and 'H' from v3.0 types + Filtering by species 'Betta'
  const males = breeders.filter(b => b.species === 'Betta' && b.sex === 'M' && b.status === 'active');
  const females = breeders.filter(b => b.species === 'Betta' && b.sex === 'H' && b.status === 'active');

  const activeProjects = breedingRecords.filter(r => !r.isFinished);
  const finishedProjects = breedingRecords.filter(r => r.isFinished);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      startDate: new Date().toISOString(),
      isFinished: false
    });
    setFormData({ pairName: '', maleId: '', femaleId: '', geneticGoals: '', status: 'Iniciado', spawnDate: '' });
    setShowForm(false);
  };

  const handleUpdateFry = (id: string, count: number, oldCount: number) => {
    onUpdate(id, { fryCount: count });
    // FIX: Updating the specific 'Alevines Betta' category
    onUpdateCensus('Alevines Betta', count - (oldCount || 0));
  };

  const finalizeProject = (id: string) => {
    const record = breedingRecords.find(r => r.id === id);
    if (!record) return;

    // 1. Subtract all fry from 'Alevines Betta' category
    onUpdateCensus('Alevines Betta', -(record.fryCount || 0));

    // 2. Add to respective groups
    onUpdateCensus('Betteras recirculadas', finishStats.males);
    onUpdateCensus('Betta-sorority', finishStats.females);

    // 3. Mark project as finished
    onUpdate(id, { 
      isFinished: true, 
      status: 'Terminado',
      finishDate: new Date().toISOString()
    });

    setShowFinishModal(null);
    setFinishStats({ males: 0, females: 0 });
  };

  return (
    <div className=\"space-y-8 pb-12\">
      <div className=\"flex justify-between items-center text-white\">
        <div>
          <h3 className=\"text-2xl font-display font-bold\">Genética y Desoves</h3>
          <p className=\"text-[10px] text-slate-500 uppercase tracking-widest font-bold font-white\">Proyectos de Cría</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'} 
          size=\"sm\" 
          onClick={() => setShowForm(!showForm)}
          className=\"rounded-full w-10 h-10 p-0\"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </Button>
      </div>

      {showForm && (
        <Card className=\"animate-in fade-in slide-in-from-top-4 duration-300\">
          <form onSubmit={handleSubmit} className=\"space-y-4\">
            <h4 className=\"font-bold text-aqua-400\">Nuevo Emparejamiento</h4>
            
            <div>
              <Label>Nombre de la Prole / Proyecto</Label>
              <Input 
                value={formData.pairName} 
                onChange={e => setFormData({...formData, pairName: e.target.value})} 
                placeholder=\"Ej: Proyecto Draggon Azul 2024\" 
                required 
              />
            </div>

            <div className=\"grid grid-cols-2 gap-4\">
              <div>
                <Label>Padre (Macho Elite)</Label>
                <Select value={formData.maleId} onChange={e => setFormData({...formData, maleId: e.target.value})} required>
                  <option value=\"\">Seleccionar Macho...</option>
                  {males.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </Select>
              </div>
              <div>
                <Label>Madre (Hembra Elite)</Label>
                <Select value={formData.femaleId} onChange={e => setFormData({...formData, femaleId: e.target.value})} required>
                  <option value=\"\">Seleccionar Hembra...</option>
                  {females.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Select>
              </div>
            </div>

            <div className=\"grid grid-cols-2 gap-4\">
              <div>
                <Label>Fecha de Desove</Label>
                <Input 
                  type=\"date\" 
                  value={formData.spawnDate} 
                  onChange={e => setFormData({...formData, spawnDate: e.target.value})} 
                />
              </div>
              <div>
                <Label>Estado Inicial</Label>
                <Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value=\"Iniciado\">Iniciado</option>
                  <option value=\"Nido\">Con Nido</option>
                  <option value=\"Eclosión\">Eclosión</option>
                  <option value=\"Alevines\">Alevines</option>
                </Select>
              </div>
            </div>

            <div>
              <Label>Objetivo Genético / Rasgos Buscados</Label>
              <Input 
                value={formData.geneticGoals} 
                onChange={e => setFormData({...formData, geneticGoals: e.target.value})} 
                placeholder=\"Ej: Mayor apertura caudal\" 
              />
            </div>

            <Button type=\"submit\" className=\"w-full\">Registrar Desove</Button>
          </form>
        </Card>
      )}

      {/* ACTIVE PROJECTS */}
      <div className=\"space-y-4\">
        <div className=\"flex items-center gap-2 text-gold-400\">
          <Layout size={18} />
          <h4 className=\"text-xs uppercase font-bold tracking-widest\">Proyectos Activos</h4>
        </div>
        
        {activeProjects.length === 0 ? (
          <p className=\"text-center text-slate-500 py-6 italic text-sm\">No hay proyectos de cría en curso.</p>
        ) : (
          activeProjects.map((record) => {
            const male = breeders.find(b => b.id === record.maleId);
            const female = breeders.find(b => b.id === record.femaleId);

            return (
              <Card key={record.id} className=\"relative bg-white/5 border border-white/5 overflow-hidden group\">
                <div className=\"absolute top-0 left-0 w-1 h-full bg-pink-500\" />
                
                <div className=\"p-4\">
                  <div className=\"flex justify-between items-start mb-4\">
                    <div className=\"flex items-center gap-3\">
                      <div className=\"w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400\">
                        <Heart size={20} />
                      </div>
                      <div>
                        <h4 className=\"font-bold text-white text-md uppercase font-display\">{record.pairName}</h4>
                        <span className=\"text-[9px] text-slate-500 font-bold uppercase\">Iniciado: {new Date(record.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      size=\"sm\" 
                      variant=\"primary\" 
                      className=\"bg-emerald-600 hover:bg-emerald-700 h-8 px-2 text-[10px]\"
                      onClick={() => setShowFinishModal(record.id)}
                    >
                      TERMINAR
                    </Button>
                  </div>

                  <div className=\"grid grid-cols-2 gap-3 mb-4\">
                    <div className=\"p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-center\">
                      <p className=\"text-[7px] text-blue-400 uppercase font-black mb-1\">Padre</p>
                      <p className=\"text-xs text-white font-bold truncate\">{male?.name || '?'}</p>
                    </div>
                    <div className=\"p-2 rounded-lg bg-pink-500/5 border border-pink-500/10 text-center\">
                      <p className=\"text-[7px] text-pink-400 uppercase font-black mb-1\">Madre</p>
                      <p className=\"text-xs text-white font-bold truncate\">{female?.name || '?'}</p>
                    </div>
                  </div>

                  <div className=\"space-y-3\">
                    <div className=\"flex gap-4\">
                       <div className=\"flex-1\">
                          <Label className=\"text-[8px] uppercase\">Alevines Logrados</Label>
                          <Input 
                            type=\"number\"
                            value={record.fryCount || 0}
                            onChange={e => handleUpdateFry(record.id, parseInt(e.target.value) || 0, record.fryCount || 0)}
                            className=\"bg-slate-900 border-white/5 h-8 text-center text-sm font-bold text-aqua-400\"
                          />
                       </div>
                       <div className=\"flex-1\">
                          <Label className=\"text-[8px] uppercase\">Estado Actual</Label>
                          <Select 
                            value={record.status} 
                            onChange={e => onUpdate(record.id, { status: e.target.value as any })}
                            className=\"h-8 py-1 px-1 bg-slate-900 border-white/5 text-[10px]\"
                          >\n                            <option value=\"Iniciado\">Iniciado</option>
                            <option value=\"Nido\">Con Nido</option>
                            <option value=\"Eclosión\">Eclosión</option>
                            <option value=\"Alevines\">Alevines</option>
                          </Select>
                       </div>
                    </div>
                    <div className=\"p-2 bg-slate-900/50 rounded-lg border border-white/5 flex items-center justify-between\">
                       <div className=\"flex items-center gap-2\">
                         <Calendar size={14} className=\"text-gold-400\" />
                         <span className=\"text-[9px] text-slate-400 font-bold uppercase tracking-widest\">Fecha Desove:</span>
                       </div>
                       <span className=\"text-[10px] text-white font-bold\">{record.spawnDate ? new Date(record.spawnDate).toLocaleDateString() : 'Pendiente'}</span>
                    </div>
                  </div>
                </div>

                {/* MODAL / FINISH FORM OVERLAY */}
                {showFinishModal === record.id && (
                  <div className=\"absolute inset-0 bg-slate-950/95 z-20 flex flex-col justify-center p-6 animate-in fade-in zoom-in duration-200\">
                    <div className=\"flex justify-between items-center mb-6\">
                      <h4 className=\"font-bold text-aqua-400 uppercase tracking-widest text-xs\">Finalizar Proyecto</h4>
                      <button onClick={() => setShowFinishModal(null)}><X size={20} className=\"text-slate-500\" /></button>
                    </div>
                    <div className=\"space-y-4\">
                      <p className=\"text-[10px] text-slate-400 italic text-center mb-4\">
                        Indica la cantidad final para distribuir en el censo. {record.fryCount} alevines serán descontados.
                      </p>
                      <div className=\"grid grid-cols-2 gap-4\">
                        <div>
                          <Label>Machos (Betteras)</Label>\n                          <Input 
                            type=\"number\" 
                            className=\"bg-blue-500/10 border-blue-500/20 text-blue-400\"
                            value={finishStats.males} 
                            onChange={e => setFinishStats({...finishStats, males: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label>Hembras (Sorority)</Label>
                          <Input 
                            type=\"number\" 
                            className=\"bg-pink-500/10 border-pink-500/20 text-pink-400\"
                            value={finishStats.females} 
                            onChange={e => setFinishStats({...finishStats, females: parseInt(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                      <Button 
                        className=\"w-full bg-emerald-600 hover:bg-emerald-700 gap-2 mt-4\" 
                        onClick={() => finalizeProject(record.id)}
                        disabled={finishStats.males + finishStats.females === 0}
                      >\n                        <CheckCircle size={18} /> CONFIRMAR Y DISTRIBUIR
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* FINISHED PROJECTS */}
      <div className=\"space-y-4 pt-4 border-t border-white/5\">
        <div className=\"flex items-center gap-2 text-slate-500\">
          <History size={18} />
          <h4 className=\"text-xs uppercase font-bold tracking-widest\">Proyectos Terminados</h4>
        </div>
        
        <div className=\"grid gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-500\">
          {finishedProjects.map((record) => (\n            <Card key={record.id} className=\"p-4 bg-white/5 border border-white/10 flex items-center justify-between\">\n              <div>\n                <h4 className=\"font-bold text-white text-sm\">{record.pairName}</h4>\n                <p className=\"text-[8px] text-slate-500 mt-1 uppercase font-bold\">Terminado el: {new Date(record.finishDate || '').toLocaleDateString()}</p>\n              </div>\n              <div className=\"flex items-center gap-2\">\n                 <div className=\"px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-aqua-400\">EXITOSO</div>\n              </div>\n            </Card>\n          ))}\n        </div>\n      </div>\n    </div>\n  );\n};\n