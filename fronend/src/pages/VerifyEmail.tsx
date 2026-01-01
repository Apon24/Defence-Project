import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authApi } from "../lib/api";
import { useNotification } from "../contexts/NotificationContext";
import { CheckCircle2, Loader2, Mail, RefreshCw } from "lucide-react";

export const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  useEffect(() => {
    let interval: any;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      showNotification("error", "Please enter both email and verification code");
      return;
    }

    setStatus("loading");
    setMessage("Verifying code...");

    try {
      await authApi.verifyEmail(email, code);
      setStatus("success");
      setMessage("Email verified successfully! Redirecting...");
      showNotification("success", "Email verified successfully!");
      
      setTimeout(() => {
        navigate("/dashboard");
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Failed to verify email");
      showNotification("error", error.message || "Verification failed");
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showNotification("error", "Email is missing");
      return;
    }

    setResending(true);
    try {
      await authApi.resendVerification(email);
      showNotification("success", "Verification code resent successfully");
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error: any) {
      showNotification("error", error.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <Mail className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            We've sent a 6-digit verification code to
            {email ? <span className="font-semibold block mt-1">{email}</span> : " your email address"}
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
            <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
              {message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            {!location.state?.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            {status === "error" && (
              <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
              {status === "loading" ? "Verifying..." : "Verify Email"}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || resending}
              className="w-full py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>
                {resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : "Resend Code"}
              </span>
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
