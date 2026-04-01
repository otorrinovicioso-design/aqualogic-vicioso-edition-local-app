export type Species = 'Betta' | 'Guppy' | 'Otro';
export type AnimalStatus = 'Activo' | 'Baja' | 'Vendido';
export type MovementType = 'Entrada' | 'Salida' | 'Nacimiento';
export type MaintenanceType = 'Cambio de Agua' | 'Aditivo' | 'Limpieza' | 'Otro';
export type Severity = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export interface Animal {
  id: string;
  species: Species;
  name: string;
  status: AnimalStatus;
  entryDate: string;
  birthDate?: string;
  parents?: string[];
  traits?: string;
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
  animalId: string;
  date: string;
  observations: string;
  diagnosis?: string;
  treatment?: string;
  dosage?: string;
  duration?: string;
  result?: string;
}

export interface Maintenance {
  id: string;
  date: string;
  task: string;
  description?: string;
  additives?: string;
}

export interface Breeding {
  id: string;
  startDate: string;
  pairName: string;
  maleId: string;
  femaleId: string;
  geneticGoals?: string;
  fryCount?: number;
  status: string;
  traitsSought?: string;
}

export interface Feeding {
  id: string;
  date: string;
  foodType: string;
  amount: string;
  notes?: string;
}

export interface Incident {
  id: string;
  date: string;
  title: string;
  description: string;
  severity: Severity;
  location: string;
  status: string;
  resolved: boolean;
}
