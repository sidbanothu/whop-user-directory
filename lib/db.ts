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
}: {
  userId: string;
  experienceId: string;
  defaultUsername: string;
}) {
  // Try to find existing profile
  const existingProfile = await prisma.profiles.findFirst({
    where: {
      user_id: userId,
      experience_id: experienceId,
    },
  });

  if (existingProfile) {
    return existingProfile;
  }

  // Create new profile if none exists
  return prisma.profiles.create({
    data: {
      user_id: userId,
      experience_id: experienceId,
      username: defaultUsername,
      name: "", // Empty name to start
      bio: "", // Empty bio to start
      sections: [], // Empty sections array
    },
  });
} 