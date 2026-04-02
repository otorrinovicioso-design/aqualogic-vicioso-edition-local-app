export type Species = 'Betta' | 'Guppy' | 'Otro';

export type SubgroupType = 
  | 'Reproductores Masculinos' 
  | 'Reproductores Femeninos' 
  | 'Betteras recirculadas' 
  | 'Betta-sorority' 
  | 'Guppys Machos' 
  | 'Guppys Hembras' 
  | 'Alevines'
  | 'Desoves'
  | string; 

export type HealthStatus = 'Tratamiento' | 'Mejorado' | 'Alta' | 'Baja';

export interface Animal {
  id: string;
  name: string;
  species: Species;
  sex: 'Macho' | 'Hembra';
  traits: string;
  entryDate: string;
  status: 'Activo' | 'Vendido' | 'Baja';
}

export interface Breeder extends Animal {
  provenance: string;
}

export interface CensusSubgroup {
  id: string;
  type: SubgroupType;
  quantity: number;
  lastUpdated: string;
}

export interface WaterParameter {
  id: string;
  date: string;
  subgroup: string;
  ph?: number; // Opcionales
  gh?: number;
  kh?: number;
  nh3?: number;
  no2?: number;
  no3?: number;
  temp?: number;
  notes?: string;
}

export interface HealthEvolution {
  id: string;
  date: string;
  note: string;
  status: HealthStatus;
}

export interface HealthRecord {
  id: string;
  date: string;
  manualName: string;
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  status: HealthStatus;
  evolutions: HealthEvolution[];
  observations?: string;
}

export interface Breeding {
  id: string;
  pairName: string;
  maleId: string;
  femaleId: string;
  startDate: string;
  spawnDate?: string;
  fryCount?: number;
  status: 'Iniciado' | 'Nido' | 'Eclosión' | 'Alevines' | 'Terminado'; 
  geneticGoals: string;
  isFinished: boolean;
  finishDate?: string;
}

export interface Incident {
  id: string;
  date: string;
  title: string;
  description: string;
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  location: string;
  resolved: boolean;
}

export interface Loss {
  id: string;
  date: string;
  quantity: number;
  subgroup: string;
  type: 'Muerte' | 'Venta';
  breederId?: string;
  reason?: string;
}

export interface Maintenance {
  id: string;
  date: string;
  task: string;
  category: string;
  type: string;
  volume?: number | string;
  description?: string;
}

export interface Feeding {
  id: string;
  date: string;
  type: string;
  amount: string;
  frequency: string;
}
