import { waitUntil } from "@vercel/functions";
import { makeWebhookValidator } from "@whop/api";
import type { NextRequest } from "next/server";
import { whopApi } from "@/lib/whop-api";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const validateWebhook = makeWebhookValidator({
	webhookSecret: process.env.WHOP_WEBHOOK_SECRET ?? "fallback",
});

export async function POST(request: NextRequest): Promise<Response> {
	try {
		const event = await request.json();
		console.log("[webhook] Incoming event:", JSON.stringify(event, null, 2));

		// Use action instead of type
		if (event.action === "payment.succeeded") {
			// Try to extract experienceId and userId from the event 
			const experienceId = event.data.experience_id || event.data.metadata?.experienceId;
			const userId = event.data.user_id || event.data.userId;
			console.log(`[webhook] payment.succeeded for userId=(${typeof userId}) ${userId}, experienceId=(${typeof experienceId}) ${experienceId}`);
			if (experienceId && userId) {
				try {
					const existingProfiles = await prisma.profiles.findMany({
						where: {
							user_id: userId,
							experience_id: experienceId,
						},
					});
					console.log(`[webhook] Found ${existingProfiles.length} profile(s) before update for user_id=${userId}, experience_id=${experienceId}`);

					console.log("[webhook] Attempting DB update for profile");
					const updateResult = await prisma.profiles.updateMany({
						where: {
							user_id: userId,
							experience_id: experienceId,
						},
						data: {
							is_premium_member: true,
							updated_at: new Date(),
						},
					});
					console.log("[webhook] DB update result:", updateResult);
				} catch (dbError) {
					console.error("[webhook] DB update error:", dbError, dbError?.stack);
				}

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
		console.error("Webhook error:", error, error?.stack);
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
