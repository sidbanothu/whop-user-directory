import { useFormContext } from "react-hook-form";
import { ProfileCard } from "@/components/directory/ProfileCard";
import { Profile } from "@/lib/types/profile";

export function LivePreview() {
  const { watch } = useFormContext();
  const formValues = watch();

  // Provide sensible defaults for preview
  const previewProfile: Profile = {
    id: "preview",
    userId: "preview",
    communityId: "preview",
    username: formValues.username || "username",
    name: formValues.name || "Your Name",
    bio: formValues.bio || "",
    avatarUrl: null, // Avatar upload to be added
    sections: [], // Optional sections to be added
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
      <ProfileCard profile={previewProfile} />
    </section>
  );
} 