import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  document.documentElement.classList.remove("dark");
  }, []);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login(email.trim(), password);
    if (ok) {
      toast.success('Signed in', 'Welcome back');
      // redirect to intended page after login
      const state = location.state as any;
      const dest = state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    } else {
      setError('Invalid credentials');
      toast.error('Sign in failed', 'Check your credentials');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-slate-200 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-slate-200 rounded px-3 py-2"
              required
            />
          </div>
          {error && <div role="alert" className="text-sm text-red-600">{error}</div>}
          <div className="flex items-center justify-between">
            <button disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <a onClick={() => navigate('/signup')} className="text-sm text-blue-600 hover:underline cursor-pointer">
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
