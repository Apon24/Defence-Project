import { Link } from "react-router-dom";
import {
  Leaf,
  Calculator,
  BookOpen,
  Trophy,
  Users,
  Map,
  TreePine,
  Target,
  BarChart3,
  Lightbulb,
  Quote,
  ArrowRight,
  Sprout,
  Recycle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export const Home = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Leaf className="h-24 w-24 text-green-400 animate-pulse drop-shadow-lg" />
              {/* Bangladesh flag colors accent */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            {t("home.hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8 animate-slide-up">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              to="/calculator"
              className="px-8 py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg">
              {t("home.hero.cta1")}
            </Link>
            <Link
              to="/quiz"
              className="px-8 py-4 bg-white text-green-600 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg">
              {t("home.hero.cta2")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            {t("home.why.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {t("home.why.track.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.why.track.desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {t("home.why.challenges.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.why.challenges.desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {t("home.why.community.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.why.community.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            {t("home.impact.title")}
          </h2>
          <p className="text-center text-emerald-100 mb-12 max-w-2xl mx-auto">
            {t("home.impact.subtitle")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-green-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TreePine className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">১০,০০০+</p>
              <p className="text-emerald-200 text-sm">
                {t("home.impact.trees")}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">৫০,০০০+</p>
              <p className="text-emerald-200 text-sm">{t("home.impact.co2")}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-yellow-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">৫,০০০+</p>
              <p className="text-emerald-200 text-sm">
                {t("home.impact.members")}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-red-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-7 w-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">২৫,০০০+</p>
              <p className="text-emerald-200 text-sm">
                {t("home.impact.challenges")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
            {t("home.howItWorks.title")}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            {t("home.howItWorks.subtitle")}
          </p>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                icon: Calculator,
                title: t("home.howItWorks.calculate"),
                desc: t("home.howItWorks.calculate.desc"),
                color: "green",
              },
              {
                icon: Target,
                title: t("home.howItWorks.challenge"),
                desc: t("home.howItWorks.challenge.desc"),
                color: "yellow",
              },
              {
                icon: BookOpen,
                title: t("home.howItWorks.learn"),
                desc: t("home.howItWorks.learn.desc"),
                color: "blue",
              },
              {
                icon: Users,
                title: t("home.howItWorks.connect"),
                desc: t("home.howItWorks.connect.desc"),
                color: "purple",
              },
              {
                icon: BarChart3,
                title: t("home.howItWorks.track"),
                desc: t("home.howItWorks.track.desc"),
                color: "red",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <div
                    className={`bg-${step.color}-100 dark:bg-${step.color}-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <step.icon
                      className={`h-6 w-6 text-${step.color}-600 dark:text-${step.color}-400`}
                    />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      {language === "bn"
                        ? ["১", "২", "৩", "৪", "৫"][index]
                        : index + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.desc}
                  </p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Challenges Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {t("home.challenges.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.challenges.subtitle")}
              </p>
            </div>
            <Link
              to="/challenges"
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105">
              <span>{t("home.challenges.viewAll")}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: t("home.challenges.plasticFree"),
                difficulty: t("home.difficulty.easy"),
                desc: t("home.challenges.plasticFree.desc"),
                icon: Recycle,
                color: "green",
              },
              {
                title: t("home.challenges.greenCommute"),
                difficulty: t("home.difficulty.medium"),
                desc: t("home.challenges.greenCommute.desc"),
                icon: Sprout,
                color: "yellow",
              },
              {
                title: t("home.challenges.zeroWaste"),
                difficulty: t("home.difficulty.hard"),
                desc: t("home.challenges.zeroWaste.desc"),
                icon: Lightbulb,
                color: "red",
              },
            ].map((challenge, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-green-500 group">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`bg-${challenge.color}-100 dark:bg-${challenge.color}-900 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <challenge.icon
                      className={`h-7 w-7 text-${challenge.color}-600 dark:text-${challenge.color}-400`}
                    />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      challenge.difficulty === t("home.difficulty.easy")
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : challenge.difficulty === t("home.difficulty.medium")
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {challenge.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {challenge.desc}
                </p>
                <Link
                  to="/challenges"
                  className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors">
                  <span>{t("home.challenges.start")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="md:hidden mt-6 text-center">
            <Link
              to="/challenges"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all">
              <span>{t("home.challenges.viewAll")}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
            {t("home.features.title")}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            {t("home.features.subtitle")}
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                icon: Calculator,
                title: t("home.features.calculator"),
                link: "/calculator",
                color: "green",
              },
              {
                icon: BookOpen,
                title: t("home.features.quiz"),
                link: "/quiz",
                color: "blue",
              },
              {
                icon: Trophy,
                title: t("home.features.challenges"),
                link: "/challenges",
                color: "yellow",
              },
              {
                icon: Map,
                title: t("home.features.map"),
                link: "/map",
                color: "red",
              },
              {
                icon: TreePine,
                title: t("home.features.treePlanting"),
                link: "/map",
                color: "emerald",
              },
              {
                icon: BarChart3,
                title: t("home.features.dashboard"),
                link: "/dashboard",
                color: "purple",
              },
            ].map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div
                  className={`bg-${feature.color}-100 dark:bg-${feature.color}-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon
                    className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`}
                  />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                  {feature.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
            {t("home.testimonials.title")}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            {t("home.testimonials.subtitle")}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  language === "bn"
                    ? "ইকো ট্র্যাক আমাকে মাত্র ৩ মাসে আমার কার্বন পদচিহ্ন ৪০% কমাতে সাহায্য করেছে। দৈনিক চ্যালেঞ্জগুলো টেকসই জীবনযাপনকে মজাদার করে তুলেছে!"
                    : "Eco Track helped me reduce my carbon footprint by 40% in just 3 months. The daily challenges made sustainability fun!",
                name: language === "bn" ? "রহিম আহমেদ" : "Rahim Ahmed",
                location: language === "bn" ? "ঢাকা" : "Dhaka",
                saved: language === "bn" ? "১২০ কেজি CO₂" : "120 kg CO₂",
              },
              {
                quote:
                  language === "bn"
                    ? "গাছ লাগানো ফিচারটি আমাকে সত্যিকারের প্রভাবের সাথে সংযুক্ত করেছে। আমি সুন্দরবন বাফার জোনে ৫০টি গাছ লাগিয়েছি।"
                    : "The tree planting feature connects me with real impact. I've virtually planted 50 trees in the Sundarbans buffer zone.",
                name: language === "bn" ? "ফাতিমা বেগম" : "Fatima Begum",
                location: language === "bn" ? "চট্টগ্রাম" : "Chittagong",
                saved: language === "bn" ? "৮৫ কেজি CO₂" : "85 kg CO₂",
              },
              {
                quote:
                  language === "bn"
                    ? "একজন ছাত্র হিসেবে, কুইজগুলো আমাকে পরিবেশ সম্পর্কে অনেক কিছু শিখিয়েছে। এখন আমি আমার পরিবারকে টেকসই অভ্যাস শেখাই।"
                    : "As a student, the quizzes taught me so much about our environment. Now I teach my family sustainable practices.",
                name: language === "bn" ? "করিম হাসান" : "Karim Hassan",
                location: language === "bn" ? "সিলেট" : "Sylhet",
                saved: language === "bn" ? "৯৫ কেজি CO₂" : "95 kg CO₂",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                <Quote className="h-10 w-10 text-green-200 dark:text-green-800 absolute top-4 left-4" />
                <div className="pt-8">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-green-700 dark:text-green-300">
                        {testimonial.saved}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                {t("home.bangladesh.title")}
              </h2>
              <p className="text-green-50 text-lg mb-6">
                {t("home.bangladesh.desc")}
              </p>
              <ul className="space-y-3 text-green-50">
                <li className="flex items-start">
                  <span className="text-2xl mr-2">🌊</span>
                  <span>{t("home.bangladesh.coastal")}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">♻️</span>
                  <span>{t("home.bangladesh.plastic")}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">🌡️</span>
                  <span>{t("home.bangladesh.temperature")}</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/blog"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-soft-lg group">
                <BookOpen className="h-12 w-12 text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {t("home.bangladesh.readStories")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("home.bangladesh.localIssues")}
                </p>
              </Link>

              <Link
                to="/map"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-soft-lg group">
                <Map className="h-12 w-12 text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {t("home.bangladesh.exploreMap")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("home.bangladesh.findSpots")}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t("home.cta.subtitle")}
          </p>
          <Link
            to="/challenges"
            className="inline-block px-10 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg">
            {t("home.cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
};
