"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BasicInfoSection } from "./BasicInfoSection";
import { OptionalSections } from "./OptionalSections";
import { LivePreview } from "./LivePreview";
import { Profile } from "@/lib/types/profile";
import { updateProfile } from "@/app/actions/profile";
import { useState, useEffect } from "react";
import { sendProfileAnnouncement, sendChatMessage } from "@/lib/whop-chat-feed";

interface ProfileFormData {
  username: string;
  name: string;
  bio: string;
  sections: Record<string, Record<string, any>>;
}

interface ProfileFormProps {
  initialData?: Profile;
  experienceId: string;
  onClose?: () => void;
}

export function ProfileForm({ initialData, experienceId, onClose }: ProfileFormProps) {
  console.log('[ProfileForm] initialData:', initialData);
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

  async function handleSendMessage() {
    setIsSendingMessage(true);
    setSendMessageResult(null);
    try {
      console.log('[ProfileForm] Sending to chat...');
      const chatRes = await fetch("/api/send-profile-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: initialData.userId,
          experienceId,
          name: initialData.name,
          username: initialData.username,
          bio: initialData.bio,
        }),
      });
      const chatResult = await chatRes.json();
      console.log('[ProfileForm] Chat result:', chatResult);
      if (!chatResult.success) throw new Error("Chat: " + chatResult.error);

      console.log('[ProfileForm] Sending to forum...');
      const forumRes = await fetch("/api/send-profile-forum-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: initialData.userId,
          experienceId,
          name: initialData.name,
          username: initialData.username,
          bio: initialData.bio,
        }),
      });
      const forumResult = await forumRes.json();
      console.log('[ProfileForm] Forum result:', forumResult);
      if (!forumResult.success) throw new Error("Forum: " + forumResult.error);

      setSendMessageResult("Profile sent to Introductions chat and forum!");
    } catch (err) {
      setSendMessageResult("Failed to send: " + (err instanceof Error ? err.message : String(err)));
      console.error('[ProfileForm] Send error:', err);
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
          <div className="flex justify-end gap-4 pt-6 border-t mt-8">
            <button
              type="button"
              onClick={onClose ? onClose : () => router.back()}
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isSendingMessage}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all disabled:opacity-60"
            >
              {isSendingMessage ? "Posting..." : "Send Message"}
            </button>
          </div>
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