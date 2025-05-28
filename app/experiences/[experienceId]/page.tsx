import { whopApi } from "@/lib/whop-api";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { DirectoryPageClientWithEdit } from "@/components/directory/DirectoryPageClientWithEdit";

export default async function ExperiencePage({ params }) {
  const headersList = await headers();
  const { experienceId } = await params;
  const { userId } = await verifyUserToken(headersList);

  const result = await whopApi.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  if (!result.hasAccessToExperience.hasAccess) {
    return <div>You do not have access to this experience</div>;
  }

  const { accessLevel } = result.hasAccessToExperience;

  return (
    <DirectoryPageClientWithEdit
      experienceId={experienceId}
      userId={userId}
      accessLevel={accessLevel}
    />
  );
}
