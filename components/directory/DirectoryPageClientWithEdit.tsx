"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { DirectoryGrid } from "./DirectoryGrid";
import { SearchBar } from "./SearchBar";
import { EditProfileModal } from "./EditProfileModal";
import { Profile } from "@/lib/types/profile";
import { updateProfile } from "@/app/actions/profile";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminSettingsModal } from "@/components/admin/admin-settings";
import { COLOR_THEMES } from "@/components/admin/admin-settings";

interface DirectoryPageClientWithEditProps {
  experienceId: string;
  userId: string;
  accessLevel: string;
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "gamers", label: "Gamers" },
  { key: "creators", label: "Creators" },
  { key: "developers", label: "Developers" },
  { key: "traders", label: "Traders" },
  { key: "students", label: "Students" },
  { key: "verified", label: "Verified" },
];

export function DirectoryPageClientWithEdit({ experienceId, userId, accessLevel }: DirectoryPageClientWithEditProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabledSections, setEnabledSections] = useState<string[] | null>(null);
  const [theme, setTheme] = useState(COLOR_THEMES[0]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminSettings, setAdminSettings] = useState<{ color?: string; profileSections?: string[] }>({});
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
      setEnabledSections(data.settings?.profileSections || []);
      const foundTheme = COLOR_THEMES.find(t => t.color === data.settings?.color) || COLOR_THEMES[0];
      setTheme(foundTheme);
    }
    fetchEnabledSections();

    // Fetch Introductions feed ID from API route and log it
    fetch(`/api/whop-introductions-feed?experienceId=${experienceId}`)
      .then(res => res.json())
      .then(data => {
        if (data.feedId) {
          console.log('[DirectoryPageClientWithEdit] Introductions feed ID from API:', data.feedId);
        } else {
          console.error('[DirectoryPageClientWithEdit] Error from API:', data.error);
        }
      })
      .catch(err => {
        console.error('[DirectoryPageClientWithEdit] Error fetching Introductions feed ID from API:', err);
      });
  }, [experienceId]);

  // Fetch admin settings for modal
  const fetchAdminSettings = async () => {
    const res = await fetch(`/api/experience/settings?experienceId=${experienceId}`);
    const data = await res.json();
    setAdminSettings(data.settings || {});
  };

  // Fix: define fetchEnabledSections for use after admin modal closes
  const fetchEnabledSections = async () => {
    const res = await fetch(`/api/experience/settings?experienceId=${experienceId}`);
    const data = await res.json();
    setEnabledSections(data.settings?.profileSections || []);
    const foundTheme = COLOR_THEMES.find(t => t.color === data.settings?.color) || COLOR_THEMES[0];
    setTheme(foundTheme);
  };

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

  // Map color value to gradient class
  const getGradientClass = () => theme.gradient;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center py-0 px-0 relative ${getGradientClass()}`}>
      {/* Header */}
      <header className="w-full flex flex-col items-center justify-center pt-10 pb-6">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto mb-4 px-2">
          <div>
            <button
              className={`directory-action-btn border-2 border-gray-200 ${theme.buttonText} ${theme.buttonBg} px-5 py-2.5 rounded-xl font-semibold text-base flex items-center gap-2 shadow-sm ${theme.buttonHoverBg} transition`}
              style={{ minWidth: 120 }}
              onClick={async () => { await fetchAdminSettings(); setShowAdminModal(true); }}
            >
              <span role="img" aria-label="settings">⚙️</span> Admin Settings
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <h1 className={`page-title text-4xl font-extrabold ${theme.text} text-center`}>Community Hub</h1>
            <p className={`page-subtitle text-lg ${theme.text} text-center max-w-2xl`}>Connect with amazing people in our community. Every member brings unique skills, experiences, and perspectives.</p>
          </div>
          <div>
            <button
              className={`directory-action-btn border-2 border-gray-200 ${theme.buttonText} ${theme.buttonBg} px-5 py-2.5 rounded-xl font-semibold text-base flex items-center gap-2 shadow-sm ${theme.buttonHoverBg} transition`}
              style={{ minWidth: 120 }}
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </header>
      <div className="search-section flex justify-center mb-6 w-full">
        <SearchBar experienceId={experienceId} tab={activeFilter} />
      </div>
      <div className="filters flex justify-center gap-2 mb-8 flex-wrap w-full">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`filter-btn px-4 py-2 rounded-full font-semibold text-sm border-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-300
              ${activeFilter === f.key || (f.key === "all" && !searchParams.get("tab"))
                ? "bg-indigo-500 text-white border-indigo-500 shadow"
                : "bg-[#f8f9fa] text-gray-700 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600"}
            `}
            onClick={() => handleFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <main className="w-full max-w-7xl px-2 pb-16">
        <Suspense fallback={<div>Loading profiles...</div>}>
          <DirectoryGrid experienceId={experienceId} currentUserId={userId} canEdit={canEdit} tab={activeFilter} theme={theme} />
        </Suspense>
      </main>
      {/* Edit Profile Modal */}
      {showEditModal && currentProfile && enabledSections && (
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
          theme={theme}
        />
      )}
      {/* Admin Settings Modal */}
      {showAdminModal && (
        <AdminSettingsModal
          open={showAdminModal}
          experienceId={experienceId}
          currentSettings={adminSettings}
          onClose={() => {
            setShowAdminModal(false);
            fetchEnabledSections();
          }}
        />
      )}
    </div>
  );
} 