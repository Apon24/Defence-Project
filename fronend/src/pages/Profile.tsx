import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { profileApi, badgesApi } from "../lib/api";
import { useNotification } from "../contexts/NotificationContext";
import { User, Mail, Award, Save, Camera } from "lucide-react";

interface Profile {
  fullName: string;
  email: string;
  avatarUrl: string;
  bio: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export const Profile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    email: "",
    avatarUrl: "",
    bio: "",
  });
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    loadProfile();
    loadBadges();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const response = await profileApi.get();

      if (response.data) {
        setProfile({
          fullName: response.data.fullName || "",
          email: response.data.email || user.email || "",
          avatarUrl: response.data.avatarUrl || "",
          bio: response.data.bio || "",
        });
      }
    } catch (error) {
      showNotification("error", "Failed to load profile");
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBadges = async () => {
    if (!user) return;

    try {
      const response = await badgesApi.getUserBadges();
      setBadges(response.data || []);
    } catch (error) {
      console.error("Error loading badges:", error);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate absolute basic constraints
    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "File size too large (max 5MB)");
      return;
    }

    setUploading(true);
    try {
      const response = await profileApi.uploadAvatar(file);
      setProfile((prev) => ({
        ...prev,
        avatarUrl: `http://localhost:3000${response.data.avatarUrl}`,
      }));
      showNotification("success", "Profile photo uploaded!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showNotification("error", "Failed to upload profile photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await profileApi.update({
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
      });

      showNotification("success", "Profile updated successfully!");
    } catch (error) {
      showNotification("error", "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          {language === "bn" ? "প্রোফাইল লোড হচ্ছে..." : "Loading profile..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in-slow">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center mb-8">
            <div
              className="relative group cursor-pointer mr-4"
              onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-100 dark:border-green-900 bg-green-100 dark:bg-green-900 flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {language === "bn" ? "আমার প্রোফাইল" : "My Profile"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {language === "bn"
                  ? "আপনার অ্যাকাউন্ট সেটিংস পরিচালনা করুন"
                  : "Manage your account settings"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                {language === "bn" ? "ইমেইল" : "Email"}
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === "bn" ? "পুরো নাম" : "Full Name"}
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
                placeholder={
                  language === "bn"
                    ? "আপনার পুরো নাম লিখুন"
                    : "Enter your full name"
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === "bn" ? "বায়ো" : "Bio"}
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
                placeholder={
                  language === "bn"
                    ? "নিজের সম্পর্কে বলুন..."
                    : "Tell us about yourself..."
                }
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors">
              <Save className="h-5 w-5" />
              <span>
                {saving
                  ? language === "bn"
                    ? "সংরক্ষণ হচ্ছে..."
                    : "Saving..."
                  : language === "bn"
                  ? "প্রোফাইল সংরক্ষণ করুন"
                  : "Save Profile"}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center mb-6">
            <Award className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {language === "bn" ? "আমার ব্যাজ" : "My Badges"}
            </h2>
          </div>

          {badges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {language === "bn"
                  ? "আপনি এখনও কোন ব্যাজ অর্জন করেননি। কুইজ, চ্যালেঞ্জ সম্পন্ন করুন এবং কমিউনিটির সাথে যোগাযোগ করুন ব্যাজ অর্জন করতে!"
                  : "You haven't earned any badges yet. Complete quizzes, challenges, and interact with the community to earn badges!"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-200 dark:bg-yellow-700 p-2 rounded-full">
                      <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {badge.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {language === "bn" ? "অর্জিত:" : "Earned:"}{" "}
                        {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
