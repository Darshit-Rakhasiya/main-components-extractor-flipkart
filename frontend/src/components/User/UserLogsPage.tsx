import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

interface LogEntry {
  id: string;
  keyId: string;
  timestamp: string;
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  ipAddress: string;
}

const UserLogsPage: React.FC = () => {
  const { keyId } = useParams<{ keyId: string }>();
  const navigate = useNavigate();
  
  const [logs] = useState<LogEntry[]>([
    {
      id: '1',
      keyId: '1',
      timestamp: '2024-03-20T10:30:00Z',
      method: 'GET',
      endpoint: '/api/users',
      statusCode: 200,
      responseTime: 145,
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      keyId: '1',
      timestamp: '2024-03-20T11:15:00Z',
      method: 'POST',
      endpoint: '/api/users',
      statusCode: 201,
      responseTime: 230,
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      keyId: '1',
      timestamp: '2024-03-20T12:00:00Z',
      method: 'GET',
      endpoint: '/api/users/123',
      statusCode: 404,
      responseTime: 89,
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      keyId: '1',
      timestamp: '2024-03-19T14:30:00Z',
      method: 'PUT',
      endpoint: '/api/users/456',
      statusCode: 200,
      responseTime: 178,
      ipAddress: '192.168.1.103'
    },
    {
      id: '5',
      keyId: '1',
      timestamp: '2024-03-19T16:45:00Z',
      method: 'DELETE',
      endpoint: '/api/users/789',
      statusCode: 500,
      responseTime: 2340,
      ipAddress: '192.168.1.104'
    }
  ]);

  const [logFilter, setLogFilter] = useState({
    days: '',
    dateFrom: '',
    dateTo: '',
    method: ''
  });

  const getFilteredLogs = () => {
    let filtered = logs.filter(log => log.keyId === keyId);
    
    if (logFilter.days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(logFilter.days));
      filtered = filtered.filter(log => new Date(log.timestamp) >= daysAgo);
    }
    
    if (logFilter.dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(logFilter.dateFrom));
    }
    
    if (logFilter.dateTo) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(logFilter.dateTo));
    }

    if (logFilter.method) {
      filtered = filtered.filter(log => log.method === logFilter.method);
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const exportLogs = (format: 'csv' | 'excel' | 'txt') => {
    const filteredLogs = getFilteredLogs();
    
    if (format === 'txt') {
      const logText = filteredLogs.map(log => 
        `${new Date(log.timestamp).toLocaleString()} | ${log.method} | ${log.endpoint} | ${log.statusCode} | ${log.responseTime}ms | ${log.ipAddress}`
      ).join('\n');
      
      const blob = new Blob([logText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `api-logs-${keyId}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvContent = [
        'Timestamp,Method,Endpoint,Status Code,Response Time (ms),IP Address',
        ...filteredLogs.map(log => 
          `"${new Date(log.timestamp).toLocaleString()}",${log.method},${log.endpoint},${log.statusCode},${log.responseTime},${log.ipAddress}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `api-logs-${keyId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      // Simple Excel format using HTML table
      const excelContent = `
        <table>
          <tr>
            <th>Timestamp</th>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Status Code</th>
            <th>Response Time (ms)</th>
            <th>IP Address</th>
          </tr>
          ${filteredLogs.map(log => `
            <tr>
              <td>${new Date(log.timestamp).toLocaleString()}</td>
              <td>${log.method}</td>
              <td>${log.endpoint}</td>
              <td>${log.statusCode}</td>
              <td>${log.responseTime}</td>
              <td>${log.ipAddress}</td>
            </tr>
          `).join('')}
        </table>
      `;
      
      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `api-logs-${keyId}-${new Date().toISOString().split('T')[0]}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getKeyName = () => {
    if (keyId === '1') return 'Test API Key';
    return `API Key ${keyId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">API Logs</h1>
          <p className="text-gray-600 mt-2">Viewing logs for: {getKeyName()}</p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Days</label>
              <select
                value={logFilter.days}
                onChange={(e) => setLogFilter({...logFilter, days: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All time</option>
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Method</label>
              <select
                value={logFilter.method}
                onChange={(e) => setLogFilter({...logFilter, method: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All methods</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={logFilter.dateFrom}
                onChange={(e) => setLogFilter({...logFilter, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={logFilter.dateTo}
                onChange={(e) => setLogFilter({...logFilter, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {getFilteredLogs().length} log entries
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => exportLogs('csv')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => exportLogs('excel')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={() => exportLogs('txt')}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export TXT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredLogs().length > 0 ? (
                  getFilteredLogs().map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          log.method === 'POST' ? 'bg-green-100 text-green-800' :
                          log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.endpoint}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.statusCode >= 200 && log.statusCode < 300 ? 'bg-green-100 text-green-800' :
                          log.statusCode >= 400 ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.responseTime}ms</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.ipAddress}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No logs found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserLogsPage;








