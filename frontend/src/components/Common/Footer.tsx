import React from 'react';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">API Tracker</h3>
              <p className="text-sm text-gray-400">Monitor and manage your APIs</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">
              A comprehensive solution for tracking API usage, managing keys, and monitoring performance.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © 2025 API Tracker. Built for developers, by developers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;