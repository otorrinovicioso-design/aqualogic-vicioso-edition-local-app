import React from 'react';
import { Home, Fish, Droplets, HeartPulse, Activity, AlertTriangle } from 'lucide-react';

export const BottomNav: React.FC<{activeTab: string, setActiveTab: any}> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home },
    { id: 'census', icon: Fish },
    { id: 'water', icon: Droplets },
    { id: 'health', icon: HeartPulse },
    { id: 'breeding', icon: Activity },
    { id: 'incidents', icon: AlertTriangle },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass flex justify-around p-4">
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActiveTab(t.id)} className={activeTab === t.id ? 'text-aqua-400' : 'text-slate-500'}>
          <t.icon size={24} />
        </button>
      ))}
    </nav>
  );
};
