const STORAGE_KEYS = {
  ANIMALS: 'aqualogic_animals',
  WATER: 'aqualogic_water',
  HEALTH: 'aqualogic_health',
  INCIDENTS: 'aqualogic_incidents',
  BREEDING: 'aqualogic_breeding',
  MAINTENANCE: 'aqualogic_maintenance',
  FEEDING: 'aqualogic_feeding'
};

export const storage = {
  get: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  
  save: <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  add: <T extends { id?: string }>(key: string, item: T): T[] => {
    const current = storage.get<T>(key);
    const newItem = { 
      ...item, 
      id: item.id || Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...current];
    storage.save(key, updated);
    return updated;
  },

  update: <T extends { id: string }>(key: string, id: string, updates: Partial<T>): T[] => {
    const current = storage.get<T>(key);
    const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
    storage.save(key, updated);
    return updated;
  },

  delete: <T extends { id: string }>(key: string, id: string): T[] => {
    const current = storage.get<T>(key);
    const updated = current.filter(item => item.id !== id);
    storage.save(key, updated);
    return updated;
  }
};

export { STORAGE_KEYS };
