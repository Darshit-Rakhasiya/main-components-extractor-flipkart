import React, { useState } from 'react';
import {
  Globe,
  Send,
  AlertCircle,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  /* ---------- Step & form state ---------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [platform, setPlatform] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('PDP');

  /* ---------- API‑test state ---------- */
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [isValidating, setIsValidating] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState([{ key: '', value: '' }]);

  // Payload handlers
  const handlePayloadChange = (idx: number, field: 'key' | 'value', val: string) => {
    setPayload((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };
  const addPayloadRow = () => setPayload((prev) => [...prev, { key: '', value: '' }]);
  const removePayloadRow = (idx: number) =>
    setPayload((prev) => prev.filter((_, i) => i !== idx));

  // Step navigation with URL update
  const goToStep2 = () => {
    setCurrentStep(2);
    window.history.replaceState(null, '', '/user/dashboard?step2');
  };
  const goToStep1 = () => {
    setCurrentStep(1);
    window.history.replaceState(null, '', '/user/dashboard');
  };

  const validateAndFetchData = async () => {
    if (!url) {
      setError('Please enter the API URL');
      return;
    }
    if (method === 'POST') {
      const hasKey = payload.some((row) => row.key.trim() !== '');
      if (!hasKey) {
        setError('Please enter at least one payload key-value pair');
        return;
      }
    }

    setIsValidating(true);
    setError('');
    setApiData(null);
    setIsValid(false);

    try {
      await new Promise((r) => setTimeout(r, 1000)); // faux latency

      // Simulate a response
      setApiData([
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
      ]);
      setIsValid(true);
      setApiResponse({
        status: 200,
        method,
        message: 'Success',
        timestamp: new Date().toISOString(),
      });
    } catch {
      setError('Failed to validate API. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const detectMethodFromUrl = (u: string) => {
    const x = u.toLowerCase();
    if (x.match(/\/(create|add|submit)/)) return 'POST';
    if (x.match(/\/(update|edit)/)) return 'PUT';
    if (x.match(/\/(delete|remove)/)) return 'DELETE';
    if (x.includes('/patch')) return 'PATCH';
    return 'GET';
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (newUrl.trim()) setMethod(detectMethodFromUrl(newUrl));
  };

  /* ---------- Render helpers ---------- */
  const renderTable = () => {
    if (!apiData) return null;
    const headers = Object.keys(apiData[0] || {});
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">API Response Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apiData.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50">
                  {headers.map((h) => (
                    <td key={h} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleLogout = () => navigate('/');

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navbar isAuthenticated={false} onLogout={handleLogout} />

      {/* main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {currentStep === 1 ? 'Configure your API settings' : 'Test your APIs and view response data'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
                {step === 2 && (
                  <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
                <div className={`flex items-center space-x-2 ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}
                  >
                    {step}
                  </div>
                  <span className="font-medium">{step === 1 ? 'Configuration' : 'API Testing'}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* STEP 1 --------------- */}
        {currentStep === 1 && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">API Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Platform *" value={platform} onChange={setPlatform} placeholder="Enter platform name" />
              <Input label="Category *" value={category} onChange={setCategory} placeholder="Enter category" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[
                    { v: 'PL', l: 'Product Listing (PL)' },
                    { v: 'PDP', l: 'Product Detail Page (PDP)' },
                    { v: 'SEARCH', l: 'Search Results' },
                    { v: 'REVIEW', l: 'Product Reviews' },
                  ].map(({ v, l }) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <Alert msg={error} Icon={AlertCircle} color="red" className="mt-4" />
            )}

            <div className="mt-8 flex justify-end">
              <Button onClick={() => (!platform || !category ? setError('Please fill in all required fields') : goToStep2())}>
                Next Step <ChevronDown className="w-4 h-4 -rotate-90" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 --------------- */}
        {currentStep === 2 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left side – form */}
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
                  <button onClick={goToStep1} className="text-blue-600 text-sm">
                    ← Back to Step&nbsp;1
                  </button>
                </div>

                {/* URL */}
                <Input
                  label="API URL"
                  value={url}
                  onChange={handleUrlChange}
                  icon={Globe}
                  placeholder="https://api.example.com/data"
                />

                {/* Method & Payload */}
                <div className="mt-6 flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Request Method</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs mt-2 bg-blue-100 text-blue-800">
                      {method}
                    </span>
                  </div>
                  {method === 'POST' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payload</label>
                      <div>
                        {payload.map((row, idx) => (
                          <div key={idx} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Key"
                              value={row.key}
                              onChange={e => handlePayloadChange(idx, 'key', e.target.value)}
                              className="px-2 py-1 border rounded"
                            />
                            <input
                              type="text"
                              placeholder="Value"
                              value={row.value}
                              onChange={e => handlePayloadChange(idx, 'value', e.target.value)}
                              className="px-2 py-1 border rounded"
                            />
                            <button type="button" onClick={() => removePayloadRow(idx)} className="text-red-500">x</button>
                          </div>
                        ))}
                        <button type="button" onClick={addPayloadRow} className="text-blue-600 text-xs">+ Add Row</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Alerts */}
                {error && <Alert msg={error} Icon={AlertCircle} color="red" className="mt-6" />}
                {isValid && (
                  <Alert msg="API is valid! Data fetched successfully." Icon={CheckCircle} color="emerald" className="mt-6" />
                )}

                {/* Test button */}
                <Button onClick={validateAndFetchData} disabled={isValidating} className="w-full mt-8">
                  <Send className="w-5 h-5" />
                  {isValidating ? 'Testing API...' : 'Test API'}
                </Button>
              </div>

              {/* Right side – response info */}
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">API Response</h2>
                <InfoRow label="Connection Status" value={isValid ? 'Connected' : 'Not Connected'} valid={isValid} />
                <InfoRow label="API URL" value={url || 'Not set'} />
                {apiResponse && (
                  <>
                    <InfoRow
                      label="Response Status"
                      value={`${apiResponse.status} - ${apiResponse.message}`}
                      valid
                      accent="emerald"
                    />
                    <InfoRow
                      label="Response Time"
                      value={new Date(apiResponse.timestamp).toLocaleString()}
                      accent="blue"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Data table */}
            {apiData && <div className="mt-8">{renderTable()}</div>}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

/* ---------- Reusable tiny components ---------- */

const Input: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ElementType;
  placeholder?: string;
}> = ({ label, value, onChange, icon: Icon, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500`}
      />
    </div>
  </div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <button
    {...props}
    className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const Alert: React.FC<{
  msg: string;
  Icon: React.ElementType;
  color: 'red' | 'emerald';
  className?: string;
}> = ({ msg, Icon, color, className = '' }) => (
  <div
    className={`flex items-center space-x-2 text-${color}-600 text-sm bg-${color}-50 py-2 px-4 rounded-lg ${className}`}
  >
    <Icon className="w-4 h-4" />
    <span>{msg}</span>
  </div>
);

const InfoRow: React.FC<{
  label: string;
  value: string;
  valid?: boolean;
  accent?: 'emerald' | 'blue';
}> = ({ label, value, valid = false, accent = 'gray' }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${valid
        ? `bg-${accent}-100 text-${accent}-800`
        : 'bg-gray-100 text-gray-800'
        }`}
    >
      {value}
    </span>
  </div>
);

export default UserDashboard;