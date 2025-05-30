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
			const userId = event.data.user_id;
			const experienceId = "exp_BPJ7JY3qCu49aR"; // Hardcoded for now
			const companyId = event.data.company_id; // Get company ID from webhook data

			console.log(`[webhook] payment.succeeded for userId=(${typeof userId}) ${userId}, experienceId=(${typeof experienceId}) ${experienceId}`);

			if (experienceId && userId) {
				try {
					console.log(`[webhook] Looking up profiles for user_id=${userId}, experience_id=${experienceId}`);
					const existingProfiles = await prisma.profiles.findMany({
						where: {
							user_id: userId,
							experience_id: experienceId,
						},
					});
					console.log(`[webhook] Found ${existingProfiles.length} profile(s):`, existingProfiles);

					console.log(`[webhook] Attempting DB update for user_id=${userId}, experience_id=${experienceId}`);
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
					console.log(`[webhook] DB update result:`, updateResult);

					// Try to send owner payout, but don't fail the webhook if it fails
					try {
						console.log(`[webhook] Fetching ledger account for companyId=${companyId}`);
						const ledgerAccount = await whopApi.getCompanyLedgerAccount({ companyId });
						console.log(`[webhook] Ledger account fetched:`, ledgerAccount);

						if (!ledgerAccount?.company?.ledgerAccount?.id) {
							console.warn("[webhook] No ledger account found, skipping owner payout");
							return NextResponse.json({ 
								received: true,
								warning: "Owner payout skipped - no ledger account found"
							});
						}

						// Transfer $0.50 to Sidbanothu
						console.log(`[webhook] Initiating transferFunds: amount=50, currency=usd, destinationId=sidbanothu, ledgerAccountId=${ledgerAccount.company.ledgerAccount.id}`);
						await whopApi.transferFunds({
							input: {
								amount: 50, // $0.50 in cents
								currency: "usd",
								destinationId: "sidbanothu", // Username to send to
								ledgerAccountId: ledgerAccount.company.ledgerAccount.id,
								idempotenceKey: `owner-payout-${experienceId}-${Date.now()}`,
							}
						});
						console.log("[webhook] Owner payout successful");
					} catch (payoutError) {
						console.error("[webhook] Owner payout failed:", payoutError);
						// Don't throw - we want the webhook to succeed even if payout fails
					}
				} catch (dbError) {
					console.error(`[webhook] DB update error for user_id=${userId}, experience_id=${experienceId}:`, dbError, dbError?.stack);
					throw dbError; // Re-throw DB errors as they are critical
				}
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
