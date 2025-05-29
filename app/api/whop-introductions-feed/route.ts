import { NextRequest } from "next/server";
import { findIntroductionsExperienceId } from "@/lib/whop-chat-feed";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const experienceId = searchParams.get("experienceId");
    if (!experienceId) {
      return Response.json({ error: "Missing experienceId query parameter" }, { status: 400 });
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
      "x-on-behalf-of": process.env.WHOP_AGENT_USER_ID,
    };
    const feedId = await findIntroductionsExperienceId(headers, experienceId);
    return Response.json({ feedId });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 