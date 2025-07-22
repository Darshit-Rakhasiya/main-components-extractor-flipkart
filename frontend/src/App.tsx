import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Home Pages
import UserHomePage from './components/Home/UserHomePage';

// Auth Pages
import SignInPage from './components/Auth/SignInPage';
import SignUpPage from './components/Auth/SignUpPage';
import AdminSignInPage from './components/Auth/AdminSignInPage';

// User Components
import UserDashboard from './components/User/UserDashboard';
import UserLogsPage from './components/User/UserLogsPage';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import RequestLogPage from './components/Admin/RequestLogPage';
import AdminDetailsPage from './components/Admin/AdminDetailsPage';
import UserDetailsPage from './components/Admin/UserDetailsPage';
import UsageKeyDetailsPage from './components/Admin/UsageKeyDetailsPage';
import GenerateKeyPage from './components/Admin/GenerateKeyPage';
import UpdateKeyTablePage from './components/Admin/UpdateKeyTablePage';
import SettingsPage from './components/Admin/SettingsPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UserHomePage />} />
        
        {/* Auth Routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Admin Routes - Direct to signin */}
        <Route path="/admin" element={<AdminSignInPage />} />
        <Route path="/admin/signin" element={<AdminSignInPage />} />
        
        {/* User Protected Routes - Remove protection for testing */}
        <Route
          path="/user/dashboard"
          element={<UserDashboard />}
        />
        <Route
          path="/user/logs/:keyId"
          element={<UserLogsPage />}
        />
        
        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/request-log"
          element={<RequestLogPage />}
        />
        <Route
          path="/admin/admin-details"
          element={<AdminDetailsPage />}
        />
        <Route
          path="/admin/user-details"
          element={<UserDetailsPage />}
        />
        <Route
          path="/admin/usage-key-details"
          element={<UsageKeyDetailsPage />}
        />
        <Route
          path="/admin/generate-key"
          element={<GenerateKeyPage />}
        />
        <Route
          path="/admin/update-key-table"
          element={<UpdateKeyTablePage />}
        />
        <Route
          path="/admin/settings"
          element={<SettingsPage />}
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
