import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { quizApi, carbonApi, challengesApi } from '../lib/api';
import { useNotification } from '../contexts/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Award, Leaf, Target, Download } from 'lucide-react';

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
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [carbonFootprints, setCarbonFootprints] = useState<CarbonFootprint[]>([]);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
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
        challengesApi.getAll(30)
      ]);

      if (quizData.data) setQuizScores(quizData.data);
      if (carbonData.data) setCarbonFootprints(carbonData.data);
      if (challengeData.data) setChallenges(challengeData.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    try {
      const csvContent = [
        ['Date', 'CO2 (kg)', 'Category', 'Electricity (kWh)', 'Transport (km)', 'Waste (kg)'],
        ...carbonFootprints.map(cf => [
          new Date(cf.calculatedAt).toLocaleDateString(),
          cf.totalCo2Kg,
          cf.category,
          cf.electricityKwh || 0,
          cf.transportationKm || 0,
          cf.wasteKg || 0
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carbon-footprint-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      showNotification('success', 'Data exported successfully!');
    } catch (error) {
      showNotification('error', 'Failed to export data');
      console.error('Export error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          {language === 'bn' ? 'ড্যাশবোর্ড লোড হচ্ছে...' : 'Loading dashboard...'}
        </div>
      </div>
    );
  }

  const averageQuizScore = quizScores.length > 0
    ? Math.round((quizScores.reduce((acc, q) => acc + (q.score / q.total_questions) * 100, 0) / quizScores.length))
    : 0;

  const averageCarbonFootprint = carbonFootprints.length > 0
    ? (carbonFootprints.reduce((acc, c) => acc + c.totalCo2Kg, 0) / carbonFootprints.length).toFixed(2)
    : 0;

  const challengeCompletionRate = challenges.length > 0
    ? Math.round((challenges.filter(c => c.completed).length / challenges.length) * 100)
    : 0;

  const carbonTrendData = carbonFootprints.slice(0, 7).reverse().map((cf, index) => ({
    name: `Day ${index + 1}`,
    co2: cf.totalCo2Kg,
  }));

  const quizTrendData = quizScores.slice(0, 5).reverse().map((qs, index) => ({
    name: `Quiz ${index + 1}`,
    score: Math.round((qs.score / qs.total_questions) * 100),
  }));

  const carbonCategoryData = carbonFootprints.reduce((acc: any[], cf) => {
    const existing = acc.find(item => item.name === cf.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: cf.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#10b981', '#fbbf24', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-center justify-between animate-fade-in-slow">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{t('dashboard.title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('dashboard.subtitle')}</p>
          </div>
          {carbonFootprints.length > 0 && (
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>{language === 'bn' ? 'ডাটা এক্সপোর্ট করুন' : 'Export Data'}</span>
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-yellow-500" />
              <span className="text-3xl font-bold text-gray-800 dark:text-white">{averageQuizScore}%</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">
              {language === 'bn' ? 'গড় কুইজ স্কোর' : 'Avg Quiz Score'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-800 dark:text-white">{averageCarbonFootprint}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">
              {language === 'bn' ? 'গড় CO₂ (কেজি/দিন)' : 'Avg CO₂ (kg/day)'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-800 dark:text-white">{challengeCompletionRate}%</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">
              {language === 'bn' ? 'চ্যালেঞ্জ সম্পন্ন' : 'Challenge Rate'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <span className="text-3xl font-bold text-gray-800 dark:text-white">{quizScores.length}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">
              {language === 'bn' ? 'মোট কুইজ' : 'Quizzes Taken'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {language === 'bn' ? 'কার্বন ফুটপ্রিন্ট প্রবণতা' : 'Carbon Footprint Trend'}
            </h2>
            {carbonTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={carbonTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={2} name="CO₂ (kg)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                {language === 'bn' 
                  ? 'এখনও কার্বন ফুটপ্রিন্ট ডাটা নেই। প্রবণতা দেখতে আপনার ফুটপ্রিন্ট গণনা করুন!' 
                  : 'No carbon footprint data yet. Calculate your footprint to see trends!'}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {language === 'bn' ? 'কুইজ পারফরম্যান্স' : 'Quiz Performance'}
            </h2>
            {quizTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name={language === 'bn' ? 'স্কোর %' : 'Score %'} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                {language === 'bn' 
                  ? 'এখনও কুইজ ডাটা নেই। আপনার পারফরম্যান্স দেখতে একটি কুইজ নিন!' 
                  : 'No quiz data yet. Take a quiz to see your performance!'}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {language === 'bn' ? 'কার্বন প্রভাব বিভাগ' : 'Carbon Impact Categories'}
            </h2>
            {carbonCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={carbonCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {carbonCategoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                {language === 'bn' ? 'কোন ডাটা নেই' : 'No data available'}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {language === 'bn' ? 'আপনার প্রভাব' : 'Your Impact'}
            </h2>
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {language === 'bn' ? 'মোট সম্পন্ন কুইজ' : 'Total Quizzes Completed'}
                </p>
                <p className="text-3xl font-bold text-green-600">{quizScores.length}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {language === 'bn' ? 'কার্বন গণনা' : 'Carbon Calculations'}
                </p>
                <p className="text-3xl font-bold text-blue-600">{carbonFootprints.length}</p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {language === 'bn' ? 'সম্পন্ন চ্যালেঞ্জ' : 'Challenges Completed'}
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {challenges.filter(c => c.completed).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {quizScores.length === 0 && carbonFootprints.length === 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-600 to-red-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'bn' ? 'আপনার ইকো যাত্রা শুরু করুন!' : 'Start Your Eco Journey!'}
            </h3>
            <p className="text-green-50 mb-6">
              {language === 'bn' 
                ? 'কুইজ নিন, আপনার কার্বন ফুটপ্রিন্ট গণনা করুন, এবং দৈনিক চ্যালেঞ্জ সম্পন্ন করুন আপনার অগ্রগতি দেখতে।' 
                : 'Take quizzes, calculate your carbon footprint, and complete daily challenges to see your progress here.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/quiz')}
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                {language === 'bn' ? 'কুইজ নিন' : 'Take a Quiz'}
              </button>
              <button
                onClick={() => navigate('/calculator')}
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                {language === 'bn' ? 'ফুটপ্রিন্ট গণনা করুন' : 'Calculate Footprint'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
