import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Key, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApiKeys: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [userRes, apiRes] = await Promise.all([
        axios.get('http://localhost:3000/user/count'),
        axios.get('http://localhost:3000/meta/count')
      ]);

      if (userRes.data.success && apiRes.data.success) {
        setStats({
          totalUsers: userRes.data.count,
          totalApiKeys: apiRes.data.count,
        });
      }
    } catch (err) {
      console.error('Failed to fetch counts:', err);
    }
  };

  const barData = [
    { label: 'Users', count: stats.totalUsers },
    { label: 'API Keys', count: stats.totalApiKeys },
  ];

  return (
    <AdminLayout pageTitle="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </div>
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total API Keys</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApiKeys}</p>
              <p className="text-xs text-gray-500 mt-1">Issued API keys</p>
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Key className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Users vs API Keys</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" barSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
