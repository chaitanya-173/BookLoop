import React, { useState } from 'react';
import { Book, User, LogOut, Menu, X, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigate('home')}
          >
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-2.5 rounded-xl group-hover:from-orange-600 group-hover:via-orange-700 group-hover:to-orange-800 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/25">
              <Book className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-playfair font-bold text-white tracking-wide leading-none">
                Book<span className="text-orange-400">Loop</span>
              </span>
              <span className="text-xs font-inter text-gray-400 tracking-widest uppercase">
                Trading Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-inter transition-all duration-200 ${
                currentPage === 'home'
                  ? 'text-orange-400 bg-gray-700 shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Browse Books
            </button>
            
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigate('add-book')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium font-inter transition-all duration-200 flex items-center space-x-2 ${
                    currentPage === 'add-book'
                      ? 'text-orange-400 bg-gray-700 shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Sell Book</span>
                </button>
                <button
                  onClick={() => handleNavigate('profile')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium font-inter transition-all duration-200 flex items-center space-x-2 ${
                    currentPage === 'profile'
                      ? 'text-orange-400 bg-gray-700 shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium font-inter text-gray-300 hover:text-white hover:bg-red-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavigate('login')}
                  className="px-4 py-2 text-sm font-medium font-inter text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigate('register')}
                  className="px-6 py-2 text-sm font-medium font-inter bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="space-y-2">
              <button
                onClick={() => handleNavigate('home')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium font-inter transition-colors duration-200 ${
                  currentPage === 'home'
                    ? 'text-orange-400 bg-gray-700'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Browse Books
              </button>
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigate('add-book')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium font-inter transition-colors duration-200 ${
                      currentPage === 'add-book'
                        ? 'text-orange-400 bg-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Sell Book
                  </button>
                  <button
                    onClick={() => handleNavigate('profile')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium font-inter transition-colors duration-200 ${
                      currentPage === 'profile'
                        ? 'text-orange-400 bg-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium font-inter text-gray-300 hover:text-white hover:bg-red-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate('login')}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium font-inter text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigate('register')}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium font-inter bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;