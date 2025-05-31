import { NextRequest } from "next/server";
import { db } from "@/src/db";
import { profiles } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const experienceId = searchParams.get("experienceId");

  if (!experienceId) {
    return Response.json({ error: "Missing experienceId" }, { status: 400 });
  }

  // Fetch all profiles for the experience
  const result = await db.select().from(profiles)
    .where(eq(profiles.experienceId, experienceId))
    .orderBy(desc(profiles.createdAt));

  // Transform to camelCase and parse sections if needed
  const transformed = result.map(profile => ({
    ...profile,
    sections: typeof profile.sections === "string" ? JSON.parse(profile.sections) : profile.sections,
  }));

  return Response.json({ profiles: transformed });
} 