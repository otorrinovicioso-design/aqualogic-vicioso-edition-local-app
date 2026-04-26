export type Species = 'Betta' | 'Guppy' | 'Otro';

export type SubgroupType = 
  | 'Reproductores Masculinos' 
  | 'Reproductores Femeninos' 
  | 'Betteras recirculadas' 
  | 'Betta-sorority' 
  | 'Guppys Machos' 
  | 'Guppys Hembras' 
  | 'Alevines Betta'
  | 'Alevines Guppys';

export interface Breeder {
  id: string;
  name: string;
  species: Species;
  sex: 'Macho' | 'Hembra';
  variety: string;
  source: string;
  importDate: string;
  notes?: string;
  status: 'Activo' | 'Retirado' | 'Fallecido';
  image?: string;
}

export interface CensusSubgroup {
  id: string;
  type: SubgroupType;
  quantity: number;
  lastUpdated: string;
  notes?: string;
}

export interface WaterParameter {
  id: string;
  date: string;
  subgroup?: string;
  ph?: number;
  gh?: number;
  kh?: number;
  nh3?: number;
  no2?: number;
  no3?: number;
  temp?: number;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  breederId?: string;
  subgroup?: string;
  symptoms: string;
  diagnosis?: string;
  treatment: string;
  status: 'En tratamiento' | 'Recuperado' | 'Fallecido';
  notes?: string;
}

export interface Incident {
  id: string;
  date: string;
  type: 'equipo' | 'parámetros' | 'salud' | 'otro';
  severity: 'baja' | 'media' | 'alta';
  description: string;
  resolved: boolean;
  resolutionDate?: string;
}

export interface Breeding {
  id: string;
  startDate: string;
  maleId: string;
  femaleId: string;
  pairName: string;
  status: 'Iniciado' | 'Nido' | 'Eclosión' | 'Alevines' | 'Terminado' | 'Fallido';
  spawnDate?: string;
  hatchDate?: string;
  fryCount?: number;
  isFinished: boolean;
  finishDate?: string;
  result?: 'Exitoso' | 'Fallido';
  notes?: string;
}

export interface Maintenance {
  id: string;
  date: string;
  task: string;
  category: string;
  type: string;
  volume?: string;
  description?: string;
}

export interface Feeding {
  id: string;
  date: string;
  type: string;
  food: string;
  amount?: string;
  notes?: string;
}

export interface Loss {
  id: string;
  date: string;
  type: 'breeder' | 'fry' | 'census';
  entityId?: string;
  entityName: string;
  count: number;
  reason: string;
  notes?: string;
}
