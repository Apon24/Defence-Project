import { Link, useLocation } from 'react-router-dom';
import { Leaf, Moon, Sun, LogOut, User, Menu, X, LogIn, UserPlus, Shield, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { profileApi } from '../lib/api';
import { NavDropdown } from './NavDropdown';
import { UserMenu } from './UserMenu';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const navCategories = [
    {
      label: 'Home',
      type: 'link',
      path: '/'
    },
    {
      label: 'Learn',
      type: 'dropdown',
      items: [
        { name: 'Tips', path: '/tips' },
        { name: 'Blog', path: '/blog' },
        { name: 'Quiz', path: '/quiz' },
      ]
    },
    {
      label: 'Tools',
      type: 'dropdown',
      items: [
        { name: 'Calculator', path: '/calculator' },
        { name: 'Map', path: '/map' },
      ]
    },
    {
      label: 'Community',
      type: 'dropdown',
      items: [
        { name: 'Community', path: '/community' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Challenges', path: '/challenges' },
      ]
    },
    {
      label: 'Dashboard',
      type: 'link',
      path: '/dashboard'
    }
  ];

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const profile = await profileApi.getProfile();
        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
        : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
    }`;

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const mobileLinkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive(path)
        ? 'bg-green-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
    }`;

  const toggleCategory = (label: string) => {
    setExpandedCategory(expandedCategory === label ? null : label);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 transition-transform duration-200 hover:scale-[1.01]"
              onClick={handleScrollTop}
            >
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-green-600">Eco Track Bangladesh</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            {navCategories.map((category) => (
              category.type === 'link' ? (
                <Link
                  key={category.path}
                  to={category.path!}
                  className={linkClass(category.path!)}
                  onClick={handleScrollTop}
                >
                  {category.label}
                </Link>
              ) : (
                <NavDropdown
                  key={category.label}
                  label={category.label}
                  items={category.items!}
                  handleScrollTop={handleScrollTop}
                />
              )
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="hidden lg:flex items-center space-x-2">
                 <UserMenu isAdmin={isAdmin} handleScrollTop={handleScrollTop} />
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all hover:shadow-lg"
                  onClick={handleScrollTop}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 transition-all"
                  onClick={() => {
                    localStorage.setItem('authMode', 'signup');
                    handleScrollTop();
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navCategories.map((category) => (
                category.type === 'link' ? (
                  <Link
                    key={category.path}
                    to={category.path!}
                    className={mobileLinkClass(category.path!)}
                    onClick={() => {
                      handleScrollTop();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {category.label}
                  </Link>
                ) : (
                  <div key={category.label} className="space-y-1">
                    <button
                      onClick={() => toggleCategory(category.label)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span>{category.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          expandedCategory === category.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedCategory === category.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 space-y-1 overflow-hidden"
                        >
                          {category.items?.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={mobileLinkClass(item.path)}
                              onClick={() => {
                                handleScrollTop();
                                setMobileMenuOpen(false);
                              }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          handleScrollTop();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Shield className="h-5 w-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      onClick={() => {
                        handleScrollTop();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        handleScrollTop();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
                      onClick={() => {
                        handleScrollTop();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-md text-base font-medium border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900"
                      onClick={() => {
                        localStorage.setItem('authMode', 'signup');
                        handleScrollTop();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
