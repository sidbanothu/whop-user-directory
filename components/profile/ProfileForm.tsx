"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BasicInfoSection } from "./BasicInfoSection";
import { OptionalSections } from "./OptionalSections";
import { LivePreview } from "./LivePreview";
import { Profile } from "@/lib/types/profile";

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
  const supabase = createClientComponentClient();

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
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: initialData?.id,
          experience_id: experienceId,
          username: data.username,
          name: data.name,
          bio: data.bio,
          sections: Object.entries(data.sections).map(([type, data]) => ({
            type,
            data,
          })),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      router.refresh();
      router.push(`/experiences/${experienceId}`);
    } catch (error) {
      console.error("Error saving profile:", error);
      // TODO: Add proper error handling/notification
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <BasicInfoSection />
          <OptionalSections />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              {initialData ? "Update Profile" : "Create Profile"}
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