import React, { useEffect, useState } from 'react';

interface MetadataItem {
    category: string;
    apiName: string;
    method: string;
    status: string;
}

const MetaDetailPage: React.FC = () => {
    const [data, setData] = useState<MetadataItem[]>([]);
    const [filteredData, setFilteredData] = useState<MetadataItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [methodFilter, setMethodFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Dummy fetch (replace with real API call)
    useEffect(() => {
        // Example data
        const fetchData: MetadataItem[] = [
            { category: 'User', apiName: 'GetUser', method: 'GET', status: 'Active' },
            { category: 'Product', apiName: 'CreateProduct', method: 'POST', status: 'Active' },
            { category: 'Order', apiName: 'DeleteOrder', method: 'DELETE', status: 'Inactive' },
            { category: 'User', apiName: 'UpdateUser', method: 'PUT', status: 'Active' },
            { category: 'Product', apiName: 'ListProducts', method: 'GET', status: 'Inactive' },
            { category: 'Order', apiName: 'UpdateOrder', method: 'PUT', status: 'Active' },
            { category: 'User', apiName: 'BanUser', method: 'PATCH', status: 'Inactive' },
            { category: 'Product', apiName: 'GetProduct', method: 'GET', status: 'Active' },
            { category: 'Order', apiName: 'GetOrders', method: 'GET', status: 'Inactive' },
            { category: 'User', apiName: 'ActivateUser', method: 'POST', status: 'Active' },
        ];
        setData(fetchData);
    }, []);

    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                Object.values(item).some(val =>
                    val.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        if (methodFilter) {
            filtered = filtered.filter(item => item.method === methodFilter);
        }

        if (statusFilter) {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchTerm, categoryFilter, methodFilter, statusFilter, data]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
    const uniqueMethods = Array.from(new Set(data.map(item => item.method)));
    const uniqueStatuses = Array.from(new Set(data.map(item => item.status)));

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Meta Detail Page</h2>

            <div className="flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border p-2 rounded-md w-full md:w-64"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <select
                    className="border p-2 rounded-md"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {uniqueCategories.map(category => (
                        <option key={category}>{category}</option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded-md"
                    value={methodFilter}
                    onChange={e => setMethodFilter(e.target.value)}
                >
                    <option value="">All Methods</option>
                    {uniqueMethods.map(method => (
                        <option key={method}>{method}</option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded-md"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map(status => (
                        <option key={status}>{status}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">API Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Method</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-800">{item.category}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{item.apiName}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{item.method}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{item.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-2">
                <button
                    className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                            }`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MetaDetailPage;
