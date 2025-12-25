import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "bn" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Comprehensive translations for Bangla and English
export const translations: Record<Language, Record<string, string>> = {
  bn: {
    // App Name & Branding
    "app.name": "ইকো ট্র্যাক বাংলাদেশ",
    "app.tagline": "সবুজ বাংলাদেশ গড়ি, পরিবেশ বাঁচাই",

    // Navigation
    "nav.home": "হোম",
    "nav.learn": "শিখুন",
    "nav.tools": "টুলস",
    "nav.community": "কমিউনিটি",
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.tips": "পরামর্শ",
    "nav.blog": "ব্লগ",
    "nav.quiz": "কুইজ",
    "nav.calculator": "ক্যালকুলেটর",
    "nav.map": "ম্যাপ",
    "nav.leaderboard": "লিডারবোর্ড",
    "nav.challenges": "চ্যালেঞ্জ",
    "nav.profile": "প্রোফাইল",
    "nav.admin": "অ্যাডমিন",
    "nav.login": "লগইন",
    "nav.signup": "সাইন আপ",
    "nav.logout": "লগ আউট",

    // Home Page
    "home.hero.title": "ইকো ট্র্যাক বাংলাদেশ",
    "home.hero.subtitle":
      "আপনার কার্বন পদচিহ্ন ট্র্যাক করুন। টেকসই জীবনযাপন শুরু করুন। সবুজ বাংলাদেশ গড়ুন।",
    "home.hero.cta1": "আপনার প্রভাব গণনা করুন",
    "home.hero.cta2": "কুইজ দিন",

    "home.why.title": "কেন ইকো ট্র্যাক?",
    "home.why.track.title": "পদচিহ্ন ট্র্যাক করুন",
    "home.why.track.desc":
      "বিদ্যুৎ, যানবাহন এবং জীবনযাত্রার পছন্দ থেকে আপনার দৈনিক কার্বন নির্গমন গণনা করুন।",
    "home.why.challenges.title": "চ্যালেঞ্জ সম্পূর্ণ করুন",
    "home.why.challenges.desc":
      "দৈনিক পরিবেশবান্ধব চ্যালেঞ্জ নিন এবং ধাপে ধাপে টেকসই অভ্যাস গড়ুন।",
    "home.why.community.title": "কমিউনিটিতে যোগ দিন",
    "home.why.community.desc":
      "আইডিয়া শেয়ার করুন, অন্যদের কাছ থেকে শিখুন এবং বাংলাদেশের ইকো আন্দোলনের অংশ হন।",

    "home.impact.title": "আমাদের সামগ্রিক প্রভাব",
    "home.impact.subtitle":
      "একসাথে, আমরা বাংলাদেশের পরিবেশের জন্য সত্যিকারের পরিবর্তন আনছি",
    "home.impact.trees": "গাছ লাগানো হয়েছে",
    "home.impact.co2": "কেজি CO₂ হ্রাস",
    "home.impact.members": "সক্রিয় সদস্য",
    "home.impact.challenges": "চ্যালেঞ্জ সম্পূর্ণ",

    "home.howItWorks.title": "কীভাবে কাজ করে",
    "home.howItWorks.subtitle":
      "মাত্র কয়েকটি সহজ ধাপে আপনার টেকসই যাত্রা শুরু করুন",
    "home.howItWorks.calculate": "গণনা করুন",
    "home.howItWorks.calculate.desc": "আপনার কার্বন পদচিহ্ন পরিমাপ করুন",
    "home.howItWorks.challenge": "চ্যালেঞ্জ নিন",
    "home.howItWorks.challenge.desc": "দৈনিক ইকো কাজ করুন",
    "home.howItWorks.learn": "শিখুন",
    "home.howItWorks.learn.desc": "কুইজ দিন ও টিপস পড়ুন",
    "home.howItWorks.connect": "সংযুক্ত হন",
    "home.howItWorks.connect.desc": "কমিউনিটিতে যোগ দিন",
    "home.howItWorks.track": "ট্র্যাক করুন",
    "home.howItWorks.track.desc": "আপনার অগ্রগতি দেখুন",

    "home.challenges.title": "জনপ্রিয় চ্যালেঞ্জ",
    "home.challenges.subtitle":
      "এই জনপ্রিয় পরিবেশবান্ধব চ্যালেঞ্জ দিয়ে শুরু করুন",
    "home.challenges.viewAll": "সব দেখুন",
    "home.challenges.start": "চ্যালেঞ্জ শুরু করুন",
    "home.challenges.plasticFree": "প্লাস্টিক-মুক্ত দিন",
    "home.challenges.plasticFree.desc":
      "২৪ ঘণ্টা একবার ব্যবহারযোগ্য প্লাস্টিক এড়িয়ে চলুন",
    "home.challenges.greenCommute": "সবুজ যাতায়াত",
    "home.challenges.greenCommute.desc": "গণপরিবহন, সাইকেল বা হেঁটে অফিসে যান",
    "home.challenges.zeroWaste": "শূন্য খাদ্য অপচয়",
    "home.challenges.zeroWaste.desc":
      "খাবার পরিকল্পনা করুন এবং সব খাদ্য বর্জ্য কম্পোস্ট করুন",

    "home.difficulty.easy": "সহজ",
    "home.difficulty.medium": "মাঝারি",
    "home.difficulty.hard": "কঠিন",

    "home.features.title": "আপনার যা প্রয়োজন সব আছে",
    "home.features.subtitle":
      "আপনার পরিবেশগত প্রভাব ট্র্যাক, শেখা এবং উন্নত করার জন্য সম্পূর্ণ টুলস",
    "home.features.calculator": "কার্বন ক্যালকুলেটর",
    "home.features.quiz": "ইকো কুইজ",
    "home.features.challenges": "চ্যালেঞ্জ",
    "home.features.map": "ইকো ম্যাপ",
    "home.features.treePlanting": "গাছ লাগানো",
    "home.features.dashboard": "ড্যাশবোর্ড",

    "home.testimonials.title": "সাফল্যের গল্প",
    "home.testimonials.subtitle":
      "আমাদের কমিউনিটি সদস্যদের কাছ থেকে শুনুন যারা পরিবর্তন আনছেন",

    "home.bangladesh.title": "বাংলাদেশের আপনার পদক্ষেপ দরকার",
    "home.bangladesh.desc":
      "বিশ্বের সবচেয়ে জলবায়ু-ঝুঁকিপূর্ণ দেশগুলির মধ্যে একটি হিসেবে, বাংলাদেশ সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি, চরম আবহাওয়া এবং পরিবেশগত চ্যালেঞ্জের সম্মুখীন। প্রতিটি ছোট পদক্ষেপ গুরুত্বপূর্ণ।",
    "home.bangladesh.coastal": "উপকূলীয় জনগোষ্ঠী পানির উচ্চতা বৃদ্ধির ঝুঁকিতে",
    "home.bangladesh.plastic":
      "প্লাস্টিক দূষণ আমাদের নদীগুলোকে হুমকির মুখে ফেলছে",
    "home.bangladesh.temperature": "ক্রমবর্ধমান তাপমাত্রা কৃষিকে প্রভাবিত করছে",
    "home.bangladesh.readStories": "গল্প পড়ুন",
    "home.bangladesh.localIssues": "স্থানীয় সমস্যা সম্পর্কে জানুন",
    "home.bangladesh.exploreMap": "ম্যাপ দেখুন",
    "home.bangladesh.findSpots": "আশেপাশে ইকো স্পট খুঁজুন",

    "home.cta.title": "আজই আপনার ইকো যাত্রা শুরু করুন",
    "home.cta.subtitle":
      "হাজার হাজার বাংলাদেশির সাথে যোগ দিন যারা পরিবর্তন আনছেন, এক সময়ে একটি টেকসই পছন্দ।",
    "home.cta.button": "শুরু করুন",

    // Footer
    "footer.description":
      "বাংলাদেশি নাগরিকদের শিক্ষা, কর্ম এবং কমিউনিটি সম্পৃক্ততার মাধ্যমে টেকসই জীবনযাপন এবং কার্বন পদচিহ্ন কমাতে ক্ষমতায়ন করা।",
    "footer.quickLinks": "দ্রুত লিংক",
    "footer.resources": "রিসোর্স",
    "footer.connectWithUs": "আমাদের সাথে যুক্ত হন",
    "footer.newsletter": "নিউজলেটার",
    "footer.newsletter.desc": "সাপ্তাহিক ইকো টিপস আপনার ইনবক্সে পান",
    "footer.newsletter.placeholder": "আপনার ইমেইল",
    "footer.newsletter.button": "যোগ দিন",
    "footer.socialMedia":
      "দৈনিক ইকো টিপস, চ্যালেঞ্জ এবং কমিউনিটি আপডেটের জন্য সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করুন।",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    "footer.privacy": "গোপনীয়তা নীতি",
    "footer.terms": "সেবার শর্তাবলী",
    "footer.cookies": "কুকি নীতি",
    "footer.about": "আমাদের সম্পর্কে",
    "footer.madeWith": "সবুজ বাংলাদেশের জন্য ভালোবাসায় তৈরি",

    // Login Page
    "login.title": "স্বাগতম",
    "login.subtitle": "আপনার একাউন্টে প্রবেশ করুন",
    "login.email": "ইমেইল",
    "login.email.placeholder": "আপনার ইমেইল লিখুন",
    "login.password": "পাসওয়ার্ড",
    "login.password.placeholder": "আপনার পাসওয়ার্ড লিখুন",
    "login.confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
    "login.fullName": "পুরো নাম",
    "login.fullName.placeholder": "আপনার পুরো নাম লিখুন",
    "login.forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?",
    "login.button": "লগইন করুন",
    "login.signup.button": "সাইন আপ করুন",
    "login.noAccount": "একাউন্ট নেই?",
    "login.hasAccount": "একাউন্ট আছে?",
    "login.createAccount": "একাউন্ট তৈরি করুন",
    "login.welcomeBack": "স্বাগতম!",
    "login.accountCreated": "একাউন্ট সফলভাবে তৈরি হয়েছে!",
    "login.error": "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    "login.invalidCredentials": "ভুল ইমেইল বা পাসওয়ার্ড",
    "login.emailExists": "এই ইমেইল দিয়ে একটি একাউন্ট আগে থেকেই আছে",

    // Signup validation
    "validation.email.required": "ইমেইল প্রয়োজন",
    "validation.email.invalid": "সঠিক ইমেইল ঠিকানা দিন",
    "validation.password.required": "পাসওয়ার্ড প্রয়োজন",
    "validation.password.minLength": "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে",
    "validation.password.uppercase":
      "পাসওয়ার্ডে কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে",
    "validation.password.lowercase":
      "পাসওয়ার্ডে কমপক্ষে একটি ছোট হাতের অক্ষর থাকতে হবে",
    "validation.password.special":
      "পাসওয়ার্ডে কমপক্ষে একটি বিশেষ অক্ষর থাকতে হবে",
    "validation.password.match": "পাসওয়ার্ড মিলছে না",
    "validation.fullName.required": "পুরো নাম প্রয়োজন",

    // Forgot Password
    "forgotPassword.title": "পাসওয়ার্ড ভুলে গেছেন?",
    "forgotPassword.subtitle": "পাসওয়ার্ড রিসেট লিংক পেতে আপনার ইমেইল লিখুন",
    "forgotPassword.sent": "রিসেট নির্দেশনার জন্য আপনার ইমেইল চেক করুন",
    "forgotPassword.button": "রিসেট লিংক পাঠান",
    "forgotPassword.backToLogin": "লগইনে ফিরে যান",

    // Dashboard
    "dashboard.title": "ড্যাশবোর্ড",
    "dashboard.welcome": "স্বাগতম",
    "dashboard.loading": "ড্যাশবোর্ড লোড হচ্ছে...",
    "dashboard.export": "ডেটা এক্সপোর্ট",
    "dashboard.quizPerformance": "কুইজ পারফরম্যান্স",
    "dashboard.carbonTrend": "কার্বন ট্রেন্ড",
    "dashboard.challengeProgress": "চ্যালেঞ্জ অগ্রগতি",
    "dashboard.totalCO2": "মোট CO₂",
    "dashboard.quizzes": "কুইজ",
    "dashboard.completed": "সম্পূর্ণ",
    "dashboard.avgScore": "গড় স্কোর",

    // Calculator
    "calculator.title": "কার্বন ফুটপ্রিন্ট ক্যালকুলেটর",
    "calculator.subtitle": "আপনার দৈনিক কার্বন নির্গমন গণনা করুন",
    "calculator.electricity": "বিদ্যুৎ ব্যবহার (kWh)",
    "calculator.electricity.placeholder": "মাসিক বিদ্যুৎ ব্যবহার",
    "calculator.transport": "যাতায়াত দূরত্ব (km)",
    "calculator.transport.placeholder": "দৈনিক যাতায়াত",
    "calculator.transportType": "যানবাহনের ধরন",
    "calculator.transportType.car": "গাড়ি",
    "calculator.transportType.motorcycle": "মোটরসাইকেল",
    "calculator.transportType.bus": "বাস",
    "calculator.transportType.rickshaw": "রিকশা",
    "calculator.transportType.bicycle": "সাইকেল",
    "calculator.waste": "বর্জ্য (kg)",
    "calculator.waste.placeholder": "সাপ্তাহিক বর্জ্য",
    "calculator.calculate": "গণনা করুন",
    "calculator.result": "আপনার ফলাফল",
    "calculator.totalCO2": "মোট CO₂ নির্গমন",
    "calculator.category": "ক্যাটাগরি",
    "calculator.breakdown": "বিস্তারিত ভাঙ্গন",
    "calculator.low": "কম",
    "calculator.medium": "মাঝারি",
    "calculator.high": "উচ্চ",
    "calculator.tips": "আপনার কার্বন পদচিহ্ন কমাতে টিপস",

    // Quiz
    "quiz.title": "ইকো কুইজ",
    "quiz.subtitle": "পরিবেশ সম্পর্কে আপনার জ্ঞান পরীক্ষা করুন",
    "quiz.start": "কুইজ শুরু করুন",
    "quiz.next": "পরবর্তী",
    "quiz.previous": "আগের",
    "quiz.submit": "জমা দিন",
    "quiz.score": "স্কোর",
    "quiz.correct": "সঠিক",
    "quiz.incorrect": "ভুল",
    "quiz.tryAgain": "আবার চেষ্টা করুন",
    "quiz.completed": "কুইজ সম্পূর্ণ!",
    "quiz.yourScore": "আপনার স্কোর",

    // Challenges
    "challenges.title": "দৈনিক চ্যালেঞ্জ",
    "challenges.subtitle": "দৈনিক পরিবেশবান্ধব চ্যালেঞ্জ নিন",
    "challenges.today": "আজকের চ্যালেঞ্জ",
    "challenges.complete": "সম্পূর্ণ করুন",
    "challenges.completed": "সম্পূর্ণ!",
    "challenges.streak": "ধারাবাহিকতা",
    "challenges.days": "দিন",

    // Community
    "community.title": "কমিউনিটি",
    "community.subtitle": "আইডিয়া শেয়ার করুন এবং অন্যদের সাথে সংযুক্ত হন",
    "community.newPost": "নতুন পোস্ট",
    "community.post.placeholder": "আপনার ইকো আইডিয়া শেয়ার করুন...",
    "community.post.button": "পোস্ট করুন",
    "community.like": "পছন্দ",
    "community.comment": "মন্তব্য",
    "community.share": "শেয়ার",

    // Map
    "map.title": "ইকো ম্যাপ",
    "map.subtitle": "বাংলাদেশের পরিবেশবান্ধব স্থান খুঁজুন",
    "map.search": "স্থান খুঁজুন...",
    "map.filter": "ফিল্টার",
    "map.categories.all": "সব",
    "map.categories.recycling": "রিসাইক্লিং",
    "map.categories.parks": "পার্ক",
    "map.categories.ecoShops": "ইকো শপ",
    "map.categories.treePlanting": "বৃক্ষরোপণ",

    // Tips
    "tips.title": "ইকো টিপস",
    "tips.subtitle": "টেকসই জীবনযাপনের জন্য ব্যবহারিক পরামর্শ",
    "tips.categories.all": "সব",
    "tips.categories.energy": "শক্তি",
    "tips.categories.water": "পানি",
    "tips.categories.waste": "বর্জ্য",
    "tips.categories.transport": "যাতায়াত",

    // Blog
    "blog.title": "ব্লগ",
    "blog.subtitle": "পরিবেশ সম্পর্কে সর্বশেষ খবর ও প্রবন্ধ",
    "blog.readMore": "আরও পড়ুন",
    "blog.by": "লিখেছেন",

    // Leaderboard
    "leaderboard.title": "লিডারবোর্ড",
    "leaderboard.subtitle": "শীর্ষ পরিবেশবান্ধব সদস্যদের দেখুন",
    "leaderboard.rank": "র‍্যাংক",
    "leaderboard.name": "নাম",
    "leaderboard.points": "পয়েন্ট",
    "leaderboard.co2Saved": "CO₂ সাশ্রয়",

    // Profile
    "profile.title": "প্রোফাইল",
    "profile.edit": "সম্পাদনা করুন",
    "profile.save": "সংরক্ষণ করুন",
    "profile.badges": "ব্যাজ",
    "profile.achievements": "অর্জন",
    "profile.stats": "পরিসংখ্যান",

    // Common
    "common.loading": "লোড হচ্ছে...",
    "common.error": "সমস্যা হয়েছে",
    "common.success": "সফল!",
    "common.save": "সংরক্ষণ",
    "common.cancel": "বাতিল",
    "common.delete": "মুছুন",
    "common.edit": "সম্পাদনা",
    "common.search": "খুঁজুন",
    "common.filter": "ফিল্টার",
    "common.all": "সব",
    "common.viewAll": "সব দেখুন",
    "common.back": "পিছনে",
    "common.next": "পরবর্তী",
    "common.previous": "আগের",
    "common.submit": "জমা দিন",
    "common.close": "বন্ধ করুন",
    "common.or": "অথবা",
    "common.and": "এবং",
    "common.yes": "হ্যাঁ",
    "common.no": "না",

    // Language Toggle
    "language.toggle": "English",
    "language.current": "বাংলা",
  },
  en: {
    // App Name & Branding
    "app.name": "Eco Track Bangladesh",
    "app.tagline": "Building a greener Bangladesh, saving the environment",

    // Navigation
    "nav.home": "Home",
    "nav.learn": "Learn",
    "nav.tools": "Tools",
    "nav.community": "Community",
    "nav.dashboard": "Dashboard",
    "nav.tips": "Tips",
    "nav.blog": "Blog",
    "nav.quiz": "Quiz",
    "nav.calculator": "Calculator",
    "nav.map": "Map",
    "nav.leaderboard": "Leaderboard",
    "nav.challenges": "Challenges",
    "nav.profile": "Profile",
    "nav.admin": "Admin",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.logout": "Logout",

    // Home Page
    "home.hero.title": "Eco Track Bangladesh",
    "home.hero.subtitle":
      "Track your carbon footprint. Embrace sustainability. Build a greener Bangladesh.",
    "home.hero.cta1": "Calculate Your Impact",
    "home.hero.cta2": "Take the Quiz",

    "home.why.title": "Why Eco Track?",
    "home.why.track.title": "Track Your Footprint",
    "home.why.track.desc":
      "Calculate your daily carbon emissions from electricity, transport, and lifestyle choices.",
    "home.why.challenges.title": "Complete Challenges",
    "home.why.challenges.desc":
      "Take on daily eco-friendly challenges and build sustainable habits step by step.",
    "home.why.community.title": "Join Community",
    "home.why.community.desc":
      "Share ideas, learn from others, and be part of Bangladesh's eco movement.",

    "home.impact.title": "Our Collective Impact",
    "home.impact.subtitle":
      "Together, we're making a real difference for Bangladesh's environment",
    "home.impact.trees": "Trees Planted",
    "home.impact.co2": "kg CO₂ Reduced",
    "home.impact.members": "Active Members",
    "home.impact.challenges": "Challenges Completed",

    "home.howItWorks.title": "How It Works",
    "home.howItWorks.subtitle":
      "Start your sustainability journey in just a few simple steps",
    "home.howItWorks.calculate": "Calculate",
    "home.howItWorks.calculate.desc": "Measure your carbon footprint",
    "home.howItWorks.challenge": "Challenge",
    "home.howItWorks.challenge.desc": "Take on daily eco tasks",
    "home.howItWorks.learn": "Learn",
    "home.howItWorks.learn.desc": "Take quizzes & read tips",
    "home.howItWorks.connect": "Connect",
    "home.howItWorks.connect.desc": "Join our community",
    "home.howItWorks.track": "Track",
    "home.howItWorks.track.desc": "Monitor your progress",

    "home.challenges.title": "Featured Challenges",
    "home.challenges.subtitle":
      "Start with these popular eco-friendly challenges",
    "home.challenges.viewAll": "View All",
    "home.challenges.start": "Start Challenge",
    "home.challenges.plasticFree": "Plastic-Free Day",
    "home.challenges.plasticFree.desc":
      "Avoid using any single-use plastic for 24 hours",
    "home.challenges.greenCommute": "Green Commute",
    "home.challenges.greenCommute.desc":
      "Use public transport, cycle, or walk to work",
    "home.challenges.zeroWaste": "Zero Food Waste",
    "home.challenges.zeroWaste.desc": "Plan meals and compost all food scraps",

    "home.difficulty.easy": "Easy",
    "home.difficulty.medium": "Medium",
    "home.difficulty.hard": "Hard",

    "home.features.title": "Everything You Need",
    "home.features.subtitle":
      "Comprehensive tools to track, learn, and improve your environmental impact",
    "home.features.calculator": "Carbon Calculator",
    "home.features.quiz": "Eco Quizzes",
    "home.features.challenges": "Challenges",
    "home.features.map": "Eco Map",
    "home.features.treePlanting": "Tree Planting",
    "home.features.dashboard": "Dashboard",

    "home.testimonials.title": "Success Stories",
    "home.testimonials.subtitle":
      "Hear from our community members making a difference",

    "home.bangladesh.title": "Bangladesh Needs Your Action",
    "home.bangladesh.desc":
      "As one of the world's most climate-vulnerable nations, Bangladesh faces rising sea levels, extreme weather, and environmental challenges. Every small action counts.",
    "home.bangladesh.coastal": "Coastal communities at risk from rising waters",
    "home.bangladesh.plastic": "Plastic pollution threatening our rivers",
    "home.bangladesh.temperature":
      "Increasing temperatures affecting agriculture",
    "home.bangladesh.readStories": "Read Stories",
    "home.bangladesh.localIssues": "Learn about local issues",
    "home.bangladesh.exploreMap": "Explore Map",
    "home.bangladesh.findSpots": "Find eco spots nearby",

    "home.cta.title": "Start Your Eco Journey Today",
    "home.cta.subtitle":
      "Join thousands of Bangladeshis making a difference, one sustainable choice at a time.",
    "home.cta.button": "Get Started",

    // Footer
    "footer.description":
      "Empowering Bangladeshi citizens to live sustainably and reduce their carbon footprint through education, action, and community engagement.",
    "footer.quickLinks": "Quick Links",
    "footer.resources": "Resources",
    "footer.connectWithUs": "Connect With Us",
    "footer.newsletter": "Newsletter",
    "footer.newsletter.desc": "Get weekly eco tips delivered to your inbox",
    "footer.newsletter.placeholder": "Your email",
    "footer.newsletter.button": "Join",
    "footer.socialMedia":
      "Follow us on social media for daily eco tips, challenges, and community updates.",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.cookies": "Cookie Policy",
    "footer.about": "About Us",
    "footer.madeWith": "Built with dedication for a greener Bangladesh",

    // Login Page
    "login.title": "Welcome",
    "login.subtitle": "Sign in to your account",
    "login.email": "Email",
    "login.email.placeholder": "Enter your email",
    "login.password": "Password",
    "login.password.placeholder": "Enter your password",
    "login.confirmPassword": "Confirm Password",
    "login.fullName": "Full Name",
    "login.fullName.placeholder": "Enter your full name",
    "login.forgotPassword": "Forgot password?",
    "login.button": "Login",
    "login.signup.button": "Sign Up",
    "login.noAccount": "Don't have an account?",
    "login.hasAccount": "Already have an account?",
    "login.createAccount": "Create Account",
    "login.welcomeBack": "Welcome back!",
    "login.accountCreated": "Account created successfully!",
    "login.error": "An error occurred. Please try again.",
    "login.invalidCredentials": "Invalid email or password",
    "login.emailExists": "An account with this email already exists",

    // Signup validation
    "validation.email.required": "Email is required",
    "validation.email.invalid": "Please enter a valid email address",
    "validation.password.required": "Password is required",
    "validation.password.minLength": "Password must be at least 8 characters",
    "validation.password.uppercase":
      "Password must contain at least one uppercase letter",
    "validation.password.lowercase":
      "Password must contain at least one lowercase letter",
    "validation.password.special":
      "Password must contain at least one special character",
    "validation.password.match": "Passwords do not match",
    "validation.fullName.required": "Full name is required",

    // Forgot Password
    "forgotPassword.title": "Forgot Password?",
    "forgotPassword.subtitle":
      "Enter your email to receive a password reset link",
    "forgotPassword.sent": "Check your email for reset instructions",
    "forgotPassword.button": "Send Reset Link",
    "forgotPassword.backToLogin": "Back to Login",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome",
    "dashboard.loading": "Loading dashboard...",
    "dashboard.export": "Export Data",
    "dashboard.quizPerformance": "Quiz Performance",
    "dashboard.carbonTrend": "Carbon Trend",
    "dashboard.challengeProgress": "Challenge Progress",
    "dashboard.totalCO2": "Total CO₂",
    "dashboard.quizzes": "Quizzes",
    "dashboard.completed": "Completed",
    "dashboard.avgScore": "Avg Score",

    // Calculator
    "calculator.title": "Carbon Footprint Calculator",
    "calculator.subtitle": "Calculate your daily carbon emissions",
    "calculator.electricity": "Electricity Usage (kWh)",
    "calculator.electricity.placeholder": "Monthly electricity usage",
    "calculator.transport": "Transportation Distance (km)",
    "calculator.transport.placeholder": "Daily commute",
    "calculator.transportType": "Transport Type",
    "calculator.transportType.car": "Car",
    "calculator.transportType.motorcycle": "Motorcycle",
    "calculator.transportType.bus": "Bus",
    "calculator.transportType.rickshaw": "Rickshaw",
    "calculator.transportType.bicycle": "Bicycle",
    "calculator.waste": "Waste (kg)",
    "calculator.waste.placeholder": "Weekly waste",
    "calculator.calculate": "Calculate",
    "calculator.result": "Your Result",
    "calculator.totalCO2": "Total CO₂ Emissions",
    "calculator.category": "Category",
    "calculator.breakdown": "Detailed Breakdown",
    "calculator.low": "Low",
    "calculator.medium": "Medium",
    "calculator.high": "High",
    "calculator.tips": "Tips to reduce your carbon footprint",

    // Quiz
    "quiz.title": "Eco Quiz",
    "quiz.subtitle": "Test your environmental knowledge",
    "quiz.start": "Start Quiz",
    "quiz.next": "Next",
    "quiz.previous": "Previous",
    "quiz.submit": "Submit",
    "quiz.score": "Score",
    "quiz.correct": "Correct",
    "quiz.incorrect": "Incorrect",
    "quiz.tryAgain": "Try Again",
    "quiz.completed": "Quiz Complete!",
    "quiz.yourScore": "Your Score",

    // Challenges
    "challenges.title": "Daily Challenges",
    "challenges.subtitle": "Take on daily eco-friendly challenges",
    "challenges.today": "Today's Challenge",
    "challenges.complete": "Complete",
    "challenges.completed": "Completed!",
    "challenges.streak": "Streak",
    "challenges.days": "days",

    // Community
    "community.title": "Community",
    "community.subtitle": "Share ideas and connect with others",
    "community.newPost": "New Post",
    "community.post.placeholder": "Share your eco ideas...",
    "community.post.button": "Post",
    "community.like": "Like",
    "community.comment": "Comment",
    "community.share": "Share",

    // Map
    "map.title": "Eco Map",
    "map.subtitle": "Find eco-friendly places in Bangladesh",
    "map.search": "Search places...",
    "map.filter": "Filter",
    "map.categories.all": "All",
    "map.categories.recycling": "Recycling",
    "map.categories.parks": "Parks",
    "map.categories.ecoShops": "Eco Shops",
    "map.categories.treePlanting": "Tree Planting",

    // Tips
    "tips.title": "Eco Tips",
    "tips.subtitle": "Practical advice for sustainable living",
    "tips.categories.all": "All",
    "tips.categories.energy": "Energy",
    "tips.categories.water": "Water",
    "tips.categories.waste": "Waste",
    "tips.categories.transport": "Transport",

    // Blog
    "blog.title": "Blog",
    "blog.subtitle": "Latest news and articles about the environment",
    "blog.readMore": "Read More",
    "blog.by": "By",

    // Leaderboard
    "leaderboard.title": "Leaderboard",
    "leaderboard.subtitle": "See the top eco-friendly members",
    "leaderboard.rank": "Rank",
    "leaderboard.name": "Name",
    "leaderboard.points": "Points",
    "leaderboard.co2Saved": "CO₂ Saved",

    // Profile
    "profile.title": "Profile",
    "profile.edit": "Edit",
    "profile.save": "Save",
    "profile.badges": "Badges",
    "profile.achievements": "Achievements",
    "profile.stats": "Statistics",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.success": "Success!",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.viewAll": "View All",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.close": "Close",
    "common.or": "or",
    "common.and": "and",
    "common.yes": "Yes",
    "common.no": "No",

    // Language Toggle
    "language.toggle": "বাংলা",
    "language.current": "English",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("ecotrack-language");
    return (saved as Language) || "bn"; // Default to Bangla
  });

  useEffect(() => {
    localStorage.setItem("ecotrack-language", language);
    // Update document direction and font for Bangla
    document.documentElement.lang = language;
    if (language === "bn") {
      document.body.style.fontFamily =
        "'Hind Siliguri', 'Noto Sans Bengali', sans-serif";
    } else {
      document.body.style.fontFamily = "'Inter', sans-serif";
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "bn" ? "en" : "bn"));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
