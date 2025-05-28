"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { DirectoryGrid } from "./DirectoryGrid";
import { SearchBar } from "./SearchBar";
import { EditProfileModal } from "./EditProfileModal";
import { Profile } from "@/lib/types/profile";

interface DirectoryPageClientWithEditProps {
  experienceId: string;
  userId: string;
  accessLevel: string;
}

export function DirectoryPageClientWithEdit({ experienceId, userId, accessLevel }: DirectoryPageClientWithEditProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  const canEdit = accessLevel === "admin" || accessLevel === "customer";

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Community Directory</h1>
        <SearchBar />
      </div>
      <Suspense fallback={<div>Loading profiles...</div>}>
        <DirectoryGrid experienceId={experienceId} currentUserId={userId} canEdit={canEdit} />
      </Suspense>
      {/* Floating Edit Profile Button */}
      {canEdit && currentProfile && (
        <button
          className="fixed top-8 right-8 z-50 bg-white/90 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg text-indigo-500 font-semibold flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all text-base"
          onClick={() => setShowEditModal(true)}
        >
          <span>✏️</span>
          <span>Edit Profile</span>
        </button>
      )}
      {/* Edit Profile Modal */}
      {showEditModal && currentProfile && (
        <EditProfileModal
          profile={currentProfile}
          onClose={() => setShowEditModal(false)}
          onSave={async () => {
            setShowEditModal(false);
            // Optionally, refetch profile here
          }}
        />
      )}
    </main>
  );
} 