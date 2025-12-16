import { LayoutDashboard, AlertTriangle, Droplets, Clock, Settings, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarNavProps {
  sidebarOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/tanks', label: 'Tanks', icon: Droplets },
  { to: '/history', label: 'History & Insights', icon: Clock },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ sidebarOpen = false, onClose }: SidebarNavProps) {
  const sidebarClasses =
    'fixed md:static md:block md:w-48 lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen md:sticky md:top-0 transition-colors transform' +
    (sidebarOpen ? ' translate-x-0' : ' -translate-x-full md:translate-x-0') +
    ' transition-transform z-40';

  return (
    <div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-2 md:gap-3 mb-6 md:mb-8">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/aquaphonics.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm md:text-base text-gray-900 dark:text-white truncate">AquaPonics</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Monitor</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <nav className="space-y-1 md:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={(item as any).end}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base ${
                    isActive
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
    </div>
  );
}
