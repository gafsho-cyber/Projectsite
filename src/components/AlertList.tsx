import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert } from '../data/mockData';
import { AlertBadge } from './AlertBadge';

interface AlertListProps {
  alerts: Alert[];
  limit?: number;
}

export function AlertList({ alerts, limit }: AlertListProps) {
  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-white dark:bg-gray-800 rounded-lg p-4 border transition-all hover:shadow-md ${
            alert.resolved
              ? 'border-gray-200 dark:border-gray-700 opacity-60'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {alert.resolved ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <AlertBadge severity={alert.severity} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {alert.parameter} - {alert.tankName}
              </h4>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {alert.message}
              </p>

              {alert.resolved && (
                <span className="inline-block mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓ Resolved
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {displayAlerts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No alerts to display</p>
        </div>
      )}
    </div>
  );
}
