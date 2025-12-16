export interface SensorReading {
  timestamp: string;
  value: number;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  parameter: string;
  tankId: string;
  tankName: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface Tank {
  id: string;
  name: string;
  fishType: string;
  plantType: string;
  lastMaintenance: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface SensorData {
  current: number;
  status: 'normal' | 'warning' | 'critical';
  unit: string;
  history: SensorReading[];
}

export const tanks: Tank[] = [
  {
    id: 'tank-1',
    name: 'Tank A - Tilapia',
    fishType: 'Tilapia',
    plantType: 'Lettuce',
    lastMaintenance: '2025-11-28',
    status: 'normal',
  },
  {
    id: 'tank-2',
    name: 'Tank B - Goldfish',
    fishType: 'Goldfish',
    plantType: 'Basil',
    lastMaintenance: '2025-11-25',
    status: 'warning',
  },
  {
    id: 'tank-3',
    name: 'Tank C - Koi',
    fishType: 'Koi',
    plantType: 'Tomatoes',
    lastMaintenance: '2025-11-30',
    status: 'normal',
  },
];

export const sensorData: Record<string, SensorData> = {
  ph: {
    current: 7.2,
    status: 'normal',
    unit: 'pH',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${23 - i}h ago`,
      value: 7.0 + Math.random() * 0.5,
    })),
  },
  dissolvedOxygen: {
    current: 8.5,
    status: 'normal',
    unit: 'mg/L',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${23 - i}h ago`,
      value: 8.0 + Math.random() * 1.0,
    })),
  },
  temperature: {
    current: 24.5,
    status: 'normal',
    unit: '°C',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${23 - i}h ago`,
      value: 23.5 + Math.random() * 2.0,
    })),
  },
  ammonia: {
    current: 0.25,
    status: 'warning',
    unit: 'ppm',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${23 - i}h ago`,
      value: 0.15 + Math.random() * 0.2,
    })),
  },
};

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    severity: 'warning',
    parameter: 'Ammonia',
    tankId: 'tank-2',
    tankName: 'Tank B - Goldfish',
    message: 'Ammonia levels slightly elevated',
    timestamp: '2025-12-03T10:30:00Z',
    resolved: false,
  },
  {
    id: 'alert-2',
    severity: 'critical',
    parameter: 'Dissolved Oxygen',
    tankId: 'tank-1',
    tankName: 'Tank A - Tilapia',
    message: 'DO levels dropped below 6 mg/L',
    timestamp: '2025-12-02T14:15:00Z',
    resolved: true,
  },
  {
    id: 'alert-3',
    severity: 'info',
    parameter: 'Maintenance',
    tankId: 'tank-3',
    tankName: 'Tank C - Koi',
    message: 'Scheduled maintenance completed',
    timestamp: '2025-11-30T09:00:00Z',
    resolved: true,
  },
  {
    id: 'alert-4',
    severity: 'warning',
    parameter: 'pH',
    tankId: 'tank-2',
    tankName: 'Tank B - Goldfish',
    message: 'pH trending upward - monitor closely',
    timestamp: '2025-12-01T16:45:00Z',
    resolved: false,
  },
];

export const maintenanceHistory = [
  {
    id: 'm-1',
    date: '2025-11-30',
    tankId: 'tank-3',
    tankName: 'Tank C - Koi',
    action: 'Full water change and filter cleaning',
  },
  {
    id: 'm-2',
    date: '2025-11-28',
    tankId: 'tank-1',
    tankName: 'Tank A - Tilapia',
    action: 'Filter replacement',
  },
  {
    id: 'm-3',
    date: '2025-11-25',
    tankId: 'tank-2',
    tankName: 'Tank B - Goldfish',
    action: 'Plant trimming and debris removal',
  },
  {
    id: 'm-4',
    date: '2025-11-20',
    tankId: 'tank-1',
    tankName: 'Tank A - Tilapia',
    action: 'pH calibration and adjustment',
  },
];
