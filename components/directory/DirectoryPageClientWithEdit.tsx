"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { DirectoryGrid } from "./DirectoryGrid";
import { SearchBar } from "./SearchBar";
import { EditProfileModal } from "./EditProfileModal";
import { Profile } from "@/lib/types/profile";
import { updateProfile } from "@/app/actions/profile";
import { useRouter, useSearchParams } from "next/navigation";

interface DirectoryPageClientWithEditProps {
  experienceId: string;
  userId: string;
  accessLevel: string;
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "developers", label: "Developers" },
  { key: "creators", label: "Creators" },
  { key: "traders", label: "Traders" },
  { key: "students", label: "Students" },
];

export function DirectoryPageClientWithEdit({ experienceId, userId, accessLevel }: DirectoryPageClientWithEditProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabledSections, setEnabledSections] = useState<string[] | null>(null);
  const [themeColor, setThemeColor] = useState<string | null>(null);
  const activeFilter = searchParams.get("tab") || "all";

  useEffect(() => {
    async function fetchCurrentUserProfile() {
      setLoading(true);
      // Fetch the profile for the current user in this experience
      const res = await fetch(`/api/profile?userId=${userId}&experienceId=${experienceId}`);
      const data = await res.json();
      if (data && data.profile) {
        setCurrentProfile(data.profile);
      }
      setLoading(false);
    }
    fetchCurrentUserProfile();
  }, [userId, experienceId]);

  useEffect(() => {
    async function fetchEnabledSections() {
      const res = await fetch(`/api/experience/settings?experienceId=${experienceId}`);
      const data = await res.json();
      console.log('[DirectoryPageClientWithEdit] fetched enabledSections:', data.settings?.profileSections);
      setEnabledSections(data.settings?.profileSections || []);
      setThemeColor(data.settings?.color || null);
      console.log('[DirectoryPageClientWithEdit] fetched themeColor:', data.settings?.color);
    }
    fetchEnabledSections();
  }, [experienceId]);

  const canEdit = accessLevel === "admin" || accessLevel === "customer";

  // Filter bar handler
  const handleFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("tab");
    } else {
      params.set("tab", key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center py-0 px-0 relative ${themeColor ? '' : 'bg-gradient-to-br from-indigo-400 via-purple-400 to-indigo-500'}`}
      style={themeColor ? { background: themeColor } : undefined}
    >
      {/* Floating Edit Profile Button */}
      {canEdit && currentProfile && (
        <button
          className="fixed top-8 right-8 z-50 bg-white px-6 py-3 rounded-full shadow-lg text-yellow-500 font-semibold flex items-center gap-2 hover:bg-yellow-50 hover:text-yellow-600 transition-all text-base border border-yellow-100"
          onClick={() => setShowEditModal(true)}
        >
          <span>✏️</span>
          <span>Edit Profile</span>
        </button>
      )}
      {/* Header */}
      <header className="w-full flex flex-col items-center justify-center pt-16 pb-8">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg text-center">Community Hub</h1>
        <p className="text-lg text-white/90 mb-8 text-center max-w-2xl">Discover and connect with amazing people in our community. Every member brings unique skills, experiences, and perspectives.</p>
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center w-full gap-3">
            <div className="flex-1 w-full">
              <SearchBar experienceId={experienceId} tab={activeFilter} />
            </div>
            <div className="flex flex-row gap-2 mt-3 md:mt-0 h-[56px]">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`px-6 py-4 rounded-full font-bold text-base transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-300 h-full
                    ${activeFilter === f.key || (f.key === "all" && !searchParams.get("tab"))
                      ? "bg-white text-indigo-600 shadow-md"
                      : "bg-transparent text-white hover:bg-white/10"}
                  `}
                  onClick={() => handleFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-3xl mx-auto text-right text-white/80 text-sm mt-2">
          {/* Show count if available */}
        </div>
      </header>
      <main className="w-full max-w-7xl px-4 pb-16">
        <Suspense fallback={<div>Loading profiles...</div>}>
          <DirectoryGrid experienceId={experienceId} currentUserId={userId} canEdit={canEdit} tab={activeFilter} />
        </Suspense>
      </main>
      {/* Edit Profile Modal */}
      {showEditModal && currentProfile && enabledSections && (
        (() => {
          console.log('[DirectoryPageClientWithEdit] Rendering EditProfileModal with enabledSections:', enabledSections);
          return (
            <EditProfileModal
              profile={currentProfile}
              onClose={() => setShowEditModal(false)}
              onSave={async (updatedProfile) => {
                try {
                  const result = await updateProfile({
                    id: updatedProfile.id,
                    experienceId,
                    username: updatedProfile.username,
                    name: updatedProfile.name,
                    bio: updatedProfile.bio,
                    sections: updatedProfile.sections.map(section => ({
                      type: section.type,
                      data: section.data,
                    })),
                  });
                  if (!result.success) {
                    throw new Error(result.error || 'Failed to update profile');
                  }
                  setShowEditModal(false);
                  // Refetch the current profile
                  const res = await fetch(`/api/profile?userId=${userId}&experienceId=${experienceId}`);
                  const data = await res.json();
                  if (data && data.profile) {
                    setCurrentProfile(data.profile);
                    router.refresh();
                  } else {
                    throw new Error('Failed to refetch profile');
                  }
                } catch (error) {
                  console.error("Failed to update profile:", error);
                  alert(error instanceof Error ? error.message : 'Failed to update profile');
                }
              }}
              enabledSections={enabledSections}
            />
          );
        })()
      )}
    </div>
  );
} 