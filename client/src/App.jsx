import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import LeadsPage from './pages/admin/LeadsPage';
import EmergenciesPage from './pages/admin/EmergenciesPage';
import EmergencyDetailsPage from './pages/admin/EmergencyDetailsPage';
import ProfilePage from './pages/admin/ProfilePage';
import SettingsPage from './pages/admin/SettingsPage';
import ThemeSettingsPage from './pages/admin/ThemeSettingsPage';
import TasksPage from './pages/admin/TasksPage';
import CompliancePage from './pages/admin/CompliancePage';
import ConsultancyPage from './pages/admin/ConsultancyPage';
import LeadDetailsPage from './pages/admin/LeadDetailsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage';
import SocialSettingsPage from './pages/admin/SocialSettingsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import { CustomerAuthProvider, useCustomerAuth } from './context/CustomerAuthContext';
import { LocaleProvider } from './context/LocaleContext';
import { TooltipProvider } from './components/ui/tooltip';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="p-8 text-center text-slate-400">Loading Admin...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function CustomerProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useCustomerAuth();

  if (isLoading) return <div className="p-8 text-center text-slate-400">Loading Portal...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <AuthProvider>
          <CustomerAuthProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                
                {/* Customer Authentication Modal Routes */}
                <Route path="/login" element={<LandingPage />} />
                <Route path="/customer/login" element={<LandingPage />} />
                <Route path="/signup" element={<LandingPage />} />
                <Route path="/register" element={<LandingPage />} />
                <Route path="/customer/signup" element={<LandingPage />} />
                <Route
                  path="/my-journey"



                element={
                  <CustomerProtectedRoute>
                    <CustomerProfilePage />
                  </CustomerProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <CustomerProtectedRoute>
                    <CustomerProfilePage />
                  </CustomerProtectedRoute>
                }
              />
              
                {/* Public Blog Routes */}
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                
                {/* Admin Routes */}
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
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="users/:id" element={<AdminUserDetailsPage />} />
                  <Route path="emergencies" element={<EmergenciesPage />} />
                  <Route path="emergencies/:id" element={<EmergencyDetailsPage />} />
                  <Route path="blog" element={<AdminBlogPage />} />
                  <Route path="social" element={<SocialSettingsPage />} />
                  <Route path="tasks" element={<TasksPage />} />
                  <Route path="compliance" element={<CompliancePage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="theme" element={<ThemeSettingsPage />} />
                  <Route path="consultancy" element={<ConsultancyPage />} />
                </Route>
            </Routes>
          </TooltipProvider>
        </CustomerAuthProvider>
      </AuthProvider>
    </LocaleProvider>
  </BrowserRouter>
);
}
