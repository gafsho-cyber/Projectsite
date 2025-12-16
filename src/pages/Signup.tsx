import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  function passwordStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score; // 0..4
  }

  function strengthLabel(score: number) {
    return ['Very weak', 'Weak', 'Okay', 'Strong', 'Very strong'][score] ?? 'Very weak';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const ok = await signup(email.trim(), password, name.trim() || undefined);
    if (ok) {
      toast.success('Account created', 'Welcome!');
      navigate('/');
    } else {
      setError('Account already exists');
      toast.error('Sign up failed', 'An account with that email already exists');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-slate-200 rounded px-3 py-2"
            />
          </div>
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
              aria-describedby="pw-help pw-strength"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-slate-200 rounded px-3 py-2"
              required
            />
            <div id="pw-help" className="text-xs text-gray-500 mt-1">Use at least 8 characters, mix letters, numbers, and symbols.</div>
            <div id="pw-strength" className="mt-2">
              <div className="h-2 w-full bg-slate-100 rounded overflow-hidden">
                <div
                  className={`h-full bg-cyan-500 transition-all duration-300 ease-out`}
                  style={{ width: `${(passwordStrength(password) / 4) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1 transition-colors duration-200">{strengthLabel(passwordStrength(password))}</div>
            </div>
          </div>
          {error && <div role="alert" className="text-sm text-red-600">{error}</div>}
          <div className="flex items-center justify-between">
            <button disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
            <a onClick={() => navigate('/login')} className="text-sm text-blue-600 hover:underline cursor-pointer">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
