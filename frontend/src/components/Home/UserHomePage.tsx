import React from 'react';
import { Link } from 'react-router-dom';
import { User, Key, BarChart3, Globe, ArrowRight } from 'lucide-react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const UserHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Test Your APIs with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Ease</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Simple and powerful API testing platform. Enter your API details, 
            validate your keys, and view response data in an organized format.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Start Testing APIs</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/signin"
              className="border-2 border-blue-300 text-blue-700 px-8 py-4 rounded-lg font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our API Testing Platform?</h2>
            <p className="text-lg text-gray-600">Everything you need to test and validate your APIs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy API Testing</h3>
              <p className="text-gray-600">
                Simply enter your API URL and key to instantly test and validate your endpoints.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Key className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Key Validation</h3>
              <p className="text-gray-600">
                Validate your API keys securely and get instant feedback on their status.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clear Data Display</h3>
              <p className="text-gray-600">
                View your API response data in a clean, organized table format for easy analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserHomePage;