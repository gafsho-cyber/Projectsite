import { Download, Calendar } from 'lucide-react';
import { useState } from 'react';
import { LineChartMock } from '../components/LineChartMock';
import { useSystemData } from '../context/SystemDataContext';
import { useToast } from '../context/ToastContext';

function generateSensorData() {
  return Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (30 - i) * 3600000).toISOString(),
    value: 6.8 + Math.random() * 0.4,
  }));
}

export function History() {
  const { system } = useSystemData();
  const { success, error } = useToast();
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTankId, setSelectedTankId] = useState(system.tanks[0]?.id || '');

  function downloadCSV(filename: string, rows: (string | number)[][]) {
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleExport() {
    if (!selectedTankId) {
      error('Please select a tank first');
      return;
    }

    const selectedTank = system.tanks.find((t) => t.id === selectedTankId);
    if (!selectedTank) return;

    const rows: (string | number)[][] = [];
    rows.push(['Tank Data Export', selectedTank.name, new Date().toISOString()]);
    rows.push([]);
    rows.push(['Tank Information']);
    rows.push(['Name', selectedTank.name]);
    rows.push(['Type', selectedTank.type]);
    rows.push(['Volume', selectedTank.volume, 'L']);
    rows.push(['Temperature', selectedTank.temperature ?? 0, '°C']);
    rows.push(['pH', selectedTank.ph ?? 0]);
    rows.push(['Water Level', selectedTank.waterLevel ?? 0, '%']);
    rows.push([]);

    const tankFish = system.fish.filter((f) => f.tankId === selectedTankId);
    if (tankFish.length > 0) {
      rows.push(['Fish Species']);
      rows.push(['Name', 'Quantity', 'Size']);
      tankFish.forEach((f) => {
        rows.push([f.name, f.quantity, f.size]);
      });
      rows.push([]);
    }

    const tankPlants = system.plants.filter((p) => p.tankId === selectedTankId);
    if (tankPlants.length > 0) {
      rows.push(['Plant Species']);
      rows.push(['Name', 'Quantity', 'Last Harvest']);
      tankPlants.forEach((p) => {
        rows.push([p.name, p.quantity, p.harvestDate || 'N/A']);
      });
      rows.push([]);
    }

    rows.push(['Date Range', startDate, 'to', endDate]);

    const filename = `export-${selectedTank.name}-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filename, rows);
    success('Data exported successfully');
  }

  if (system.tanks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No tanks yet. Create one to view history.</p>
      </div>
    );
  }

  const phData = generateSensorData();
  const tempData = generateSensorData().map((d) => ({ ...d, value: 25 + Math.random() * 2 }));
  const doData = generateSensorData().map((d) => ({ ...d, value: 7 + Math.random() * 1 }));
  const ammonyData = generateSensorData().map((d) => ({ ...d, value: 0.2 + Math.random() * 0.1 }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">History & Insights</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Analyze trends and data</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-3">Tank Selection & Date Range</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedTankId}
                onChange={(e) => setSelectedTankId(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {system.tanks.map((tank) => (
                  <option key={tank.id} value={tank.id}>
                    {tank.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <span className="flex items-center text-gray-500 dark:text-gray-400">to</span>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <LineChartMock data={phData} color="#14b8a6" title="pH History" />
        <LineChartMock data={tempData} color="#10b981" title="Temperature History" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <LineChartMock data={doData} color="#0ea5e9" title="Dissolved Oxygen History" />
        <LineChartMock data={ammonyData} color="#f59e0b" title="Ammonia History" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-cyan-500 rounded-lg p-6 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90 mb-2">Total Tanks</h3>
          <p className="text-4xl font-bold mb-1">{system.tanks.length}</p>
          <p className="text-sm opacity-75">In your system</p>
        </div>

        <div className="bg-cyan-500 rounded-lg p-6 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90 mb-2">Total Fish</h3>
          <p className="text-4xl font-bold mb-1">{system.fish.reduce((s, f) => s + f.quantity, 0)}</p>
          <p className="text-sm opacity-75">Species: {system.fish.length}</p>
        </div>

        <div className="bg-cyan-500 rounded-lg p-6 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90 mb-2">Total Plants</h3>
          <p className="text-4xl font-bold mb-1">{system.plants.reduce((s, p) => s + p.quantity, 0)}</p>
          <p className="text-sm opacity-75">Species: {system.plants.length}</p>
        </div>
      </div>
    </div>
  );
}
