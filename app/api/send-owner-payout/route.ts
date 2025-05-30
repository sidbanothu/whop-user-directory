import { whopApi } from "@/lib/whop-api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { experienceId } = await request.json();
    if (!experienceId) {
      return NextResponse.json({ error: "Missing experienceId" }, { status: 400 });
    }

    // 1. Get your company's ledger account
    const experience = await whopApi.getExperience({ experienceId });
    const companyId = experience.experience.company.id;
    const ledgerAccount = await whopApi.getCompanyLedgerAccount({ companyId });

    // 2. Transfer $0.50 to the owner (hardcoded user ID)
    await whopApi.transferFunds({
      input: {
        amount: 0.50, // $0.50 in cents
        currency: "usd",
        destinationId: "user_htieokJ90kVys",
        ledgerAccountId: ledgerAccount.company?.ledgerAccount.id!,
        idempotenceKey: `owner-payout-${experienceId}-${Date.now()}`,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending owner payout:", error);
    return NextResponse.json({ error: "Failed to send payout" }, { status: 500 });
  }
} 