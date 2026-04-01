import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { Census } from './components/Census';
import { WaterParameters } from './components/WaterParameters';
import { Health } from './components/Health';
import { BreedingModule } from './components/BreedingModule';
import { Incidents } from './components/Incidents';
import { MaintenanceModule } from './components/MaintenanceModule';
import { FeedingModule } from './components/FeedingModule';
import { AquaGenius } from './components/AquaGenius';
import { storage, STORAGE_KEYS } from './services/storage';
import { 
  Animal, 
  WaterParameter, 
  HealthRecord, 
  Incident, 
  Breeding, 
  Maintenance, 
  Feeding 
} from './types';
import { Fish, Sparkles } from 'lucide-react';
import { Button } from './components/UI';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);

  // Data State
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [waterParams, setWaterParams] = useState<WaterParameter[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<Breeding[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<Feeding[]>([]);

  useEffect(() => {
    // Load initial data from LocalStorage
    setAnimals(storage.get<Animal>(STORAGE_KEYS.ANIMALS));
    setWaterParams(storage.get<WaterParameter>(STORAGE_KEYS.WATER));
    setHealthRecords(storage.get<HealthRecord>(STORAGE_KEYS.HEALTH));
    setIncidents(storage.get<Incident>(STORAGE_KEYS.INCIDENTS));
    setBreedingRecords(storage.get<Breeding>(STORAGE_KEYS.BREEDING));
    setMaintenanceRecords(storage.get<Maintenance>(STORAGE_KEYS.MAINTENANCE));
    setFeedingRecords(storage.get<Feeding>(STORAGE_KEYS.FEEDING));
    
    setLoading(false);
  }, []);

  const handleDataUpdate = <T extends { id: string }>(
    key: string, 
    setter: React.Dispatch<React.SetStateAction<T[]>>, 
    action: 'add' | 'update' | 'delete',
    item?: any,
    id?: string,
    updates?: Partial<T>
  ) => {
    let updated: T[] = [];
    if (action === 'add' && item) {
      updated = storage.add<T>(key, item);
    } else if (action === 'update' && id && updates) {
      updated = storage.update<T>(key, id, updates);
    } else if (action === 'delete' && id) {
      updated = storage.delete<T>(key, id);
    }
    setter(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-aqua-400/20 rounded-full flex items-center justify-center">
            <Fish className="text-aqua-400 animate-bounce" size={32} />
          </div>
          <span className="text-aqua-400 font-display text-xl tracking-widest uppercase">AquaLogic</span>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (showAI) {
      return <AquaGenius context={{ animals, waterParams, healthRecords, incidents }} />;
    }

    switch (activeTab) {
      case 'home':
        return <Dashboard animals={animals} waterParams={waterParams} incidents={incidents} />;
      case 'census':
        return (
          <Census 
            animals={animals} 
            onAdd={(item) => handleDataUpdate(STORAGE_KEYS.ANIMALS, setAnimals, 'add', item)}
            onDelete={(id) => handleDataUpdate(STORAGE_KEYS.ANIMALS, setAnimals, 'delete', undefined, id)}
          />
        );
      case 'water':
        return (
          <div className="space-y-8 pb-10">
            <WaterParameters 
              waterParams={waterParams} 
              onAdd={(item) => handleDataUpdate(STORAGE_KEYS.WATER, setWaterParams, 'add', item)}
            />
            <MaintenanceModule 
              maintenanceRecords={maintenanceRecords} 
              onAdd={(item) => handleDataUpdate(STORAGE_KEYS.MAINTENANCE, setMaintenanceRecords, 'add', item)}
            />
            <FeedingModule 
              feedingRecords={feedingRecords} 
              onAdd={(item) => handleDataUpdate(STORAGE_KEYS.FEEDING, setFeedingRecords, 'add', item)}
            />
          </div>
        );
      case 'health':
        return <Health healthRecords={healthRecords} animals={animals} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.HEALTH, setHealthRecords, 'add', item)} />;
      case 'breeding':
        return <BreedingModule breedingRecords={breedingRecords} animals={animals} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.BREEDING, setBreedingRecords, 'add', item)} />;
      case 'incidents':
        return <Incidents incidents={incidents} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.INCIDENTS, setIncidents, 'add', item)} />;
      default:
        return <Dashboard animals={animals} waterParams={waterParams} incidents={incidents} />;
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      <header className="p-4 flex justify-between items-center glass sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-aqua-400/10 rounded-2xl flex items-center justify-center text-aqua-400">
            <Fish size={24} />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white leading-none">AquaLogic</h2>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Vicioso Edition • Local</p>
          </div>
        </div>
        <Button 
          variant={showAI ? 'secondary' : 'ghost'} 
          size="sm" 
          onClick={() => setShowAI(!showAI)}
          className="rounded-full w-10 h-10 p-0"
        >
          <Sparkles size={18} className={showAI ? 'text-slate-950' : 'text-gold-500'} />
        </Button>
      </header>

      <main className="p-4 max-w-4xl mx-auto w-full">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setShowAI(false); }} />
    </div>
  );
}
