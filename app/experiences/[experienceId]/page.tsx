import { whopApi } from "@/lib/whop-api";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { Suspense } from "react";
import { DirectoryGrid } from "@/components/directory/DirectoryGrid";
import { SearchBar } from "@/components/directory/SearchBar";
import Link from "next/link";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  // The headers contains the user token
  const headersList = await headers();

  // The experienceId is a path param
  const { experienceId } = await params;

  // The user token is in the headers
  const { userId } = await verifyUserToken(headersList);

  const result = await whopApi.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  const user = (await whopApi.getUser({ userId })).publicUser;
  const experience = (await whopApi.getExperience({ experienceId })).experience;

  // Either: 'admin' | 'customer' | 'no_access';
  // 'admin' means the user is an admin of the whop, such as an owner or moderator
  // 'customer' means the user is a common member in this whop
  // 'no_access' means the user does not have access to the whop
  const { accessLevel } = result.hasAccessToExperience;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-end items-center mb-8">
        <Link
          href={`/experiences/${experienceId}/edit-profile`}
          className="px-4 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          Edit Profile
        </Link>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Community Directory</h2>
        <SearchBar />
      </div>
      <Suspense fallback={<div>Loading profiles...</div>}>
        <DirectoryGrid />
      </Suspense>
    </main>
  );
}
