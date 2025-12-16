import { Wrench } from 'lucide-react';

interface MaintenanceItem {
  id: string;
  date: string;
  tankId: string;
  tankName: string;
  action: string;
}

interface MaintenanceTimelineProps {
  items: MaintenanceItem[];
}

export function MaintenanceTimeline({ items }: MaintenanceTimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="relative pl-8 pb-8 last:pb-0">
          {index !== items.length - 1 && (
            <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-green-500"></div>
          )}

          <div className="absolute left-0 top-0 w-6 h-6 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Wrench className="w-3 h-3 text-white" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.tankName}</span>
            </div>

            <p className="text-sm text-gray-900 dark:text-white font-medium">{item.action}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
