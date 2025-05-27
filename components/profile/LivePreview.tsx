"use client";

import { useFormContext } from "react-hook-form";
import { ProfileCard } from "@/components/directory/ProfileCard";
import { Profile, ProfileSection } from "@/lib/types/profile";
import { OPTIONAL_SECTIONS } from "./optionalSectionsConfig";

export function LivePreview() {
  const { watch } = useFormContext();
  const formValues = watch();

  // Transform form data to match Profile type
  const previewProfile: Profile = {
    id: "preview",
    userId: "preview",
    communityId: "preview",
    username: formValues.username || "username",
    name: formValues.name || "Your Name",
    bio: formValues.bio || "",
    avatarUrl: null,
    sections: Object.entries(formValues.sections || {}).map(([type, data]) => {
      const section = OPTIONAL_SECTIONS.find(s => s.key === type);
      return {
        type: type as ProfileSection["type"],
        title: section?.label || type,
        data: data as Record<string, string | string[]>,
      };
    }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
      <div className="transform scale-90 origin-top">
        <ProfileCard profile={previewProfile} />
      </div>
    </section>
  );
} 