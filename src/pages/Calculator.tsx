import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { carbonApi } from "../lib/api";
import {
  Calculator as CalcIcon,
  Zap,
  Car,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export const Calculator = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [electricityKwh, setElectricityKwh] = useState("");
  const [wasteKg, setWasteKg] = useState("");
  const [transportEntries, setTransportEntries] = useState<
    Array<{ id: number; type: string; km: string }>
  >([{ id: Date.now(), type: "car", km: "" }]);

  const [result, setResult] = useState<{
    totalCO2: number;
    category: string;
    breakdown: { electricity: number; transport: number; waste: number };
  } | null>(null);

  const addTransportRow = () => {
    setTransportEntries([
      ...transportEntries,
      { id: Date.now(), type: "car", km: "" },
    ]);
  };

  const removeTransportRow = (id: number) => {
    if (transportEntries.length > 1) {
      setTransportEntries(transportEntries.filter((entry) => entry.id !== id));
    }
  };

  const updateTransportEntry = (
    id: number,
    field: "type" | "km",
    value: string
  ) => {
    setTransportEntries(
      transportEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const calculateCarbonFootprint = async (e: React.FormEvent) => {
    e.preventDefault();

    const electricity = parseFloat(electricityKwh) || 0;
    const waste = parseFloat(wasteKg) || 0;

    const transportEmissionFactors: Record<string, number> = {
      car: 0.21,
      motorcycle: 0.12,
      bus: 0.089,
      rickshaw: 0,
      bicycle: 0,
    };

    let totalTransportCO2 = 0;
    let totalTransportKm = 0;

    transportEntries.forEach((entry) => {
      const km = parseFloat(entry.km) || 0;
      totalTransportKm += km;
      totalTransportCO2 += km * (transportEmissionFactors[entry.type] || 0.21);
    });

    const electricityCO2 = electricity * 0.82;
    const wasteCO2 = waste * 0.5;

    const totalCO2 = electricityCO2 + totalTransportCO2 + wasteCO2;

    let category = "Low";
    if (totalCO2 > 100) category = "High";
    else if (totalCO2 > 50) category = "Medium";

    setResult({
      totalCO2: parseFloat(totalCO2.toFixed(2)),
      category,
      breakdown: {
        electricity: parseFloat(electricityCO2.toFixed(2)),
        transport: parseFloat(totalTransportCO2.toFixed(2)),
        waste: parseFloat(wasteCO2.toFixed(2)),
      },
    });

    if (user) {
      try {
        await carbonApi.create({
          electricityKwh: electricity,
          transportationKm: totalTransportKm,
          transportationType:
            transportEntries.length === 1 ? transportEntries[0].type : "mixed",
          wasteKg: waste,
          totalCo2Kg: totalCO2,
          category,
        });
      } catch (error) {
        console.error("Error saving carbon footprint:", error);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <CalcIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t("calculator.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("calculator.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {language === "bn"
                ? "আপনার দৈনিক কার্যক্রম লিখুন"
                : "Enter Your Daily Activities"}
            </h2>

            <form onSubmit={calculateCarbonFootprint} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  {t("calculator.electricity")}
                </label>
                <input
                  type="number"
                  value={electricityKwh}
                  onChange={(e) => setElectricityKwh(e.target.value)}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder={language === "bn" ? "যেমন: ১০" : "e.g., 10"}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === "bn"
                    ? "বাংলাদেশে গড় পরিবার দৈনিক ৮-১২ kWh ব্যবহার করে"
                    : "Average household in Bangladesh uses 8-12 kWh/day"}
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Car className="h-5 w-5 mr-2 text-blue-500" />
                  {t("calculator.transport")}
                </label>

                <div className="space-y-3">
                  {transportEntries.map((entry) => (
                    <div key={entry.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <select
                          value={entry.type}
                          onChange={(e) =>
                            updateTransportEntry(
                              entry.id,
                              "type",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white mb-2">
                          <option value="car">
                            {language === "bn"
                              ? "ব্যক্তিগত গাড়ি"
                              : "Private Car"}
                          </option>
                          <option value="motorcycle">
                            {language === "bn" ? "মোটরসাইকেল" : "Motorcycle"}
                          </option>
                          <option value="bus">
                            {language === "bn"
                              ? "বাস/পাবলিক ট্রান্সপোর্ট"
                              : "Bus/Public Transport"}
                          </option>
                          <option value="rickshaw">
                            {language === "bn"
                              ? "রিকশা (ইলেকট্রিক/ম্যানুয়াল)"
                              : "Rickshaw (Electric/Manual)"}
                          </option>
                          <option value="bicycle">
                            {language === "bn"
                              ? "সাইকেল/হাঁটা"
                              : "Bicycle/Walking"}
                          </option>
                        </select>
                        <input
                          type="number"
                          value={entry.km}
                          onChange={(e) =>
                            updateTransportEntry(entry.id, "km", e.target.value)
                          }
                          step="0.1"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          placeholder={
                            language === "bn" ? "কত কিমি?" : "Distance (km)"
                          }
                          required
                        />
                      </div>
                      {transportEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTransportRow(entry.id)}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addTransportRow}
                  className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium hover:underline flex items-center">
                  +{" "}
                  {language === "bn"
                    ? "আরেকটি মাধ্যম যোগ করুন"
                    : "Add another transport"}
                </button>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                  {t("calculator.waste")}
                </label>
                <input
                  type="number"
                  value={wasteKg}
                  onChange={(e) => setWasteKg(e.target.value)}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder={language === "bn" ? "যেমন: ২" : "e.g., 2"}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === "bn"
                    ? "গড় মানুষ দৈনিক ১-৩ কেজি বর্জ্য তৈরি করে"
                    : "Average person generates 1-3 kg waste per day"}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                {t("calculator.calculate")}
              </button>
            </form>
          </div>

          {result && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {language === "bn"
                  ? "আপনার কার্বন ফুটপ্রিন্ট"
                  : "Your Carbon Footprint"}
              </h2>

              <div className="text-center mb-8">
                <p className="text-6xl font-bold text-green-600 mb-2">
                  {result.totalCO2}
                </p>
                <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
                  {language === "bn" ? "কেজি CO₂ প্রতিদিন" : "kg CO₂ per day"}
                </p>
                <div
                  className={`inline-block px-6 py-2 rounded-full ${getCategoryColor(
                    result.category
                  )} bg-opacity-10 font-bold text-lg`}>
                  {language === "bn"
                    ? result.category === "Low"
                      ? "কম প্রভাব"
                      : result.category === "Medium"
                      ? "মাঝারি প্রভাব"
                      : "উচ্চ প্রভাব"
                    : `${result.category} Impact`}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      {language === "bn" ? "বিদ্যুৎ" : "Electricity"}
                    </span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {result.breakdown.electricity}{" "}
                      {language === "bn" ? "কেজি CO₂" : "kg CO₂"}
                    </span>
                  </div>
                  <div className="bg-yellow-200 dark:bg-yellow-700 h-2 rounded-full">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (result.breakdown.electricity / result.totalCO2) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <Car className="h-5 w-5 mr-2 text-blue-500" />
                      {language === "bn" ? "পরিবহন" : "Transportation"}
                    </span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {result.breakdown.transport}{" "}
                      {language === "bn" ? "কেজি CO₂" : "kg CO₂"}
                    </span>
                  </div>
                  <div className="bg-blue-200 dark:bg-blue-700 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (result.breakdown.transport / result.totalCO2) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                      {language === "bn" ? "বর্জ্য" : "Waste"}
                    </span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {result.breakdown.waste}{" "}
                      {language === "bn" ? "কেজি CO₂" : "kg CO₂"}
                    </span>
                  </div>
                  <div className="bg-red-200 dark:bg-red-700 h-2 rounded-full">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (result.breakdown.waste / result.totalCO2) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">
                  {language === "bn" ? "পরামর্শ:" : "Recommendations:"}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {result.breakdown.electricity > 8 && (
                    <li className="flex items-start">
                      <TrendingDown className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      {language === "bn"
                        ? "শক্তি-সাশ্রয়ী যন্ত্রপাতি এবং LED বাল্ব ব্যবহার করুন"
                        : "Switch to energy-efficient appliances and LED bulbs"}
                    </li>
                  )}
                  {result.breakdown.transport > 5 && (
                    <li className="flex items-start">
                      <TrendingDown className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      {language === "bn"
                        ? "নির্গমন কমাতে পাবলিক ট্রান্সপোর্ট বা কারপুল ব্যবহার করুন"
                        : "Use public transport or carpool to reduce emissions"}
                    </li>
                  )}
                  {result.breakdown.waste > 1 && (
                    <li className="flex items-start">
                      <TrendingDown className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      {language === "bn"
                        ? "প্লাস্টিকের ব্যবহার কমান এবং জৈব বর্জ্য কম্পোস্ট করুন"
                        : "Reduce plastic use and compost organic waste"}
                    </li>
                  )}
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
                    {language === "bn"
                      ? "আপনার কার্বন নির্গমন অফসেট করতে গাছ লাগান"
                      : "Plant trees to offset your carbon emissions"}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
