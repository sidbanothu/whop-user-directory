"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BasicInfoSection } from "./BasicInfoSection";
import { OptionalSections } from "./OptionalSections";
import { Profile, ProfileSection } from "@/lib/types/profile";
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
  onSave?: (updatedProfile: Profile) => Promise<void>;
}

export function ProfileForm({ initialData, experienceId, onClose, onSave }: ProfileFormProps) {
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

  // Helper: get all enabled section keys and fields
  function getSectionFieldDefaults(enabledSections: string[] | null) {
    if (!enabledSections) return {};
    const { OPTIONAL_SECTIONS } = require('./optionalSectionsConfig');
    const defaults: Record<string, Record<string, any>> = {};
    for (const section of OPTIONAL_SECTIONS) {
      if (enabledSections.includes(section.key)) {
        defaults[section.key] = {};
        for (const field of section.fields) {
          if (field.type === 'tags') defaults[section.key][field.name] = [];
          else if (field.type === 'key-value') defaults[section.key][field.name] = {};
          else defaults[section.key][field.name] = '';
        }
      }
    }
    return defaults;
  }

  // Compute defaultValues for the form
  const sectionDefaults = getSectionFieldDefaults(enabledSections);
  const initialSections = initialData?.sections
    ? Object.fromEntries(
        initialData.sections.map(section => [
          section.type,
          { ...sectionDefaults[section.type], ...section.data }
        ])
      )
    : sectionDefaults;

  const methods = useForm<ProfileFormData>({
    defaultValues: {
      name: initialData?.name || "",
      bio: initialData?.bio || "",
      sections: initialSections,
    },
  });

  // Add a debug log to see what's happening with the form data
  useEffect(() => {
    const subscription = methods.watch((value) => {
      console.log('[ProfileForm] Form values changed:', value);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      console.log('[ProfileForm] Form submission started with data:', data);
      setIsSubmitting(true);
      setError(null);

      if (!initialData?.id) {
        console.error('[ProfileForm] Missing profile ID in initialData:', initialData);
        throw new Error("Profile ID is required");
      }

      // Filter out undefined/empty fields from section data
      const nonEmptySections = Object.entries(data.sections)
        .filter(([_, sectionData]) =>
          Object.values(sectionData).some(value => {
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
            return value !== undefined && value !== '';
          })
        )
        .map(([type, sectionData]) => {
          // Remove undefined/empty fields from sectionData
          const cleanedData = Object.fromEntries(
            Object.entries(sectionData).filter(([_, v]) =>
              (Array.isArray(v) && v.length > 0) ||
              (typeof v === 'object' && v !== null && Object.keys(v).length > 0) ||
              (typeof v === 'string' && v.trim() !== '')
            )
          );
          return {
            type: type as ProfileSection['type'],
            title: type.charAt(0).toUpperCase() + type.slice(1),
            data: cleanedData,
          };
        });

      const updatedProfile: Profile = {
        ...initialData,
        name: data.name,
        bio: data.bio,
        sections: nonEmptySections,
      };

      console.log('[ProfileForm] Prepared updated profile:', updatedProfile);

      if (onSave) {
        console.log('[ProfileForm] Using onSave callback');
        await onSave(updatedProfile);
      } else {
        console.log('[ProfileForm] Using direct updateProfile action');
        const result = await updateProfile({
          id: initialData.id,
          experienceId,
          username: initialData.username,
          name: data.name,
          bio: data.bio,
          sections: Object.entries(data.sections).map(([type, data]) => ({
            type: type as ProfileSection['type'],
            title: type.charAt(0).toUpperCase() + type.slice(1),
            data,
          })),
        });

        console.log('[ProfileForm] Update profile result:', result);

        if (!result.success) {
          throw new Error(result.error);
        }

        router.push(`/experiences/${experienceId}`);
      }
    } catch (error) {
      console.error("[ProfileForm] Error saving profile:", error);
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
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-1 border-b pb-2">Basic Information</h2>
          <BasicInfoSection username={initialData?.username || ""} />
        </div>
        {/* Profile Sections Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-1 border-b pb-2">Profile Sections</h2>
          <p className="text-gray-600 mb-6">Choose which sections to display on your profile. Click to expand and customize each section.</p>
          <OptionalSections enabledSections={enabledSections} />
        </div>
        {/* Error and Actions */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded mb-4">{error}</div>
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
        </div>
      </form>
    </FormProvider>
  );
} 