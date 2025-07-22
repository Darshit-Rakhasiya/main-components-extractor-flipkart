import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BarChart3, Users, Settings, ArrowRight, Database, FileText } from 'lucide-react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const AdminHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Advanced Admin Control
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Center</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive administrative dashboard for monitoring system-wide API usage, 
            managing users, tracking requests, and maintaining optimal platform performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admin/signin"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Access Admin Panel</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/admin/signup"
              className="border-2 border-emerald-300 text-emerald-700 px-8 py-4 rounded-lg font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200"
            >
              Create Admin Account
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Features Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Admin Features</h2>
            <p className="text-lg text-gray-600">Complete control and monitoring tools for system administrators</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">System Analytics</h3>
              <p className="text-gray-600">
                Monitor total API calls, daily usage patterns, and comprehensive system performance metrics.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User Management</h3>
              <p className="text-gray-600">
                View detailed user information, manage accounts, and track individual API usage patterns.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Logging</h3>
              <p className="text-gray-600">
                Comprehensive request logs with detailed tracking of all API calls and responses.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Management</h3>
              <p className="text-gray-600">
                Manage API keys, update key tables, and monitor usage statistics across all users.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h3>
              <p className="text-gray-600">
                Configure platform settings, manage system preferences, and maintain optimal performance.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Controls</h3>
              <p className="text-gray-600">
                Advanced administrative controls for managing the entire API tracking platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminHomePage;