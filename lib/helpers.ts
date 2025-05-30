import { prisma } from "./db";

export async function findOrCreateProfile({
  userId,
  experienceId,
  defaultUsername = "",
  defaultName = "",
  defaultBio = "",
  defaultAvatarUrl = "",
}) {
  let profile = await prisma.profiles.findFirst({
    where: { user_id: userId, experience_id: experienceId },
  });
  if (!profile) {
    profile = await prisma.profiles.create({
      data: {
        user_id: userId,
        experience_id: experienceId,
        username: defaultUsername,
        name: defaultName,
        bio: defaultBio,
        avatar_url: defaultAvatarUrl,
        sections: [],
      },
    });
  }
  return profile;
} 