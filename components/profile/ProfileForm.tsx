"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BasicInfoSection } from "./BasicInfoSection";
import { OptionalSections } from "./OptionalSections";
import { LivePreview } from "./LivePreview";

const profileSchema = z.object({
  username: z.string().min(2).max(32),
  name: z.string().min(2).max(64),
  bio: z.string().max(256).optional(),
  // avatarUrl, sections, etc. will be added later
});

// type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const methods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      name: "",
      bio: "",
    },
  });

  const onSubmit = (data: any) => {
    // TODO: Save/update profile in Supabase
    console.log("Profile form submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <BasicInfoSection />
          <OptionalSections />
          <button type="submit" className="mt-4 px-4 py-2 rounded bg-black text-white">Save Profile</button>
        </div>
        <div>
          <LivePreview />
        </div>
      </form>
    </FormProvider>
  );
} 