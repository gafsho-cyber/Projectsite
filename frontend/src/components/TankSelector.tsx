import { ChevronDown } from 'lucide-react';
import { Tank } from '../context/SystemDataContext';

interface TankSelectorProps {
  tanks: Tank[];
  selectedTankId: string;
  onSelect: (tankId: string) => void;
}

export function TankSelector({ tanks, selectedTankId, onSelect }: TankSelectorProps) {
  const selectedTank = tanks.find((t) => t.id === selectedTankId);

  return (
    <div className="relative">
      <select
        value={selectedTankId}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white font-medium cursor-pointer hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
      >
        {tanks.map((tank) => (
          <option key={tank.id} value={tank.id}>
            {tank.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />

      {selectedTank && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Type:</span> {selectedTank.type.replace('-', ' ')} •
          <span className="font-medium ml-2">Volume:</span> {selectedTank.volume}L
        </div>
      )}
    </div>
  );
}
