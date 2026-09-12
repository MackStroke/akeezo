import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import LeadsPage from './pages/admin/LeadsPage';
import ProfilePage from './pages/admin/ProfilePage';
import SettingsPage from './pages/admin/SettingsPage';
import ThemeSettingsPage from './pages/admin/ThemeSettingsPage';
import TasksPage from './pages/admin/TasksPage';
import CompliancePage from './pages/admin/CompliancePage';
import ConsultancyPage from './pages/admin/ConsultancyPage';
import LeadDetailsPage from './pages/admin/LeadDetailsPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/admin/login" element={<LoginPage />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="theme" element={<ThemeSettingsPage />} />
            <Route path="consultancy" element={<ConsultancyPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
