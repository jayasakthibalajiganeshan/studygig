"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PersonalityThemeProvider,
  PersonalityCard,
  PersonalityToggle,
  usePersonalityTheme,
} from "@/components/ui/personality-themes-fixed";
import {
  User,
  Settings,
  Brain,
  Heart,
  Shield,
  Zap,
  BookOpen,
  Users,
  MessageCircle,
  TrendingUp,
  Star,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PersonalityProfilePage() {
  const [personality, setPersonality] = useState<
    "introvert" | "extrovert" | "ambivert"
  >("ambivert");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    bio: "",
    studyPreferences: {
      quietHours: "morning",
      socialLevel: "moderate",
      focusMode: false,
      notifications: "important",
    },
    uiPreferences: {
      reducedAnimations: true,
      largeText: false,
      highContrast: false,
      compactMode: false,
    },
  });

  const theme = usePersonalityTheme();

  useEffect(() => {
    const saved = localStorage.getItem("user-personality") as
      | "introvert"
      | "extrovert"
      | "ambivert"
      | null;

    if (saved && saved !== personality) {
      setPersonality(saved);
    }
  }, [personality]);

  const handlePersonalityChange = (
    newPersonality: "introvert" | "extrovert" | "ambivert",
  ) => {
    setPersonality(newPersonality);
    localStorage.setItem("user-personality", newPersonality);

    setProfileData((prev) => ({
      ...prev,
      uiPreferences: {
        ...prev.uiPreferences,
        reducedAnimations: newPersonality === "introvert",
      },
      studyPreferences: {
        ...prev.studyPreferences,
        socialLevel:
          newPersonality === "introvert"
            ? "minimal"
            : newPersonality === "extrovert"
              ? "enhanced"
              : "moderate",
        notifications: newPersonality === "extrovert" ? "all" : "important",
      },
    }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem("user-personality", personality);
    localStorage.setItem("user-profile-data", JSON.stringify(profileData));

    setIsEditing(false);
  };

  return (
    <PersonalityThemeProvider personality={personality}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-display text-4xl font-bold mb-4"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Personality Profile
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Customize your StudyGig experience based on your personality
                type
              </motion.p>
            </div>

            {/* Personality Selector */}
            <div className="mb-8">
              <h2
                className="text-2xl font-bold text-center mb-6"
                style={{ color: theme.colors.text }}
              >
                Choose Your Personality
              </h2>

              <PersonalityToggle
                currentPersonality={personality}
                onPersonalityChange={handlePersonalityChange}
              />
            </div>

            {/* Current Profile Display */}
            <div
              className={cn(
                "rounded-2xl p-6 backdrop-blur-sm border",
                theme.components.cardStyle,
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {personality.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3
                      className="font-bold text-xl mb-2"
                      style={{ color: theme.colors.text }}
                    >
                      {personality.charAt(0).toUpperCase() +
                        personality.slice(1)}
                    </h3>

                    <p
                      className="text-gray-600"
                      style={{ color: theme.colors.muted }}
                    >
                      Personalized UI experience enabled
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                    isEditing
                      ? "bg-red-500 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.colors.text }}
                      >
                        Bio
                      </label>

                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself..."
                        className={cn(
                          "w-full p-4 rounded-xl border",
                          theme.components.inputStyle,
                        )}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* LEFT COLUMN */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: theme.colors.text }}
                        >
                          Study Preferences
                        </label>

                        <div className="space-y-4">
                          <div>
                            <label
                              className="block text-sm mb-2"
                              style={{ color: theme.colors.muted }}
                            >
                              Quiet Hours
                            </label>

                            <select
                              value={profileData.studyPreferences.quietHours}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  studyPreferences: {
                                    ...prev.studyPreferences,
                                    quietHours: e.target.value,
                                  },
                                }))
                              }
                              className={cn(
                                "w-full p-3 rounded-lg border",
                                theme.components.inputStyle,
                              )}
                            >
                              <option value="morning">Morning</option>
                              <option value="afternoon">Afternoon</option>
                              <option value="evening">Evening</option>
                              <option value="night">Night</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: theme.colors.text }}
                        >
                          UI Preferences
                        </label>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={
                                profileData.uiPreferences.reducedAnimations
                              }
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  uiPreferences: {
                                    ...prev.uiPreferences,
                                    reducedAnimations: e.target.checked,
                                  },
                                }))
                              }
                            />

                            <label
                              className="text-sm"
                              style={{ color: theme.colors.text }}
                            >
                              Reduced Animations
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={profileData.uiPreferences.largeText}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  uiPreferences: {
                                    ...prev.uiPreferences,
                                    largeText: e.target.checked,
                                  },
                                }))
                              }
                            />

                            <label
                              className="text-sm"
                              style={{ color: theme.colors.text }}
                            >
                              Large Text
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-3 pt-6">
                      <button
                        onClick={handleSaveProfile}
                        className={cn(
                          "px-6 py-3 rounded-lg font-medium transition-all duration-200",
                          theme.components.buttonStyle,
                        )}
                      >
                        Save Profile
                      </button>

                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </PersonalityThemeProvider>
  );
}
