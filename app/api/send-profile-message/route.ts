import { NextRequest } from "next/server";
import { findIntroductionsChatFeedId, sendChatMessage } from "@/lib/whop-chat-feed";

export async function POST(request: NextRequest) {
  const { userId, experienceId, name, username, bio } = await request.json();

  console.log('[API/send-profile-message] Received:', { userId, experienceId, name, username, bio });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
    "x-on-behalf-of": process.env.WHOP_AGENT_USER_ID,
  };
  console.log('[API/send-profile-message] Using headers:', headers);

  try {
    const introductionsChatFeedId = await findIntroductionsChatFeedId(headers, experienceId);
    console.log('[API/send-profile-message] Found Introductions chatFeedId:', introductionsChatFeedId);
    const message = `👋 Meet ${name} (@${username})\n${bio || ''}`;
    await sendChatMessage(introductionsChatFeedId, message, headers);
    console.log('[API/send-profile-message] Message sent successfully');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[API/send-profile-message] Error:', err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }), { status: 500 });
  }
} 