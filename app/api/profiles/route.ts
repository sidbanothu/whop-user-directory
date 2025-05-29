import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const experienceId = searchParams.get("experienceId");

  if (!experienceId) {
    return Response.json({ error: "Missing experienceId" }, { status: 400 });
  }

  // Fetch all profiles for the experience
  const profiles = await prisma.profiles.findMany({
    where: { experience_id: experienceId },
    orderBy: { created_at: "desc" },
  });

  // Transform to camelCase and parse sections if needed
  const transformed = profiles.map(profile => ({
    ...profile,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    sections: typeof profile.sections === "string" ? JSON.parse(profile.sections) : profile.sections,
  }));

  return Response.json({ profiles: transformed });
} 