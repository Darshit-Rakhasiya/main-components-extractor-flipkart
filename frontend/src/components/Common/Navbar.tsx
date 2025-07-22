import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, User, Home, LogIn, UserPlus } from 'lucide-react';

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: { name: string; role: 'user' | 'admin' | 'Super Admin' } | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              API Tracker
            </h1>
          </div>

          {/* Right Side - Conditionally Hidden on /admin */}
          {!isAdminPage && (
            <>
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                      {user.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <Link
                    to="/"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      location.pathname === '/'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/signin"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      location.pathname === '/signin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      location.pathname === '/signup'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
