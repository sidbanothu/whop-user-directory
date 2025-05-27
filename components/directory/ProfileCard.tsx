import Image from "next/image";
import { Profile } from "@/lib/types/profile";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OPTIONAL_SECTIONS } from "@/components/profile/optionalSectionsConfig";
import { FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";

interface ProfileCardProps {
  profile: Profile;
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

export function ProfileCard({ profile }: ProfileCardProps) {
  // Extract fields from sections
  const location = getFieldFromSections(profile, ["location"]);
  const stats = getNumberFieldFromSections(profile, ["subscribers", "followers"]);
  const experience = getFieldFromSections(profile, ["experience"]);
  const education = getFieldFromSections(profile, ["education"]);

  // Collect all section badges (with icons)
  const sectionBadges = profile.sections.map((section) => {
    const config = OPTIONAL_SECTIONS.find((s) => s.key === section.type);
    const Icon = config?.icon;
    return (
      <span key={section.type} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-900 font-medium text-sm gap-1 mr-2 mb-1">
        {Icon && <Icon className={`h-4 w-4 ${config?.iconColor}`} />}
        {section.title}
      </span>
    );
  });

  // Collect all tags (flatten arrays from section data)
  let tags: string[] = [];
  profile.sections.forEach((section) => {
    Object.values(section.data).forEach((val) => {
      if (Array.isArray(val)) tags = tags.concat(val);
    });
  });
  const visibleTags = tags.slice(0, MAX_TAGS);
  const moreCount = tags.length - visibleTags.length;

  return (
    <Card className="rounded-2xl border bg-white shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-14 w-14">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              className="object-cover rounded-full border border-gray-200"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
              <span>👤</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold truncate">{profile.name}</h3>
            {/* Optionally add verified badge here */}
          </div>
          <div className="text-gray-500 text-sm truncate">@{profile.username}</div>
          {location && (
            <div className="flex items-center text-xs text-gray-400 gap-1 mt-0.5">
              <FaMapMarkerAlt className="h-3 w-3" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>
      {profile.bio && (
        <div className="mb-3 text-sm text-gray-700 line-clamp-2">{profile.bio}</div>
      )}
      <div className="flex flex-wrap gap-2 mb-3">
        {sectionBadges}
      </div>
      {stats && (
        <div className="flex items-center text-sm text-gray-600 mb-2 gap-1">
          <FaUserFriends className="h-4 w-4" />
          <span>{stats.toLocaleString()} subscribers</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mb-3">
        {visibleTags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
            {tag}
          </Badge>
        ))}
        {moreCount > 0 && (
          <Badge variant="secondary" className="text-xs px-2 py-0.5">+{moreCount} more</Badge>
        )}
      </div>
      {experience && (
        <div className="text-xs text-gray-500 mt-auto">Experience: {experience}</div>
      )}
      {education && (
        <div className="text-xs text-gray-500 mt-1">{education}</div>
      )}
    </Card>
  );
} 