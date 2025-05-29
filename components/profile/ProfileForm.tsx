"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BasicInfoSection } from "./BasicInfoSection";
import { OptionalSections } from "./OptionalSections";
import { LivePreview } from "./LivePreview";
import { Profile } from "@/lib/types/profile";
import { updateProfile } from "@/app/actions/profile";
import { useState, useEffect } from "react";
import { findIntroductionsExperienceId, sendProfileAnnouncement, sendChatMessage } from "@/lib/whop-chat-feed";

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
  console.log('[ProfileForm] Edit Profile module rendered');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabledSections, setEnabledSections] = useState<string[] | null>(null);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [announceResult, setAnnounceResult] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendMessageResult, setSendMessageResult] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEnabledSections() {
      const res = await fetch(`/api/experience/settings?experienceId=${experienceId}`);
      const data = await res.json();
      setEnabledSections(data.settings?.profileSections || []);
    }
    fetchEnabledSections();
  }, [experienceId]);

  const methods = useForm<ProfileFormData>({
    defaultValues: {
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
      console.log('ProfileForm onSubmit data:', data);
      setIsSubmitting(true);
      setError(null);

      if (!initialData?.id) {
        throw new Error("Profile ID is required");
      }

      const result = await updateProfile({
        id: initialData.id,
        experienceId,
        username: initialData.username,
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

  async function handleAnnounce() {
    setIsAnnouncing(true);
    setAnnounceResult(null);
    try {
      // You may need to pass headers from context or fetch them here
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        "x-on-behalf-of": initialData.userId,
      };
      const feedId = await findIntroductionsExperienceId(headers, experienceId);
      await sendProfileAnnouncement(feedId, initialData, headers);
      setAnnounceResult("Profile announced in Introductions chat!");
    } catch (err) {
      setAnnounceResult("Failed to announce profile: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsAnnouncing(false);
    }
  }

  async function handleSendMessage() {
    setIsSendingMessage(true);
    setSendMessageResult(null);
    try {
      // Build headers for GraphQL
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        "x-on-behalf-of": initialData.userId,
      };
      // Find Introductions experience ID
      const introductionsExperienceId = await findIntroductionsExperienceId(headers, experienceId);
      // Format the profile card as a message
      const message = `👋 Meet ${initialData.name} (@${initialData.username})\n${initialData.bio || ''}`;
      await sendChatMessage(introductionsExperienceId, message, headers);
      setSendMessageResult("Profile sent to Introductions chat!");
    } catch (err) {
      setSendMessageResult("Failed to send message: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSendingMessage(false);
    }
  }

  if (!enabledSections) {
    return <div>Loading profile editor...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <BasicInfoSection username={initialData?.username || ""} />
          <OptionalSections enabledSections={enabledSections} />
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="p-2 bg-yellow-100 text-yellow-800 text-center rounded">DEBUG: This is the ProfileForm with Announce button</div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            {/* <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button> */}
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isSendingMessage}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all disabled:opacity-60"
            >
              {isSendingMessage ? "Sending..." : "Send Message"}
            </button>
          </div>
          {announceResult && (
            <div className="mt-2 text-sm text-center text-green-600">{announceResult}</div>
          )}
          {sendMessageResult && (
            <div className="mt-2 text-sm text-center text-green-600">{sendMessageResult}</div>
          )}
        </div>
        <div className="sticky top-8">
          <LivePreview />
        </div>
      </form>
    </FormProvider>
  );
} 