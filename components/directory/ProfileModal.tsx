import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Profile, ProfileSection } from "@/lib/types/profile";

interface ProfileModalProps {
  profile: Profile;
  onClose: () => void;
  enabledSections?: string[];
}

const sectionIcons: Record<string, string> = {
  gamer: "🎮",
  creator: "🎨",
  developer: "👨‍💻",
  trader: "📈",
  student: "🎓",
};

const sectionTitles: Record<string, string> = {
  gamer: "Gaming Profile",
  creator: "Creator Profile",
  developer: "Developer Profile",
  trader: "Trading Profile",
  student: "Academic Profile",
};

export function ProfileModal({ profile, onClose, enabledSections }: ProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  console.log('[ProfileModal] enabledSections:', enabledSections);
  const filteredSections = profile.sections && profile.sections.length > 0
    ? profile.sections.filter(section => !enabledSections || enabledSections.includes(section.type))
    : [];
  console.log('[ProfileModal] filteredSections:', filteredSections.map(s => s.type));

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("keydown", handleEscape); };
  }, [onClose]);

  // Close modal on click outside (backdrop)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  // Helper to render tag chips
  const TagList = ({ items }: { items: string[] }) => (
    <div className="flex flex-wrap gap-2 mt-1">
      {items.map((item, i) => (
        <span key={i} className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-medium">
          {item}
        </span>
      ))}
    </div>
  );

  // Helper to render info cards (for handles, links, projects, achievements)
  const InfoCard = ({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) => (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 mb-2">
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-bold text-lg">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-sm">{label}</div>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline break-all">{value}</a>
        ) : (
          <div className="text-xs text-gray-700 break-all">{value}</div>
        )}
      </div>
    </div>
  );

  // Section renderers
  const renderGamer = (section: ProfileSection) => (
    <div className="section bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{sectionIcons.gamer}</span>
        <span className="text-lg font-bold">Gaming Profile</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.data.games && Array.isArray(section.data.games) && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Favorite Games</div>
            <TagList items={section.data.games as string[]} />
          </div>
        )}
        {section.data.platforms && Array.isArray(section.data.platforms) && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Platforms</div>
            <TagList items={section.data.platforms as string[]} />
          </div>
        )}
      </div>
      {section.data.handles && typeof section.data.handles === "object" && !Array.isArray(section.data.handles) && (
        <div className="mt-6">
          <div className="text-xs font-semibold text-gray-500 mb-2">Gaming Handles</div>
          {Object.entries(section.data.handles as Record<string, string>).map(([key, value], i) => (
            <InfoCard key={i} icon={key[0].toUpperCase()} label={key} value={value} />
          ))}
        </div>
      )}
    </div>
  );

  const renderCreator = (section: ProfileSection) => (
    <div className="section bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{sectionIcons.creator}</span>
        <span className="text-lg font-bold">Creator Profile</span>
      </div>
      {section.data.mediums && Array.isArray(section.data.mediums) && (
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-1">Creative Mediums</div>
          <TagList items={section.data.mediums as string[]} />
        </div>
      )}
      {section.data.links && typeof section.data.links === "object" && !Array.isArray(section.data.links) && (
        <div className="mt-6">
          <div className="text-xs font-semibold text-gray-500 mb-2">Creator Links</div>
          {Object.entries(section.data.links as Record<string, string>).map(([key, value], i) => (
            <InfoCard key={i} icon={key[0].toUpperCase()} label={key} value={value} href={value.startsWith("http") ? value : undefined} />
          ))}
        </div>
      )}
    </div>
  );

  const renderDeveloper = (section: ProfileSection) => (
    <div className="section bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{sectionIcons.developer}</span>
        <span className="text-lg font-bold">Developer Profile</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.data.languages && Array.isArray(section.data.languages) && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Programming Languages</div>
            <TagList items={section.data.languages as string[]} />
          </div>
        )}
        {section.data.frameworks && Array.isArray(section.data.frameworks) && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Frameworks & Tools</div>
            <TagList items={section.data.frameworks as string[]} />
          </div>
        )}
      </div>
      {section.data.projects && typeof section.data.projects === "object" && !Array.isArray(section.data.projects) && (
        <div className="mt-6">
          <div className="text-xs font-semibold text-gray-500 mb-2">Featured Projects</div>
          {Object.entries(section.data.projects as Record<string, string>).map(([key, value], i) => (
            <InfoCard key={i} icon={"📁"} label={key} value={value} href={value.startsWith("http") ? value : undefined} />
          ))}
        </div>
      )}
    </div>
  );

  const renderTrader = (section: ProfileSection) => (
    <div className="section bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{sectionIcons.trader}</span>
        <span className="text-lg font-bold">Trading Profile</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.data.assets && Array.isArray(section.data.assets) && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Trading Assets</div>
            <TagList items={section.data.assets as string[]} />
          </div>
        )}
        {section.data.platforms && Array.isArray(section.data.platforms) && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Trading Platforms</div>
            <TagList items={section.data.platforms as string[]} />
          </div>
        )}
      </div>
    </div>
  );

  const renderStudent = (section: ProfileSection) => (
    <div className="section bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{sectionIcons.student}</span>
        <span className="text-lg font-bold">Academic Profile</span>
      </div>
      {section.data.subjects && Array.isArray(section.data.subjects) && (
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-1">Study Areas</div>
          <TagList items={section.data.subjects as string[]} />
        </div>
      )}
      {section.data.achievements && typeof section.data.achievements === "object" && !Array.isArray(section.data.achievements) && (
        <div className="mt-6">
          <div className="text-xs font-semibold text-gray-500 mb-2">Academic Achievements</div>
          {Object.entries(section.data.achievements as Record<string, string>).map(([key, value], i) => (
            <InfoCard key={i} icon={"🏆"} label={key} value={value} />
          ))}
        </div>
      )}
    </div>
  );

  // Section dispatcher
  const renderSection = (section: ProfileSection) => {
    switch (section.type) {
      case "gamer": return renderGamer(section);
      case "creator": return renderCreator(section);
      case "developer": return renderDeveloper(section);
      case "trader": return renderTrader(section);
      case "student": return renderStudent(section);
      default: return null;
    }
  };

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="w-[95%] max-w-3xl max-h-[95vh] overflow-y-auto bg-transparent rounded-2xl shadow-2xl">
        {/* Modal Header (gradient background) */}
        <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-8 rounded-t-2xl relative">
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-2xl font-bold" onClick={onClose}>&times;</button>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center shadow-lg">
              {profile.avatarUrl && profile.avatarUrl.trim() !== "" ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                  unoptimized
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <span className="text-3xl font-bold text-white">{profile.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-1 flex items-center gap-3">
                {profile.name}
                {profile.is_premium_member ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-white font-semibold text-base shadow">
                    <span role="img" aria-label="star">🌟</span> Premium Member
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold text-base">
                    <span role="img" aria-label="star">⭐</span> Not Premium
                  </span>
                )}
              </h2>
              <div className="text-lg opacity-90 mb-1">@{profile.username}</div>
              {profile.bio && <p className="text-base opacity-80 max-w-2xl">{profile.bio}</p>}
            </div>
          </div>
        </div>
        {/* Modal Body (sections) */}
        <div className="p-8 bg-gray-50 rounded-b-2xl">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, idx) => (
              <React.Fragment key={idx}>{renderSection(section)}</React.Fragment>
            ))
          ) : (
            <div className="text-gray-500">No additional info provided.</div>
          )}
        </div>
      </div>
    </div>
  );
} 