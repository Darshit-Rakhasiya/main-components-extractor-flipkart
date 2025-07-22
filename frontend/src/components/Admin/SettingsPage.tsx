import React, { useState } from 'react';
import { Save, RotateCcw, Shield, Globe, Clock, Database } from 'lucide-react';
import AdminLayout from './AdminLayout';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Rate Limiting
    globalDailyLimit: 1000,
    globalHourlyLimit: 100,
    perUserRateOverride: false,
    
    // IP Controls
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
    ipBlacklist: ['192.168.1.100'],
    blockByRegion: false,
    blockedRegions: ['CN', 'RU'],
    
    // Security
    twoFactorEnabled: true,
    abnormalUsageAlerts: true,
    adminPasswordChange: '',
    confirmPassword: '',
    
    // Log Retention
    logRetentionDays: 30,
    
    // General
    maintenanceMode: false,
    apiVersioning: true
  });

  const [newIp, setNewIp] = useState('');
  const [ipType, setIpType] = useState<'whitelist' | 'blacklist'>('whitelist');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddIp = () => {
    if (!newIp) return;
    
    const ipList = ipType === 'whitelist' ? 'ipWhitelist' : 'ipBlacklist';
    setSettings(prev => ({
      ...prev,
      [ipList]: [...prev[ipList], newIp]
    }));
    setNewIp('');
  };

  const handleRemoveIp = (ip: string, type: 'whitelist' | 'blacklist') => {
    const ipList = type === 'whitelist' ? 'ipWhitelist' : 'ipBlacklist';
    setSettings(prev => ({
      ...prev,
      [ipList]: prev[ipList].filter(item => item !== ip)
    }));
  };

  const handleSaveSettings = () => {
    // In real app, save to backend
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        globalDailyLimit: 1000,
        globalHourlyLimit: 100,
        perUserRateOverride: false,
        ipWhitelist: [],
        ipBlacklist: [],
        blockByRegion: false,
        blockedRegions: [],
        twoFactorEnabled: false,
        abnormalUsageAlerts: true,
        adminPasswordChange: '',
        confirmPassword: '',
        logRetentionDays: 30,
        maintenanceMode: false,
        apiVersioning: true
      });
    }
  };

  return (
    <AdminLayout pageTitle="Settings">
      <div className="space-y-8">
        {/* Rate Limiting Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Rate Limiting</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Global Daily Limit (per user)
              </label>
              <input
                type="number"
                value={settings.globalDailyLimit}
                onChange={(e) => handleSettingChange('globalDailyLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Global Hourly Limit (per user)
              </label>
              <input
                type="number"
                value={settings.globalHourlyLimit}
                onChange={(e) => handleSettingChange('globalHourlyLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.perUserRateOverride}
                onChange={(e) => handleSettingChange('perUserRateOverride', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Allow per-user rate override</span>
            </label>
          </div>
        </div>

        {/* IP Controls Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">IP Controls</h3>
          </div>
          
          {/* Add IP */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <select
                value={ipType}
                onChange={(e) => setIpType(e.target.value as 'whitelist' | 'blacklist')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="whitelist">Whitelist</option>
                <option value="blacklist">Blacklist</option>
              </select>
              <input
                type="text"
                placeholder="Enter IP address"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleAddIp}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Add IP
              </button>
            </div>
          </div>
          
          {/* IP Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">IP Whitelist</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {settings.ipWhitelist.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-900">{ip}</span>
                    <button
                      onClick={() => handleRemoveIp(ip, 'whitelist')}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">IP Blacklist</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {settings.ipBlacklist.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-900">{ip}</span>
                    <button
                      onClick={() => handleRemoveIp(ip, 'blacklist')}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.blockByRegion}
                onChange={(e) => handleSettingChange('blockByRegion', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable region-based blocking</span>
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable 2FA for Admins</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.abnormalUsageAlerts}
                onChange={(e) => handleSettingChange('abnormalUsageAlerts', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable abnormal usage alerts</span>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Admin Password
              </label>
              <input
                type="password"
                value={settings.adminPasswordChange}
                onChange={(e) => handleSettingChange('adminPasswordChange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Leave blank to keep current"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={settings.confirmPassword}
                onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        {/* Log Retention Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Database className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Log Retention</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Log Retention Period (days)
            </label>
            <select
              value={settings.logRetentionDays}
              onChange={(e) => handleSettingChange('logRetentionDays', parseInt(e.target.value))}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>1 year</option>
            </select>
          </div>
        </div>

        {/* General Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">General</h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.apiVersioning}
                onChange={(e) => handleSettingChange('apiVersioning', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable API Versioning</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
          
          <button
            onClick={handleResetToDefaults}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;