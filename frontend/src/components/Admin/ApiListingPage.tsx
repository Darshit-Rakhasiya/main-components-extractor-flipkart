import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface ApiItem {
  category?: string;
  apiName?: string;
  method?: string;
  status?: boolean;
}

const ApiListingPage: React.FC = () => {
  const { user } = useAuth()
  const [data, setData] = useState<ApiItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    apiName: '',
    method: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/meta/fetch', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          category: filters.category,
          apiName: filters.apiName,
          method: filters.method,
          status: filters.status === 'Active' ? 'true' : filters.status === 'Inactive' ? 'false' : undefined,
        }
      });

      setData(res.data.data || []);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching API metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (apiName?: string) => {
    if (apiName) {
      navigate(`/meta/${encodeURIComponent(apiName)}`);
    }
  };

  return (
    <AdminLayout pageTitle="API Listing">
      <div className="space-y-4">
        {loading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-6 w-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-gray-800 text-sm font-medium">Loading APIs...</span>
            </div>
          </div>
        )}

        {/* Global Search */}
        <input
          type="text"
          placeholder="Master Search Bar"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white/80 backdrop-blur-md rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="API Name"
                    value={filters.apiName}
                    onChange={(e) => handleFilterChange('apiName', e.target.value)}
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </th>
                <th className="px-4 py-2">
                  <select
                    value={filters.method}
                    onChange={(e) => handleFilterChange('method', e.target.value)}
                    className="w-full px-2 py-1 border rounded-md"
                  >
                    <option value="">All Methods</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </th>
                <th className="px-4 py-2">
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-2 py-1 border rounded-md"
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </th>
                <th className="px-4 py-2"></th>
              </tr>
              <tr>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">API Name</th>
                <th className="px-4 py-2">Method</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.category || 'N/A'}</td>
                  <td className="px-4 py-2">{item.apiName || 'N/A'}</td>
                  <td className="px-4 py-2">{item.method || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <select
                      value={item.status ? 'Active' : 'Inactive'}
                      onChange={async (e) => {
                        const newStatus = e.target.value === 'Active';

                        try {
                          const res = await axios.put(`http://localhost:3000/meta/update-status`, {
                            apiName: item.apiName,
                            status: newStatus,
                            userEmail: user?.email,
                          });

                          if (res.data.success) {
                            setData((prev) =>
                              prev.map((d) =>
                                d.apiName === item.apiName ? { ...d, status: newStatus } : d
                              )
                            );
                            toast.success(`Status updated to ${e.target.value === "Active" ? "Inactive" : "Active"}`);
                          } else {
                            toast.error(res.data.message || 'Failed to update status');
                          }
                        } catch (err: any) {
                          console.error('Status update failed:', err);
                          toast.error(err?.response?.data?.message || 'Failed to update status');
                        }
                      }}
                      className={`px-2 py-1 text-xs rounded-md border ${item.status
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(item.apiName)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}–
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm font-medium px-2 py-1">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApiListingPage;
