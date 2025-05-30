import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@whop/api";
import { findOrCreateProfile } from "@/lib/db";
import { whopApi } from "@/lib/whop-api";

export async function POST(request: NextRequest) {
  try {
    const { experienceId } = await request.json();
    const headersList = request.headers;
    const { userId } = await verifyUserToken(headersList);
    const whopUser = (await whopApi.getUser({ userId })).publicUser;
    await findOrCreateProfile({
      userId,
      experienceId,
      defaultUsername: whopUser.username ?? "",
      defaultName: whopUser.name ?? "",
      defaultBio: whopUser.bio ?? "",
      defaultAvatarUrl: whopUser.profilePicture?.sourceUrl ?? "",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
} 