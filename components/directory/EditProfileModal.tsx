import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Profile, ProfileSection } from "@/lib/types/profile";

interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updatedProfile: Profile) => Promise<void>;
}

const sectionMeta = {
  gamer: {
    icon: "🎮",
    title: "Gamer",
    desc: "Show off your gaming skills, favorite titles, and platforms.",
    fields: ["games", "platforms", "handles"],
  },
  creator: {
    icon: "🎨",
    title: "Creator",
    desc: "Share your creative outlets, channels, and content.",
    fields: ["mediums", "links"],
  },
  developer: {
    icon: "👨‍💻",
    title: "Developer",
    desc: "Highlight your dev skills, languages, and projects.",
    fields: ["languages", "frameworks", "projects"],
  },
  trader: {
    icon: "📈",
    title: "Trader",
    desc: "Share your trading interests, assets, and platforms.",
    fields: ["assets", "platforms"],
  },
  student: {
    icon: "🎓",
    title: "Student",
    desc: "Show your studies, interests, and achievements.",
    fields: ["subjects", "achievements"],
  },
};

function isProfileSectionType(type: string): type is ProfileSection['type'] {
  return ["gamer", "creator", "trader", "developer", "student"].includes(type);
}

// Type guard for input fields
function isInputValue(value: unknown): value is string | string[] | undefined {
  return (
    typeof value === "string" ||
    Array.isArray(value) ||
    value === undefined
  );
}

export function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() => ({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    sections: profile.sections
      .filter(section => isProfileSectionType(section.type))
      .map(section => ({
        ...section,
        type: section.type as ProfileSection["type"],
        title: section.title,
        data: section.data as { [key: string]: string | string[] | Record<string, string> }
      }) as ProfileSection),
  }));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    gamer: true,
    creator: false,
    developer: false,
    trader: false,
    student: false,
  });

  // Modal close logic
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  // Section helpers
  const getSectionIdx = (type: string) => formData.sections.findIndex(s => s.type === type);
  const ensureSection = (type: ProfileSection["type"]) => {
    let idx = getSectionIdx(type);
    if (idx === -1) {
      setFormData(prev => ({
        ...prev,
        sections: [
          ...prev.sections,
          { type, title: sectionMeta[type].title, data: {} },
        ],
      }));
      idx = formData.sections.length;
    }
    return idx;
  };

  // Field change handlers
  const handleFieldChange = (sectionType: string, key: string, value: string) => {
    setFormData(prev => {
      const idx = getSectionIdx(sectionType);
      if (idx === -1) return prev;
      const newSections = [...prev.sections];
      newSections[idx] = {
        ...newSections[idx],
        data: { ...newSections[idx].data, [key]: value },
      };
      return { ...prev, sections: newSections };
    });
  };
  const handleArrayFieldChange = (sectionType: string, key: string, value: string) => {
    handleFieldChange(sectionType, key, value);
  };
  // Key-value pair handlers
  const handleKVChange = (sectionType: string, key: string, idx: number, subKey: string, subValue: string) => {
    setFormData(prev => {
      const sIdx = getSectionIdx(sectionType);
      if (sIdx === -1) return prev;
      const section = prev.sections[sIdx];
      const obj = { ...(section.data[key] as Record<string, string> || {}) };
      const keys = Object.keys(obj);
      const oldKey = keys[idx];
      if (oldKey !== subKey) {
        // Key changed
        const val = obj[oldKey];
        delete obj[oldKey];
        obj[subKey] = subValue;
      } else {
        obj[subKey] = subValue;
      }
      const newSections = [...prev.sections];
      newSections[sIdx] = {
        ...section,
        data: { ...section.data, [key]: obj },
      };
      return { ...prev, sections: newSections };
    });
  };
  const handleKVAdd = (sectionType: string, key: string) => {
    setFormData(prev => {
      const sIdx = getSectionIdx(sectionType);
      if (sIdx === -1) return prev;
      const section = prev.sections[sIdx];
      const obj = { ...(section.data[key] as Record<string, string> || {}) };
      obj[""] = "";
      const newSections = [...prev.sections];
      newSections[sIdx] = {
        ...section,
        data: { ...section.data, [key]: obj },
      };
      return { ...prev, sections: newSections };
    });
  };
  const handleKVRemove = (sectionType: string, key: string, subKey: string) => {
    setFormData(prev => {
      const sIdx = getSectionIdx(sectionType);
      if (sIdx === -1) return prev;
      const section = prev.sections[sIdx];
      const obj = { ...(section.data[key] as Record<string, string> || {}) };
      delete obj[subKey];
      const newSections = [...prev.sections];
      newSections[sIdx] = {
        ...section,
        data: { ...section.data, [key]: obj },
      };
      return { ...prev, sections: newSections };
    });
  };

  // Section expand/collapse
  const toggleSection = (type: string) => {
    setExpanded(prev => ({ ...prev, [type]: !prev[type] }));
    if (getSectionIdx(type) === -1) ensureSection(type as ProfileSection["type"]);
  };

  // Save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedProfile: Profile = {
        ...profile,
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        sections: formData.sections.map(section => ({
          ...section,
          type: section.type as ProfileSection["type"],
        })),
      };
      await onSave(updatedProfile);
      onClose();
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Renderers
  const renderKVInputs = (sectionType: string, key: string, obj: Record<string, string>) => (
    <div className="space-y-2">
      {Object.entries(obj).map(([k, v], idx) => (
        <div key={idx} className="flex gap-2 mb-1 items-center">
          <input
            type="text"
            value={k}
            onChange={e => handleKVChange(sectionType, key, idx, e.target.value, v)}
            className="w-1/3 px-2 py-1 rounded border border-gray-200 text-xs"
            placeholder="Key"
          />
          <input
            type="text"
            value={v}
            onChange={e => handleKVChange(sectionType, key, idx, k, e.target.value)}
            className="w-2/3 px-2 py-1 rounded border border-gray-200 text-xs"
            placeholder="Value"
          />
          <button type="button" onClick={() => handleKVRemove(sectionType, key, k)} className="text-red-500 text-lg px-2">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => handleKVAdd(sectionType, key)} className="mt-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">Add</button>
    </div>
  );

  const renderSection = (type: ProfileSection["type"]) => {
    const meta = sectionMeta[type];
    const idx = getSectionIdx(type);
    const section = idx !== -1 ? formData.sections[idx] : { type, title: meta.title, data: {} };
    return (
      <div className={`optional-section bg-white rounded-2xl shadow border mb-6 ${expanded[type] ? "" : "opacity-70"}`}> 
        <div className={`section-header flex items-center gap-4 px-6 py-4 cursor-pointer rounded-t-2xl ${expanded[type] ? "bg-indigo-200/80" : "bg-gray-100"}`} onClick={() => toggleSection(type)}>
          <div className="section-icon-form text-2xl">{meta.icon}</div>
          <div className="flex-1">
            <div className="font-semibold">{meta.title}</div>
            <div className="text-xs opacity-80">{meta.desc}</div>
          </div>
          <div className="section-toggle text-2xl font-bold select-none">{expanded[type] ? "−" : "+"}</div>
        </div>
        <div className={`section-content transition-all duration-300 px-6 pt-4 pb-6 ${expanded[type] ? "block" : "hidden"}`}>
          {/* Render fields */}
          {meta.fields.map(field => {
            const value = section.data[field];
            if (isInputValue(value)) {
              // Array or string field (comma separated)
              return (
                <div className="form-group mb-4" key={field}>
                  <label className="form-label block text-sm font-semibold mb-1 capitalize">{field.replace(/_/g, " ")}</label>
                  <input
                    type="text"
                    value={Array.isArray(value) ? value.join(", ") : value || ""}
                    onChange={e => handleArrayFieldChange(type, field, e.target.value)}
                    className="form-input w-full px-3 py-2 rounded border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm"
                    placeholder={field === "games" ? "Add a game" : field === "platforms" ? "e.g. PC, PS5" : ""}
                  />
                </div>
              );
            } else if (typeof value === "object" && value !== null) {
              // Key-value pairs
              return (
                <div className="form-group mb-4" key={field}>
                  <label className="form-label block text-sm font-semibold mb-1 capitalize">{field.replace(/_/g, " ")}</label>
                  {renderKVInputs(type, field, value as Record<string, string>)}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="w-[95%] max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-8 rounded-t-2xl relative">
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-2xl font-bold" onClick={onClose}>&times;</button>
          <h2 className="text-3xl font-bold text-white mb-1">Edit Your Profile</h2>
          <div className="text-white text-base opacity-80">Manage your profile and connect with community members</div>
        </div>
        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow border p-6 mb-2">
            <h3 className="text-xl font-bold mb-4">Basic Info</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all min-h-[80px] resize-y"
                placeholder="Tell everyone about yourself"
              />
            </div>
          </div>
          {/* Optional Sections */}
          <div>
            <h3 className="text-xl font-bold mb-4">Optional Sections</h3>
            {(["gamer", "creator", "developer", "trader", "student"] as ProfileSection["type"][]).map(type => (
              <div key={type}>{renderSection(type)}</div>
            ))}
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 