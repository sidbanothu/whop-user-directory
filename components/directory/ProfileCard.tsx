import Image from "next/image";
import { Profile } from "@/lib/types/profile";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OPTIONAL_SECTIONS } from "@/components/profile/optionalSectionsConfig";
import { FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { ProfileModal } from "./ProfileModal";
import { useState } from "react";

interface ProfileCardProps {
  profile: Profile;
  onEdit?: (profile: Profile) => void;
  isEditable?: boolean;
  currentUserId?: string | null;
  enabledSections?: string[];
}

const MAX_TAGS = 3;

function getFieldFromSections(profile: Profile, keys: string[]): string | undefined {
  for (const section of profile.sections) {
    for (const key of keys) {
      const value = section.data[key];
      if (typeof value === "string" && value.trim()) return value;
    }
  }
  return undefined;
}

function getNumberFieldFromSections(profile: Profile, keys: string[]): number | undefined {
  for (const section of profile.sections) {
    for (const key of keys) {
      const value = section.data[key];
      if (typeof value === "string" && !isNaN(Number(value))) return Number(value);
    }
  }
  return undefined;
}

function isValidAvatarUrl(url?: string | null) {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

export function ProfileCard({ profile, onEdit, isEditable = false, enabledSections }: ProfileCardProps) {
  const [showModal, setShowModal] = useState(false);

  // Section badges
  const sectionIcons: Record<string, string> = {
    gamer: "🎮",
    creator: "🎨",
    developer: "👨‍💻",
    trader: "📈",
    student: "🎓",
  };
  const sectionLabels: Record<string, string> = {
    gamer: "Gamer",
    creator: "Creator",
    developer: "Developer",
    trader: "Trader",
    student: "Student",
  };
  const activeSections = profile.sections.map(s => s.type).filter(type => !enabledSections || enabledSections.includes(type));

  // Skills (languages)
  const developerSection = profile.sections.find((s) => s.type === "developer");
  let skills: string[] = [];
  if (developerSection?.data?.languages) {
    if (Array.isArray(developerSection.data.languages)) {
      skills = developerSection.data.languages;
    } else if (typeof developerSection.data.languages === "string") {
      skills = [developerSection.data.languages];
    }
  }
  // Games
  const gamerSection = profile.sections.find((s) => s.type === "gamer");
  let games: string[] = [];
  if (gamerSection?.data?.games) {
    if (Array.isArray(gamerSection.data.games)) {
      games = gamerSection.data.games;
    } else if (typeof gamerSection.data.games === "string") {
      games = [gamerSection.data.games];
    }
  }

  const handleClick = () => {
    setShowModal(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(profile);
  };

  return (
    <>
      <div
        className="user-card group relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl"
        onClick={handleClick}
      >
        {/* Top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400" />
        
        {/* Edit button (floating) */}
        {isEditable && onEdit && (
          <button
            onClick={handleEdit}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        )}

        <div className="user-header flex items-center mb-6">
          <div className="avatar w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg mr-4">
            {isValidAvatarUrl(profile.avatarUrl) ? (
              <Image
                src={profile.avatarUrl!}
                alt={profile.name}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            ) : (
              <span>{profile.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || profile.username?.[0]?.toUpperCase() || "U"}</span>
            )}
          </div>
          <div className="user-info">
            <h3 className="text-xl font-semibold mb-1 text-gray-900 flex items-center gap-2">
              {profile.name}
              {profile.is_premium_member && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-white text-xs font-bold ml-2 shadow" title="Premium Member">
                  <span role="img" aria-label="star">🌟</span> Premium
                </span>
              )}
            </h3>
            <div className="username text-indigo-500 font-medium text-sm">@{profile.username}</div>
          </div>
        </div>
        <div className="bio text-gray-700 mb-4 line-clamp-2">{profile.bio}</div>
        {/* Section badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {activeSections.map((type, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100">
              <span>{sectionIcons[type]}</span>
              <span>{sectionLabels[type]}</span>
            </span>
          ))}
        </div>
        {/* Skills row */}
        {skills.length > 0 && (
          <div className="flex items-center gap-2 text-gray-700 text-base mb-1">
            <span role="img" aria-label="skills">💻</span>
            <span>{skills.join(", ")}</span>
          </div>
        )}
        {/* Games row */}
        {games.length > 0 && (
          <div className="flex items-center gap-2 text-gray-700 text-base">
            <span role="img" aria-label="games">🎯</span>
            <span>{games.join(", ")}</span>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showModal && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowModal(false)}
          enabledSections={enabledSections}
        />
      )}
    </>
  );
} 