import { db } from '../src/db';
import { profiles } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

console.log(process.env.DATABASE_URL_SERVICE_ROLE);

export async function findOrCreateProfile({
  userId,
  experienceId,
  defaultUsername,
  defaultName,
  defaultBio,
  defaultAvatarUrl,
}: {
  userId: string;
  experienceId: string;
  defaultUsername: string;
  defaultName?: string;
  defaultBio?: string;
  defaultAvatarUrl?: string;
}) {
  // Try to find existing profile
  const existingProfile = await db.select().from(profiles).where(
    and(
      eq(profiles.userId, userId),
      eq(profiles.experienceId, experienceId)
    )
  ).limit(1);

  if (existingProfile.length > 0) {
    const profile = existingProfile[0];
    // If any fields are empty, update them with Whop info
    const needsUpdate =
      (!profile.username && defaultUsername) ||
      (!profile.name && defaultName) ||
      (!profile.bio && defaultBio) ||
      (!profile.avatarUrl && defaultAvatarUrl);

    if (needsUpdate) {
      const [updated] = await db.update(profiles)
        .set({
          username: profile.username || defaultUsername,
          name: profile.name || defaultName,
          bio: profile.bio || defaultBio,
          avatarUrl: profile.avatarUrl || defaultAvatarUrl,
        })
        .where(eq(profiles.id, profile.id))
        .returning();
      return updated;
    }
    return profile;
  }

  // Create new profile if none exists
  const [created] = await db.insert(profiles).values({
    userId,
    experienceId,
    username: defaultUsername,
    name: defaultName ?? '',
    bio: defaultBio ?? '',
    avatarUrl: defaultAvatarUrl ?? '',
    sections: [],
  }).returning();
  return created;
} 