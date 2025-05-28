"use client";

import { useSearchParams } from "next/navigation";
import { ProfileCard } from "./ProfileCard";
import { EditProfileModal } from "./EditProfileModal";
import { useProfiles } from "@/lib/hooks/use-profiles";
import { Profile } from "@/lib/types/profile";
import { useState } from "react";
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
  const query = searchParams.get("q") ?? "";
  const { profiles, isLoading, error } = useProfiles(query);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // Filter by section type if tab is set and not 'all'
  const filteredProfiles = tab && tab !== "all"
    ? profiles.filter(profile => profile.sections.some(s => s.type === tab.slice(0, -1))) // e.g. 'developers' -> 'developer'
    : profiles;

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
  };

  const handleSaveProfile = async (updatedProfile: Profile) => {
    try {
      console.log('DirectoryGrid: Starting profile update...');
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

      setEditingProfile(null);
      // Force a refresh of the profiles data
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
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
          />
        ))}
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <EditProfileModal
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
} 