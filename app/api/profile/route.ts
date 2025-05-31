import { NextRequest } from "next/server";
import { db } from "@/src/db";
import { profiles } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const experienceId = searchParams.get("experienceId");

  if (!userId || !experienceId) {
    return Response.json({ error: "Missing userId or experienceId" }, { status: 400 });
  }

  // Fetch the profile from your DB
  const result = await db.select().from(profiles).where(
    and(
      eq(profiles.userId, userId),
      eq(profiles.experienceId, experienceId)
    )
  ).limit(1);
  const profile = result[0];

  if (!profile) {
    return Response.json({ profile: null }, { status: 200 });
  }

  // Transform to camelCase and parse sections if needed
  const transformed = {
    ...profile,
    sections: typeof profile.sections === "string" ? JSON.parse(profile.sections) : profile.sections,
  };

  console.log('[api/profile] Returning profile:', transformed);

  return Response.json({ profile: transformed });
} 