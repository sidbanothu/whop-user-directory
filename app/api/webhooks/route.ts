import { waitUntil } from "@vercel/functions";
import { makeWebhookValidator } from "@whop/api";
import type { NextRequest } from "next/server";
import { whopApi } from "@/lib/whop-api";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { profiles } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

const validateWebhook = makeWebhookValidator({
	webhookSecret: process.env.WHOP_WEBHOOK_SECRET ?? "fallback",
});

export async function POST(request: NextRequest): Promise<Response> {
	try {
		const event = await request.json();
		console.log("[webhook] Incoming event:", JSON.stringify(event, null, 2));

		// Use action instead of type
		if (event.action === "payment.succeeded") {
			const userId = event.data.user_id;
			const experienceId = "exp_BPJ7JY3qCu49aR"; // Hardcoded for now  
			const companyId = event.data.company_id; // Get company ID from webhook data

			console.log(`[webhook] payment.succeeded for userId=(${typeof userId}) ${userId}, experienceId=(${typeof experienceId}) ${experienceId}`);

			if (experienceId && userId) {
				try {
					console.log(`[webhook] Looking up profiles for user_id=${userId}, experience_id=${experienceId}`);
					const existingProfiles = await db.select().from(profiles).where(and(
						eq(profiles.userId, userId),
						eq(profiles.experienceId, experienceId)
					));
					console.log(`[webhook] Found ${existingProfiles.length} profile(s):`, existingProfiles);

					console.log(`[webhook] Attempting DB update for user_id=${userId}, experience_id=${experienceId}`);
					const updateResult = await db.update(profiles)
						.set({
							isPremiumMember: true,
							updatedAt: new Date(),
						})
						.where(and(
							eq(profiles.userId, userId),
							eq(profiles.experienceId, experienceId)
						));
					console.log(`[webhook] DB update result:`, updateResult);

					// Try to send owner payout, but don't fail the webhook if it fails
					try {
						console.log(`[webhook] Fetching ledger account for companyId=${companyId}`);
						const ledgerAccount = await whopApi.withUser(process.env.WHOP_AGENT_USER_ID).getCompanyLedgerAccount({ companyId });
						console.log(`[webhook] Ledger account fetched:`, ledgerAccount);

						if (!ledgerAccount?.company?.ledgerAccount?.id) {
							console.warn("[webhook] No ledger account found, skipping owner payout");
							return NextResponse.json({ 
								received: true,
								warning: "Owner payout skipped - no ledger account found"
							});
						}

						// Transfer $0.50 to Sidbanothu
						const amount = 1.0; // 1.00 USD
						const currency = "usd";
						const destinationId = "user_htieokJ90kVys"; // hardcoded for now 
						console.log(`[webhook] Initiating transferFunds: amount=${amount}, currency=${currency}, destinationId=${destinationId}, ledgerAccountId=${ledgerAccount.company.ledgerAccount.id}`);
						await whopApi.withUser(process.env.WHOP_AGENT_USER_ID).transferFunds({
							input: {
								amount,
								currency,
								destinationId,
								ledgerAccountId: ledgerAccount.company.ledgerAccount.id,
								idempotenceKey: `owner-payout-${experienceId}-${Date.now()}`,
							}
						});
						console.log("[webhook] Owner payout successful");
					} catch (error) {
						console.error("[webhook] Error sending owner payout:", error);
						return NextResponse.json({ 
							received: true,
							error: "Error sending owner payout"
						});
					}
				} catch (error) {
					console.error("[webhook] Error processing payment:", error);
					return NextResponse.json({ 
						received: true,
						error: "Error processing payment"
					});
				}
			}
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("[webhook] Error processing webhook:", error);
		return NextResponse.json({ 
			received: false,
			error: "Error processing webhook"
		});
	}
}