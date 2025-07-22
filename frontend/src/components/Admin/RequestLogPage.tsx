import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface RequestLog {
  id: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  responseData: string;
  timestamp: string;
  keyUsed: string;
  ipAddress: string;
}

const RequestLogPage: React.FC = () => {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RequestLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockLogs: RequestLog[] = [
      {
        id: '1',
        endpoint: '/api/users',
        method: 'GET',
        statusCode: 200,
        responseTime: 145,
        responseData: '{"users": [{"id": 1, "name": "John"}]}',
        timestamp: new Date().toISOString(),
        keyUsed: 'key_123***',
        ipAddress: '192.168.1.1'
      },
      {
        id: '2',
        endpoint: '/api/posts',
        method: 'POST',
        statusCode: 401,
        responseTime: 89,
        responseData: '{"error": "Unauthorized"}',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        keyUsed: 'key_456***',
        ipAddress: '192.168.1.2'
      },
      {
        id: '3',
        endpoint: '/api/data',
        method: 'GET',
        statusCode: 500,
        responseTime: 2340,
        responseData: '{"error": "Internal Server Error"}',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        keyUsed: 'key_789***',
        ipAddress: '192.168.1.3'
      }
    ];
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.keyUsed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(log => log.statusCode.toString().startsWith(statusFilter));
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= new Date(dateRange.start) && logDate <= new Date(dateRange.end);
      });
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateRange, logs]);

  const exportLogs = (format: 'csv' | 'json') => {
    const dataStr = format === 'json' 
      ? JSON.stringify(filteredLogs, null, 2)
      : [
          'ID,Endpoint,Method,Status Code,Response Time,Timestamp,Key Used,IP Address',
          ...filteredLogs.map(log => 
            `${log.id},${log.endpoint},${log.method},${log.statusCode},${log.responseTime},${log.timestamp},${log.keyUsed},${log.ipAddress}`
          )
        ].join('\n');

    const dataBlob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `request-logs.${format}`;
    link.click();
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-emerald-600 bg-emerald-100';
    if (statusCode >= 400 && statusCode < 500) return 'text-orange-600 bg-orange-100';
    if (statusCode >= 500) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  return (
    <AdminLayout pageTitle="Request Log">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by endpoint, key, or IP..."
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
              <option value="">All Status Codes</option>
              <option value="2">2xx Success</option>
              <option value="4">4xx Client Error</option>
              <option value="5">5xx Server Error</option>
            </select>

            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />

            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} requests
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => exportLogs('csv')}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => exportLogs('json')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Request Logs Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                        log.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                        log.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.statusCode)}`}>
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.responseTime}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.keyUsed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RequestLogPage;