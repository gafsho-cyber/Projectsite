import { LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Configure your preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6">

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-sm md:text-base text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h3>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">About This App</h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Aquaponics Monitor is a personal project management system for tracking your aquaponics tanks, fish, and plants.
          All data is stored locally in your browser and is unique to your account.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Your data is stored locally in your browser. It is not shared with anyone and remains private.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Your data will be exported as a JSON file.')}
            className="px-4 py-2 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
