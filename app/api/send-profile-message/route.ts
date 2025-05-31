import { NextRequest } from "next/server";
import { findIntroductionsChatFeedId, sendChatMessage } from "@/lib/whop-chat-feed";

function formatRelativeTime(dateString) {
  const now = Date.now();
  const created = new Date(dateString).getTime();
  const diffMs = now - created;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return 'just now';
  if (diffHrs === 1) return 'about an hour ago';
  return `about ${diffHrs} hours ago`;
}

function buildInterestLines(profile) {
  if (!profile.sections) return '';
  const icons = {
    gamer: '🎮',
    developer: '💻',
    trader: '📈',
    student: '🎓',
    creator: '🎨',
  };
  const TITLES = {
    gamer: "Gamer",
    developer: "Developer",
    trader: "Trading",
    student: "Student",
    creator: "Creator"
  };
  return profile.sections.map(section => {
    const icon = icons[section.type] || '';
    const title = TITLES[section.type] || section.type.charAt(0).toUpperCase() + section.type.slice(1);
    let line = `${icon} **${title}:**`;
    const data = section.data || {};
    if (section.type === 'gamer') {
      const games = data.games?.join(', ');
      const platforms = data.platforms?.join(', ');
      if (games && platforms) line += ` ${games} on ${platforms}`;
      else if (games) line += ` ${games}`;
      else if (platforms) line += ` on ${platforms}`;
    } else if (section.type === 'developer') {
      const langs = data.languages?.join(', ');
      const frameworks = data.frameworks?.join(', ');
      const projects = data.projects ? Object.keys(data.projects).join(', ') : '';
      let devLine = [];
      if (langs) devLine.push(langs);
      if (frameworks) devLine.push(frameworks);
      if (projects) devLine.push(projects);
      if (devLine.length) line += ` Coding with ${devLine.join(', ')}`;
    } else if (section.type === 'trader') {
      const assets = data.assets?.join(', ');
      const platforms = data.platforms?.join(', ');
      if (assets && platforms) line += ` ${assets} on ${platforms}`;
      else if (assets) line += ` ${assets}`;
      else if (platforms) line += ` on ${platforms}`;
    } else if (section.type === 'student') {
      const subjects = data.subjects?.join(', ');
      const achievements = data.achievements ? Object.keys(data.achievements).join(', ') : '';
      if (subjects && achievements) line += ` ${subjects} & ${achievements}`;
      else if (subjects) line += ` ${subjects}`;
      else if (achievements) line += ` ${achievements}`;
    } else if (section.type === 'creator') {
      const mediums = data.mediums?.join(', ');
      if (mediums) line += ` ${mediums}`;
    }
    return line;
  }).join('\n');
}

function buildLinksList(profile) {
  let links = [];
  function qualify(url) {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  }
  for (const section of profile.sections || []) {
    if (section.type === 'creator' && section.data?.links) {
      for (const [label, url] of Object.entries(section.data.links)) {
        links.push(`[${label.charAt(0).toUpperCase() + label.slice(1)}](${qualify(url)})`);
      }
    }
    if (section.type === 'developer' && section.data?.projects) {
      for (const [label, url] of Object.entries(section.data.projects)) {
        links.push(`[${label}](${qualify(url)})`);
      }
    }
    if (section.type === 'student' && section.data?.achievements) {
      for (const [label, url] of Object.entries(section.data.achievements)) {
        links.push(`[${label}](${qualify(url)})`);
      }
    }
  }
  return links.join(' • ');
}

function generateProfilePost(user, profile) {
  return `👋 **Meet ${user.name} (@${user.username})**\n\n${user.bio}\n🗓️ Joined ${formatRelativeTime(user.createdAt)}\n\n---\n\n${buildInterestLines(profile)}\n\n**Links:** ${buildLinksList(profile)}\n\n---\n\n*Say hi and connect! 💬*`;
}

export async function POST(request: NextRequest) {
  const { user, profile } = await request.json();

  console.log('[API/send-profile-message] Received:', { user, profile });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
    "x-on-behalf-of": process.env.WHOP_AGENT_USER_ID,
  };
  console.log('[API/send-profile-message] Using headers:', headers);

  try {
    const introductionsChatFeedId = await findIntroductionsChatFeedId(headers, profile.experienceId);
    console.log('[API/send-profile-message] Found Introductions chatFeedId:', introductionsChatFeedId);
    const message = generateProfilePost(user, profile);
    await sendChatMessage(introductionsChatFeedId, message, headers);
    console.log('[API/send-profile-message] Message sent successfully');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[API/send-profile-message] Error:', err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }), { status: 500 });
  }
} 