import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import toast from 'react-hot-toast';

const AdminSignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password, 'admin');
      if (success) {
        toast.success('Successfully signed in as admin!');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Sign In</h2>
              <p className="text-gray-600 mt-2">Access the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {isLoading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              {/* Temporary testing link */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 mb-2">For Testing Only:</p>
                <Link
                  to="/admin/dashboard"
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Go to Admin Dashboard
                </Link>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <ArrowLeft className="w-4 h-4 text-gray-400" />
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminSignInPage;
