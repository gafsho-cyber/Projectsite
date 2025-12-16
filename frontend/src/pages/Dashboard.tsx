import { useState } from 'react';
import { Droplet, Thermometer, Waves, FlaskConical, Plus } from 'lucide-react';
import { SensorCard } from '../components/SensorCard';
import { TankSelector } from '../components/TankSelector';
import { LineChartMock } from '../components/LineChartMock';
import { useSystemData } from '../context/SystemDataContext';
import { Link } from 'react-router-dom';

function generateSensorData() {
  return Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (30 - i) * 3600000).toISOString(),
    value: 6.8 + Math.random() * 0.4,
  }));
}

export function Dashboard() {
  const { system } = useSystemData();
  const [selectedTankId, setSelectedTankId] = useState(system.tanks[0]?.id || '');

  if (system.tanks.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No tanks yet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Go to the onboarding or add a tank to get started.</p>
        <Link to="/" className="text-blue-600 hover:underline">Return to setup</Link>
      </div>
    );
  }

  const selectedTank = system.tanks.find((t) => t.id === selectedTankId) || system.tanks[0];
  const tankFish = system.fish.filter((f) => f.tankId === selectedTank.id);
  const tankPlants = system.plants.filter((p) => p.tankId === selectedTank.id);

  const phData = generateSensorData();
  const tempData = generateSensorData().map((d) => ({ ...d, value: 25 + Math.random() * 2 }));
  const doData = generateSensorData().map((d) => ({ ...d, value: 7 + Math.random() * 1 }));
  const ammonyData = generateSensorData().map((d) => ({ ...d, value: 0.2 + Math.random() * 0.1 }));

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Monitor {selectedTank.name}</p>
        </div>
        <div className="w-full sm:w-auto">
          <TankSelector
            tanks={system.tanks}
            selectedTankId={selectedTank.id}
            onSelect={setSelectedTankId}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">System Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-300 dark:bg-gray-500 rounded">
            <div className="text-sm text-gray-600 dark:text-gray-100">Tanks</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{system.tanks.length}</div>
          </div>
          <div className="p-4 bg-blue-400 dark:bg-blue-700 rounded">
            <div className="text-sm text-gray-700 dark:text-gray-400">Fish Species</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{system.fish.length}</div>
            <div className="text-xs text-gray-500 mt-1">{tankFish.reduce((s, f) => s + f.quantity, 0)} in this tank</div>
          </div>
          <div className="p-4 bg-emerald-500 dark:bg-emerald-800 rounded">
            <div className="text-sm text-gray-600 dark:text-gray-400">Plant Species</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{system.plants.length}</div>
            <div className="text-xs text-gray-500 mt-1">{tankPlants.reduce((s, p) => s + p.quantity, 0)} in this tank</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">{selectedTank.name}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Type</div>
            <div className="text-gray-900 dark:text-white capitalize">{selectedTank.type.replace('-', ' ')}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Volume</div>
            <div className="text-gray-900 dark:text-white">{selectedTank.volume} liters</div>
          </div>
          {selectedTank.temperature && (
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
              <div className="text-gray-900 dark:text-white">{selectedTank.temperature}°C</div>
            </div>
          )}
          {selectedTank.ph && (
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">pH</div>
              <div className="text-gray-900 dark:text-white">{selectedTank.ph}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <SensorCard
          title="pH Level"
          value={selectedTank.ph || 6.8}
          unit=""
          status={selectedTank.ph ? (selectedTank.ph >= 6.5 && selectedTank.ph <= 7.0 ? 'normal' : 'warning') : 'warning'}
          icon={Droplet}
          trend="stable"
        />
        <SensorCard
          title="Temperature"
          value={selectedTank.temperature || 25}
          unit="°C"
          status={selectedTank.temperature ? (selectedTank.temperature >= 22 && selectedTank.temperature <= 28 ? 'normal' : 'warning') : 'warning'}
          icon={Thermometer}
          trend="stable"
        />
        <SensorCard
          title="Water Level"
          value={selectedTank.waterLevel || 75}
          unit="%"
          status={selectedTank.waterLevel && selectedTank.waterLevel >= 70 ? 'normal' : 'warning'}
          icon={Waves}
          trend="stable"
        />
        <SensorCard
          title="Dissolved Oxygen"
          value={7.2}
          unit="mg/L"
          status="normal"
          icon={FlaskConical}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <LineChartMock data={phData} color="#14b8a6" title="pH Level Trends" />
        <LineChartMock data={tempData} color="#10b981" title="Temperature Trends" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <LineChartMock data={doData} color="#0ea5e9" title="Dissolved Oxygen Trends" />
        <LineChartMock data={ammonyData} color="#f59e0b" title="Ammonia Level Trends" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/tanks"
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            <Plus className="w-4 h-4" /> Add Tank
          </Link>
          <Link
            to="/tanks"
            className="flex items-center gap-1 px-3 py-2 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Plus className="w-4 h-4" /> Add Fish
          </Link>
          <Link
            to="/tanks"
            className="flex items-center gap-1 px-3 py-2 border border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 rounded text-sm hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <Plus className="w-4 h-4" /> Add Plants
          </Link>
        </div>
      </div>
    </div>
  );
}
