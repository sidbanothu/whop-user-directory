"use server";

import { prisma } from "@/lib/db";
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
    const updatedProfile = await prisma.profiles.update({
      where: { id },
      data: {
        username,
        name,
        bio,
        sections,
        updated_at: new Date(),
      },
    });

    // Revalidate the directory and profile pages
    revalidatePath(`/experiences/${experienceId}`);
    revalidatePath(`/experiences/${experienceId}/edit-profile`);

    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
} 