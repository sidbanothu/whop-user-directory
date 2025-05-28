import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Profile, ProfileSection } from "@/lib/types/profile";

interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updatedProfile: Profile) => Promise<void>;
}

function isProfileSectionType(type: string): type is ProfileSection['type'] {
  return ["gamer", "creator", "trader", "developer", "student"].includes(type);
}

export function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
    sections: Array<{
      type: string;
      title: string;
      data: { [key: string]: string | string[] | Record<string, string> };
    }>;
  }>(() => ({
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

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Close modal on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  // Handle changes for section fields
  const handleSectionFieldChange = (sectionIdx: number, key: string, value: string | string[]) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, idx) => {
        if (idx !== sectionIdx) return section;
        return {
          ...section,
          data: {
            ...section.data,
            [key]: value,
          },
        };
      });
      return { ...prev, sections: newSections };
    });
  };

  // Add handlers for editing object fields in sections
  const handleSectionObjectKeyChange = (sectionIdx: number, key: string, oldSubKey: string, newSubKey: string) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, idx) => {
        if (idx !== sectionIdx) return section;
        const obj = typeof section.data[key] === 'object' && section.data[key] !== null && !Array.isArray(section.data[key])
          ? { ...section.data[key] as Record<string, string> }
          : {};
        obj[newSubKey] = obj[oldSubKey];
        delete obj[oldSubKey];
        return { ...section, data: { ...section.data, [key]: obj } };
      });
      return { ...prev, sections: newSections };
    });
  };

  const handleSectionObjectValueChange = (sectionIdx: number, key: string, subKey: string, newValue: string) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, idx) => {
        if (idx !== sectionIdx) return section;
        const obj = typeof section.data[key] === 'object' && section.data[key] !== null && !Array.isArray(section.data[key])
          ? { ...section.data[key] as Record<string, string> }
          : {};
        obj[subKey] = newValue;
        return {
          ...section,
          data: {
            ...section.data,
            [key]: obj
          }
        };
      });
      return { ...prev, sections: newSections };
    });
  };

  const handleSectionRemoveObjectField = (sectionIdx: number, key: string, subKey: string) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, idx) => {
        if (idx !== sectionIdx) return section;
        const obj = typeof section.data[key] === 'object' && section.data[key] !== null && !Array.isArray(section.data[key])
          ? { ...section.data[key] as Record<string, string> }
          : {};
        delete obj[subKey];
        return { ...section, data: { ...section.data, [key]: obj } };
      });
      return { ...prev, sections: newSections };
    });
  };

  const handleSectionAddObjectField = (sectionIdx: number, key: string) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, idx) => {
        if (idx !== sectionIdx) return section;
        const obj = typeof section.data[key] === 'object' && section.data[key] !== null && !Array.isArray(section.data[key])
          ? { ...section.data[key] as Record<string, string> }
          : {};
        obj[""] = "";
        return {
          ...section,
          data: {
            ...section.data,
            [key]: obj
          }
        };
      });
      return { ...prev, sections: newSections };
    });
  };

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
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      ref={modalRef} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        className="modal-content w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl transform scale-100 transition-all duration-300 animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header bg-gradient-to-r from-indigo-400 to-purple-400 p-6 rounded-t-2xl relative">
          <button 
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <div className="avatar-upload relative w-20 h-20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center overflow-hidden">
                {formData.avatarUrl ? (
                  <Image
                    src={formData.avatarUrl}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {formData.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                +
              </button>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Avatar URL"
                value={formData.avatarUrl}
                onChange={e => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Name and Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all min-h-[100px] resize-y"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Editable Sections */}
          {formData.sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2 capitalize">{section.title || section.type}</h3>
              {Object.entries(section.data).map(([key, value], i) => (
                <div key={i} className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{key.replace(/_/g, " ")}</label>
                  {Array.isArray(value) ? (
                    <input
                      type="text"
                      value={value.join(", ")}
                      onChange={e => handleSectionFieldChange(sectionIdx, key, e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                      className="w-full px-3 py-2 rounded border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm"
                      placeholder="Comma separated values"
                    />
                  ) : typeof value === "object" && value !== null ? (
                    <div className="space-y-2">
                      {Object.entries(value).map(([subKey, subValue], idx) => (
                        <div key={idx} className="flex gap-2 mb-1 items-center">
                          <input
                            type="text"
                            value={subKey}
                            onChange={e => handleSectionObjectKeyChange(sectionIdx, key, subKey, e.target.value)}
                            className="w-1/3 px-2 py-1 rounded border border-gray-200 text-xs"
                            placeholder="Key"
                          />
                          <input
                            type="text"
                            value={subValue as string}
                            onChange={e => handleSectionObjectValueChange(sectionIdx, key, subKey, e.target.value)}
                            className="w-2/3 px-2 py-1 rounded border border-gray-200 text-xs"
                            placeholder="Value"
                          />
                          <button type="button" onClick={() => handleSectionRemoveObjectField(sectionIdx, key, subKey)} className="text-red-500 text-lg px-2">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleSectionAddObjectField(sectionIdx, key)} className="mt-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">Add {key.slice(0, -1)}</button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={value as string}
                      onChange={e => handleSectionFieldChange(sectionIdx, key, e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}

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