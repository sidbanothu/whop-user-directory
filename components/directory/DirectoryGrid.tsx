"use client";

import { useSearchParams } from "next/navigation";
import { ProfileCard } from "./ProfileCard";
import { EditProfileModal } from "./EditProfileModal";
import { useProfiles } from "@/lib/hooks/use-profiles";
import { Profile } from "@/lib/types/profile";
import { useState, useEffect } from "react";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

interface DirectoryGridProps {
  experienceId: string;
  currentUserId: string;
  canEdit: boolean;
  tab?: string;
}

export function DirectoryGrid({ experienceId, currentUserId, canEdit, tab }: DirectoryGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profiles, isLoading, error } = useProfiles(experienceId);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [enabledSections, setEnabledSections] = useState<string[] | null>(null);
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  useEffect(() => {
    async function fetchEnabledSections() {
      const res = await fetch(`/api/experience/settings?experienceId=${experienceId}`);
      const data = await res.json();
      console.log('[DirectoryGrid] fetched enabledSections:', data.settings?.profileSections);
      setEnabledSections(data.settings?.profileSections || []);
    }
    fetchEnabledSections();
  }, [experienceId]);

  if (!enabledSections) {
    return <div>Loading directory...</div>;
  }

  // Filter by section type if tab is set and not 'all'
  let filteredProfiles = tab && tab !== "all"
    ? profiles.filter(profile => profile.sections.some(s => s.type === tab.slice(0, -1) && enabledSections.includes(s.type)))
    : profiles;

  // Apply search filter (name, username, bio only)
  if (searchQuery) {
    filteredProfiles = filteredProfiles.filter(profile => {
      return (
        (profile.name && profile.name.toLowerCase().includes(searchQuery)) ||
        (profile.username && profile.username.toLowerCase().includes(searchQuery)) ||
        (profile.bio && profile.bio.toLowerCase().includes(searchQuery))
      );
    });
  }

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
  };

  const handleSaveProfile = async (updatedProfile: Profile) => {
    try {
      console.log('[DirectoryGrid] Starting profile update with data:', updatedProfile);
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
      
      console.log('[DirectoryGrid] Update profile result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setEditingProfile(null);
      console.log('[DirectoryGrid] Profile updated successfully, refreshing data');
      // Force a refresh of the profiles data
      router.refresh();
    } catch (error) {
      console.error("[DirectoryGrid] Failed to update profile:", error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading profiles. Please try again later.
      </div>
    );
  }

  if (!filteredProfiles?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No profiles found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <ProfileCard 
            key={profile.id} 
            profile={profile}
            onEdit={handleEditProfile}
            isEditable={canEdit && currentUserId === profile.userId}
            currentUserId={currentUserId}
            enabledSections={enabledSections}
          />
        ))}
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && enabledSections && (
        (() => {
          console.log('[DirectoryGrid] Rendering EditProfileModal with enabledSections:', enabledSections);
          return (
            <EditProfileModal
              profile={editingProfile}
              onClose={() => setEditingProfile(null)}
              onSave={handleSaveProfile}
              enabledSections={enabledSections}
            />
          );
        })()
      )}
    </>
  );
} 