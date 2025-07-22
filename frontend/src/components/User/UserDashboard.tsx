import React, { useState, useEffect } from 'react';
import {
  Globe,
  Key,
  Send,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronDown,
  Copy,
  X,
} from 'lucide-react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface ApiKeyData {
  id: string;
  name: string;
  key: string;
  limit: number;
  usage: number;
  status: 'Active' | 'Inactive' | 'Expired';
  createdAt: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const step = searchParams.get('step');
    if (step === '2') {
      setCurrentStep(2);
    }
  }, [searchParams]);

  /* ---------- Step & form state ---------- */
  const [platform, setPlatform] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('PDP');

  /* ---------- API‑test state ---------- */
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showKeyDropdown, setShowKeyDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  /* ---------- Key‑limit inline edit ---------- */
  const [editingLimit, setEditingLimit] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState(0);

  /* ---------- Mock data ---------- */
  const [userApiKeys, setUserApiKeys] = useState<ApiKeyData[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_51H7qABC123456789DEF',
      limit: 1000,
      usage: 750,
      status: 'Active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_51H7qXYZ987654321ABC',
      limit: 500,
      usage: 120,
      status: 'Active',
      createdAt: '2024-02-01',
    },
  ]);

  /* ---------- Helpers ---------- */
  const handleCopyKey = async (keyValue: string) => {
    try {
      await navigator.clipboard.writeText(keyValue);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('Copy failed');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleSelectKey = (selectedKey: ApiKeyData) => {
    setApiKey(selectedKey.key);
    setShowKeyDropdown(false);
  };

  const handleEditLimit = (keyId: string, currentLimit: number) => {
    setEditingLimit(keyId);
    setTempLimit(currentLimit);
  };

  const handleSaveLimit = (keyId: string) => {
    setUserApiKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, limit: tempLimit } : k)),
    );
    setEditingLimit(null);
  };

  const validateAndFetchData = async () => {
    if (!url || !apiKey) {
      setError('Please enter both URL and API key');
      return;
    }

    setIsValidating(true);
    setError('');
    setApiData(null);
    setIsValid(false);

    try {
      await new Promise((r) => setTimeout(r, 1500)); // faux latency
      const isValidKey = apiKey.length > 10 && url.includes('api');

      if (isValidKey) {
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
      } else {
        setError('Invalid API key or URL');
      }
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

  /* ---------- Click‑outside close for key dropdown ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (showKeyDropdown && !(e.target as HTMLElement).closest('.dropdown-container')) {
        setShowKeyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showKeyDropdown]);

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

  /* ---------- Navigation stubs ---------- */
  const handleLogout = () => navigate('/');
  const handleViewLogs = (id: string) => navigate(`/user/dashboard/logs/${id}`);

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
              <Button onClick={() => (!platform || !category ? setError('Please fill in all required fields') : setCurrentStep(2))}>
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
                  <button onClick={() => setCurrentStep(1)} className="text-blue-600 text-sm">
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

                {/* Method */}
                <div className="mt-6">
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

                {/* API key */}
                <div className="mt-6 relative dropdown-container">
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full pl-10 pr-20 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-3 top-3 flex space-x-2">
                      <IconButton onClick={() => setShowApiKey((s) => !s)} Icon={showApiKey ? EyeOff : Eye} />
                      <IconButton onClick={() => setShowKeyDropdown((s) => !s)} Icon={ChevronDown} />
                    </div>
                  </div>

                  {/* Dropdown */}
                  {showKeyDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {userApiKeys.map((k) => (
                        <button
                          key={k.id}
                          onClick={() => handleSelectKey(k)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{k.name}</div>
                          <div className="text-sm text-gray-500 font-mono">{`${k.key.slice(0, 12)}...${k.key.slice(-4)}`}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {copySuccess && <p className="text-xs text-green-600 mt-1">{copySuccess}</p>}
                </div>

                {/* Alerts */}
                {error && <Alert msg={error} Icon={AlertCircle} color="red" className="mt-6" />}
                {isValid && (
                  <Alert msg="API key is valid! Data fetched successfully." Icon={CheckCircle} color="emerald" className="mt-6" />
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

            {/* Keys table */}
            <KeysTable
              keys={userApiKeys}
              editingLimit={editingLimit}
              tempLimit={tempLimit}
              onEdit={handleEditLimit}
              onSave={handleSaveLimit}
              onCancel={() => setEditingLimit(null)}
              onCopy={handleCopyKey}
              onLogs={handleViewLogs}
            />

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

const IconButton: React.FC<{ onClick: () => void; Icon: React.ElementType }> = ({ onClick, Icon }) => (
  <button onClick={onClick} className="text-gray-400 hover:text-gray-600">
    <Icon className="w-5 h-5" />
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

const KeysTable: React.FC<{
  keys: ApiKeyData[];
  editingLimit: string | null;
  tempLimit: number;
  onEdit: (id: string, limit: number) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onCopy: (val: string) => void;
  onLogs: (id: string) => void;
}> = ({ keys, editingLimit, tempLimit, onEdit, onSave, onCancel, onCopy, onLogs }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Your API Keys</h2>
    <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {['API KEY', 'NAME', 'STATUS', 'LIMIT', 'USAGE', 'USAGE %', 'ACTIONS'].map((h) => (
              <th
                key={h}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {keys.map((k) => {
            const usagePct = k.limit ? Math.round((k.usage / k.limit) * 100) : 0;
            return (
              <tr key={k.id} className="hover:bg-gray-50">
                {/* Key */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono">{`${k.key.slice(0, 12)}...${k.key.slice(-4)}`}</code>
                    <IconButton onClick={() => onCopy(k.key)} Icon={Copy} />
                  </div>
                </td>

                {/* Name */}
                <td className="px-6 py-4 text-sm">{k.name}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${k.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : k.status === 'Inactive'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {k.status}
                  </span>
                </td>

                {/* Limit */}
                <td className="px-6 py-4">
                  {editingLimit === k.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={tempLimit}
                        onChange={(e) => {
                          const num = Number(e.target.value);
                          if (!Number.isNaN(num)) setTempLimit(num);
                        }}
                      />

                      <IconButton onClick={() => onSave(k.id)} Icon={CheckCircle} />
                      <IconButton onClick={onCancel} Icon={X} />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{k.limit.toLocaleString()}</span>
                      <IconButton onClick={() => onEdit(k.id, k.limit)} Icon={Key} />
                    </div>
                  )}
                </td>

                {/* Usage */}
                <td className="px-6 py-4 text-sm">{k.usage.toLocaleString()}</td>

                {/* Usage % */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        style={{ width: `${Math.min(usagePct, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[3rem]">{usagePct}%</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => onLogs(k.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Logs</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserDashboard;
