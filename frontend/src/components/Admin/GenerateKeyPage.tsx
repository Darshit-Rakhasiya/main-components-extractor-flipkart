import React, { useState, useEffect } from 'react';
import { Plus, Download, Key } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface GeneratedKey {
  id: string;
  keyValue: string;
  assignedTo: string;
  assignedType: 'User' | 'Admin';
  limit: number;
  usage: number;
  status: 'Active' | 'Deactive';
  createdAt: string;
  database: string;
  collection: string;
}

const GenerateKeyPage: React.FC = () => {
  const [users, setUsers] = useState<Array<{id: string, name: string, type: 'User' | 'Admin'}>>([]);
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKey[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assignedTo: '',
    assignedType: 'User' as 'User' | 'Admin',
    database: '',             
    collection: '',
    customKey: '',
    limit: 1000,
    status: 'Active' as 'Active' | 'Deactive'
  });

  useEffect(() => {
    // Mock users and admins data
    const mockUsers = [
      { id: '1', name: 'Alice Johnson', type: 'User' as const },
      { id: '2', name: 'Bob Smith', type: 'User' as const },
      { id: '3', name: 'Charlie Brown', type: 'User' as const },
      { id: '4', name: 'Admin John', type: 'Admin' as const },
      { id: '5', name: 'Admin Jane', type: 'Admin' as const }
    ];
    setUsers(mockUsers);

    // Mock generated keys
    const mockKeys: GeneratedKey[] = [
      {
        id: '1',
        keyValue: 'sk_live_51H7qABC123456789DEF',
        assignedTo: 'Alice Johnson',
        assignedType: 'User',
        limit: 1000,
        usage: 750,
        status: 'Active',
        createdAt: '2024-03-15T10:30:00Z',
        database:'database',
        collection:'collection',
      },
      {
        id: '2',
        keyValue: 'sk_test_51H7qXYZ987654321ABC',
        assignedTo: 'Bob Smith',
        assignedType: 'User',
        limit: 500,
        usage: 120,
        status: 'Active',
        createdAt: '2024-03-10T14:20:00Z',
        database:"database",
        collection:'collection',
      }
    ];
    setGeneratedKeys(mockKeys);
  }, []);

  const generateApiKey = () => {
    if (formData.customKey.trim()) {
      return formData.customKey.trim();
    }
    const prefix = formData.assignedType === 'User' ? 'sk_live_' : 'sk_admin_';
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return prefix + randomString;
  };

  const handleGenerateKey = () => {
    if (!formData.assignedTo) {
      alert('Please select a user/admin');
      return;
    }

    const selectedUser = users.find(u => u.name.toLowerCase() === formData.assignedTo.toLowerCase());
    if (!selectedUser) return;

    if (!formData.database || !formData.collection) {
    alert("Please enter both database and collection names.");
    return;
  }
    const newKey: GeneratedKey = {
      id: Date.now().toString(),
      keyValue: generateApiKey(),
      assignedTo: selectedUser.name,
      assignedType: selectedUser.type,
      limit: formData.limit,
      usage: 0,
      status: formData.status,
      createdAt: new Date().toISOString(),
      database: formData.database,
      collection: formData.collection
    };

    setGeneratedKeys([newKey, ...generatedKeys]);
    setFormData({
      assignedTo: '',
      assignedType: 'User',
      customKey: '',
      database:'',
      collection:'',
      limit: 1000,
      status: 'Active'
    });
    setShowForm(false);
    
    alert('API key generated successfully!');
  };

  const handleRegenerateKey = (keyId: string) => {
    if (window.confirm('Are you sure you want to regenerate this key? The old key will become invalid.')) {
      setGeneratedKeys(generatedKeys.map(key =>
        key.id === keyId
          ? { ...key, keyValue: generateApiKey(), createdAt: new Date().toISOString() }
          : key
      ));
      alert('API key regenerated successfully!');
    }
  };

  const downloadKeysAsCSV = () => {
    const csvContent = [
      'ID,Key Value,Assigned To,Type,Limit,Usage,Status,Created At,Database,Collection',
      ...generatedKeys.map(key =>
        `${key.id},${key.keyValue},${key.assignedTo},${key.assignedType},${key.limit},${key.usage},${key.status},${key.createdAt},${key.database},${key.collection}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'api-keys.csv';
    link.click();
  };

  return (
    <AdminLayout pageTitle="Generate Key Table">
      <div className="space-y-6">
        {/* Header with Generate Button */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">API Key Management</h2>
              <p className="text-sm text-gray-600">Generate and manage API keys for users and admins</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={downloadKeysAsCSV}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Generate New Key</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generate Key Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New API Key</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to User/Admin
                  </label>
                  {/* <select
                    value={formData.assignedTo}
                    onChange={(e) => {
                      const selectedUser = users.find(u => u.id === e.target.value);
                      setFormData({
                        ...formData,
                        assignedTo: e.target.value,
                        assignedType: selectedUser?.type || 'User'
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select User/Admin</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.type})
                      </option>
                    ))}
                  </select> */}
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => {
                      const selectedUser = users.find(u => u.name.toLowerCase() === e.target.value.toLowerCase());
                      setFormData({
                        ...formData,
                        assignedTo: e.target.value,
                        assignedType: selectedUser?.type || 'User'
                      });
                    }}
                    placeholder="Enter User/Admin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Key (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.customKey}
                    onChange={(e) => setFormData({ ...formData, customKey: e.target.value })}
                    placeholder="Enter custom key or leave blank for auto-generation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Database
                  </label>
                  <input
                    type="text"
                    value={formData.database}
                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                    placeholder="Enter Database"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Collection
                  </label>
                  <input
                    type="text"
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    placeholder="Enter Collection"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limit
                  </label>
                  <input
                    type="number"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Deactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleGenerateKey}
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Generate Key
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Keys Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Generated API Keys</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {generatedKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {key.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Key className="w-4 h-4 text-gray-400" />
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {key.keyValue.substring(0, 12)}...{key.keyValue.substring(key.keyValue.length - 4)}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {key.usage.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Limit: {key.limit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        key.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {key.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GenerateKeyPage;
