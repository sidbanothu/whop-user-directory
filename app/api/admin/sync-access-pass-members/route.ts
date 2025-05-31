import { NextRequest } from "next/server";
import { whopApi } from "@/lib/whop-api";
import { db } from "@/src/db";
import { profiles } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  // Hardcode all IDs
  const companyId = "biz_GikUnQmoNs3s0Z";
  const accessPassId = "prod_cXOfYhdgpM6Ge";
  const experienceId = "exp_BPJ7JY3qCu49aR";

  // 1. Fetch all users from Whop using GraphQL (scoped under company)
  const query = `
    query GetAccessPassUsers($companyId: ID!, $accessPassId: ID!) {
      company(id: $companyId) {
        accessPass(id: $accessPassId) {
          users {
            nodes {
              id
              name
              username
            }
          }
        }
      }
    }
  `;

  // Use whopApi.withUser() to make the request with proper auth
  const res = await fetch("https://api.whop.com/public-graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
      "x-on-behalf-of": process.env.WHOP_AGENT_USER_ID,
    },
    body: JSON.stringify({ query, variables: { companyId, accessPassId } }),
  });
  const data = await res.json();

  if (!data.data || !data.data.company || !data.data.company.accessPass || !data.data.company.accessPass.users) {
    console.error("Whop API error or company/accessPass/users not found:", JSON.stringify(data, null, 2));
    return new Response(JSON.stringify({ error: "Whop API error or company/accessPass/users not found", whopResponse: data }), { status: 500 });
  }

  const users = data.data.company.accessPass.users.nodes;

  let created = 0;
  for (const user of users) {
    // 2. Check if profile exists for userId + experienceId
    const existing = await db.select().from(profiles).where(
      and(
        eq(profiles.userId, user.id),
        eq(profiles.experienceId, experienceId)
      )
    );
    if (existing.length === 0) {
      // 3. Create profile
      await db.insert(profiles).values({
        userId: user.id,
        experienceId,
        username: user.username,
        name: user.name,
        bio: "",
        avatarUrl: null,
        sections: [],
      });
      created++;
    }
  }

  return new Response(JSON.stringify({ created }), { status: 200 });
} 