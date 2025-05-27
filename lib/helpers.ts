import { prisma } from "./db";

export async function findOrCreateProfile(user_id: string, experience_id: string) {
  let profile = await prisma.profiles.findFirst({
    where: { user_id, experience_id },
  });
  if (!profile) {
    profile = await prisma.profiles.create({
      data: {
        user_id,
        experience_id,
        username: "",
        name: "",
        bio: "",
        avatar_url: "",
        sections: [],
      },
    });
  }
  return profile;
} 