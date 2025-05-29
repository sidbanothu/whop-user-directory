import { NextRequest } from "next/server";
import { whopApi } from "@/lib/whop-api";

export async function POST(request: NextRequest) {
  const { userId, experienceId, name, username, bio } = await request.json();

  try {
    console.log('[ForumPost] Received:', { userId, experienceId, name, username, bio });
    // 1. Find or create the 'Introductions' forum experience
    const newForum = await whopApi
      .withUser(process.env.WHOP_AGENT_USER_ID)
      .findOrCreateForum({
        input: {
          experienceId,
          name: "Introductions",
          whoCanPost: "admins",
        },
      });
    const forumExperienceId = newForum.createForum?.id;
    console.log('[ForumPost] Forum experienceId:', forumExperienceId);
    if (!forumExperienceId) {
      throw new Error("Could not find or create Introductions forum experience");
    }

    // 2. Post the profile info as a forum post (as the agent user)
    const forumPost = await whopApi
      .withUser(process.env.WHOP_AGENT_USER_ID)
      .createForumPost({
        input: {
          forumExperienceId,
          title: `👋 Meet ${name} (@${username})`,
          content: bio || "",
        },
      });
    console.log('[ForumPost] Forum post created:', forumPost);

    return new Response(JSON.stringify({ success: true, post: forumPost }), { status: 200 });
  } catch (err) {
    console.error('[ForumPost] Error:', err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }), { status: 500 });
  }
} 