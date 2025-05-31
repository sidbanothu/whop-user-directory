"use server";

import { db } from "@/src/db";
import { profiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile({
  id,
  experienceId,
  username,
  name,
  bio,
  sections,
}: {
  id: string;
  experienceId: string;
  username: string;
  name: string;
  bio: string;
  sections: Array<{ type: string; data: Record<string, any> }>;
}) {
  try {
    console.log('[updateProfile] Starting profile update with data:', {
      id,
      experienceId,
      username,
      name,
      bio,
      sections
    });

    const [updatedProfile] = await db.update(profiles)
      .set({
        username,
        name,
        bio,
        sections: sections,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();

    console.log('[updateProfile] Successfully updated profile in database:', updatedProfile);

    // Revalidate the directory and profile pages
    revalidatePath(`/experiences/${experienceId}`);
    revalidatePath(`/experiences/${experienceId}/edit-profile`);

    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error("[updateProfile] Error updating profile:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update profile" };
  }
} 