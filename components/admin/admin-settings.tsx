'use client';

import { useState } from 'react';
import React from 'react';

export const COLOR_THEMES = [
  {
    key: 'ocean',
    name: 'Ocean Blue',
    gradient: 'bg-gradient-to-br from-indigo-500 to-purple-400',
    modalHeaderGradient: 'bg-gradient-to-r from-indigo-500 to-purple-400',
    surface: 'bg-white',
    text: 'text-gray-900',
    textOnGradient: 'text-white',
    buttonBg: 'bg-white',
    buttonText: 'text-indigo-700',
    buttonHoverBg: 'hover:bg-indigo-50',
    modalBodyBg: 'bg-[#eef2ff]',
    subtitle: 'Professional & modern',
    color: '#6366f1',
  },
  {
    key: 'green',
    name: 'Fresh Green',
    gradient: 'bg-gradient-to-br from-green-400 to-teal-500',
    modalHeaderGradient: 'bg-gradient-to-r from-green-400 to-teal-500',
    surface: 'bg-white',
    text: 'text-gray-900',
    textOnGradient: 'text-white',
    buttonBg: 'bg-white',
    buttonText: 'text-teal-700',
    buttonHoverBg: 'hover:bg-teal-50',
    modalBodyBg: 'bg-[#e6fcf5]',
    subtitle: 'Nature & growth',
    color: '#34d399',
  },
  {
    key: 'purple',
    name: 'Soft Purple',
    gradient: 'bg-gradient-to-br from-purple-200 to-pink-100',
    modalHeaderGradient: 'bg-gradient-to-r from-purple-200 to-pink-100',
    surface: 'bg-white',
    text: 'text-gray-900',
    textOnGradient: 'text-gray-900',
    buttonBg: 'bg-white',
    buttonText: 'text-purple-700',
    buttonHoverBg: 'hover:bg-purple-50',
    modalBodyBg: 'bg-[#f8eafd]',
    subtitle: 'Creative & elegant',
    color: '#c4b5fd',
  },
  {
    key: 'sunset',
    name: 'Warm Sunset',
    gradient: 'bg-gradient-to-br from-pink-300 to-orange-200',
    modalHeaderGradient: 'bg-gradient-to-r from-pink-300 to-orange-200',
    surface: 'bg-white',
    text: 'text-gray-900',
    textOnGradient: 'text-gray-900',
    buttonBg: 'bg-white',
    buttonText: 'text-pink-700',
    buttonHoverBg: 'hover:bg-orange-50',
    modalBodyBg: 'bg-[#fff0f6]',
    subtitle: 'Energetic & friendly',
    color: '#fb7185',
  },
  {
    key: 'teal',
    name: 'Cool Teal',
    gradient: 'bg-gradient-to-br from-cyan-400 to-green-300',
    modalHeaderGradient: 'bg-gradient-to-r from-cyan-400 to-green-300',
    surface: 'bg-white',
    text: 'text-gray-900',
    textOnGradient: 'text-gray-900',
    buttonBg: 'bg-white',
    buttonText: 'text-cyan-700',
    buttonHoverBg: 'hover:bg-cyan-50',
    modalBodyBg: 'bg-[#e0fcff]',
    subtitle: 'Tech & innovation',
    color: '#22d3ee',
  },
  {
    key: 'forest',
    name: 'Dark Forest',
    gradient: 'bg-gradient-to-br from-gray-700 to-green-900',
    modalHeaderGradient: 'bg-gradient-to-r from-gray-700 to-green-900',
    surface: 'bg-gray-900',
    text: 'text-white',
    textOnGradient: 'text-white',
    buttonBg: 'bg-gray-800',
    buttonText: 'text-green-200',
    buttonHoverBg: 'hover:bg-green-900',
    modalBodyBg: 'bg-gray-800',
    subtitle: 'Bold & sophisticated',
    color: '#334155',
  },
];

const PROFILE_SECTION_OPTIONS = [
  {
    key: 'gamer',
    label: 'Gamer',
    description: 'Gaming profiles, platforms, achievements',
    icon: '🎮',
  },
  {
    key: 'creator',
    label: 'Creator',
    description: 'Content creation, channels, portfolios',
    icon: '🎨',
  },
  {
    key: 'developer',
    label: 'Developer',
    description: 'Coding skills, projects, repositories',
    icon: '💻',
  },
  {
    key: 'trader',
    label: 'Trader',
    description: 'Trading platforms, investments, analysis',
    icon: '📈',
  },
  {
    key: 'student',
    label: 'Student',
    description: 'Academic achievements, courses, research',
    icon: '🎓',
  },
];

interface AdminSettingsProps {
  experienceId: string;
  currentSettings: {
    color?: string;
    profileSections?: string[];
  };
  onSaveSuccess?: () => void;
}

export function AdminSettings({ experienceId, currentSettings, onSaveSuccess }: AdminSettingsProps) {
  // Find the selected theme from color or fallback to first
  const initialTheme = COLOR_THEMES.find(t => t.color === currentSettings.color) || COLOR_THEMES[0];
  const [selectedTheme, setSelectedTheme] = useState(initialTheme.key);
  const [profileSections, setProfileSections] = useState<string[]>(currentSettings.profileSections || PROFILE_SECTION_OPTIONS.map(s => s.key));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSectionChange = (section: string) => {
    setProfileSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const theme = COLOR_THEMES.find(t => t.key === selectedTheme);
      const response = await fetch("/api/experience/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId,
          color: theme?.color,
          profileSections,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }
      setMessage("Settings saved successfully!");
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      setMessage(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSyncProfiles = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/admin/sync-access-pass-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessPassId: "prod_cXOfYhdgpM6Ge" }),
      });
      const data = await res.json();
      setSyncMessage(`Created ${data.created} new profiles!`);
    } catch (err: any) {
      setSyncMessage("Failed to sync profiles");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-extrabold mb-6">Admin Settings</h2>
      <div className="mb-6">
        <button
          type="button"
          onClick={handleSyncProfiles}
          disabled={syncing}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all disabled:opacity-60"
        >
          {syncing ? "Syncing..." : "Sync Access Pass Members"}
        </button>
        {syncMessage && (
          <div className="mt-2 text-sm text-gray-700">{syncMessage}</div>
        )}
      </div>
      <div className="mb-8">
        <div className="font-bold text-lg mb-2">Color Theme</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
          {COLOR_THEMES.map(theme => (
            <button
              key={theme.key}
              type="button"
              className={`rounded-2xl p-4 flex flex-col items-center border-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-200
                ${selectedTheme === theme.key ? 'border-teal-400 ring-2 ring-teal-200' : 'border-gray-200 hover:border-teal-300'}`}
              onClick={() => setSelectedTheme(theme.key)}
            >
              <div className={`w-28 h-12 rounded-xl mb-2 ${theme.gradient}`}></div>
              <div className="font-semibold text-gray-800 text-base mb-1">{theme.name}</div>
              <div className="text-xs text-gray-500">{theme.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <div className="font-bold text-lg mb-2">Profile Sections</div>
        <div className="text-gray-500 mb-4 text-sm">Choose which profile sections are available for members to use</div>
        <div className="flex flex-col gap-4">
          {PROFILE_SECTION_OPTIONS.map(section => (
            <label
              key={section.key}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer
                ${profileSections.includes(section.key) ? 'border-teal-400 bg-teal-50/30' : 'border-gray-200 bg-white hover:border-teal-300'}`}
            >
              <input
                type="checkbox"
                checked={profileSections.includes(section.key)}
                onChange={() => handleSectionChange(section.key)}
                className="accent-teal-500 w-5 h-5"
              />
              <span className="text-2xl">{section.icon}</span>
              <span className="font-bold text-base text-gray-800">{section.label}</span>
              <span className="text-gray-500 text-sm flex-1">{section.description}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 mt-2 rounded-full bg-teal-500 text-white font-bold text-lg shadow-md hover:bg-teal-600 transition"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {message && <div className="mt-4 text-center text-teal-600 font-semibold">{message}</div>}
    </div>
  );
}

export function AdminSettingsModal({ open, onClose, experienceId, currentSettings }: { open: boolean, onClose: () => void, experienceId: string, currentSettings: { color?: string; profileSections?: string[] } }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[90vw] max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-0 relative">
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors text-2xl font-bold z-10" onClick={onClose}>&times;</button>
        <div className="p-8">
          <AdminSettings experienceId={experienceId} currentSettings={currentSettings} onSaveSuccess={onClose} />
        </div>
      </div>
    </div>
  );
} 