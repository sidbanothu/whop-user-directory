import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Profile, ProfileSection } from "@/lib/types/profile";
import { ProfileForm } from "@/components/profile/ProfileForm";

interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  enabledSections?: string[];
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

export function EditProfileModal({ profile, onClose, enabledSections }: EditProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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
        <div className="p-8 space-y-8 overflow-y-auto">
          <ProfileForm initialData={profile} experienceId={profile.experience_id} onClose={onClose} />
        </div>
      </div>
    </div>
  );
} 