const STORAGE_PREFIX = 'aqualogic_';

export const STORAGE_KEYS = {
  ANIMALS: `${STORAGE_PREFIX}animals`,
  BREEDERS: `${STORAGE_PREFIX}breeders`,
  CENSUS: `${STORAGE_PREFIX}census`,
  WATER: `${STORAGE_PREFIX}water`,
  HEALTH: `${STORAGE_PREFIX}health`,
  INCIDENTS: `${STORAGE_PREFIX}incidents`,
  BREEDING: `${STORAGE_PREFIX}breeding`,
  MAINTENANCE: `${STORAGE_PREFIX}maintenance`,
  FEEDING: `${STORAGE_PREFIX}feeding`,
};

export const storage = {
  get: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  set: <T>(key: string, data: T[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  add: <T extends { id: string }>(key: string, item: Partial<T>): T[] => {
    const current = storage.get<T>(key);
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
    } as T;
    const updated = [newItem, ...current];
    storage.set(key, updated);
    return updated;
  },

  update: <T extends { id: string }>(key: string, id: string, updates: Partial<T>): T[] => {
    const current = storage.get<T>(key);
    const updated = current.map((item) => 
      item.id === id ? { ...item, ...updates } : item
    );
    storage.set(key, updated);
    return updated;
  },

  delete: <T extends { id: string }>(key: string, id: string): T[] => {
    const current = storage.get<T>(key);
    const updated = current.filter((item) => item.id !== id);
    storage.set(key, updated);
    return updated;
  },
};
