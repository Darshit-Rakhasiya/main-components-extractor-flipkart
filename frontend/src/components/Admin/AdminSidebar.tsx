import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Shield,
  Users,
  Key,
  Database,
  Settings,
  Plus
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/request-log', icon: FileText, label: 'Request Log' },
    { path: '/admin/admin-details', icon: Shield, label: 'Admin Details' },
    { path: '/admin/user-details', icon: Users, label: 'User Details' },
    { path: '/admin/usage-key-details', icon: Key, label: 'Usage Key Details' },
    { path: '/admin/generate-key', icon: Plus, label: 'Generate Key Table' },
    { path: '/admin/update-key-table', icon: Database, label: 'Update Key Table' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
