import { db } from '../src/db';
import { profiles } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

export async function findOrCreateProfile({
  userId,
  experienceId,
  defaultUsername = '',
  defaultName = '',
  defaultBio = '',
  defaultAvatarUrl = '',
}) {
  const existing = await db.select().from(profiles).where(
    and(
      eq(profiles.userId, userId),
      eq(profiles.experienceId, experienceId)
    )
  ).limit(1);
  let profile = existing[0];
  if (!profile) {
    const [created] = await db.insert(profiles).values({
      userId,
      experienceId,
      username: defaultUsername,
      name: defaultName,
      bio: defaultBio,
      avatarUrl: defaultAvatarUrl,
      sections: [],
    }).returning();
    profile = created;
  }
  return profile;
} 