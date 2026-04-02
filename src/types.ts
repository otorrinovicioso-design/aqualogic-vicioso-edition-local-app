export type Species = 'Betta' | 'Guppy' | 'Otro';
export type SubgroupType = 'Reproductores Masculinos' | 'Reproductores Femeninos' | 'Beteras recirculadas' | 'Beta-sorority' | 'Guppys' | 'Desoves';
export type HealthStatus = 'Tratamiento' | 'Mejorado' | 'Recuperado' | 'Baja';

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
  ph: number;
  gh: number;
  kh: number;
  nh3: number;
  no2: number;
  no3: number;
  temp: number;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  manualName?: string;
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  status?: HealthStatus;
  observations?: string;
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

export interface Breeding {
  id: string;
  pairName: string;
  maleId: string;
  femaleId: string;
  startDate: string;
  fryCount?: number;
  status: 'Iniciado' | 'Nido' | 'Eclosión' | 'Alevines';
  geneticGoals: string;
}

export interface Maintenance {
  id: string;
  date: string;
  task: string;
  category: string;
  type: string;
  volume?: number;
  description?: string;
}

export interface Feeding {
  id: string;
  date: string;
  type: string;
  amount: string;
  frequency: string;
}
