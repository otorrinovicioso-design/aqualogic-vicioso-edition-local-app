import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { Census } from './components/Census';
import { WaterParameters } from './components/WaterParameters';
import { Health } from './components/Health';
import { BreedingModule } from './components/BreedingModule';
import { BreedersModule } from './components/BreedersModule';
import { LossesModule } from './components/LossesModule';
import { Incidents } from './components/Incidents';
import { MaintenanceModule } from './components/MaintenanceModule';
import { FeedingModule } from './components/FeedingModule';
import { storage, STORAGE_KEYS } from './services/storage';
import { Breeder, CensusSubgroup, WaterParameter, HealthRecord, Incident, Breeding, Maintenance, Feeding, Loss, SubgroupType } from './types';
import { Fish } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [breeders, setBreeders] = useState<Breeder[]>([]);
  const [census, setCensus] = useState<CensusSubgroup[]>([]);
  const [waterParams, setWaterParams] = useState<WaterParameter[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<Breeding[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<Feeding[]>([]);
  const [losses, setLosses] = useState<Loss[]>([]);

  useEffect(() => {
    setBreeders(storage.get<Breeder>(STORAGE_KEYS.BREEDERS));
    setCensus(storage.get<CensusSubgroup>(STORAGE_KEYS.CENSUS));
    setWaterParams(storage.get<WaterParameter>(STORAGE_KEYS.WATER));
    setHealthRecords(storage.get<HealthRecord>(STORAGE_KEYS.HEALTH));
    setIncidents(storage.get<Incident>(STORAGE_KEYS.INCIDENTS));
    setBreedingRecords(storage.get<Breeding>(STORAGE_KEYS.BREEDING));
    setMaintenanceRecords(storage.get<Maintenance>(STORAGE_KEYS.MAINTENANCE));
    setFeedingRecords(storage.get<Feeding>(STORAGE_KEYS.FEEDING));
    setLosses(storage.get<Loss>(STORAGE_KEYS.LOSSES));
    setLoading(false);
  }, []);

  const handleDataUpdate = <T extends { id: string }>(key: string, setter: React.Dispatch<React.SetStateAction<T[]>>, action: 'add' | 'update' | 'delete', item?: any, id?: string, updates?: Partial<T>) => {
    let updated: T[] = [];
    if (action === 'add' && item) { updated = storage.add<T>(key, item); } 
    else if (action === 'update' && id && updates) { updated = storage.update<T>(key, id, updates); } 
    else if (action === 'delete' && id) { updated = storage.delete<T>(key, id); }
    setter(updated);
  };

  const onUpdateCensus = (type: SubgroupType, delta: number) => {
    const s = census.find(c => c.type === type);
    if (s) { handleDataUpdate(STORAGE_KEYS.CENSUS, setCensus, 'update', undefined, s.id, { quantity: s.quantity + delta, lastUpdated: new Date().toISOString() } as any); }
    else { handleDataUpdate(STORAGE_KEYS.CENSUS, setCensus, 'add', { type, quantity: delta, lastUpdated: new Date().toISOString() }); }
  };

  if (loading) return (<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-white uppercase font-black"><Fish className="animate-bounce" size={48} /></div>);

  return (
    <div className="min-h-screen pb-24 bg-slate-950 text-slate-100 font-sans">
      <header className="p-4 flex justify-between items-center glass sticky top-0 z-40"><div><h2 className="text-xl font-display font-bold text-aqua-400">AquaLogic</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Vicioso Edition • Cloud Active</p></div></header>
      <main className="p-4 max-w-4xl mx-auto">
        {activeTab === 'home' && <Dashboard censusData={census} waterParams={waterParams} incidents={incidents} />}
        {activeTab === 'census' && <div className="space-y-8"><Census censusData={census} breedingProjects={breedingRecords} onUpdate={(id, qty) => handleDataUpdate(STORAGE_KEYS.CENSUS, setCensus, 'update', undefined, id, { quantity: qty, lastUpdated: new Date().toISOString() } as any)} onInit={(data) => handleDataUpdate(STORAGE_KEYS.CENSUS, setCensus, 'add', data)} /><BreedersModule breeders={breeders} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.BREEDERS, setBreeders, 'add', item)} onDelete={(id) => handleDataUpdate(STORAGE_KEYS.BREEDERS, setBreeders, 'delete', undefined, id)} /></div>}
        {activeTab === 'water' && <div className="space-y-8"><WaterParameters waterParams={waterParams} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.WATER, setWaterParams, 'add', item)} onUpdate={(id, updates) => handleDataUpdate(STORAGE_KEYS.WATER, setWaterParams, 'update', undefined, id, updates)} /><MaintenanceModule maintenanceRecords={maintenanceRecords} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.MAINTENANCE, setMaintenanceRecords, 'add', item)} /><FeedingModule feedingRecords={feedingRecords} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.FEEDING, setFeedingRecords, 'add', item)} /></div>}
        {activeTab === 'health' && <Health healthRecords={healthRecords} breeders={breeders} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.HEALTH, setHealthRecords, 'add', item)} onUpdate={(id, updates) => handleDataUpdate(STORAGE_KEYS.HEALTH, setHealthRecords, 'update', undefined, id, updates)} onDelete={(id) => handleDataUpdate(STORAGE_KEYS.HEALTH, setHealthRecords, 'delete', undefined, id)} />}
        {activeTab === 'breeding' && <BreedingModule breedingRecords={breedingRecords} breeders={breeders} censusData={census} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.BREEDING, setBreedingRecords, 'add', item)} onUpdate={(id, updates) => handleDataUpdate(STORAGE_KEYS.BREEDING, setBreedingRecords, 'update', undefined, id, updates)} onUpdateCensus={onUpdateCensus} />}
        {activeTab === 'losses' && <LossesModule losses={losses} censusData={census} breeders={breeders} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.LOSSES, setLosses, 'add', item)} onUpdateCensus={onUpdateCensus} onUpdateBreeder={(id, u) => handleDataUpdate(STORAGE_KEYS.BREEDERS, setBreeders, 'update', undefined, id, u)} />}
        {activeTab === 'incidents' && <Incidents incidents={incidents} onAdd={(item) => handleDataUpdate(STORAGE_KEYS.INCIDENTS, setIncidents, 'add', item)} />}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
