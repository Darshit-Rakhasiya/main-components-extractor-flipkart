import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Home Pages
import UserHomePage from './components/Home/UserHomePage';

// Auth Pages
import SignInPage from './components/Auth/SignInPage';
import SignUpPage from './components/Auth/SignUpPage';

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

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UserHomePage />} />

        {/* Auth Routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* User Pages */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/logs/:keyId" element={<UserLogsPage />} />

        {/* Admin Pages */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/request-log" element={<RequestLogPage />} />
        <Route path="/admin/admin-details" element={<AdminDetailsPage />} />
        <Route path="/admin/user-details" element={<UserDetailsPage />} />
        <Route path="/admin/usage-key-details" element={<UsageKeyDetailsPage />} />
        <Route path="/admin/generate-key" element={<GenerateKeyPage />} />
        <Route path="/admin/update-key-table" element={<UpdateKeyTablePage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
