import React, { createContext, useContext, useState } from 'react';
import { simpleHash } from '../utils/hash';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextValue {
  user: User | null;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: { name?: string }) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'aqua_auth_users_v1';
const SESSION_KEY = 'aqua_auth_session_v1';

function readUsers(): Record<string, { email: string; password: string; name?: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, { email: string; password: string; name?: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  async function signup(email: string, password: string, name?: string) {
    const users = readUsers();
    if (Object.values(users).some((u) => u.email === email)) return false;
    const id = `u_${Date.now()}`;
    users[id] = { email, password: simpleHash(password), name };
    writeUsers(users);
    const newUser: User = { id, email, name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  }

  async function login(email: string, password: string) {
    const users = readUsers();
    const hashedPw = simpleHash(password);
    const entry = Object.entries(users).find(([, v]) => v.email === email && v.password === hashedPw);
    if (!entry) return false;
    const [id, v] = entry;
    const u: User = { id, email: v.email, name: v.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    return true;
  }

  async function updateProfile(updates: { name?: string }) {
    try {
      if (!user) return;
      const users = readUsers();
      const entry = users[user.id];
      if (!entry) return;
      entry.name = updates.name ?? entry.name;
      writeUsers(users);
      const newUser = { ...user, name: entry.name };
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (e) {
      // ignore
    }
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    if (!user) return false;
    const users = readUsers();
    const entry = users[user.id];
    if (!entry) return false;
    if (entry.password !== simpleHash(oldPassword)) return false;
    entry.password = simpleHash(newPassword);
    writeUsers(users);
    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, signup, login, logout, updateProfile, changePassword }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
