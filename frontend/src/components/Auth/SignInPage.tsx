import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import toast from 'react-hot-toast';
import axios from 'axios';

const SignInPage: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setSignInData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log(signInData);

      // Make a single request to the new login endpoint
      const response = await axios.post('http://localhost:3000/login', signInData);

      console.log(response);
      

      if (response.status === 200 && response.data.status) {
        const { role } = response.data;

        switch (role) {
          case 'user':
            toast.success('Logged in as User successfully!', {
              position: 'top-center',
              duration: 3000,
            });
            navigate('/user/dashboard');
            break;
          case 'admin':
            toast.success('Logged in as Admin successfully!', {
              position: 'top-center',
              duration: 3000,
            });
            navigate('/admin/dashboard');
            break;
          case 'super':
            toast.success('Logged in as Super Admin successfully!', {
              position: 'top-center',
              duration: 3000,
            });
            navigate('/super/dashboard');
            break;
          default:
            setError('Unknown role. Please contact support.');
            break;
        }

        setSignInData({ email: '', password: '' });
        return; // Exit early after successful login

      } else {
        setError('Invalid credentials. Please try again.');
      }

    } catch (err) {
      // Catch any error during the request (network error, etc.)
      // console.error('Login error:', err);
      setError('Failed to log in. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state once all attempts are done
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
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
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
                    name='email'
                    required
                    value={signInData.email.toLowerCase()}
                    onChange={handleChange}
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={signInData.password}
                    name='password'
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Don't have an account? Sign up
              </Link>

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

export default SignInPage;
