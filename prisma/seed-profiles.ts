import { PrismaClient } from "../lib/generated/prisma";
const prisma = new PrismaClient();

const profiles = [
  {
    user_id: "user_htieokJ90kVys",
    experience_id: "exp_demo",
    username: "sidbanothu",
    name: "Sid Banothu",
    bio: "Product @ Whop • Building the future of digital commerce • Passionate about creating seamless user experiences",
    avatar_url: "SB",
    sections: [
      { type: "gamer", data: { games: ["Valorant", "CS2", "League of Legends"], platforms: ["PC", "Steam"], handles: [ { key: "Steam", value: "sidbanothu" }, { key: "Riot ID", value: "sid#1337" } ] } },
      { type: "creator", data: { mediums: ["Blog Writing", "Product Design", "UI/UX"], links: [ { key: "Medium", value: "https://medium.com/@sidbanothu" }, { key: "Dribbble", value: "https://dribbble.com/sidbanothu" } ] } },
      { type: "developer", data: { languages: ["JavaScript", "Python", "TypeScript", "Go"], frameworks: ["React", "Next.js", "Django", "FastAPI"], projects: [ { key: "WhopOS", value: "Next-gen creator platform" }, { key: "PaymentFlow", value: "Seamless checkout experience" }, { key: "Github", value: "https://github.com/sidbanothu" } ] } },
      { type: "trader", data: { assets: ["Tech Stocks", "Growth ETFs"], platforms: ["Robinhood", "Fidelity"] } },
      { type: "student", data: { subjects: ["Computer Science", "Product Management", "Design"], achievements: [ { key: "Degree", value: "BS Computer Science - Stanford" }, { key: "GPA", value: "3.8/4.0" }, { key: "Honor", value: "Dean's List 2023" } ] } },
    ],
  },
];

async function main() {
  for (const profile of profiles) {
    await prisma.profiles.create({ data: profile });
    console.log(`Inserted profile for ${profile.username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 