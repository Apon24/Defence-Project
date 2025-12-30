import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { authApi } from "../lib/api";

export const Login = () => {
  const { t, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { signIn, signUp } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const authMode = localStorage.getItem("authMode");
    if (authMode === "signup") {
      setIsLogin(false);
      localStorage.removeItem("authMode");
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (
    password: string
  ): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Password must be at least 8 characters",
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one special character",
      };
    }
    return { valid: true };
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!isLogin && !fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isLogin) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message!;
      }
    }

    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await signIn(email, password);
        showNotification("success", t("login.welcomeBack"));
        navigate("/dashboard");
      } else {
        await signUp(email, password, fullName);
        showNotification(
          "success",
          "Account created! Please check your email for the verification code."
        );
        navigate("/verify-email", { state: { email } });
        setIsLogin(true);
        resetForm();
      }
    } catch (err: any) {
      let errorMessage = "An error occurred. Please try again.";

      if (err.message?.includes("Invalid credentials")) {
        errorMessage = "Invalid email or password";
      } else if (err.message?.includes("already exists")) {
        errorMessage = "An account with this email already exists";
      } else if (err.message) {
        errorMessage = err.message;
      }

      if (err.code === "UNVERIFIED_EMAIL") {
        showNotification("error", "Please verify your email first");
        navigate("/verify-email", { state: { email } });
        return;
      }

      setErrors({ form: errorMessage });
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "Please enter your email address" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authApi.forgotPassword(email);
      setShowOtpForm(true);
      showNotification("success", "OTP sent to your email");
    } catch (err: any) {
      setErrors({ form: "Failed to send OTP. Please try again." });
      showNotification("error", "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setErrors({ otp: "Please enter the 6-digit OTP" });
      return;
    }

    if (!newPassword) {
      setErrors({ newPassword: "New password is required" });
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setErrors({ newPassword: passwordValidation.message! });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrors({ confirmNewPassword: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authApi.resetPassword(email, otp, newPassword);
      setPasswordResetSent(true);
      setShowOtpForm(false);
      showNotification("success", "Password reset successful!");
    } catch (err: any) {
      setErrors({ form: err.message || "Failed to reset password" });
      showNotification("error", err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrors({});
    setShowForgotPassword(false);
    setPasswordResetSent(false);
    setShowOtpForm(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                  <Leaf className="h-12 w-12 text-white" />
                </div>
              </Link>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {passwordResetSent
                  ? "Password Reset Successful"
                  : showOtpForm
                  ? "Reset Your Password"
                  : t("forgotPassword.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {passwordResetSent
                  ? "You can now login with your new password"
                  : showOtpForm
                  ? `Enter the 6-digit OTP sent to ${email}`
                  : t("forgotPassword.subtitle")}
              </p>
            </div>

            {passwordResetSent ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="h-20 w-20 text-emerald-500" />
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      resetForm();
                      setIsLogin(true);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg">
                    Back to Login
                  </button>
                </div>
              </div>
            ) : showOtpForm ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {errors.form && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-500 rounded-xl flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 dark:text-red-200 text-sm">
                      {errors.form}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      setErrors({ ...errors, otp: "" });
                    }}
                    className={`w-full text-center text-2xl tracking-[1rem] font-bold py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.otp
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder="000000"
                  />
                  {errors.otp && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.otp}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrors({ ...errors, newPassword: "" });
                      }}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.newPassword
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.newPassword}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => {
                        setConfirmNewPassword(e.target.value);
                        setErrors({ ...errors, confirmNewPassword: "" });
                      }}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.confirmNewPassword
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmNewPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.confirmNewPassword}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtpForm(false)}
                  className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  Back
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                {errors.form && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-500 rounded-xl flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 dark:text-red-200 text-sm">
                      {errors.form}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.email
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {loading ? "Sending..." : "Send OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsLogin(true);
                  }}
                  className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  Back to Login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg transform hover:scale-110 transition-transform">
                <Leaf className="h-12 w-12 text-white" />
              </div>
            </Link>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              {isLogin
                ? language === "bn"
                  ? "স্বাগতম"
                  : "Welcome Back"
                : language === "bn"
                ? "ইকো ট্র্যাকে যোগ দিন"
                : "Join Eco Track"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {isLogin
                ? language === "bn"
                  ? "আপনার ইকো যাত্রা চালিয়ে যান"
                  : "Continue your eco journey"
                : language === "bn"
                ? "আজই আপনার টেকসই যাত্রা শুরু করুন"
                : "Start your sustainable journey today"}
            </p>
          </div>

          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-500 rounded-xl flex items-start space-x-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-200 text-sm">
                {errors.form}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("login.fullName")}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrors({ ...errors, fullName: "" });
                    }}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder={t("login.fullName.placeholder")}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("login.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.email
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                  } dark:bg-gray-700 dark:text-white`}
                  placeholder={t("login.email.placeholder")}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.password
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                  } dark:bg-gray-700 dark:text-white`}
                  placeholder={t("login.password.placeholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </p>
              )}
              {!isLogin && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {language === "bn"
                      ? "পাসওয়ার্ডে থাকতে হবে:"
                      : "Password must contain:"}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                        }`}></div>
                      <span
                        className={
                          password.length >= 8
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }>
                        {language === "bn"
                          ? "কমপক্ষে ৮টি অক্ষর"
                          : "At least 8 characters"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[A-Z]/.test(password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}></div>
                      <span
                        className={
                          /[A-Z]/.test(password)
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }>
                        {language === "bn"
                          ? "একটি বড় হাতের অক্ষর (A-Z)"
                          : "One uppercase letter (A-Z)"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[a-z]/.test(password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}></div>
                      <span
                        className={
                          /[a-z]/.test(password)
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }>
                        {language === "bn"
                          ? "একটি ছোট হাতের অক্ষর (a-z)"
                          : "One lowercase letter (a-z)"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}></div>
                      <span
                        className={
                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }>
                        {language === "bn"
                          ? "একটি বিশেষ অক্ষর (!@#$%^&*)"
                          : "One special character (!@#$%^&*)"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("login.confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: "" });
                    }}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 dark:border-gray-600 focus:border-emerald-500"
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder={
                      language === "bn"
                        ? "পাসওয়ার্ড নিশ্চিত করুন"
                        : "Confirm your password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors">
                  {t("login.forgotPassword")}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <span>
                {loading
                  ? isLogin
                    ? language === "bn"
                      ? "প্রবেশ করা হচ্ছে..."
                      : "Signing in..."
                    : language === "bn"
                    ? "একাউন্ট তৈরি হচ্ছে..."
                    : "Creating account..."
                  : isLogin
                  ? t("login.button")
                  : t("login.signup.button")}
              </span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {isLogin ? t("login.noAccount") : t("login.hasAccount")}
            </p>
            <button
              onClick={toggleMode}
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold text-lg transition-colors">
              {isLogin ? t("login.createAccount") : t("login.button")}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          {language === "bn"
            ? "চালিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের সেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হচ্ছেন"
            : "By continuing, you agree to our Terms of Service and Privacy Policy"}
        </p>
      </div>
    </div>
  );
};
