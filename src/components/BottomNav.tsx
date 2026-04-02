import React from 'react';
import { Home, Fish, Droplets, HeartPulse, Activity, AlertTriangle, MinusCircle } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'census', icon: Fish, label: 'Censo' },
    { id: 'water', icon: Droplets, label: 'Agua' },
    { id: 'health', icon: HeartPulse, label: 'Salud' },
    { id: 'breeding', icon: Activity, label: 'Cría' },
    { id: 'losses', icon: MinusCircle, label: 'Bajas' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-2 py-3 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === tab.id ? 'text-aqua-400' : 'text-slate-500'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
