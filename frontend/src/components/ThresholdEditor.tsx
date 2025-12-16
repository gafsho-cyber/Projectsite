import { useState } from 'react';

interface Threshold {
  parameter: string;
  min: number;
  max: number;
  unit: string;
}

const defaultThresholds: Threshold[] = [
  { parameter: 'pH', min: 6.5, max: 8.0, unit: 'pH' },
  { parameter: 'Dissolved Oxygen', min: 6.0, max: 10.0, unit: 'mg/L' },
  { parameter: 'Temperature', min: 20.0, max: 28.0, unit: '°C' },
  { parameter: 'Ammonia', min: 0.0, max: 0.5, unit: 'ppm' },
];

export function ThresholdEditor() {
  const [thresholds, setThresholds] = useState(defaultThresholds);

  const handleMinChange = (index: number, value: number) => {
    const updated = [...thresholds];
    updated[index].min = value;
    setThresholds(updated);
  };

  const handleMaxChange = (index: number, value: number) => {
    const updated = [...thresholds];
    updated[index].max = value;
    setThresholds(updated);
  };

  return (
    <div className="space-y-6">
      {thresholds.map((threshold, index) => (
        <div
          key={threshold.parameter}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            {threshold.parameter} ({threshold.unit})
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Threshold: {threshold.min.toFixed(1)} {threshold.unit}
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={threshold.min}
                onChange={(e) => handleMinChange(index, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Threshold: {threshold.max.toFixed(1)} {threshold.unit}
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={threshold.max}
                onChange={(e) => handleMaxChange(index, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-2">
              <span>Range: {threshold.min.toFixed(1)} - {threshold.max.toFixed(1)} {threshold.unit}</span>
              <button className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
