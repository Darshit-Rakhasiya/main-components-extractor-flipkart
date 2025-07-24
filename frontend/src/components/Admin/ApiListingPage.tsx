import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import axios from 'axios';

interface ApiItem {
  category?: string;
  apiName?: string;
  method?: string;
  status?: boolean; // changed from Boolean to boolean for standard TypeScript type
}

const ApiListingPage: React.FC = () => {
  const [data, setData] = useState<ApiItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    name: '',
    method: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/meta/fetch');
        const fetched = res.data?.Meta || [];
        setData(fetched);
      } catch (err) {
        console.error('Error fetching API metadata:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchCategory = (item.category || '').toLowerCase().includes(filters.category.toLowerCase());
    const matchName = (item.apiName || '').toLowerCase().includes(filters.name.toLowerCase());
    const matchMethod = filters.method === '' || item.method === filters.method;
    const matchStatus =
      filters.status === '' ||
      (filters.status === 'Active' && item.status === true) ||
      (filters.status === 'Inactive' && item.status === false);

    const globalMatch =
      (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.apiName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.method || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.status !== undefined && (item.status ? 'active' : 'inactive').includes(searchTerm.toLowerCase()));

    return matchCategory && matchName && matchMethod && matchStatus && globalMatch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
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
              {paginatedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.category || 'N/A'}</td>
                  <td className="px-4 py-2">{item.apiName || 'N/A'}</td>
                  <td className="px-4 py-2">{item.method || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {item.status ? 'Active' : 'Inactive'}
                    </span>
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
              {paginatedData.length === 0 && (
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
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}–
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
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
