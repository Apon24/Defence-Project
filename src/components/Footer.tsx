import { Link } from "react-router-dom";
import {
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Youtube,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link
              to="/"
              className="flex items-center space-x-2 mb-4 group transition-transform duration-200 hover:scale-[1.01]"
              onClick={handleScrollTop}>
              <div className="p-2 bg-emerald-500 rounded-lg group-hover:bg-emerald-400 transition-colors">
                <Leaf className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold">{t("app.name")}</span>
            </Link>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-emerald-400" />
                <a
                  href="mailto:support@ecotrackbd.com"
                  className="hover:text-emerald-400 transition-colors">
                  support@ecotrackbd.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-emerald-400" />
                <a
                  href="tel:+8801700000000"
                  className="hover:text-emerald-400 transition-colors">
                  +880 1700-000000
                </a>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  {language === "bn" ? "ঢাকা, বাংলাদেশ" : "Dhaka, Bangladesh"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.home")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/quiz"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.quiz")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/calculator"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.calculator")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/challenges"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.challenges")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.map")}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.blog")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tips"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.tips")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.community")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.leaderboard")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group"
                  onClick={handleScrollTop}>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>{t("nav.dashboard")}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">
              {t("footer.connectWithUs")}
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              {t("footer.socialMedia")}
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2">
                {t("footer.newsletter")}
              </p>
              <p className="text-sm text-gray-300 mb-3">
                {t("footer.newsletter.desc")}
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder")}
                  className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                />
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded transition-colors">
                  {t("footer.newsletter.button")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>
                &copy; {currentYear} {t("app.name")}. {t("footer.rights")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">
                {t("footer.privacy")}
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                {t("footer.terms")}
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                {t("footer.cookies")}
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                {t("footer.about")}
              </a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">{t("footer.madeWith")} 🇧🇩</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
