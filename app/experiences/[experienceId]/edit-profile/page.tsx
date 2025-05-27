import { cookies } from "next/headers";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DirectoryToggle } from "@/components/directory/DirectoryToggle";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { findOrCreateProfile } from "@/lib/db";
import { Profile, ProfileSection } from "@/lib/types/profile";

export default async function EditProfilePage({ 
  params,
  searchParams,
}: { 
  params: { experienceId: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const whopToken = resolvedParams["whop-dev-user-token"];
  if (!whopToken || Array.isArray(whopToken)) {
    throw new Error("No Whop token provided");
  }
  const { userId } = await verifyUserToken(whopToken);

  // Use our new helper to find or create profile
  const profile = await findOrCreateProfile({
    userId,
    experienceId: params.experienceId,
    defaultUsername: "", // We'll let the user set this in the form
  });

  // Transform the profile to match the Profile type
  const transformedProfile: Profile = {
    id: profile.id,
    userId: profile.user_id,
    communityId: profile.experience_id,
    username: profile.username,
    name: profile.name,
    bio: profile.bio ?? "",
    avatarUrl: profile.avatar_url,
    sections: (profile.sections as any[] || []).map(section => ({
      type: section.type as ProfileSection["type"],
      title: section.title,
      data: section.data as Record<string, string | string[]>,
    })),
    createdAt: profile.created_at?.toISOString() ?? new Date().toISOString(),
    updatedAt: profile.updated_at?.toISOString() ?? new Date().toISOString(),
  };

  const justCreated = !profile.name && !profile.username; // Consider it "just created" if name and username are empty

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-1">Community Hub</h1>
      <p className="text-gray-500 text-base mb-4">Manage your profile and connect with community members</p>
      <DirectoryToggle experienceId={params.experienceId} activeTab="edit-profile" />
      {justCreated && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
          Create your profile to join the directory!
        </div>
      )}
      <ProfileForm experienceId={params.experienceId} initialData={transformedProfile} />
    </main>
  );
} 