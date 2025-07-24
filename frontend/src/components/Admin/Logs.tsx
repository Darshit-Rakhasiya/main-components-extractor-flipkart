import React, { useState, useEffect } from 'react';
import { Loader2, Shield } from 'lucide-react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';

const Logs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const logsPerPage = 7;
    const totalPages = Math.ceil(totalLogs / logsPerPage);

    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [appliedDateRange, setAppliedDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const [startDate, endDate] = appliedDateRange;
            const { data } = await axios.get('http://localhost:3000/logs/fetch', {
                params: {
                    page: currentPage,
                    limit: logsPerPage,
                    search: appliedSearch.trim(),
                    startDate: startDate ? startDate.toISOString() : undefined,
                    endDate: endDate ? endDate.toISOString() : undefined
                },
            });

            if (data.success) {
                setLogs(data.logs);
                setTotalLogs(data.totalLogs);
            }
        } catch (err) {
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const exportLogs = async () => {
        setIsExporting(true);
        setExportProgress(5); // Initial state

        try {
            const [startDate, endDate] = appliedDateRange;
            const { data } = await axios.get('http://localhost:3000/logs/fetch', {
                params: {
                    page: 1,
                    limit: 10000,
                    search: appliedSearch.trim(),
                    startDate: startDate ? startDate.toISOString() : undefined,
                    endDate: endDate ? endDate.toISOString() : undefined
                }
            });

            setExportProgress(30); // After fetching

            if (!data.success || !data.logs?.length) {
                alert('No logs found to export.');
                return;
            }

            // Simulate processing
            const total = data.logs.length;
            const batchSize = Math.ceil(total / 5); // break into 5 chunks
            const exportData: any[] = [];

            for (let i = 0; i < total; i++) {
                const log = data.logs[i];
                exportData.push({
                    IP: log.ip || 'N/A',
                    URL: log?.params?.url || 'N/A',
                    API_Key: log?.params?.api || 'N/A',
                    Key: log?.key || 'N/A',
                    Status_Code: log.status_code ?? 'N/A',
                    Message: log?.response?.message ?? 'N/A',
                    Execution_Time: log?.response?.execution_time ?? 'N/A',
                    Success: typeof log?.response?.success === 'boolean' ? (log.response.success ? 'Yes' : 'No') : 'N/A',
                    Query_Params: log?.response?.query_params ? JSON.stringify(log.response.query_params) : 'N/A',
                    Product_Data: log?.response?.data ? JSON.stringify(log.response.data) : 'N/A',
                    Created_At: log?.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'
                });

                if ((i + 1) % batchSize === 0 || i === total - 1) {
                    const percent = 30 + Math.round(((i + 1) / total) * 50);
                    setExportProgress(percent);
                    await new Promise((res) => setTimeout(res, 100));
                }
            }

            setExportProgress(90);

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');
            XLSX.writeFile(workbook, `Logs_Export_${new Date().toISOString()}.xlsx`);

            setExportProgress(100);
        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to export logs.');
        } finally {
            setTimeout(() => {
                setIsExporting(false);
                setExportProgress(0);
            }, 1000);
        }
    };


    useEffect(() => {
        fetchLogs();
    }, [currentPage, appliedSearch, appliedDateRange]);

    const applyFilters = () => {
        setAppliedSearch(searchTerm);
        setAppliedDateRange(dateRange);
        setCurrentPage(1);
    };

    const openModal = (log: any) => {
        setSelectedLog(log);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedLog(null);
        setShowModal(false);
    };

    return (
        <AdminLayout pageTitle="API Logs">
            {loading && (
                <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur flex justify-center items-center">
                    <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">Loading logs...</span>
                    </div>
                </div>
            )}

            {/* Filter Inputs */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search by IP or URL..."
                    className="border rounded px-3 py-2 w-72"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <DatePicker
                    selected={dateRange[0]}
                    onChange={(dates: [Date | null, Date | null] | null) => {
                        if (dates) setDateRange(dates);
                        else setDateRange([null, null]);
                    }}
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    selectsRange
                    isClearable
                    maxDate={new Date()}
                    className="border rounded px-3 py-2 w-64"
                    placeholderText="Select date or range"
                />


                <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-blue-600 text-black rounded bg-emerald-100"
                >
                    Apply Filter
                </button>

                <button
                    onClick={exportLogs}
                    disabled={isExporting}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        'Export Logs'
                    )}
                </button>
                {isExporting && (
                    <div className="mt-2 w-full max-w-sm">
                        <div className="text-sm text-gray-600 mb-1">Export Progress: {exportProgress}%</div>
                        <div className="w-full h-2 bg-gray-200 rounded">
                            <div
                                className="h-full bg-blue-500 rounded transition-all duration-300"
                                style={{ width: `${exportProgress}%` }}
                            />
                        </div>
                    </div>
                )}

            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 text-left">IP</th>
                            <th className="px-4 py-2 text-left">URL</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Message</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr
                                key={log._id}
                                onClick={() => openModal(log)}
                                className="hover:bg-gray-50 cursor-pointer border-t"
                            >
                                <td className="px-4 py-2 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex justify-center items-center">
                                        <Shield className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span>{log.ip || 'N/A'}</span>
                                </td>
                                <td className="px-4 py-2 text-blue-600 hover:underline truncate max-w-[250px]">
                                    <a href={log?.params?.url} target="_blank" rel="noreferrer">
                                        {log?.params?.url || 'N/A'}
                                    </a>
                                </td>
                                <td className="px-4 py-2">{log.status_code ?? 'N/A'}</td>
                                <td className="px-4 py-2 truncate max-w-[200px]">
                                    {log?.response?.message ?? 'N/A'}
                                </td>
                                <td className="px-4 py-2">{log?.response?.execution_time ?? 'N/A'}s</td>
                                <td className="px-4 py-2">
                                    {log?.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                        {!logs.length && (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-400">
                                    No logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * logsPerPage + 1}–{Math.min(currentPage * logsPerPage, totalLogs)} of {totalLogs}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Log Details Modal */}
            {showModal && selectedLog && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl overflow-y-auto p-6 relative">
                        <button
                            className="absolute top-4 right-4 bg-gray-200 text-gray-600 p-2 rounded-full"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Log Details</h2>
                        <div className="space-y-3 text-sm">
                            <div><strong>IP:</strong> {selectedLog?.ip || 'N/A'}</div>
                            <div><strong>URL:</strong> {selectedLog?.params?.url || 'N/A'}</div>
                            <div><strong>API Key:</strong> {selectedLog?.params?.api || 'N/A'}</div>
                            <div><strong>Status Code:</strong> {selectedLog?.status_code || 'N/A'}</div>
                            <div><strong>Key:</strong> {selectedLog?.key || 'N/A'}</div>
                            <div><strong>Message:</strong> {selectedLog?.response?.message || 'N/A'}</div>
                            <div><strong>Execution Time:</strong> {selectedLog?.response?.execution_time || 'N/A'}s</div>
                            <div><strong>Success:</strong> {selectedLog?.response?.success ? 'Yes' : 'No'}</div>
                            <div><strong>Query Params:</strong>
                                <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(selectedLog?.response?.query_params || {}, null, 2)}</pre>
                            </div>
                            <div><strong>Product Data:</strong>
                                <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(selectedLog?.response?.data || {}, null, 2)}</pre>
                            </div>
                            <div><strong>Created At:</strong> {new Date(selectedLog?.createdAt).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Logs;