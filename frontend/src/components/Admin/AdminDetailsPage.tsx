import React, { useState, useEffect } from 'react';
import { Search, Plus, Shield } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Admin {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Blocked';
  createdAt: string;
}

const AdminDetailsPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const mockAdmins: Admin[] = [
      {
        id: '1',
        name: 'John Admin',
        email: 'john@admin.com',
        status: 'Active',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Jane Editor',
        email: 'jane@admin.com',
        status: 'Active',
        createdAt: '2024-02-20T14:45:00Z'
      },
      {
        id: '3',
        name: 'Bob Manager',
        email: 'bob@admin.com',
        status: 'Blocked',
        createdAt: '2024-03-10T09:15:00Z'
      }
    ];
    setAdmins(mockAdmins);
    setFilteredAdmins(mockAdmins);
  }, []);

  useEffect(() => {
    const filtered = admins.filter(admin =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [searchTerm, admins]);

  // const handleAddAdmin = () => {
  //   const admin: Admin = {
  //     id: Date.now().toString(),
  //     name: newAdmin.name,
  //     email: newAdmin.email,
  //     // role: newAdmin.role,
  //     status: 'Active',
  //     createdAt: new Date().toISOString()
  //   };
  //   setAdmins([...admins, admin]);
  //   setNewAdmin({ name: '', email: '',  password: '' });
  //   setShowAddModal(false);
  // };
 
  const handleAddAdmin = async () => {
  // optional validation
  if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
    toast.error("All fields are required");
    return;
  }
  console.log("📤 Sending Admin Data:", newAdmin);
  try {
    const response = await axios.post('http://localhost:3000/admin/register', {
      name: newAdmin.name,
      email: newAdmin.email,
      password: newAdmin.password
    });

    if (response.data.success) {
      // Add admin to UI list
      const admin: Admin = {
        id: Date.now().toString(),
        name: newAdmin.name,
        email: newAdmin.email,
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      setAdmins([...admins, admin]);
      setNewAdmin({ name: '', email: '', password: '' });
      setShowAddModal(false);

      toast.success('Admin created successfully!', {
        position: 'top-center',
        duration: 4000
      });
    } else {
      toast.error(response.data.message || 'Failed to create admin');
    }

  } catch (error: any) {
    console.error('❌ Error:', error);
    toast.error(error.response?.data?.message || 'Something went wrong', {
      position: 'top-center'
    });
  }
};

  

  return (
    <AdminLayout pageTitle="Admin Details">
      <div className="space-y-6">
        {/* Search & Add */}
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
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Admin</span>
            </button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${admin.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Admin</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name='name'
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name='email'
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name='password'
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddAdmin}
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700"
                >
                  Add Admin
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDetailsPage;
