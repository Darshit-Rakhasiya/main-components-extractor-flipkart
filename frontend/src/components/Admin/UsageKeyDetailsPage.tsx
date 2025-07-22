import React, { useState, useEffect } from 'react';
import { Search, Key, Eye, EyeOff } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface UsageKeyDetail {
  id: string;
  apiKey: string;
  assignedUser: string;
  dailyUsage: number;
  totalUsage: number;
  expirationDate: string;
  dailyLimit: number;
  monthlyLimit: number;
  status: 'Active' | 'Expired' | 'Deactivated';
}

const UsageKeyDetailsPage: React.FC = () => {
  const [keys, setKeys] = useState<UsageKeyDetail[]>([]);
  const [filteredKeys, setFilteredKeys] = useState<UsageKeyDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockKeys: UsageKeyDetail[] = [
      {
        id: '1',
        apiKey: 'sk_live_51H7qABC123456789DEF',
        assignedUser: 'Alice Johnson',
        dailyUsage: 45,
        totalUsage: 1250,
        expirationDate: '2024-12-31T23:59:59Z',
        dailyLimit: 100,
        monthlyLimit: 3000,
        status: 'Active'
      },
      {
        id: '2',
        apiKey: 'sk_test_51H7qXYZ987654321ABC',
        assignedUser: 'Bob Smith',
        dailyUsage: 23,
        totalUsage: 890,
        expirationDate: '2024-06-30T23:59:59Z',
        dailyLimit: 50,
        monthlyLimit: 1500,
        status: 'Active'
      },
      {
        id: '3',
        apiKey: 'sk_live_51H7qMNO456789123DEF',
        assignedUser: 'Charlie Brown',
        dailyUsage: 0,
        totalUsage: 45,
        expirationDate: '2024-03-15T23:59:59Z',
        dailyLimit: 25,
        monthlyLimit: 750,
        status: 'Expired'
      },
      {
        id: '4',
        apiKey: 'sk_test_51H7qPQR789123456GHI',
        assignedUser: 'Diana Prince',
        dailyUsage: 78,
        totalUsage: 2100,
        expirationDate: '2025-01-31T23:59:59Z',
        dailyLimit: 200,
        monthlyLimit: 6000,
        status: 'Active'
      }
    ];
    setKeys(mockKeys);
    setFilteredKeys(mockKeys);
  }, []);

  useEffect(() => {
    let filtered = keys;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(key =>
        key.apiKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.assignedUser.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(key => key.status === statusFilter);
    }

    setFilteredKeys(filtered);
  }, [searchTerm, statusFilter, keys]);

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return '*'.repeat(apiKey.length);
    return apiKey.substring(0, 8) + '*'.repeat(apiKey.length - 12) + apiKey.substring(apiKey.length - 4);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Deactivated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  return (
    <AdminLayout pageTitle="Usage Key Details">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by key or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Deactivated">Deactivated</option>
            </select>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Total Keys: {filteredKeys.length}
              </span>
              <span className="text-sm text-gray-600">
                Active: {filteredKeys.filter(k => k.status === 'Active').length}
              </span>
            </div>
          </div>
        </div>

        {/* Keys Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKeys.map((keyDetail) => {
                  const dailyPercentage = getUsagePercentage(keyDetail.dailyUsage, keyDetail.dailyLimit);
                  const isExpired = new Date(keyDetail.expirationDate) < new Date();
                  
                  return (
                    <tr key={keyDetail.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Key className="w-4 h-4 text-gray-400" />
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {visibleKeys.has(keyDetail.id) ? keyDetail.apiKey : maskApiKey(keyDetail.apiKey)}
                            </code>
                          </div>
                          <button
                            onClick={() => toggleKeyVisibility(keyDetail.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {visibleKeys.has(keyDetail.id) ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {keyDetail.assignedUser}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {keyDetail.dailyUsage} / {keyDetail.dailyLimit}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${getUsageColor(dailyPercentage)}`}
                            style={{ width: `${dailyPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dailyPercentage.toFixed(1)}% used
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {keyDetail.totalUsage.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Monthly: {keyDetail.monthlyLimit.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(keyDetail.expirationDate).toLocaleDateString()}
                        </div>
                        {isExpired && (
                          <div className="text-xs text-red-600 font-medium">
                            Expired
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(keyDetail.status)}`}>
                          {keyDetail.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {filteredKeys.filter(k => k.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Keys</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredKeys.filter(k => k.status === 'Expired').length}
              </div>
              <div className="text-sm text-gray-600">Expired Keys</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredKeys.reduce((sum, key) => sum + key.dailyUsage, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Daily Usage</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredKeys.reduce((sum, key) => sum + key.totalUsage, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Usage</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsageKeyDetailsPage;