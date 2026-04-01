import React from 'react';
import { 
  Home, 
  Fish, 
  Droplets, 
  HeartPulse, 
  Activity, 
  AlertTriangle, 
  MessageSquare,
  Bot
} from 'lucide-react';
import { cn } from './UI';

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
    { id: 'incidents', icon: AlertTriangle, label: 'Alertas' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Decorative gradient blur */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10" />
      
      <div className="relative flex justify-around items-center px-2 py-4 max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative px-4",
                isActive ? "text-aqua-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {isActive && (
                <div className="absolute -top-4 w-8 h-1 bg-aqua-400 rounded-full shadow-[0_0_10px_#2dd4bf]" />
              )}
              <tab.icon size={22} className={cn(
                "transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
