import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AppProvider } from "./contexts/AppContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Quiz } from "./pages/Quiz";
import { Calculator } from "./pages/Calculator";
import { Tips } from "./pages/Tips";
import { Challenges } from "./pages/Challenges";
import { Dashboard } from "./pages/Dashboard";
import { Community } from "./pages/Community";
import { Blog } from "./pages/Blog";
import { Map } from "./pages/Map";
import { Profile } from "./pages/Profile";
import { Leaderboard } from "./pages/Leaderboard";
import { Admin } from "./pages/Admin";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppProvider>
              <Router>
                <ScrollToTop />
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route
                      path="/quiz"
                      element={
                        <ProtectedRoute>
                          <Quiz />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/calculator"
                      element={
                        <ProtectedRoute>
                          <Calculator />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/tips" element={<Tips />} />
                    <Route
                      path="/challenges"
                      element={
                        <ProtectedRoute>
                          <Challenges />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/community"
                      element={
                        <ProtectedRoute>
                          <Community />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/map" element={<Map />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/admin" element={<Admin />} />
                  </Routes>
                  <Footer />
                </div>
              </Router>
            </AppProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
