import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { notFound } from "next/navigation";

export default async function EditProfilePage({ params }) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch existing profile if it exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("experience_id", params.experienceId)
    .single();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Your Profile</h1>
      <ProfileForm experienceId={params.experienceId} initialData={profile} />
    </main>
  );
} 