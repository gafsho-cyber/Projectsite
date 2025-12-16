import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
}

export function SensorCard({ title, value, unit, status, icon: Icon, trend = 'stable' }: SensorCardProps) 
{
  const statusColors = {
    normal: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-500',
    critical: 'from-red-500 to-rose-600',
  };

  const statusBgColors = {
    normal: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    critical: 'bg-red-50 dark:bg-red-900/20',
  };

  const statusTextColors = {
    normal: 'text-green-700 dark:text-green-300',
    warning: 'text-[#FFC000]',
    critical: 'text-red-700 dark:text-red-300',
  };

  const iconTextColors = {
    normal: 'text-white',
    warning: 'text-[#FFC000]',
    critical: 'text-white',
  };

  const trendIndicator = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <div className={`${statusBgColors[status]} rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg transform hover:-translate-y-1 duration-300`}>
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className={`p-2 md:p-3 rounded-lg shadow-lg`}>
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconTextColors[status]}`} />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusTextColors[status]} bg-white dark:bg-gray-800`}>
          {status.toUpperCase()}
        </span>
      </div>

      <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 md:mb-2">{title}</h3>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {value.toFixed(1)}
        </span>
        <span className="text-base md:text-lg text-gray-500 dark:text-gray-400">{unit}</span>
        <span className="text-sm text-gray-400 dark:text-gray-500 ml-auto">
          {trendIndicator[trend]}
        </span>
      </div>
    </div>
  );
}
