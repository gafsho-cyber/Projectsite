import { Bell, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface TopbarProps {
  onMenuToggle?: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const toast = useToast();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between transition-colors">
      <div className="flex-1 flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src="/aquaphonics.png" alt="Logo" className="w-10 h-10 sm:w-12 md:w-16 sm:h-12 md:h-16 object-contain flex-shrink-0" />
          <div className="hidden sm:block min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">Smart Aquaponics Platform</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Real-time monitoring and insights</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          )}
        </button>

        <button className="relative p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user ? (
          <div className="relative" ref={useRef(null)}>
            <ProfileMenu user={user} onLogout={() => { logout(); toast.info('Signed out', 'You have been signed out'); }} />
          </div>
        ) : (
          <div className="p-1 sm:p-2 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-300">Guest</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileMenu({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const initials = (user.name || user.email || 'U')
    .split(' ')
    .map((s: string) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  useEffect(() => {
    if (!open || !ref.current) return;
    const focusable = ref.current.querySelectorAll<HTMLElement>('a,button,input');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    first?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-200">{initials}</div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name ?? user.email}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Account</div>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Profile</Link>
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onLogout()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onLogout();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
