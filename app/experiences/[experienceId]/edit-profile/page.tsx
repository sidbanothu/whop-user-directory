import { cookies } from "next/headers";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DirectoryToggle } from "@/components/directory/DirectoryToggle";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { findOrCreateProfile } from "@/lib/db";
import { Profile, ProfileSection } from "@/lib/types/profile";
import { whopApi } from "@/lib/whop-api";

export default async function EditProfilePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = await params;
  const headersList = await headers();
  const { userId } = await verifyUserToken(headersList);

  // Fetch Whop user info
  const whopUser = (await whopApi.getUser({ userId })).publicUser;

  // Log the values being passed to findOrCreateProfile
  console.log("About to call findOrCreateProfile", {
    defaultUsername: whopUser.username,
    defaultName: whopUser.name,
    defaultBio: whopUser.bio,
    defaultAvatarUrl: whopUser.profilePicture?.sourceUrl,
  });

  // Use our new helper to find or create profile
  const profile = await findOrCreateProfile({
    userId,
    experienceId,
    defaultUsername: whopUser.username ?? "",
    defaultName: whopUser.name ?? "",
    defaultBio: whopUser.bio ?? "",
    defaultAvatarUrl: whopUser.profilePicture?.sourceUrl ?? "",
  });

  console.log("Profile after creation", profile);

  // Transform the profile to match the Profile type 
  const transformedProfile: Profile = {
    id: profile.id,
    userId: profile.userId,
    experienceId: profile.experienceId,
    username: profile.username,
    name: profile.name,
    bio: profile.bio ?? "",
    avatarUrl: profile.avatarUrl,
    sections: (profile.sections as any[] || []).map(section => ({
      type: section.type as ProfileSection["type"],
      title: section.title,
      data: section.data as Record<string, string | string[]>,
    })),
    createdAt: profile.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: profile.updatedAt?.toISOString() ?? new Date().toISOString(),
  };

  const justCreated = !profile.name && !profile.username; // Consider it "just created" if name and username are empty

  return (
    <main className="container mx-auto px-4 py-8">
      <DirectoryToggle experienceId={experienceId} activeTab="directory" />
      <p className="text-gray-500 text-base mb-4">Manage your profile and connect with community members</p>
      {justCreated && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
          Create your profile to join the directory!
        </div>
      )}
      <ProfileForm experienceId={experienceId} initialData={transformedProfile} />
    </main>
  );
} 