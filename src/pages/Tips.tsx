import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Lightbulb, RefreshCw } from "lucide-react";

const ecoTipsData = {
  en: [
    {
      title: "Use Jute Bags Instead of Plastic",
      description:
        "Bangladesh is the world's leading jute producer. Switch to jute bags for shopping to reduce plastic waste and support local industry.",
      impact: "High",
    },
    {
      title: "Install Solar Panels",
      description:
        "Bangladesh has excellent solar potential. Installing solar panels can reduce electricity costs and carbon emissions significantly.",
      impact: "High",
    },
    {
      title: "Use Public Transport",
      description:
        "Take buses, trains, or share rides instead of driving alone. This reduces traffic congestion and air pollution in cities like Dhaka.",
      impact: "High",
    },
    {
      title: "Harvest Rainwater",
      description:
        "Collect rainwater during monsoon season for washing, gardening, and other non-drinking purposes to conserve water.",
      impact: "Medium",
    },
    {
      title: "Compost Kitchen Waste",
      description:
        "Turn vegetable peels and food scraps into nutrient-rich compost for plants instead of sending them to landfills.",
      impact: "Medium",
    },
    {
      title: "Switch to LED Bulbs",
      description:
        "LED bulbs use 75% less energy than traditional bulbs and last much longer, reducing both electricity bills and carbon emissions.",
      impact: "Medium",
    },
    {
      title: "Plant Native Trees",
      description:
        "Plant indigenous trees like mango, jackfruit, or neem. They adapt well to Bangladesh's climate and provide shade and fruits.",
      impact: "High",
    },
    {
      title: "Reduce AC Usage",
      description:
        "Use fans, natural ventilation, and keep windows open during cooler hours to reduce air conditioning dependency.",
      impact: "Medium",
    },
    {
      title: "Buy Local Produce",
      description:
        "Purchase vegetables and fruits from local farmers' markets to reduce transportation emissions and support local economy.",
      impact: "Medium",
    },
    {
      title: "Fix Water Leaks",
      description:
        "Repair dripping taps and leaking pipes immediately. A small leak can waste thousands of liters of water annually.",
      impact: "Low",
    },
    {
      title: "Use Cloth Napkins",
      description:
        "Replace paper napkins with reusable cloth ones to reduce paper waste and save trees.",
      impact: "Low",
    },
    {
      title: "Unplug Devices",
      description:
        "Unplug chargers and electronics when not in use. Phantom power consumption accounts for 5-10% of electricity usage.",
      impact: "Low",
    },
    {
      title: "Start a Kitchen Garden",
      description:
        "Grow vegetables like tomatoes, chilies, and herbs on your rooftop or balcony. It provides fresh produce and reduces carbon footprint.",
      impact: "Medium",
    },
    {
      title: "Avoid Single-Use Plastics",
      description:
        "Say no to plastic straws, cups, and cutlery. Carry your own reusable alternatives when going out.",
      impact: "High",
    },
    {
      title: "Support Eco-Friendly Brands",
      description:
        "Choose products from companies that use sustainable practices and eco-friendly packaging.",
      impact: "Medium",
    },
  ],
  bn: [
    {
      title: "প্লাস্টিকের বদলে পাটের ব্যাগ ব্যবহার করুন",
      description:
        "বাংলাদেশ বিশ্বের শীর্ষ পাট উৎপাদনকারী দেশ। প্লাস্টিক বর্জ্য কমাতে এবং স্থানীয় শিল্পকে সমর্থন করতে কেনাকাটার জন্য পাটের ব্যাগে স্যুইচ করুন।",
      impact: "উচ্চ",
    },
    {
      title: "সোলার প্যানেল ইনস্টল করুন",
      description:
        "বাংলাদেশে চমৎকার সৌর সম্ভাবনা রয়েছে। সোলার প্যানেল ইনস্টল করলে বিদ্যুৎ খরচ এবং কার্বন নির্গমন উল্লেখযোগ্যভাবে কমে যায়।",
      impact: "উচ্চ",
    },
    {
      title: "পাবলিক ট্রান্সপোর্ট ব্যবহার করুন",
      description:
        "একা গাড়ি চালানোর পরিবর্তে বাস, ট্রেন বা রাইড শেয়ার করুন। এটি ঢাকার মতো শহরে যানজট এবং বায়ু দূষণ কমায়।",
      impact: "উচ্চ",
    },
    {
      title: "বৃষ্টির পানি সংগ্রহ করুন",
      description:
        "বর্ষা মৌসুমে ধোয়া, বাগান করা এবং অন্যান্য অপানীয় উদ্দেশ্যে বৃষ্টির পানি সংগ্রহ করুন।",
      impact: "মাঝারি",
    },
    {
      title: "রান্নাঘরের বর্জ্য কম্পোস্ট করুন",
      description:
        "সবজির খোসা এবং খাদ্য স্ক্র্যাপগুলিকে ল্যান্ডফিলে পাঠানোর পরিবর্তে গাছের জন্য পুষ্টি সমৃদ্ধ কম্পোস্টে রূপান্তর করুন।",
      impact: "মাঝারি",
    },
    {
      title: "LED বাল্বে স্যুইচ করুন",
      description:
        "LED বাল্ব প্রচলিত বাল্বের চেয়ে ৭৫% কম শক্তি ব্যবহার করে এবং অনেক বেশি সময় স্থায়ী হয়।",
      impact: "মাঝারি",
    },
    {
      title: "দেশীয় গাছ লাগান",
      description:
        "আম, কাঁঠাল বা নিম জাতীয় দেশীয় গাছ লাগান। এগুলো বাংলাদেশের আবহাওয়ায় ভালো মানিয়ে নেয় এবং ছায়া ও ফল দেয়।",
      impact: "উচ্চ",
    },
    {
      title: "এসি ব্যবহার কমান",
      description:
        "এয়ার কন্ডিশনার নির্ভরতা কমাতে ফ্যান, প্রাকৃতিক বায়ু চলাচল ব্যবহার করুন এবং ঠান্ডা সময়ে জানালা খোলা রাখুন।",
      impact: "মাঝারি",
    },
    {
      title: "স্থানীয় পণ্য কিনুন",
      description:
        "পরিবহন নির্গমন কমাতে এবং স্থানীয় অর্থনীতিকে সমর্থন করতে স্থানীয় কৃষকদের বাজার থেকে শাকসবজি এবং ফল কিনুন।",
      impact: "মাঝারি",
    },
    {
      title: "পানির লিক ঠিক করুন",
      description:
        "ট্যাপ এবং পাইপের লিক অবিলম্বে মেরামত করুন। একটি ছোট লিক বছরে হাজার হাজার লিটার পানি নষ্ট করতে পারে।",
      impact: "কম",
    },
    {
      title: "কাপড়ের ন্যাপকিন ব্যবহার করুন",
      description:
        "কাগজের বর্জ্য কমাতে এবং গাছ বাঁচাতে কাগজের ন্যাপকিনকে পুনরায় ব্যবহারযোগ্য কাপড়ের ন্যাপকিন দিয়ে প্রতিস্থাপন করুন।",
      impact: "কম",
    },
    {
      title: "ডিভাইস আনপ্লাগ করুন",
      description:
        "ব্যবহার না করার সময় চার্জার এবং ইলেকট্রনিক্স আনপ্লাগ করুন। ফ্যান্টম পাওয়ার ৫-১০% বিদ্যুৎ ব্যবহার করে।",
      impact: "কম",
    },
    {
      title: "ছাদে বাগান শুরু করুন",
      description:
        "আপনার ছাদে বা বারান্দায় টমেটো, মরিচ এবং ভেষজ জাতীয় সবজি চাষ করুন। এটি তাজা পণ্য সরবরাহ করে এবং কার্বন পায়ের ছাপ কমায়।",
      impact: "মাঝারি",
    },
    {
      title: "একবার ব্যবহারযোগ্য প্লাস্টিক এড়িয়ে চলুন",
      description:
        "প্লাস্টিকের স্ট্র, কাপ এবং কাটলারিকে না বলুন। বাইরে যাওয়ার সময় আপনার নিজের পুনরায় ব্যবহারযোগ্য বিকল্প সাথে নিন।",
      impact: "উচ্চ",
    },
    {
      title: "পরিবেশ-বান্ধব ব্র্যান্ড সমর্থন করুন",
      description:
        "টেকসই অনুশীলন এবং পরিবেশ-বান্ধব প্যাকেজিং ব্যবহার করে এমন কোম্পানিগুলির পণ্য বেছে নিন।",
      impact: "মাঝারি",
    },
  ],
};

export const Tips = () => {
  const { language, t } = useLanguage();
  const [currentTip, setCurrentTip] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const ecoTips = ecoTipsData[language];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ecoTips.length);
    setCurrentTip(randomIndex);
  }, [language]);

  const getNewTip = () => {
    setIsRotating(true);
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * ecoTips.length);
      } while (newIndex === currentTip);
      setCurrentTip(newIndex);
      setIsRotating(false);
    }, 300);
  };

  const getImpactColor = (impact: string) => {
    const highImpacts = ["High", "উচ্চ"];
    const mediumImpacts = ["Medium", "মাঝারি"];
    const lowImpacts = ["Low", "কম"];

    if (highImpacts.includes(impact)) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    } else if (mediumImpacts.includes(impact)) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    } else if (lowImpacts.includes(impact)) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const tip = ecoTips[currentTip];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Lightbulb className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t("tips.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("tips.subtitle")}
          </p>
        </div>

        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-8 transition-transform ${
            isRotating ? "scale-95" : "scale-100"
          }`}>
          <div className="flex items-center justify-between mb-6">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getImpactColor(
                tip.impact
              )}`}>
              {tip.impact} {language === "bn" ? "প্রভাব" : "Impact"}
            </span>
            <button
              onClick={getNewTip}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw
                className={`h-5 w-5 ${isRotating ? "animate-spin" : ""}`}
              />
              <span>{language === "bn" ? "নতুন টিপস" : "New Tip"}</span>
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {tip.title}
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {tip.description}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-red-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            {language === "bn"
              ? "কেন প্রতিটি পদক্ষেপ গুরুত্বপূর্ণ"
              : "Why Every Action Matters"}
          </h3>
          <p className="text-green-50 mb-4">
            {language === "bn"
              ? "বাংলাদেশ জলবায়ু পরিবর্তনের জন্য অত্যন্ত ঝুঁকিপূর্ণ। সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি উপকূলীয় এলাকাকে হুমকির মুখে ফেলছে এবং চরম আবহাওয়া আরও সাধারণ হয়ে উঠছে, প্রতিটি টেকসই পদক্ষেপ একটি নিরাপদ ভবিষ্যতে অবদান রাখে।"
              : "Bangladesh is highly vulnerable to climate change. With rising sea levels threatening coastal areas and extreme weather becoming more common, every sustainable action contributes to a safer future."}
          </p>
          <p className="text-green-50">
            {language === "bn"
              ? "পরিবেশ-বান্ধব অভ্যাস গ্রহণ করে, আপনি শুধুমাত্র আপনার কার্বন পদচিহ্ন কমাচ্ছেন না বরং আপনার সম্প্রদায়ের অন্যদের সবুজ বাংলাদেশের আন্দোলনে যোগ দিতে অনুপ্রাণিত করছেন।"
              : "By adopting eco-friendly habits, you not only reduce your carbon footprint but also inspire others in your community to join the movement toward a greener Bangladesh."}
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {ecoTips.slice(0, 6).map((tip, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setCurrentTip(index)}>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getImpactColor(
                  tip.impact
                )}`}>
                {tip.impact}
              </span>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {tip.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
