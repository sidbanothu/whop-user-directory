'use client';

import { useState } from 'react';
import React from 'react';

const PROFILE_SECTION_OPTIONS = [
  "gamer",
  "creator",
  "trader",
  "developer",
  "student",
];

interface AdminSettingsProps {
  experienceId: string;
  currentSettings: {
    color?: string;
    profileSections?: string[];
  };
}

export function AdminSettings({ experienceId, currentSettings }: AdminSettingsProps) {
  const [color, setColor] = useState(currentSettings.color || "#2563eb");
  const [profileSections, setProfileSections] = useState<string[]>(currentSettings.profileSections || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      const response = await fetch("/api/experience/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId,
          color,
          profileSections,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }
      setMessage("Settings saved successfully!");
    } catch (err: any) {
      setMessage(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Theme Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Profile Sections</label>
        <div className="flex flex-wrap gap-2">
          {PROFILE_SECTION_OPTIONS.map((section) => (
            <label key={section} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={profileSections.includes(section)}
                onChange={() => handleSectionChange(section)}
              />
              <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
      {message && <div className="mt-4 text-center text-red-600">{message}</div>}
    </div>
  );
}

export function AdminSettingsModal({ open, onClose, experienceId, currentSettings }: { open: boolean, onClose: () => void, experienceId: string, currentSettings: { color?: string; profileSections?: string[] } }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[90vw] max-w-lg max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-0 relative">
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors text-2xl font-bold z-10" onClick={onClose}>&times;</button>
        <div className="p-8">
          <AdminSettings experienceId={experienceId} currentSettings={currentSettings} />
        </div>
      </div>
    </div>
  );
} 