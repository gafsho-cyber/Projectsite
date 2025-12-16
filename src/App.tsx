import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Topbar } from './components/Topbar';
import { SidebarNav } from './components/SidebarNav';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import { Tanks } from './pages/Tanks';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SystemDataProvider, useSystemData } from './context/SystemDataContext';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {

    const location = window.location;
    return <Navigate to="/login" replace state={{ from: { pathname: location.pathname } }} />;
  }
  return children;
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SidebarNav sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ProtectedLayout() {
  const { hasSetup } = useSystemData();
  
  if (!hasSetup) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <Layout />;
}

function OnboardingRoute() {
  return <Onboarding />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SystemDataProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <OnboardingRoute />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <ProtectedLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="alerts" element={<Alerts />} />
                  <Route path="tanks" element={<Tanks />} />
                  <Route path="history" element={<History />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </SystemDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
