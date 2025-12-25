import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  User as UserIcon,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface UserMenuProps {
  isAdmin: boolean;
  handleScrollTop: () => void;
}

export const UserMenu = ({ isAdmin, handleScrollTop }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  if (!user) return null;

  return (
    <div
      className="relative z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <button className="flex items-center space-x-2 focus:outline-none">
        <div
          className={`h-9 w-9 rounded-full flex items-center justify-center overflow-hidden border-2 ${
            isOpen ? "border-green-600" : "border-gray-200 dark:border-gray-700"
          } transition-colors`}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold text-sm">
              {getInitials(user.fullName)}
            </div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden origin-top-right">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>

            <div className="py-1">
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  handleScrollTop();
                }}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {language === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    handleScrollTop();
                  }}>
                  <Shield className="mr-2 h-4 w-4" />
                  {language === "bn" ? "অ্যাডমিন" : "Admin"}
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  handleScrollTop();
                }}>
                <UserIcon className="mr-2 h-4 w-4" />
                {language === "bn" ? "প্রোফাইল" : "Profile"}
              </Link>

              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut className="mr-2 h-4 w-4" />
                {language === "bn" ? "লগআউট" : "Logout"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
