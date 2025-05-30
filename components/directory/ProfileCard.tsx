import Image from "next/image";
import { Profile } from "@/lib/types/profile";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OPTIONAL_SECTIONS } from "@/components/profile/optionalSectionsConfig";
import { FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { ProfileModal } from "./ProfileModal";
import { useState } from "react";
import { formatDistanceToNow } from 'date-fns';

interface ProfileCardProps {
  profile: Profile;
  onEdit?: (profile: Profile) => void;
  isEditable?: boolean;
  currentUserId?: string | null;
  enabledSections?: string[];
  theme: any;
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

export function ProfileCard({ profile, onEdit, isEditable = false, enabledSections, theme }: ProfileCardProps) {
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

  // Social links: collect from all possible keys
  const SOCIAL_LINK_KEYS = ['links', 'handles', 'projects', 'achievements'];
  let socialLinks: { platform: string; url: string }[] = [];
  profile.sections.forEach(section => {
    SOCIAL_LINK_KEYS.forEach(key => {
      if (section.data && section.data[key] && typeof section.data[key] === 'object') {
        Object.entries(section.data[key]).forEach(([platform, url]) => {
          if (typeof url === 'string' && url.trim()) {
            socialLinks.push({ platform, url });
          }
        });
      }
    });
  });
  // Limit to 4 links for layout, show '+N more' if needed
  const MAX_LINKS = 4;
  const visibleLinks = socialLinks.slice(0, MAX_LINKS);
  const extraLinksCount = socialLinks.length - MAX_LINKS;

  const handleClick = () => {
    setShowModal(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(profile);
  };

  // Section badges (with emoji)
  const sectionBadges = activeSections.map((type, i) => (
    <div key={i} className={`profile-tag ${type} flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold`}> 
      <span>{sectionIcons[type]}</span> <span>{sectionLabels[type]}</span>
    </div>
  ));

  // Verification badge
  const verificationBadge = profile.is_premium_member ? (
    <div className="verified-badge bg-gradient-to-r from-green-500 to-teal-400 border-2 border-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ml-2">
      ✓ Verified
    </div>
  ) : (
    <div className="verification-badge bg-gray-100 border-2 border-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ml-2">
      Not Verified
    </div>
  );

  // Joined date
  const joinedDate = profile.createdAt ? (
    <div className="joined-date text-gray-400 text-xs mb-1">
      Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
    </div>
  ) : null;

  // Social link icon mapping
  const linkIconClass: Record<string, string> = {
    github: 'github-icon',
    youtube: 'youtube-icon',
    linkedin: 'linkedin-icon',
    portfolio: 'portfolio-icon',
    steam: 'steam-icon',
    twitch: 'youtube-icon',
    binance: 'binance-icon',
    university: 'university-icon',
    website: 'portfolio-icon',
    blog: 'portfolio-icon',
    twitter: 'twitter-icon',
    discord: 'discord-icon',
    mit: 'university-icon',
    stanford: 'university-icon',
    instagram: 'portfolio-icon',
    nyu: 'university-icon',
  };

  return (
    <>
      <div
        className="profile-card bg-white border-2 border-gray-200 rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl"
        onClick={handleClick}
      >
        <div className="profile-content flex flex-col gap-4">
          <div className="profile-header flex items-start gap-4">
            <div className="profile-avatar w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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
            <div className="profile-info flex-1">
              <div className="profile-name text-lg font-bold text-gray-900 flex items-center gap-2">
                {profile.name}
                {verificationBadge}
              </div>
              <div className="profile-username text-gray-500 text-sm mb-1">@{profile.username}</div>
              {joinedDate}
              <div className="profile-bio text-gray-700 text-sm mb-1">{profile.bio}</div>
            </div>
          </div>
          <div className="profile-tags flex flex-wrap gap-2 mb-1">
            {sectionBadges}
          </div>
          {socialLinks.length > 0 && (
            <div className="profile-links flex flex-wrap gap-2 mt-1">
              {visibleLinks.map((link, i) => {
                const url = link.url.startsWith('http://') || link.url.startsWith('https://')
                  ? link.url
                  : `https://${link.url}`;
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`profile-link flex items-center gap-1 text-gray-700 text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-indigo-50 transition ${linkIconClass[link.platform.toLowerCase()] || 'portfolio-icon'}`}
                  >
                    <span className={`profile-link-icon ${linkIconClass[link.platform.toLowerCase()] || 'portfolio-icon'} w-4 h-4 flex items-center justify-center`}></span>
                    {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  </a>
                );
              })}
              {extraLinksCount > 0 && (
                <span className="profile-link text-gray-400 text-xs px-2 py-1">+{extraLinksCount} more</span>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Profile Modal */}
      {showModal && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowModal(false)}
          enabledSections={enabledSections}
          theme={theme}
        />
      )}
    </>
  );
} 