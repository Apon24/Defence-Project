import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { quizApi, carbonApi, challengesApi } from "../lib/api";
import { useNotification } from "../contexts/NotificationContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  Award,
  Leaf,
  Target,
  Download,
  Globe,
  Zap,
  Calendar,
  Activity,
  BarChart3,
  PieChartIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface QuizScore {
  score: number;
  total_questions: number;
  completed_at: string;
}

interface CarbonFootprint {
  totalCo2Kg: number;
  category: string;
  calculatedAt: string;
  electricityKwh?: number;
  transportationKm?: number;
  wasteKg?: number;
}

interface DailyChallenge {
  completed: boolean;
  challengeDate: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [carbonFootprints, setCarbonFootprints] = useState<CarbonFootprint[]>(
    []
  );
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<"line" | "area" | "composed">(
    "area"
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [quizData, carbonData, challengeData] = await Promise.all([
        quizApi.getAttempts(10),
        carbonApi.getAll(10),
        challengesApi.getAll(30),
      ]);

      if (quizData.data) setQuizScores(quizData.data);
      if (carbonData.data) setCarbonFootprints(carbonData.data);
      if (challengeData.data) setChallenges(challengeData.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    try {
      const csvContent = [
        [
          "Date",
          "CO2 (kg)",
          "Category",
          "Electricity (kWh)",
          "Transport (km)",
          "Waste (kg)",
        ],
        ...carbonFootprints.map((cf) => [
          new Date(cf.calculatedAt).toLocaleDateString(),
          cf.totalCo2Kg,
          cf.category,
          cf.electricityKwh || 0,
          cf.transportationKm || 0,
          cf.wasteKg || 0,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carbon-footprint-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      showNotification("success", "Data exported successfully!");
    } catch (error) {
      showNotification("error", "Failed to export data");
      console.error("Export error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          {language === "bn"
            ? "ড্যাশবোর্ড লোড হচ্ছে..."
            : "Loading dashboard..."}
        </div>
      </div>
    );
  }

  const averageQuizScore =
    quizScores.length > 0
      ? Math.round(
          quizScores.reduce(
            (acc, q) => acc + (q.score / q.total_questions) * 100,
            0
          ) / quizScores.length
        )
      : 0;

  const averageCarbonFootprint =
    carbonFootprints.length > 0
      ? (
          carbonFootprints.reduce((acc, c) => acc + c.totalCo2Kg, 0) /
          carbonFootprints.length
        ).toFixed(2)
      : 0;

  const challengeCompletionRate =
    challenges.length > 0
      ? Math.round(
          (challenges.filter((c) => c.completed).length / challenges.length) *
            100
        )
      : 0;

  const quizTrendData = quizScores
    .slice(0, 5)
    .reverse()
    .map((qs, index) => ({
      name: `Quiz ${index + 1}`,
      score: Math.round((qs.score / qs.total_questions) * 100),
    }));

  const carbonCategoryData = carbonFootprints.reduce((acc: any[], cf) => {
    const existing = acc.find((item) => item.name === cf.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: cf.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ["#10b981", "#fbbf24", "#ef4444", "#3b82f6", "#8b5cf6"];

  // Prepare radar chart data for environmental impact
  const radarData = [
    {
      subject: language === "bn" ? "বিদ্যুৎ" : "Electricity",
      value:
        carbonFootprints.length > 0
          ? Math.min(
              100,
              carbonFootprints.reduce(
                (acc, cf) => acc + (cf.electricityKwh || 0),
                0
              ) / carbonFootprints.length
            )
          : 0,
      fullMark: 100,
    },
    {
      subject: language === "bn" ? "যানবাহন" : "Transport",
      value:
        carbonFootprints.length > 0
          ? Math.min(
              100,
              carbonFootprints.reduce(
                (acc, cf) => acc + (cf.transportationKm || 0),
                0
              ) / carbonFootprints.length
            )
          : 0,
      fullMark: 100,
    },
    {
      subject: language === "bn" ? "বর্জ্য" : "Waste",
      value:
        carbonFootprints.length > 0
          ? Math.min(
              100,
              carbonFootprints.reduce(
                (acc, cf) => acc + (cf.wasteKg || 0) * 10,
                0
              ) / carbonFootprints.length
            )
          : 0,
      fullMark: 100,
    },
    {
      subject: language === "bn" ? "কুইজ" : "Quiz",
      value: averageQuizScore,
      fullMark: 100,
    },
    {
      subject: language === "bn" ? "চ্যালেঞ্জ" : "Challenges",
      value: challengeCompletionRate,
      fullMark: 100,
    },
  ];

  // Weekly progress data
  const weeklyProgressData = carbonFootprints
    .slice(0, 7)
    .reverse()
    .map((cf) => {
      const dayNames =
        language === "bn"
          ? ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"]
          : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const date = new Date(cf.calculatedAt);
      return {
        name: dayNames[date.getDay()],
        co2: cf.totalCo2Kg,
        electricity: cf.electricityKwh || 0,
        transport: cf.transportationKm || 0,
        waste: (cf.wasteKg || 0) * 10,
      };
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Language Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-green-100 dark:border-green-900">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                    {t("dashboard.title")}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {language === "bn"
                      ? `স্বাগতম, ${
                          (user as any)?.name ||
                          (user as any)?.user_metadata?.name ||
                          "ব্যবহারকারী"
                        }! আপনার পরিবেশগত প্রভাব দেখুন।`
                      : `Welcome, ${
                          (user as any)?.name ||
                          (user as any)?.user_metadata?.name ||
                          "User"
                        }! Track your environmental impact.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg">
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">
                    {language === "bn" ? "English" : "বাংলা"}
                  </span>
                </motion.button>

                {carbonFootprints.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportData}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg">
                    <Download className="h-5 w-5" />
                    <span className="font-medium">
                      {language === "bn" ? "এক্সপোর্ট" : "Export"}
                    </span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards with Icons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border-l-4 border-yellow-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === "bn" ? "গড় কুইজ স্কোর" : "Avg Quiz Score"}
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {averageQuizScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${averageQuizScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border-l-4 border-green-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === "bn" ? "গড় CO₂ (কেজি)" : "Avg CO₂ (kg)"}
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {averageCarbonFootprint}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {language === "bn" ? "প্রতিদিনের গড়" : "Daily average"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border-l-4 border-blue-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === "bn" ? "চ্যালেঞ্জ সম্পন্ন" : "Challenge Rate"}
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {challengeCompletionRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${challengeCompletionRate}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border-l-4 border-purple-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === "bn" ? "মোট কুইজ" : "Quizzes Taken"}
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {quizScores.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {language === "bn" ? "সম্পূর্ণ কুইজ" : "Completed quizzes"}
            </p>
          </motion.div>
        </div>

        {/* Chart Type Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
            {language === "bn" ? "চার্ট ধরন:" : "Chart Type:"}
          </span>
          {[
            {
              key: "area",
              icon: BarChart3,
              label: language === "bn" ? "এরিয়া" : "Area",
            },
            {
              key: "line",
              icon: Activity,
              label: language === "bn" ? "লাইন" : "Line",
            },
            {
              key: "composed",
              icon: PieChartIcon,
              label: language === "bn" ? "কম্বো" : "Combo",
            },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() =>
                setActiveChart(key as "line" | "area" | "composed")
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeChart === key
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}>
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Main Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Carbon Footprint Trend - Dynamic Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-500" />
                {language === "bn"
                  ? "কার্বন ফুটপ্রিন্ট প্রবণতা"
                  : "Carbon Footprint Trend"}
              </h2>
            </div>
            {weeklyProgressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                {activeChart === "area" ? (
                  <AreaChart data={weeklyProgressData}>
                    <defs>
                      <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="co2"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorCo2)"
                      name="CO₂ (kg)"
                    />
                  </AreaChart>
                ) : activeChart === "line" ? (
                  <LineChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="co2"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2 }}
                      name="CO₂ (kg)"
                    />
                  </LineChart>
                ) : (
                  <ComposedChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="electricity"
                      fill="#3b82f6"
                      name={language === "bn" ? "বিদ্যুৎ" : "Electricity"}
                    />
                    <Bar
                      dataKey="transport"
                      fill="#f59e0b"
                      name={language === "bn" ? "যানবাহন" : "Transport"}
                    />
                    <Line
                      type="monotone"
                      dataKey="co2"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="CO₂"
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                <Leaf className="h-12 w-12 text-gray-300 mb-3" />
                <p>
                  {language === "bn"
                    ? "কার্বন ফুটপ্রিন্ট গণনা করুন প্রবণতা দেখতে!"
                    : "Calculate your footprint to see trends!"}
                </p>
              </div>
            )}
          </motion.div>

          {/* Quiz Performance Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                {language === "bn" ? "কুইজ পারফরম্যান্স" : "Quiz Performance"}
              </h2>
            </div>
            {quizTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizTrendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="url(#colorScore)"
                    radius={[8, 8, 0, 0]}
                    name={language === "bn" ? "স্কোর %" : "Score %"}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                <Award className="h-12 w-12 text-gray-300 mb-3" />
                <p>
                  {language === "bn"
                    ? "কুইজ দিন আপনার স্কোর দেখতে!"
                    : "Take a quiz to see your scores!"}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Second Row - Radar & Pie Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Radar Chart - Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              {language === "bn"
                ? "পরিবেশগত প্রোফাইল"
                : "Environmental Profile"}
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#9ca3af" }}
                />
                <Radar
                  name={language === "bn" ? "আপনার প্রভাব" : "Your Impact"}
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart - Carbon Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-orange-500" />
              {language === "bn" ? "কার্বন বিভাগ" : "Carbon Categories"}
            </h2>
            {carbonCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={carbonCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value">
                    {carbonCategoryData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-gray-500">
                <PieChartIcon className="h-12 w-12 text-gray-300 mb-3" />
                <p>{language === "bn" ? "ডাটা নেই" : "No data"}</p>
              </div>
            )}
          </motion.div>

          {/* Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              {language === "bn" ? "প্রভাব সারাংশ" : "Impact Summary"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "bn" ? "কার্বন গণনা" : "Carbon Calculations"}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {carbonFootprints.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "bn"
                      ? "সম্পন্ন চ্যালেঞ্জ"
                      : "Challenges Done"}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {challenges.filter((c) => c.completed).length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "bn" ? "সক্রিয় দিন" : "Active Days"}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {
                      new Set([
                        ...carbonFootprints.map((c) =>
                          new Date(c.calculatedAt).toDateString()
                        ),
                        ...challenges
                          .filter((c) => c.completed)
                          .map((c) => new Date(c.challengeDate).toDateString()),
                      ]).size
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Empty State CTA */}
        {quizScores.length === 0 && carbonFootprints.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white shadow-2xl">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4">
              {language === "bn"
                ? "আপনার ইকো যাত্রা শুরু করুন!"
                : "Start Your Eco Journey!"}
            </h3>
            <p className="text-green-100 mb-8 max-w-lg mx-auto">
              {language === "bn"
                ? "কুইজ নিন, আপনার কার্বন ফুটপ্রিন্ট গণনা করুন, এবং দৈনিক চ্যালেঞ্জ সম্পন্ন করুন আপনার অগ্রগতি দেখতে।"
                : "Take quizzes, calculate your carbon footprint, and complete daily challenges to see your progress here."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/quiz")}
                className="px-8 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg flex items-center gap-2">
                <Award className="h-5 w-5" />
                {language === "bn" ? "কুইজ নিন" : "Take a Quiz"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/calculator")}
                className="px-8 py-3 bg-white/20 text-white border-2 border-white rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                {language === "bn" ? "ফুটপ্রিন্ট গণনা" : "Calculate Footprint"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
