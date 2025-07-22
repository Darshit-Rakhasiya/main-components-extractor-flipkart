import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Globe, Key, Send, AlertCircle, CheckCircle, Eye, Calendar, Filter, EyeOff, ChevronDown, Copy, X } from 'lucide-react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import { useNavigate } from 'react-router-dom';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 fields
  const [platform, setPlatform] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('PDP');
  
  // Step 2 fields
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showKeyDropdown, setShowKeyDropdown] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [editingLimit, setEditingLimit] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<number>(0);

  // Platform options
  const platformOptions = [
    'Amazon',
    'eBay', 
    'Shopify',
    'WooCommerce',
    'Magento',
    'BigCommerce',
    'Other'
  ];

  // Category options
  const categoryOptions = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Health & Beauty',
    'Automotive',
    'Toys & Games',
    'Other'
  ];

  // Type options
  const typeOptions = [
    { value: 'PL', label: 'Product Listing (PL)' },
    { value: 'PDP', label: 'Product Detail Page (PDP)' },
    { value: 'SEARCH', label: 'Search Results' },
    { value: 'REVIEW', label: 'Product Reviews' }
  ];

  // Method options
  const methodOptions = [
    { value: 'GET', label: 'GET', color: 'bg-blue-100 text-blue-800' },
    { value: 'POST', label: 'POST', color: 'bg-emerald-100 text-emerald-800' }
  ];

  // Mock API Keys data
  const [userApiKeys, setUserApiKeys] = useState<ApiKeyData[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_51H7qABC123456789DEF',
      limit: 1000,
      usage: 750,
      status: 'Active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_51H7qXYZ987654321ABC',
      limit: 500,
      usage: 120,
      status: 'Active',
      createdAt: '2024-02-01'
    }
  ]);

  const handleCopyKey = async (keyValue: string) => {
    try {
      await navigator.clipboard.writeText(keyValue);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy key:', err);
      const textArea = document.createElement('textarea');
      textArea.value = keyValue;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess('Copied!');
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
    setUserApiKeys(userApiKeys.map(key =>
      key.id === keyId ? { ...key, limit: tempLimit } : key
    ));
    setEditingLimit(null);
    setTempLimit(0);
  };

  const handleCancelEdit = () => {
    setEditingLimit(null);
    setTempLimit(0);
  };

  const handleNextStep = () => {
    if (!platform || !category || !type) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isValidKey = apiKey.length > 10 && url.includes('api');
      
      if (isValidKey) {
        const mockData = [
          { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
        ];
        
        setApiData(mockData);
        setIsValid(true);
        setApiResponse({
          status: 200,
          method: method,
          message: 'Success',
          timestamp: new Date().toISOString()
        });
      } else {
        setError('Invalid API key or URL');
      }
    } catch (err) {
      setError('Failed to validate API. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewLogs = (keyId: string) => {
    navigate(`/user/logs/${keyId}`);
  };

  const renderTable = () => {
    if (!apiData || !Array.isArray(apiData)) return null;

    const headers = Object.keys(apiData[0] || {});
    
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">API Response Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apiData.map((row: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row[header]}
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

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showKeyDropdown && !target.closest('.dropdown-container')) {
        setShowKeyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showKeyDropdown]);

  // Auto-detect method from URL
  const detectMethodFromUrl = (url: string) => {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('/create') || lowerUrl.includes('/add') || lowerUrl.includes('/submit')) {
      return 'POST';
    } else if (lowerUrl.includes('/update') || lowerUrl.includes('/edit')) {
      return 'PUT';
    } else if (lowerUrl.includes('/delete') || lowerUrl.includes('/remove')) {
      return 'DELETE';
    } else if (lowerUrl.includes('/patch')) {
      return 'PATCH';
    } else {
      return 'GET';
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (newUrl.trim()) {
      const detectedMethod = detectMethodFromUrl(newUrl);
      setMethod(detectedMethod);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navbar isAuthenticated={!!user} user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {currentStep === 1 ? 'Configure your API settings' : 'Test your APIs and view response data'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Configuration</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">API Testing</span>
            </div>
          </div>
        </div>

        {currentStep === 1 ? (
          /* Step 1: Configuration */
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">API Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter platform name"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category"
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center space-x-2 text-red-600 text-sm bg-red-50 py-2 px-4 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                <span>Next Step</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: API Testing */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* API Configuration */}
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
                  <button
                    onClick={handlePreviousStep}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    ← Back to Step 1
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://api.example.com/data"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Method
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {methodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        methodOptions.find(m => m.value === method)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {method}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">Auto-detected from URL</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <div className="relative dropdown-container">
                      <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your API key"
                      />
                      <div className="absolute right-3 top-3 flex items-center space-x-2">
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => setShowKeyDropdown(!showKeyDropdown)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {showKeyDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {userApiKeys.map((key) => (
                            <button
                              key={key.id}
                              onClick={() => handleSelectKey(key)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{key.name}</div>
                              <div className="text-sm text-gray-500 font-mono">
                                {key.key.substring(0, 12)}...{key.key.substring(key.key.length - 4)}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {copySuccess && (
                      <div className="text-xs text-green-600 mt-1">{copySuccess}</div>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 py-2 px-4 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  {isValid && (
                    <div className="flex items-center space-x-2 text-emerald-600 text-sm bg-emerald-50 py-2 px-4 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span>API key is valid! Data fetched successfully.</span>
                    </div>
                  )}

                  <button
                    onClick={validateAndFetchData}
                    disabled={isValidating}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                    <span>{isValidating ? 'Testing API...' : 'Test API'}</span>
                  </button>
                </div>
              </div>

              {/* API Response */}
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">API Response</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Connection Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isValid ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">API URL</span>
                    <span className="text-xs text-gray-600 truncate max-w-48">
                      {url || 'Not set'}
                    </span>
                  </div>

                  {apiResponse && (
                    <>
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Response Status</span>
                        <span className="text-sm font-semibold text-emerald-600">
                          {apiResponse.status} - {apiResponse.message}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Response Time</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {new Date(apiResponse.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* API Keys Table */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your API Keys</h2>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">API KEY</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NAME</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">LIMIT</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">USAGE</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">USAGE %</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {userApiKeys.length > 0 ? (
                        userApiKeys.map((keyData) => {
                          const usagePercentage = Math.round((keyData.usage / keyData.limit) * 100);
                          
                          return (
                            <tr key={keyData.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <code className="text-sm font-mono text-gray-900">
                                    {keyData.key.substring(0, 12)}...{keyData.key.substring(keyData.key.length - 4)}
                                  </code>
                                  <button
                                    onClick={() => handleCopyKey(keyData.key)}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded"
                                    title="Copy full API key"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {keyData.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-md text-xs font-semibold ${
                                  keyData.status === 'Active' ? 'bg-green-100 text-green-700' :
                                  keyData.status === 'Inactive' ? 'bg-gray-100 text-gray-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {keyData.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editingLimit === keyData.id ? (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="number"
                                      value={tempLimit}
                                      onChange={(e) => setTempLimit(parseInt(e.target.value) || 0)}
                                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      min="0"
                                    />
                                    <button
                                      onClick={() => handleSaveLimit(keyData.id)}
                                      className="p-1 text-green-600 hover:text-green-700"
                                      title="Save"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="p-1 text-red-600 hover:text-red-700"
                                      title="Cancel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <span>{keyData.limit.toLocaleString()}</span>
                                    <button
                                      onClick={() => handleEditLimit(keyData.id, keyData.limit)}
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      title="Edit limit"
                                    >
                                      <Key className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {keyData.usage.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        usagePercentage >= 90 ? 'bg-red-500' :
                                        usagePercentage >= 70 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                      }`}
                                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600 font-medium min-w-[3rem]">
                                    {usagePercentage}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleViewLogs(keyData.id)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold hover:bg-blue-200 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View Logs</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                            No API keys found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Data Table */}
            {apiData && (
              <div className="mt-8">
                {renderTable()}
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
