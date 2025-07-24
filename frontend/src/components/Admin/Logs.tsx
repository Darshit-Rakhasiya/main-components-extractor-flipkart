import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const Logs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const logsPerPage = 7;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/logs/fetch', {
                    params: {
                        page: currentPage,
                        limit: logsPerPage,
                    },
                });

                const { success, totalLogs, logs: fetchedLogs } = response.data;

                if (success) {
                    setLogs(fetchedLogs);
                    setTotalLogs(totalLogs);
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
    }, [currentPage]);

    const totalPages = Math.ceil(totalLogs / logsPerPage);

    const currentLogs = logs;

    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = (log: any) => {
        setSelectedLog(log);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLog(null);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <AdminLayout pageTitle="Logs">
            <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Execution Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentLogs.map((log) => (
                                    <tr
                                        key={log._id || "N/A"}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => openModal(log)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <Shield className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{log.ip || "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <a href={log?.params?.url || "#"} target="_blank" className="text-blue-500 hover:underline">
                                                {log?.params?.url || "N/A"}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{log?.status_code ?? "N/A"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{log?.response?.message ?? "N/A"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{log?.response?.execution_time ?? "N/A"}s</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {log?.createdAt ? new Date(log.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </div>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>

                {/* Modal for Selected Log */}
                {showModal && selectedLog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full p-2 shadow-md z-10"
                                aria-label="Close Modal"
                            >
                                ✕
                            </button>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Log Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">IP</strong>
                                    <div className="text-sm text-gray-900">{selectedLog?.ip || "N/A"}</div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">URL</strong>
                                    <div className="text-sm text-blue-500">
                                        <a href={selectedLog?.params?.url || "N/A"} target="_blank" className="hover:underline">
                                            {selectedLog?.params?.url || "N/A"}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">API Key</strong>
                                    <div className="text-sm text-gray-900">{selectedLog?.params?.api || "N/A"}</div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Status Code</strong>
                                    <div className="text-sm text-gray-900">{selectedLog?.status_code || "N/A"}</div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Key</strong>
                                    <div className="text-sm text-gray-900">{selectedLog?.key || "N/A"}</div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Message</strong>
                                    <div className="text-sm text-gray-900">{selectedLog?.response?.message || "N/A"}</div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Execution Time</strong>
                                    <div className="text-sm text-gray-900">{selectedLog?.response?.execution_time || "N/A"}s</div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Success</strong>
                                    <div className="text-sm text-gray-900">{selectedLog?.response?.success ? 'Yes' : 'No'}</div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Query Params</strong>
                                    <pre className="text-sm text-gray-900">{JSON.stringify(selectedLog?.response?.query_params, null, 2)}</pre>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Product Data</strong>
                                    <div className="text-sm text-gray-900">
                                        <div>Name: {selectedLog?.response?.data?.name || "N/A"}</div>
                                        <div>Price: {selectedLog?.response?.data?.price || "N/A"}</div>
                                        <div>Discount: {selectedLog?.response?.data?.discount ?? "N/A"}%</div>
                                        <div>MRP: {selectedLog?.response?.data?.mrp || "N/A"}</div>
                                        <div>Ratings: {selectedLog?.response?.data?.ratings_count ?? "N/A"}</div>
                                    </div>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Category Hierarchy</strong>
                                    <pre className="text-sm text-gray-900">
                                        {JSON.stringify(selectedLog?.response?.data?.category_hierarchy || {}, null, 2)}
                                    </pre>
                                </div>
                                <div>
                                    <strong className="block text-sm font-medium text-gray-700">Created At</strong>
                                    <div className="text-sm text-gray-900">
                                        {new Date(selectedLog.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Logs;
