import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Profile, ProfileSection } from "@/lib/types/profile";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PremiumBadgeButton } from "@/components/PremiumBadgeButton";

interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updatedProfile: Profile) => Promise<void>;
  enabledSections?: string[];
  theme: any;
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

export function EditProfileModal({ profile, onClose, onSave, enabledSections, theme }: EditProfileModalProps) {
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
      <div className="w-[90vw] max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl p-0 bg-white" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={`${theme.modalHeaderGradient} p-8 rounded-t-3xl relative`}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-2xl font-bold" style={{ color: theme.textOnGradient }} onClick={onClose}>&times;</button>
          <h2 className={`text-3xl font-bold mb-1 ${theme.textOnGradient}`}>Edit Your Profile</h2>
          <div className={`${theme.textOnGradient} text-base opacity-80 mb-4`}>Manage your profile and connect with community members</div>
          {/* Premium Status */}
          <div className="flex items-center gap-4 mb-2">
            {profile.isPremiumMember ? null : (
              <PremiumBadgeButton userId={profile.userId} experienceId={profile.experienceId} label="Get Verified $1" />
            )}
          </div>
        </div>
        {/* Modal Body - no preview, more spacious */}
        <div className={`p-10 space-y-10 overflow-y-auto rounded-b-3xl min-h-[60vh] bg-white`}>
          <ProfileForm initialData={profile} experienceId={profile.experienceId} onClose={onClose} onSave={onSave} />
        </div>
      </div>
    </div>
  );
} 