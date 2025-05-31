import { NextRequest } from "next/server";
import { db } from "@/src/db";
import { experienceSettings } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { whopApi, verifyUserToken } from "@/lib/whop-api";

// Save settings (POST)
export async function POST(request: NextRequest) {
  try {
    const { experienceId, color, profileSections } = await request.json();
    if (!experienceId || !color || !Array.isArray(profileSections)) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Auth: Only allow admins
    const { userId } = await verifyUserToken(request.headers);
    const access = await whopApi.checkIfUserHasAccessToExperience({ userId, experienceId });
    if (!access.hasAccessToExperience.hasAccess || access.hasAccessToExperience.accessLevel !== "admin") {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    // Upsert settings
    const [existing] = await db.select().from(experienceSettings).where(eq(experienceSettings.experienceId, experienceId)).limit(1);
    if (existing) {
      await db.update(experienceSettings)
        .set({ color, profileSections })
        .where(eq(experienceSettings.experienceId, experienceId));
    } else {
      await db.insert(experienceSettings).values({ experienceId, color, profileSections });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Settings update error:", error);
    return Response.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

// Fetch settings (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get("experienceId");
    if (!experienceId) {
      return Response.json({ error: "Missing experienceId" }, { status: 400 });
    }
    const [settings] = await db.select().from(experienceSettings).where(eq(experienceSettings.experienceId, experienceId)).limit(1);
    return Response.json({ settings });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
} 