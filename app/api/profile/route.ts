import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const experienceId = searchParams.get("experienceId");

  if (!userId || !experienceId) {
    return Response.json({ error: "Missing userId or experienceId" }, { status: 400 });
  }

  // Fetch the profile from your DB
  const profile = await prisma.profiles.findFirst({
    where: {
      user_id: userId,
      experience_id: experienceId,
    },
  });

  if (!profile) {
    return Response.json({ profile: null }, { status: 200 });
  }

  // Transform to camelCase and parse sections if needed
  const transformed = {
    id: profile.id,
    userId: profile.user_id,
    experience_id: profile.experience_id,
    username: profile.username,
    name: profile.name,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    sections: typeof profile.sections === "string" ? JSON.parse(profile.sections) : profile.sections,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    is_premium_member: profile.is_premium_member,
  };

  console.log('[api/profile] Returning profile:', transformed);

  return Response.json({ profile: transformed });
} 