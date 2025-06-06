import { findIntroductionsChatFeedId } from "@/lib/whop-chat-feed";
import { whopApi } from "@/lib/whop-api";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { DirectoryPageClientWithEdit } from "@/components/directory/DirectoryPageClientWithEdit";
import Link from "next/link";
import { findOrCreateProfile } from "@/lib/db";
import { redirect } from "next/navigation";
import { CreateProfileButton } from "@/components/CreateProfileButton";

export default async function ExperiencePage({ params }) {
  const headersList = await headers();
  const { experienceId } = await params;
  const { userId } = await verifyUserToken(headersList);

  // Get Whop user info
  const whopUser = (await whopApi.getUser({ userId })).publicUser;

  // Only fetch profile, do not create
  const profile = await findOrCreateProfile({
    userId,
    experienceId,
    defaultUsername: whopUser.username ?? "",
    defaultName: whopUser.name ?? "",
    defaultBio: whopUser.bio ?? "",
    defaultAvatarUrl: whopUser.profilePicture?.sourceUrl ?? "",
  });

  const result = await whopApi.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  if (!result.hasAccessToExperience.hasAccess) {
    return <div>You do not have access to this experience</div>;
  }

  const { accessLevel } = result.hasAccessToExperience;

  // If profile does not exist, show create profile card
  if (!profile) {
    return (
      <div>
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2 text-yellow-800">You don&apos;t have a profile yet!</h2>
          <p className="mb-4 text-yellow-700">Create your profile to join the directory and connect with others.</p>
          <CreateProfileButton experienceId={experienceId} />
        </div>
      </div>
    );
  }

  // If profile was just created (empty name/username), redirect to edit profile
  if (!profile.name && !profile.username) {
    redirect(`/experiences/${experienceId}/edit-profile`);
  }

  return (
    <div>
      <DirectoryPageClientWithEdit
        experienceId={experienceId}
        userId={userId}
        accessLevel={accessLevel}
      />
    </div>
  );
}
