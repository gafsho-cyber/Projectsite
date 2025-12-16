import { useState } from 'react';
import { Search, Filter, AlertTriangle, AlertCircle } from 'lucide-react';
import { useSystemData } from '../context/SystemDataContext';

interface Alert {
  id: string;
  tankId: string;
  tankName: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  parameter: string;
  timestamp: string;
  resolved: boolean;
}

// Generate demo alerts
function generateAlerts(tanks: any[]): Alert[] {
  return [
    {
      id: '1',
      tankId: tanks[0]?.id || '',
      tankName: tanks[0]?.name || 'Tank 1',
      severity: 'warning',
      message: 'Water temperature is slightly elevated',
      parameter: 'Temperature',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: '2',
      tankId: tanks[0]?.id || '',
      tankName: tanks[0]?.name || 'Tank 1',
      severity: 'info',
      message: 'Routine maintenance check scheduled',
      parameter: 'Maintenance',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      resolved: false,
    },
  ];
}

export function Alerts() {
  const { system } = useSystemData();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const alerts = generateAlerts(system.tanks);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.tankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.parameter.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !alert.resolved) ||
      (statusFilter === 'resolved' && alert.resolved);

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.resolved).length;
  const warningCount = alerts.filter((a) => a.severity === 'warning' && !a.resolved).length;
  const infoCount = alerts.filter((a) => a.severity === 'info' && !a.resolved).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Alerts</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Monitor and manage system alerts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
        <div className="bg-red-500 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <h3 className="text-xs sm:text-sm font-medium opacity-90 mb-1 md:mb-2">Critical Alerts</h3>
          <p className="text-3xl md:text-4xl font-bold">{criticalCount}</p>
        </div>

        <div className="bg-yellow-500 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <h3 className="text-xs sm:text-sm font-medium opacity-90 mb-1 md:mb-2">Warnings</h3>
          <p className="text-3xl md:text-4xl font-bold">{warningCount}</p>
        </div>

        <div className="bg-cyan-500 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <h3 className="text-xs sm:text-sm font-medium opacity-90 mb-1 md:mb-2">Info</h3>
          <p className="text-3xl md:text-4xl font-bold">{infoCount}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-gray-400" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full sm:w-auto pl-8 md:pl-9 pr-8 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 dark:text-gray-400">No alerts found</p>
          </div>
        ) : (
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
              Alert History ({filteredAlerts.length} results)
            </h3>
            <div className="space-y-2">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 md:p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm md:text-base">{alert.tankName}</h4>
                        <span className="text-xs bg-white/30 px-2 py-0.5 rounded">
                          {alert.parameter}
                        </span>
                        {alert.resolved && (
                          <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
