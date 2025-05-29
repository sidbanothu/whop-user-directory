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
  {
    user_id: "user_alexjdev",
    experience_id: "exp_BPJ7JY3qCu49aR",
    username: "@alexj_dev",
    name: "Alex Johnson",
    bio: "Full-stack developer & crypto enthusiast • Building the future of DeFi • Smart contract security researcher",
    avatar_url: "AJ",
    sections: [
      { type: "gamer", data: { games: ["Apex Legends", "Rocket League"], platforms: ["PC", "PlayStation 5"], handles: [ { key: "Steam", value: "alexjdev" }, { key: "PSN", value: "AlexJ_Crypto" } ] } },
      { type: "creator", data: { mediums: ["YouTube", "Technical Writing", "Tutorials"], links: [ { key: "YouTube", value: "https://youtube.com/alexjohnsondev" }, { key: "Dev.to", value: "https://dev.to/alexjohnson" } ] } },
      { type: "developer", data: { languages: ["Solidity", "JavaScript", "Rust", "Python"], frameworks: ["React", "Hardhat", "Foundry", "Express.js"], projects: [ { key: "DeFiVault", value: "Yield farming protocol" }, { key: "NFTMarket", value: "Decentralized marketplace" }, { key: "Github", value: "https://github.com/alexjohnsondev" } ] } },
      { type: "trader", data: { assets: ["Bitcoin", "Ethereum", "DeFi Tokens", "NFTs"], platforms: ["Binance", "Uniswap", "OpenSea"] } },
    ],
  },
  {
    user_id: "user_mayacreates",
    experience_id: "exp_BPJ7JY3qCu49aR",
    username: "@mayacreates",
    name: "Maya Chen",
    bio: "Digital artist & content creator • 100k+ YouTube subscribers • Specializing in character design and animation",
    avatar_url: "MC",
    sections: [
      { type: "gamer", data: { games: ["Genshin Impact", "Valorant", "Animal Crossing"], platforms: ["PC", "Nintendo Switch", "Mobile"], handles: [ { key: "Steam", value: "mayacreates" }, { key: "Nintendo", value: "SW-1234-5678-9012" } ] } },
      { type: "creator", data: { mediums: ["YouTube", "Digital Art", "Animation", "Twitch"], links: [ { key: "YouTube", value: "https://youtube.com/mayacreates" }, { key: "Instagram", value: "https://instagram.com/mayacreates" }, { key: "Twitch", value: "https://twitch.tv/mayacreates" } ] } },
      { type: "developer", data: { languages: ["JavaScript", "Python"], frameworks: ["p5.js", "Three.js", "Blender Python API"], projects: [ { key: "ArtBot", value: "AI-powered art generator" }, { key: "Portfolio", value: "Interactive 3D gallery" } ] } },
      { type: "student", data: { subjects: ["Digital Media", "Computer Graphics", "Fine Arts"], achievements: [ { key: "Degree", value: "BFA Digital Arts - RISD" }, { key: "Award", value: "Student Artist of the Year 2023" }, { key: "Exhibition", value: "Featured in Digital Dreams Gallery" } ] } },
    ],
  },
  {
    user_id: "user_traderkim",
    experience_id: "exp_BPJ7JY3qCu49aR",
    username: "@traderkim",
    name: "David Kim",
    bio: "Professional day trader • Options specialist with 8 years experience • Risk management expert • Trading educator",
    avatar_url: "DK",
    sections: [
      { type: "trader", data: { assets: ["Options", "Futures", "Forex", "Commodities"], platforms: ["ThinkorSwim", "Interactive Brokers", "TradingView"] } },
      { type: "creator", data: { mediums: ["Trading Education", "YouTube", "Trading Courses"], links: [ { key: "YouTube", value: "https://youtube.com/traderkimofficial" }, { key: "Course", value: "https://traderkimacademy.com" }, { key: "Discord", value: "TraderKim Community" } ] } },
      { type: "student", data: { subjects: ["Finance", "Economics", "Statistics"], achievements: [ { key: "Degree", value: "MBA Finance - Wharton" }, { key: "Certification", value: "CFA Level III" }, { key: "License", value: "Series 7 & 63" } ] } },
    ],
  },
  {
    user_id: "user_sarahcodes",
    experience_id: "exp_BPJ7JY3qCu49aR",
    username: "@sarahcodes",
    name: "Sarah Wilson",
    bio: "CS Student at MIT • AI/ML researcher • Open source contributor • Building the next generation of intelligent systems",
    avatar_url: "SW",
    sections: [
      { type: "gamer", data: { games: ["Portal", "Civilization VI", "Chess.com"], platforms: ["PC", "Steam"], handles: [ { key: "Steam", value: "sarahcodes" }, { key: "Chess.com", value: "SarahWilsonAI" } ] } },
      { type: "creator", data: { mediums: ["Research Papers", "Technical Blog", "Open Source"], links: [ { key: "Research Gate", value: "https://researchgate.net/profile/Sarah-Wilson" }, { key: "Medium", value: "https://medium.com/@sarahcodes" } ] } },
      { type: "developer", data: { languages: ["Python", "R", "C++", "Julia"], frameworks: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV"], projects: [ { key: "VisionAI", value: "Computer vision for medical imaging" }, { key: "NLP-Toolkit", value: "Open source language processing" }, { key: "Github", value: "https://github.com/sarahwilsonai" } ] } },
      { type: "student", data: { subjects: ["Machine Learning", "Computer Vision", "Natural Language Processing", "Statistics"], achievements: [ { key: "University", value: "MIT Computer Science" }, { key: "GPA", value: "4.8/5.0" }, { key: "Research", value: "Published 23 papers" }, { key: "Award", value: "NSF Graduate Research Fellow" } ] } },
    ],
  },
  {
    user_id: "user_marcusgames",
    experience_id: "exp_BPJ7JY3qCu49aR",
    username: "@marcusgames",
    name: "Marcus Torres",
    bio: "Professional esports player • Valorant champion • Twitch streamer with 45k followers • Gaming coach and mentor",
    avatar_url: "MT",
    sections: [
      { type: "gamer", data: { games: ["Valorant", "CS2", "Apex Legends", "Rocket League"], platforms: ["PC", "Steam", "Epic Games"], handles: [ { key: "Steam", value: "MarcusTorres" }, { key: "Riot ID", value: "Marcus#GOAT" }, { key: "Epic", value: "MarcusGamesYT" } ] } },
      { type: "creator", data: { mediums: ["Twitch Streaming", "YouTube", "Gaming Content", "Coaching"], links: [ { key: "Twitch", value: "https://twitch.tv/marcusgames" }, { key: "YouTube", value: "https://youtube.com/marcusgamesofficial" }, { key: "Discord", value: "Marcus Gaming Community" } ] } },
      { type: "trader", data: { assets: ["Gaming Stocks", "Esports ETFs"], platforms: ["Robinhood"] } },
      { type: "student", data: { subjects: ["Sports Management", "Digital Marketing", "Psychology"], achievements: [ { key: "Tournament", value: "Valorant Champions 2023" }, { key: "Rank", value: "Radiant Top 500" }, { key: "Coaching", value: "500+ students trained" } ] } },
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