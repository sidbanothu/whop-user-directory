import { whopApi } from "@/lib/whop-api";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { Suspense } from "react";
import { DirectoryGrid } from "@/components/directory/DirectoryGrid";
import { SearchBar } from "@/components/directory/SearchBar";
import { DirectoryToggle } from "@/components/directory/DirectoryToggle";
import { findOrCreateProfile } from "@/lib/db";

export default async function ExperiencePage({ params }: {params: Promise<{experienceId: string}>} ) {
  // The headers contains the user token
  const headersList = await headers();
  // The experienceId is a path param
  const { experienceId } = await params;

  // The user token is in the headers
  const { userId } = await verifyUserToken(headersList);
//   console.log(userId, "first check");

  // Fetch Whop user info
  const whopUser = (await whopApi.getUser({ userId })).publicUser;
//   console.log(whopUser, "this is user info");

  // Ensure the user has a profile for this experience (create if needed)
  const profile = await findOrCreateProfile({
    userId,
    experienceId,
    defaultUsername: whopUser.username ?? "",
    defaultName: whopUser.name ?? "",
    defaultBio: whopUser.bio ?? "",
    defaultAvatarUrl: whopUser.profilePicture?.sourceUrl ?? "",
  });
  console.log(profile, "profile for rendering");

  // The rest of your original logic
  const result = await whopApi.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });
  const experience = (await whopApi.getExperience({ experienceId })).experience;
  // Either: 'admin' | 'customer' | 'no_access';
  const { accessLevel } = result.hasAccessToExperience;
  // TODO: Replace with real count from profiles query
  const memberCount = 6;

  return (
    <main className="container mx-auto px-4 py-12">
      <DirectoryToggle experienceId={experienceId} activeTab="directory" />
      <p className="text-gray-500 text-base mb-4">Discover and connect with people in this Whop. Every member has a custom profile so you can see who they are, what they do, and how to reach out. </p>
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="mb-6 text-gray-500 text-sm">
        Showing 1-{memberCount} of {memberCount} members
      </div>
      <Suspense fallback={<div>Loading profiles...</div>}>
        <DirectoryGrid />
      </Suspense>
    </main>
  );
}
