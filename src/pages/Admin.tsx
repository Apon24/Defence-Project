import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { adminApi, blogApi, communityApi } from "../lib/api";
import { AdminQuizManager } from "../components/AdminQuizManager";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Target,
  Users,
  User,
  BarChart3,
  Settings,
  Shield,
  MessageSquare,
  Trash2,
  Heart,
  Lock,
  ChevronRight,
  Eye,
  EyeOff,
  X,
  UserPlus,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

type Tab = "overview" | "quiz" | "blog" | "challenges" | "users" | "community";

export const Admin = () => {
  const { user, signIn } = useAuth();
  const { language } = useLanguage();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Login State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data States
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizAttempts: 0,
    totalBlogPosts: 0,
    totalChallenges: 0,
    activeCommunityPosts: 0,
  });

  // Users State
  const [users, setUsers] = useState<
    Array<{
      _id: string;
      email: string;
      fullName: string;
      role: "user" | "admin";
      avatarUrl?: string;
      createdAt: string;
    }>
  >([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);

  // Create User State
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  });
  const [creatingUser, setCreatingUser] = useState(false);

  // Community State
  const [communityPosts, setCommunityPosts] = useState<
    Array<{
      id: string;
      content: string;
      likes: number;
      created_at: string;
      user_id: string;
      profiles: {
        full_name: string;
        email: string;
      };
    }>
  >([]);
  const [communityLoading, setCommunityLoading] = useState(false);

  // Blog State
  const [blogPosts, setBlogPosts] = useState<
    Array<{
      _id: string;
      title: string;
      content: string;
      author: string;
      publishedAt: string;
      isExternal?: boolean;
      sourceName?: string;
    }>
  >([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [fetchingBlogs, setFetchingBlogs] = useState(false);

  // Effects to load data when authenticated
  useEffect(() => {
    if (user?.role === "admin") {
      loadStats();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin" && activeTab === "users") {
      loadUsers(usersPage);
    }
  }, [activeTab, usersPage, user]);

  useEffect(() => {
    if (user?.role === "admin" && activeTab === "community") {
      loadCommunityPosts();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (user?.role === "admin" && activeTab === "blog") {
      loadBlogPosts();
    }
  }, [activeTab, user]);

  // Handlers
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signIn(adminEmail, adminPassword);
      showNotification(
        "success",
        language === "bn" ? "স্বাগতম অ্যাডমিন" : "Welcome Admin"
      );
      // Determine if we need to reload purely based on state change
    } catch (error: any) {
      console.error("Admin login error:", error);
      showNotification(
        "error",
        error.message ||
          (language === "bn" ? "লগইন ব্যর্থ হয়েছে" : "Login Failed")
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats({
        totalUsers: data.totalUsers || 0,
        totalQuizAttempts: data.totalQuizAttempts || 0,
        totalBlogPosts: data.totalBlogPosts || 0,
        totalChallenges: data.totalChallenges || 0,
        activeCommunityPosts: data.activeCommunityPosts || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadUsers = async (page = 1) => {
    try {
      setUsersLoading(true);
      const response = await adminApi.getUsers(page, 20);
      setUsers(response.data || []);
      if (response.pagination?.totalPages) {
        setUsersTotalPages(response.pagination.totalPages);
      } else {
        setUsersTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading users list:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingUser(true);
      await adminApi.createUser(newUser);
      showNotification("success", "User created successfully");
      setShowCreateUserModal(false);
      setNewUser({ fullName: "", email: "", password: "", role: "user" });
      loadUsers(usersPage);
    } catch (error: any) {
      console.error("Error creating user:", error);
      showNotification("error", error.message || "Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleChangeUserRole = async (
    id: string,
    newRole: "user" | "admin"
  ) => {
    try {
      await adminApi.updateUserRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      showNotification("success", "User role updated");
    } catch (error) {
      console.error("Error updating user role:", error);
      showNotification("error", "Failed to update user role");
    }
  };

  const loadCommunityPosts = async () => {
    try {
      setCommunityLoading(true);
      const response = await communityApi.getPosts();
      setCommunityPosts(response.data || []);
    } catch (error) {
      console.error("Error loading community posts:", error);
      showNotification("error", "Failed to load community posts");
    } finally {
      setCommunityLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await communityApi.deletePost(postId);
      setCommunityPosts((prev) => prev.filter((post) => post.id !== postId));
      showNotification("success", "Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      showNotification("error", "Failed to delete post");
    }
  };

  const loadBlogPosts = async () => {
    try {
      setBlogLoading(true);
      const response = await blogApi.getAll();
      setBlogPosts(response.data || []);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      showNotification("error", "Failed to load blog posts");
    } finally {
      setBlogLoading(false);
    }
  };

  const handleFetchBlogPosts = async () => {
    if (
      !confirm(
        "This will fetch and import blog posts from online sources. Continue?"
      )
    ) {
      return;
    }

    try {
      setFetchingBlogs(true);
      const response = await blogApi.fetchFromOnline();
      showNotification(
        "success",
        `Successfully imported ${response.data?.imported || 0} blog posts`
      );
      await loadBlogPosts(); // Reload the list
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      showNotification(
        "error",
        "Failed to fetch blog posts from online sources"
      );
    } finally {
      setFetchingBlogs(false);
    }
  };

  const handleDeleteBlogPost = async (postId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await blogApi.delete(postId);
      showNotification("success", "Blog post deleted successfully");
      await loadBlogPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      showNotification("error", "Failed to delete blog post");
    }
  };

  // Login Screen View (Using Real Auth)
  if (!user || user.role !== "admin") {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-10 pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300 relative z-10 border border-white/20 dark:border-gray-700">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <Shield className="h-14 w-14 text-white mx-auto mb-3 drop-shadow-md" />
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Strictly Admin
              </h2>
              <p className="text-emerald-50 text-sm mt-1 font-medium tracking-wide uppercase opacity-90">
                Authorized Access Only
              </p>
            </div>
          </div>

          <div className="p-8 pt-10">
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {language === "bn" ? "অ্যাডমিন ইমেইল" : "Admin Email"}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm outline-none"
                    placeholder="admin@ecotrack.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {language === "bn" ? "সিকিউরিটি কী" : "Security Key"}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoggingIn ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {language === "bn" ? "প্রবেশ করুন" : "Authenticate"}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "overview" as Tab,
      label: language === "bn" ? "সারসংক্ষেপ" : "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "quiz" as Tab,
      label: language === "bn" ? "কুইজ ব্যবস্থাপনা" : "Quiz Management",
      icon: HelpCircle,
    },
    {
      id: "blog" as Tab,
      label: language === "bn" ? "ব্লগ পোস্ট" : "Blog Posts",
      icon: FileText,
    },
    {
      id: "community" as Tab,
      label: language === "bn" ? "কমিউনিটি" : "Community",
      icon: MessageSquare,
    },
    {
      id: "challenges" as Tab,
      label: language === "bn" ? "চ্যালেঞ্জ" : "Challenges",
      icon: Target,
    },
    {
      id: "users" as Tab,
      label: language === "bn" ? "ব্যবহারকারী" : "Users",
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {language === "bn"
              ? "অ্যাডমিন অ্যাক্সেস যাচাই করা হচ্ছে..."
              : "Verifying admin access..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="h-10 w-10 text-emerald-600" />
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
                {language === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin Dashboard"}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {language === "bn"
                ? "ইকো ট্র্যাক বাংলাদেশের সকল দিক পরিচালনা করুন"
                : "Manage all aspects of Eco Track Bangladesh"}
            </p>
          </div>
          {/* Logout Button */}
          <button
            onClick={async () => {
              // We don't have a direct signOut exposed from useAuth in the component in my previous edit, but it is available.
              // But actually, we need to import it properly.
              // For now, let's refresh page or simple reload which clears context if needed or assume user wants to just logout
              // Actually signOut IS exposed in context.
              // I will access it from context.
              // Wait, I destructured only user and signIn above. Let me fix that.
              window.location.href = "/";
            }}
            className="self-start md:self-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Home
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
            <div className="flex flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "text-emerald-600 border-b-2 border-emerald-600 bg-white dark:bg-gray-800 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}>
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">
                        {stats.totalUsers}
                      </span>
                    </div>
                    <p className="text-blue-100 font-medium">
                      {language === "bn" ? "মোট ব্যবহারকারী" : "Total Users"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <HelpCircle className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">
                        {stats.totalQuizAttempts}
                      </span>
                    </div>
                    <p className="text-emerald-100 font-medium">
                      {language === "bn" ? "কুইজ প্রচেষ্টা" : "Quiz Attempts"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">
                        {stats.totalBlogPosts}
                      </span>
                    </div>
                    <p className="text-purple-100 font-medium">
                      {language === "bn" ? "ব্লগ পোস্ট" : "Blog Posts"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">
                        {stats.totalChallenges}
                      </span>
                    </div>
                    <p className="text-teal-100 font-medium">
                      {language === "bn"
                        ? "দৈনিক চ্যালেঞ্জ"
                        : "Daily Challenges"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">
                        {stats.activeCommunityPosts}
                      </span>
                    </div>
                    <p className="text-pink-100 font-medium">
                      {language === "bn" ? "কমিউনিটি পোস্ট" : "Community Posts"}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-start space-x-4">
                    <Settings className="h-8 w-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {language === "bn"
                          ? "অ্যাডমিন বৈশিষ্ট্য"
                          : "Admin Features"}
                      </h3>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          <span>
                            {language === "bn"
                              ? "কুইজ প্রশ্ন ও উত্তর পরিচালনা"
                              : "Manage quiz questions and answers"}
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          <span>
                            {language === "bn"
                              ? "কমিউনিটি কন্টেন্ট দেখুন ও মডারেট করুন"
                              : "View and moderate community content"}
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          <span>
                            {language === "bn"
                              ? "ব্যবহারকারীর কার্যকলাপ পর্যবেক্ষণ করুন"
                              : "Monitor user activity and engagement"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quiz" && <AdminQuizManager />}

            {activeTab === "blog" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {language === "bn"
                      ? "ব্লগ পোস্ট ব্যবস্থাপনা"
                      : "Blog Posts Management"}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleFetchBlogPosts}
                      disabled={fetchingBlogs}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer">
                      {fetchingBlogs ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>
                            {language === "bn" ? "আনা হচ্ছে..." : "Fetching..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          <span>
                            {language === "bn"
                              ? "অনলাইন থেকে আনুন"
                              : "Fetch from Online"}
                          </span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={loadBlogPosts}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm cursor-pointer">
                      {language === "bn" ? "রিফ্রেশ" : "Refresh"}
                    </button>
                  </div>
                </div>

                {blogLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-emerald-600"></div>
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center text-gray-600 dark:text-gray-300">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl mb-4">
                      {language === "bn"
                        ? "কোনো ব্লগ পোস্ট পাওয়া যায়নি।"
                        : "No blog posts found."}
                    </p>
                    <p className="text-sm mb-4">
                      {language === "bn"
                        ? 'পরিবেশ বিষয়ক আর্টিকেল আমদানি করতে "অনলাইন থেকে আনুন" ক্লিক করুন।'
                        : 'Click "Fetch from Online" to import environmental articles.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {blogPosts.map((post) => (
                      <div
                        key={post._id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 transition-colors">
                                {post.title}
                              </h3>
                              {post.isExternal && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                  External
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <span className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{post.author}</span>
                              </span>
                              <span>
                                {new Date(
                                  post.publishedAt
                                ).toLocaleDateString()}
                              </span>
                              {post.sourceName && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  Source: {post.sourceName}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                              {post.content.substring(0, 200)}...
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteBlogPost(post._id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Delete blog post">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "community" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {language === "bn"
                      ? "কমিউনিটি পোস্ট ব্যবস্থাপনা"
                      : "Community Posts Management"}
                  </h2>
                  <button
                    onClick={loadCommunityPosts}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm cursor-pointer ml-auto">
                    {language === "bn" ? "রিফ্রেশ" : "Refresh"}
                  </button>
                </div>

                {communityLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-emerald-600"></div>
                  </div>
                ) : communityPosts.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center text-gray-600 dark:text-gray-300">
                    {language === "bn"
                      ? "কোনো কমিউনিটি পোস্ট পাওয়া যায়নি।"
                      : "No community posts found."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {communityPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                  {post.profiles.full_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                  {post.profiles.full_name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {post.profiles.email}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3 pl-13">
                              {post.content}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 pl-13">
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{post.likes} likes</span>
                              </div>
                              <span>
                                {new Date(post.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Delete post">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {language === "bn"
                      ? "ব্যবহারকারী ব্যবস্থাপনা"
                      : "User Management"}
                  </h2>
                  <button
                    onClick={() => setShowCreateUserModal(true)}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {language === "bn" ? "নতুন ব্যবহারকারী" : "New User/Admin"}
                  </button>
                </div>

                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-emerald-600"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center text-gray-600 dark:text-gray-300">
                    {language === "bn"
                      ? "কোনো ব্যবহারকারী পাওয়া যায়নি।"
                      : "No users found."}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {language === "bn" ? "নাম" : "Name"}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {language === "bn" ? "ইমেইল" : "Email"}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {language === "bn" ? "ভূমিকা" : "Role"}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {language === "bn" ? "যোগদান" : "Joined"}
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {language === "bn" ? "অ্যাকশন" : "Actions"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {users.map((u) => (
                            <tr
                              key={u._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {u.fullName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {u.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    u.role === "admin"
                                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200"
                                      : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200"
                                  }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <select
                                  value={u.role}
                                  onChange={(e) =>
                                    handleChangeUserRole(
                                      u._id,
                                      e.target.value as "user" | "admin"
                                    )
                                  }
                                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                                  disabled={user?.id === u._id}
                                  title={
                                    user?.id === u._id
                                      ? "You cannot change your own role"
                                      : "Change user role"
                                  }>
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {usersTotalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <button
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                      disabled={usersPage === 1}>
                      {language === "bn" ? "আগের" : "Previous"}
                    </button>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {language === "bn"
                        ? `পৃষ্ঠা ${usersPage} / ${usersTotalPages}`
                        : `Page ${usersPage} of ${usersTotalPages}`}
                    </span>
                    <button
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() =>
                        setUsersPage((p) => Math.min(usersTotalPages, p + 1))
                      }
                      disabled={usersPage === usersTotalPages}>
                      {language === "bn" ? "পরের" : "Next"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Create User Modal */}
            {showCreateUserModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      Create New Account
                    </h3>
                    <button
                      onClick={() => setShowCreateUserModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.fullName}
                        onChange={(e) =>
                          setNewUser({ ...newUser, fullName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        placeholder="••••••••"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            role: e.target.value as "user" | "admin",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCreateUserModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={creatingUser}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                        {creatingUser ? "Creating..." : "Create Account"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab !== "overview" &&
              activeTab !== "quiz" &&
              activeTab !== "users" &&
              activeTab !== "community" &&
              activeTab !== "blog" && (
                <div className="text-center py-12">
                  <div className="inline-block p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
                    <Settings className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {tabs.find((t) => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {language === "bn"
                      ? "ম্যানেজমেন্ট ইন্টারফেস শীঘ্রই আসছে"
                      : "Management interface coming soon"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === "bn"
                      ? "এই বিভাগটি ডেভেলপমেন্টের অধীনে এবং পরবর্তী আপডেটে উপলব্ধ হবে"
                      : "This section is under development and will be available in the next update"}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
