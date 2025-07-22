import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await signup(email, password, name, 'user');
      if (success) {
        navigate('/user/dashboard');
      } else {
        setError('User already exists');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
              <p className="text-gray-600 mt-2">Get started with API tracking</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Link
                to="/signin"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Already have an account? Sign in
              </Link>
              {/* Add link for admins */}
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

export default SignUpPage;