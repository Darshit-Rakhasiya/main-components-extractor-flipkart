import React, { useState, useEffect } from 'react';
import { Search, Edit, Save, X, RotateCcw, Download } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface ApiKeyData {
  id: string;
  keyValue: string;
  assignedUser: string;
  status: 'Active' | 'Deactive' | 'Expired';
  limit: number;
  usageCount: number;
  createdAt: string;
}

const UpdateKeyTablePage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyData[]>([]);
  const [filteredKeys, setFilteredKeys] = useState<ApiKeyData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ApiKeyData>>({});

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockKeys: ApiKeyData[] = [
      {
        id: '1',
        keyValue: 'sk_live_51H7qABC123456789DEF',
        assignedUser: 'Alice Johnson',
        status: 'Active',
        limit: 3000,
        usageCount: 1250,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        keyValue: 'sk_test_51H7qXYZ987654321ABC',
        assignedUser: 'Bob Smith',
        status: 'Active',
        limit: 1500,
        usageCount: 890,
        createdAt: '2024-02-20T14:45:00Z'
      },
      {
        id: '3',
        keyValue: 'sk_live_51H7qMNO456789123DEF',
        assignedUser: 'Charlie Brown',
        status: 'Expired',
        limit: 750,
        usageCount: 45,
        createdAt: '2024-01-10T09:15:00Z'
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
        key.keyValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.assignedUser.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(key => key.status === statusFilter);
    }

    setFilteredKeys(filtered);
  }, [searchTerm, statusFilter, keys]);

  const handleEdit = (key: ApiKeyData) => {
    setEditingKey(key.id);
    setEditData({
      status: key.status,
      limit: key.limit,
      usageCount: key.usageCount
    });
  };

  const handleSave = (keyId: string) => {
    setKeys(keys.map(key =>
      key.id === keyId ? { ...key, ...editData } : key
    ));
    setEditingKey(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditData({});
  };

  const handleRegenerateKey = (keyId: string) => {
    if (window.confirm('Are you sure you want to regenerate this key? The old key will become invalid.')) {
      const newKeyValue = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setKeys(keys.map(key =>
        key.id === keyId 
          ? { ...key, keyValue: newKeyValue, createdAt: new Date().toISOString() }
          : key
      ));
      alert('API key regenerated successfully!');
    }
  };

  const handleDeactivateKey = (keyId: string) => {
    setKeys(keys.map(key =>
      key.id === keyId 
        ? { ...key, status: key.status === 'Active' ? 'Deactive' : 'Active' }
        : key
    ));
  };

  const exportUpdatedKeys = () => {
    const csvContent = [
      'ID,Original Key,Name,Key,Usage,Limit,Status,Created At',
      ...filteredKeys.map(key =>
        `${key.id},${key.keyValue},${key.assignedUser},${key.keyValue.substring(0, 12)}...${key.keyValue.substring(key.keyValue.length - 4)},${key.usageCount},${key.limit},${key.status},${key.createdAt}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'updated-api-keys.csv';
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800';
      case 'Deactive':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout pageTitle="Update Key Table">
      <div className="space-y-6">
        {/* Filters and Export */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 max-w-2xl">
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
                <option value="Deactive">Deactive</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <button
              onClick={exportUpdatedKeys}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Keys Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {key.keyValue}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {key.assignedUser}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {key.keyValue.substring(0, 12)}...{key.keyValue.substring(key.keyValue.length - 4)}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingKey === key.id ? (
                        <input
                          type="number"
                          value={editData.usageCount || key.usageCount}
                          onChange={(e) => setEditData({ ...editData, usageCount: parseInt(e.target.value) })}
                          className="w-24 text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                        />
                      ) : (
                        key.usageCount.toLocaleString()
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingKey === key.id ? (
                        <input
                          type="number"
                          value={editData.limit || key.limit}
                          onChange={(e) => setEditData({ ...editData, limit: parseInt(e.target.value) })}
                          className="w-24 text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                        />
                      ) : (
                        key.limit
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingKey === key.id ? (
                        <select
                          value={editData.status || key.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value as 'Active' | 'Deactive' | 'Expired' })}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Deactive">Deactive</option>
                          <option value="Expired">Expired</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(key.status)}`}>
                          {key.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingKey === key.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(key.id)}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(key)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRegenerateKey(key.id)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeactivateKey(key.id)}
                            className={`${
                              key.status === 'Active' 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-emerald-600 hover:text-emerald-900'
                            }`}
                          >
                            {key.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="text-2xl font-bold text-gray-600">
                {filteredKeys.filter(k => k.status === 'Deactive').length}
              </div>
              <div className="text-sm text-gray-600">Deactivated Keys</div>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateKeyTablePage;
