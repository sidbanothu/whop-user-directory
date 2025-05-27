"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BasicInfoSection } from "./BasicInfoSection";
import { OptionalSections } from "./OptionalSections";
import { LivePreview } from "./LivePreview";
import { Profile } from "@/lib/types/profile";
import { updateProfile } from "@/app/actions/profile";
import { useState } from "react";

interface ProfileFormData {
  username: string;
  name: string;
  bio: string;
  sections: Record<string, Record<string, any>>;
}

interface ProfileFormProps {
  initialData?: Profile;
  experienceId: string;
}

export function ProfileForm({ initialData, experienceId }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ProfileFormData>({
    defaultValues: {
      username: initialData?.username || "",
      name: initialData?.name || "",
      bio: initialData?.bio || "",
      sections: initialData?.sections ? 
        Object.fromEntries(
          (initialData.sections as any[]).map(s => [s.type, s.data])
        ) : {},
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!initialData?.id) {
        throw new Error("Profile ID is required");
      }

      const result = await updateProfile({
        id: initialData.id,
        experienceId,
        username: data.username,
        name: data.name,
        bio: data.bio,
        sections: Object.entries(data.sections).map(([type, data]) => ({
          type,
          data,
        })),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      router.push(`/experiences/${experienceId}`);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <BasicInfoSection />
          <OptionalSections />
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Profile" : "Create Profile"}
            </button>
          </div>
        </div>
        <div className="sticky top-8">
          <LivePreview />
        </div>
      </form>
    </FormProvider>
  );
} 