import React, { useState, useEffect } from 'react';
import { User, ApiKey, ApiRequest } from '../../types';
import { Users, Key, Activity, TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApiKeys: 0,
    totalRequests: 0,
    dailyUsage: 0,
    totalAdmins: 0,
    todayKeyUsage: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allApiKeys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
    const allRequests = JSON.parse(localStorage.getItem('apiRequests') || '[]');
    const allAdmins = JSON.parse(localStorage.getItem('admins') || '[]');

    setUsers(allUsers.filter((user: User) => user.role === 'user'));
    setApiKeys(allApiKeys);
    setRequests(allRequests);

    // Get today's date
    const today = new Date().toDateString();
    const todayRequests = allRequests.filter((req: ApiRequest) => {
      const reqDate = new Date(req.timestamp).toDateString();
      return today === reqDate;
    });

    setStats({
      totalUsers: allUsers.filter((user: User) => user.role === 'user').length,
      totalApiKeys: allApiKeys.length,
      totalRequests: allRequests.length,
      dailyUsage: todayRequests.length,
      totalAdmins: allAdmins.length || 3, // Default to 3 if no data
      todayKeyUsage: todayRequests.length
    });
  };

  // Prepare chart data
  const requestsOverTime = requests
    .reduce((acc, req) => {
      const date = new Date(req.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const timelineData = Object.entries(requestsOverTime)
    .map(([date, count]) => ({ date, requests: count }))
    .slice(-7); // Last 7 days

  const statusCodeData = requests
    .reduce((acc, req) => {
      const status = req.statusCode >= 200 && req.statusCode < 300 ? 'Success' : 'Error';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(statusCodeData).map(([name, value]) => ({ name, value }));

  const COLORS = ['#10B981', '#EF4444'];

  const userApiUsage = users.map(user => {
    const userRequests = requests.filter(req => req.userId === user.id);
    return {
      name: user.name,
      requests: userRequests.length,
    };
  }).sort((a, b) => b.requests - a.requests).slice(0, 5);

  return (
    <AdminLayout pageTitle="Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Key Usage</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayKeyUsage}</p>
              <p className="text-xs text-gray-500 mt-1">API calls today</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Calls in Days</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
              <p className="text-xs text-gray-500 mt-1">All time requests</p>
            </div>
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAdmins}</p>
              <p className="text-xs text-gray-500 mt-1">Active administrators</p>
            </div>
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Keys</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApiKeys}</p>
              <p className="text-xs text-gray-500 mt-1">Active API keys</p>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <Key className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requests Over Time */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">API Usage (Last 7 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Success/Error Ratio */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Key Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Top Users by API Usage */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Users by Requests</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userApiUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {requests.slice(-5).reverse().map((request) => {
              const user = users.find(u => u.id === request.userId);
              const apiKey = apiKeys.find(k => k.id === request.apiKeyId);
              return (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${request.statusCode >= 200 && request.statusCode < 300
                        ? 'bg-emerald-500'
                        : 'bg-red-500'
                      }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {apiKey?.name || 'Unknown API'} • {request.method} {request.endpoint}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{request.statusCode}</p>
                    <p className="text-xs text-gray-600">{request.responseTime}ms</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
