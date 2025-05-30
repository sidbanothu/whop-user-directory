import { waitUntil } from "@vercel/functions";
import { makeWebhookValidator } from "@whop/api";
import type { NextRequest } from "next/server";
import { whopApi } from "@/lib/whop-api";
import { NextResponse } from "next/server";

const validateWebhook = makeWebhookValidator({
	webhookSecret: process.env.WHOP_WEBHOOK_SECRET ?? "fallback",
});

export async function POST(request: NextRequest): Promise<Response> {
	try {
		const event = await request.json();
		// Example: check for successful payment event and badge purchase
		if (event.type === "payment.succeeded" && event.data?.metadata?.premium) {
			const experienceId = event.data.metadata.experienceId;
			if (experienceId) {
				// 1. Get your company's ledger account
				const experience = await whopApi.getExperience({ experienceId });
				const companyId = experience.experience.company.id;
				const ledgerAccount = await whopApi.getCompanyLedgerAccount({ companyId });
				// 2. Transfer $0.50 to the owner (hardcoded user ID)
				await whopApi.transferFunds({
					input: {
						amount: 50, // $0.50 in cents
						currency: "usd",
						destinationId: "user_htieokJ90kVys",
						ledgerAccountId: ledgerAccount.company?.ledgerAccount.id!,
						idempotenceKey: `owner-payout-${experienceId}-${Date.now()}`,
					}
				});
			}
		}
		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Webhook error:", error);
		return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
	}
}

async function potentiallyLongRunningHandler(
	_user_id: string | null | undefined,
	_amount: number,
	_currency: string,
	_amount_after_fees: number | null | undefined,
) {
	// This is a placeholder for a potentially long running operation
	// In a real scenario, you might need to fetch user data, update a database, etc.
}
