import { whopApi } from "@/lib/whop-api";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { Suspense } from "react";
import { DirectoryGrid } from "@/components/directory/DirectoryGrid";
import { SearchBar } from "@/components/directory/SearchBar";
import { DirectoryToggle } from "@/components/directory/DirectoryToggle";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies as getCookies } from "next/headers";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  // The headers contains the user token
  const headersList = await headers();
  const cookiesStore = getCookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });

  // The experienceId is a path param
  const { experienceId } = await params;

  // The user token is in the headers
  const { userId } = await verifyUserToken(headersList);
  console.log(userId, "first check")

  // Ensure the user has a profile for this experience
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("experience_id", experienceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) {
	console.log(userId, "!profile")
    const { data: newProfile, error } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        experience_id: experienceId,
        username: "",
        name: "",
        bio: "",
        sections: [],
      })
      .select()
      .maybeSingle();
		if (error) console.error("Insert error:", error);
	console.log(profile, "this is new profile le")
    profile = newProfile;
  }

  // The rest of your original logic
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

  // TODO: Replace with real count from profiles query
  const memberCount = 6;

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-1">Community Directory</h1>
      <p className="text-gray-500 text-base mb-4">Discover members in this community</p>
      <DirectoryToggle experienceId={experienceId} activeTab="directory" />
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
