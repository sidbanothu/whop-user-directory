import { PrismaClient } from "./generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Use service role connection string to bypass RLS
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_SERVICE_ROLE, // Use service role connection string
      },
    },
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
  const existingProfile = await prisma.profiles.findFirst({
    where: {
      user_id: userId,
      experience_id: experienceId,
    },
  });

  if (existingProfile) {
    // If any fields are empty, update them with Whop info
    const needsUpdate =
      (!existingProfile.username && defaultUsername) ||
      (!existingProfile.name && defaultName) ||
      (!existingProfile.bio && defaultBio) ||
      (!existingProfile.avatar_url && defaultAvatarUrl);

    if (needsUpdate) {
      return await prisma.profiles.update({
        where: { id: existingProfile.id },
        data: {
          username: existingProfile.username || defaultUsername,
          name: existingProfile.name || defaultName,
          bio: existingProfile.bio || defaultBio,
          avatar_url: existingProfile.avatar_url || defaultAvatarUrl,
        },
      });
    }
    return existingProfile;
  }

  // Create new profile if none exists
  return prisma.profiles.create({
    data: {
      user_id: userId,
      experience_id: experienceId,
      username: defaultUsername,
      name: defaultName ?? "",
      bio: defaultBio ?? "",
      avatar_url: defaultAvatarUrl ?? "",
      sections: [],
    },
  });
} 