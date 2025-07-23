import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const ConfigApi: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [method, setMethod] = useState('POST');
  const [mongoDbUrl, setMongoDbUrl] = useState('');
  const [databaseName, setDatabaseName] = useState('');
  const [keyCollectionName, setKeyCollectionName] = useState('');
  const [logCollectionName, setLogCollectionName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);

  const [payload, setPayload] = useState<{ key: string; value: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      apiUrl,
      method,
      mongoDbUrl,
      databaseName,
      keyCollectionName,
      logCollectionName,
      domainName,
      category,
      type,
      payload,
    };

    console.log(formData);


    try {
      const apiResponse = await axios.post('http://localhost:3000/meta/submit', formData);

      setResponse({
        success: apiResponse.data.success,
        message: apiResponse.data.message,
      });

    } catch (error: any) {
      setResponse({
        success: false,
        message: error.response?.data?.message || 'An error occurred while submitting the configuration.',
      });
    }

  };

  const addPayload = () => {
    setPayload([...payload, { key: '', value: '' }]);
  };

  const removePayload = (index: number) => {
    const updatedPayload = [...payload];
    updatedPayload.splice(index, 1);
    setPayload(updatedPayload);
  };

  const handlePayloadChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedPayload = [...payload];
    updatedPayload[index][field] = value;
    setPayload(updatedPayload);
  };

  return (
    <AdminLayout pageTitle="API Configuration">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="relative">
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="API URL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="relative">
                <input
                  type="url"
                  value={mongoDbUrl}
                  onChange={(e) => setMongoDbUrl(e.target.value)}
                  placeholder="MongoDB URL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={databaseName}
                  onChange={(e) => setDatabaseName(e.target.value)}
                  placeholder="Database Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="relative">
                <input
                  type="text"
                  value={keyCollectionName}
                  onChange={(e) => setKeyCollectionName(e.target.value)}
                  placeholder="Key Collection Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={logCollectionName}
                  onChange={(e) => setLogCollectionName(e.target.value)}
                  placeholder="Log Collection Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="relative">
                <input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="Domain Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="relative">
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Type"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {method === 'POST' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Payload</h3>
                {payload.map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <input
                      type="text"
                      value={item.key}
                      onChange={(e) => handlePayloadChange(index, 'key', e.target.value)}
                      placeholder="Key"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handlePayloadChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removePayload(index)}
                      className="text-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPayload}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mt-4"
                >
                  Add Payload
                </button>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Check Configuration
              </button>
            </div>

            {response && (
              <div className={`mt-6 p-4 rounded-lg ${response.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <h4 className="font-semibold text-lg">
                  {response.success ? 'Success' : 'Error'}
                </h4>
                <pre className="whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ConfigApi;
