import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Tank {
  id: string;
  name: string;
  type: 'grow-bed' | 'fish-tank' | 'settling-tank';
  volume: number; 
  waterLevel?: number;
  temperature?: number;
  ph?: number;
  notes?: string;
}

export interface FishSpecies {
  id: string;
  name: string;
  quantity: number;
  size: string;
  tankId: string;
  notes?: string;
}

export interface PlantSpecies {
  id: string;
  name: string;
  quantity: number;
  harvestDate?: string;
  tankId: string;
  notes?: string;
}

export interface SystemData {
  tanks: Tank[];
  fish: FishSpecies[];
  plants: PlantSpecies[];
}

interface SystemDataContextValue {
  system: SystemData;
  hasSetup: boolean;
  addTank: (tank: Omit<Tank, 'id'>) => void;
  updateTank: (id: string, updates: Partial<Tank>) => void;
  deleteTank: (id: string) => void;
  addFish: (fish: Omit<FishSpecies, 'id'>) => void;
  updateFish: (id: string, updates: Partial<FishSpecies>) => void;
  deleteFish: (id: string) => void;
  addPlant: (plant: Omit<PlantSpecies, 'id'>) => void;
  updatePlant: (id: string, updates: Partial<PlantSpecies>) => void;
  deletePlant: (id: string) => void;
}

const SystemDataContext = createContext<SystemDataContextValue | undefined>(undefined);

const STORAGE_KEY_TEMPLATE = 'aqua_system_data_v1_';

function getStorageKey(userId: string) {
  return STORAGE_KEY_TEMPLATE + userId;
}

function readSystem(userId: string): SystemData {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : { tanks: [], fish: [], plants: [] };
  } catch {
    return { tanks: [], fish: [], plants: [] };
  }
}

function writeSystem(userId: string, system: SystemData) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(system));
}

export function SystemDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [system, setSystem] = useState<SystemData>(() => {
    if (!user) return { tanks: [], fish: [], plants: [] };
    return readSystem(user.id);
  });

  useEffect(() => {
    if (!user) {
      setSystem({ tanks: [], fish: [], plants: [] });
      return;
    }
    const loaded = readSystem(user.id);
    setSystem(loaded);
  }, [user?.id]);

  function save(data: SystemData) {
    if (!user) return;
    setSystem(data);
    writeSystem(user.id, data);
  }

  const addTank = (tank: Omit<Tank, 'id'>) => {
    const newTank: Tank = { ...tank, id: `tank_${Date.now()}` };
    save({ ...system, tanks: [...system.tanks, newTank] });
  };

  const updateTank = (id: string, updates: Partial<Tank>) => {
    save({ ...system, tanks: system.tanks.map((t) => (t.id === id ? { ...t, ...updates } : t)) });
  };

  const deleteTank = (id: string) => {
    save({
      ...system,
      tanks: system.tanks.filter((t) => t.id !== id),
      fish: system.fish.filter((f) => f.tankId !== id),
      plants: system.plants.filter((p) => p.tankId !== id),
    });
  };

  const addFish = (fish: Omit<FishSpecies, 'id'>) => {
    const newFish: FishSpecies = { ...fish, id: `fish_${Date.now()}` };
    save({ ...system, fish: [...system.fish, newFish] });
  };

  const updateFish = (id: string, updates: Partial<FishSpecies>) => {
    save({ ...system, fish: system.fish.map((f) => (f.id === id ? { ...f, ...updates } : f)) });
  };

  const deleteFish = (id: string) => {
    save({ ...system, fish: system.fish.filter((f) => f.id !== id) });
  };

  const addPlant = (plant: Omit<PlantSpecies, 'id'>) => {
    const newPlant: PlantSpecies = { ...plant, id: `plant_${Date.now()}` };
    save({ ...system, plants: [...system.plants, newPlant] });
  };

  const updatePlant = (id: string, updates: Partial<PlantSpecies>) => {
    save({ ...system, plants: system.plants.map((p) => (p.id === id ? { ...p, ...updates } : p)) });
  };

  const deletePlant = (id: string) => {
    save({ ...system, plants: system.plants.filter((p) => p.id !== id) });
  };

  return (
    <SystemDataContext.Provider
      value={{
        system,
        hasSetup: system.tanks.length > 0,
        addTank,
        updateTank,
        deleteTank,
        addFish,
        updateFish,
        deleteFish,
        addPlant,
        updatePlant,
        deletePlant,
      }}
    >
      {children}
    </SystemDataContext.Provider>
  );
}

export function useSystemData() {
  const ctx = useContext(SystemDataContext);
  if (!ctx) throw new Error('useSystemData must be used within SystemDataProvider');
  return ctx;
}
