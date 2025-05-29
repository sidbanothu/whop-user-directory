// If you get a 'Cannot find module' error, run: npm install node-fetch@2
import fetch from 'node-fetch';
import { Profile } from "@/lib/types/profile";



export async function findIntroductionsChatFeedId(headers: Record<string, string>, experienceId: string): Promise<string> {
  // Step 1: Fetch companyId from publicExperience
  const getCompanyQuery = {
    query: `
      query GetCompany($experienceId: ID!) {
        publicExperience(id: $experienceId) {
          company { id }
          id
          name
        }
      }
    `,
    variables: { experienceId },
  };
  console.log('[findIntroductionsChatFeedId] Fetching companyId for experienceId:', experienceId);
  const companyRes = await fetch("https://api.whop.com/public-graphql", {
    method: "POST",
    headers,
    body: JSON.stringify(getCompanyQuery),
  });
  const companyData = await companyRes.json();
  console.log('[findIntroductionsChatFeedId] publicExperience response:', JSON.stringify(companyData, null, 2));
  const companyId = companyData.data?.publicExperience?.company?.id;
  if (!companyId) {
    throw new Error('Could not find companyId for experienceId: ' + experienceId);
  }

  // Step 2: Fetch all access passes and experiences for the company, including chatFeedIds
  const getExperiencesQuery = {
    query: `
      query GetExperiences($companyId: ID!) {
        company(id: $companyId) {
          accessPassesV2 {
            nodes {
              id
              title
              experiences {
                id
                name
                chatFeedIds
              }
            }
          }
        }
      }
    `,
    variables: { companyId },
  };
  console.log('[findIntroductionsChatFeedId] Fetching all experiences for companyId:', companyId);
  const experiencesRes = await fetch("https://api.whop.com/public-graphql", {
    method: "POST",
    headers,
    body: JSON.stringify(getExperiencesQuery),
  });
  const experiencesData = await experiencesRes.json();
  console.log('[findIntroductionsChatFeedId] company accessPassesV2 response:', JSON.stringify(experiencesData, null, 2));
  const passes = experiencesData.data?.company?.accessPassesV2?.nodes || [];
  for (const pass of passes) {
    for (const exp of pass.experiences || []) {
      if (exp.name && exp.name.toLowerCase() === 'introductions') {
        const chatFeedId = exp.chatFeedIds && exp.chatFeedIds[0];
        if (chatFeedId) {
          console.log(`[findIntroductionsChatFeedId] Found "Introductions" chatFeedId: ${chatFeedId}`);
          return chatFeedId;
        }
      }
    }
  }
  throw new Error('No experience named "Introductions" with a chat feed found for this company.');
}

export async function sendProfileAnnouncement(feedId: string, profile: Profile, headers: Record<string, string>) {
  const message = `👋 Meet ${profile.name} (@${profile.username})\n${profile.bio || ''}`;
  const graphqlQuery = {
    query: `mutation sendMessage($input: SendMessageInput!) { sendMessage(input: $input) }`,
    variables: {
      input: {
        feedId,
        feedType: "chat_feed",
        message,
      },
    },
  };
  const res = await fetch("https://api.whop.com/public-graphql", {
    method: "POST",
    headers,
    body: JSON.stringify(graphqlQuery),
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error("Failed to send announcement: " + JSON.stringify(data.errors));
  }
  return data.data;
}

export async function sendChatMessage(feedId: string, message: string, headers: Record<string, string>) {
  const graphqlQuery = {
    query: `mutation sendMessage($input: SendMessageInput!) { sendMessage(input: $input) }`,
    variables: {
      input: {
        feedId,
        feedType: "chat_feed",
        message,
      },
    },
  };
  console.log('[sendChatMessage] Sending message to feedId:', feedId);
  console.log('[sendChatMessage] GraphQL request payload:', JSON.stringify(graphqlQuery, null, 2));
  const res = await fetch("https://api.whop.com/public-graphql", {
    method: "POST",
    headers,
    body: JSON.stringify(graphqlQuery),
  });
  const data = await res.json();
  console.log('[sendChatMessage] GraphQL response:', JSON.stringify(data, null, 2));
  if (data.errors) {
    throw new Error("Failed to send chat message: " + JSON.stringify(data.errors));
  }
  return data.data;
}  
