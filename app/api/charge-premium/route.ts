import { whopApi } from "@/lib/whop-api";
import { NextResponse } from "next/server";

// Get base URL based on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://whop-user-directory.vercel.app';
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, experienceId, returnUrl } = body;
    console.log('[charge-premium] Incoming request:', body);

    if (!userId) {
      console.error('[charge-premium] Missing userId');
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    if (!experienceId) {
      console.error('[charge-premium] Missing experienceId');
      return NextResponse.json({ error: "Missing experienceId" }, { status: 400 });
    }

    // Create the $1 charge with correct redirect URL
    const chargeUser = await whopApi.chargeUser({
      input: {
        amount: 1, // $1
        currency: "usd",
        userId,
        metadata: { premium: true, experienceId },
        redirectUrl: returnUrl || `${getBaseUrl()}/experiences/${experienceId}`
      },
    });

    console.log('[charge-premium] chargeUser response:', chargeUser);

    if (!chargeUser?.chargeUser?.checkoutSession?.purchaseUrl) {
      throw new Error('Failed to create checkout session');
    }

    return NextResponse.json({
      checkoutUrl: chargeUser.chargeUser.checkoutSession.purchaseUrl,
      planId: chargeUser.chargeUser.checkoutSession.planId
    });
  } catch (error) {
    console.error("Error creating premium charge:", error);
    return NextResponse.json({ error: "Failed to create charge" }, { status: 500 });
  }
} 