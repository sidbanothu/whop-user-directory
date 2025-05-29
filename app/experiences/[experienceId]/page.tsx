import { findIntroductionsChatFeedId } from "@/lib/whop-chat-feed";
import { whopApi } from "@/lib/whop-api";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { DirectoryPageClientWithEdit } from "@/components/directory/DirectoryPageClientWithEdit";
import Link from "next/link";
import { findOrCreateProfile } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ExperiencePage({ params }) {
  const headersList = await headers();
  const { experienceId } = await params;
  const { userId } = await verifyUserToken(headersList);

  // Build headers for GraphQL
  const gqlHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
    "x-on-behalf-of": userId,
  };

  // Trigger the workflow and log the GraphQL requests/results
  await findIntroductionsChatFeedId(gqlHeaders, experienceId);

  const result = await whopApi.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  if (!result.hasAccessToExperience.hasAccess) {
    return <div>You do not have access to this experience</div>;
  }

  const { accessLevel } = result.hasAccessToExperience;

  // Get Whop user info
  const whopUser = (await whopApi.getUser({ userId })).publicUser;

  // Find or create profile
  const profile = await findOrCreateProfile({
    userId,
    experienceId,
    defaultUsername: whopUser.username ?? "",
    defaultName: whopUser.name ?? "",
    defaultBio: whopUser.bio ?? "",
    defaultAvatarUrl: whopUser.profilePicture?.sourceUrl ?? "",
  });

  // If profile was just created (empty name/username), redirect to edit profile
  if (!profile.name && !profile.username) {
    redirect(`/experiences/${experienceId}/edit-profile`);
  }

  return (
    <div>
      {/* Show Admin Settings button for admins */}
      {accessLevel === "admin" && (
        <div className="mb-4">
          <Link
            href={`/experiences/${experienceId}/admin`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Admin Settings
          </Link>
        </div>
      )}
      <DirectoryPageClientWithEdit
        experienceId={experienceId}
        userId={userId}
        accessLevel={accessLevel}
      />
    </div>
  );
}
