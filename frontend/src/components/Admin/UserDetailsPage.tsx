import React, { useState, useEffect } from 'react';
import { Search, User, Eye, UserX, UserCheck, RotateCcw } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  accountStatus: 'Active' | 'Blocked';
  registeredOn: string;
  lastActive: string;
  apiKeysCount: number;
  keyAccess: 'Yes' | 'No';
  totalApiCalls: number;
}

const UserDetailsPage: React.FC = () => {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'usage' | 'date'>('usage');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockUsers: UserDetail[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        accountStatus: 'Active',
        registeredOn: '2024-01-15T10:30:00Z',
        lastActive: '2024-03-20T14:45:00Z',
        apiKeysCount: 3,
        keyAccess: 'Yes',
        totalApiCalls: 1250
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        accountStatus: 'Active',
        registeredOn: '2024-02-20T09:15:00Z',
        lastActive: '2024-03-19T11:30:00Z',
        apiKeysCount: 2,
        keyAccess: 'Yes',
        totalApiCalls: 890
      },
      {
        id: '3',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        accountStatus: 'Blocked',
        registeredOn: '2024-03-10T16:20:00Z',
        lastActive: '2024-03-15T08:45:00Z',
        apiKeysCount: 1,
        keyAccess: 'No',
        totalApiCalls: 45
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort users
    if (sortBy === 'usage') {
      filtered.sort((a, b) => b.totalApiCalls - a.totalApiCalls);
    } else {
      filtered.sort((a, b) => new Date(b.registeredOn).getTime() - new Date(a.registeredOn).getTime());
    }

    setFilteredUsers(filtered);
  }, [searchTerm, sortBy, users]);

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId 
        ? { ...user, accountStatus: user.accountStatus === 'Active' ? 'Blocked' : 'Active' }
        : user
    ));
  };

  const handleResetApiKey = (userId: string) => {
    if (window.confirm('Are you sure you want to reset this user\'s API keys?')) {
      // In real app, make API call to reset keys
      alert('API keys have been reset for this user.');
    }
  };

  const handleViewProfile = (user: UserDetail) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleToggleKeyAccess = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId 
        ? { ...user, keyAccess: user.keyAccess === 'Yes' ? 'No' : 'Yes' }
        : user
    ));
  };

  return (
    <AdminLayout pageTitle="User Details">
      <div className="space-y-6">
        {/* Header with Search and Sort */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'usage' | 'date')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="usage">API Usage</option>
                <option value="date">Registration Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Access</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.apiKeysCount} API keys</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.accountStatus === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleKeyAccess(user.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.keyAccess === 'Yes' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {user.keyAccess}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(user.registeredOn).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">Last active: {new Date(user.lastActive).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                          user.accountStatus === 'Active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {user.accountStatus === 'Active' ? (
                          <>
                            <UserX className="w-3 h-3 mr-1" />
                            Block
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 mr-1" />
                            Unblock
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Profile Modal */}
        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total API Calls</label>
                  <p className="text-sm text-gray-900">{selectedUser.totalApiCalls.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">API Keys Count</label>
                  <p className="text-sm text-gray-900">{selectedUser.apiKeysCount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Status</label>
                  <p className={`text-sm font-medium ${
                    selectedUser.accountStatus === 'Active' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {selectedUser.accountStatus}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registered On</label>
                  <p className="text-sm text-gray-900">{new Date(selectedUser.registeredOn).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Active</label>
                  <p className="text-sm text-gray-900">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserDetailsPage;
