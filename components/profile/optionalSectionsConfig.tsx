import { IconType } from "react-icons";
import { FaGamepad, FaPaintBrush, FaCode, FaChartLine, FaGraduationCap } from "react-icons/fa";

export type OptionalSectionKey = "gamer" | "creator" | "developer" | "trader" | "student";

export interface OptionalSectionConfig {
  key: OptionalSectionKey;
  label: string;
  description: string;
  icon: IconType;
  iconColor: string;
  fields: {
    type: "tags" | "key-value" | "text";
    name: string;
    label: string;
    placeholder?: string;
    max?: number;
  }[];
}

export const OPTIONAL_SECTIONS: OptionalSectionConfig[] = [
  {
    key: "gamer",
    label: "Gamer",
    description: "Show off your gaming skills, favorite titles, and platforms.",
    icon: FaGamepad,
    iconColor: "text-indigo-500",
    fields: [
      { type: "tags", name: "games", label: "Favorite Games", placeholder: "Add a game", max: 8 },
      { type: "tags", name: "platforms", label: "Platforms", placeholder: "e.g. PC, PS5", max: 5 },
      { type: "key-value", name: "handles", label: "Gamer Handles", placeholder: "e.g. Steam, Xbox", max: 5 },
    ],
  },
  {
    key: "creator",
    label: "Creator",
    description: "Share your creative outlets, channels, and content.",
    icon: FaPaintBrush,
    iconColor: "text-pink-500",
    fields: [
      { type: "tags", name: "mediums", label: "Mediums", placeholder: "e.g. YouTube, Art", max: 5 },
      { type: "key-value", name: "links", label: "Links", placeholder: "e.g. Channel, Portfolio", max: 5 },
    ],
  },
  {
    key: "developer",
    label: "Developer",
    description: "Highlight your dev skills, languages, and projects.",
    icon: FaCode,
    iconColor: "text-green-500",
    fields: [
      { type: "tags", name: "languages", label: "Languages", placeholder: "e.g. JS, Python", max: 8 },
      { type: "tags", name: "frameworks", label: "Frameworks", placeholder: "e.g. React, Django", max: 5 },
      { type: "key-value", name: "projects", label: "Projects", placeholder: "Name & Link", max: 5 },
    ],
  },
  {
    key: "trader",
    label: "Trader",
    description: "Share your trading interests, assets, and platforms.",
    icon: FaChartLine,
    iconColor: "text-yellow-500",
    fields: [
      { type: "tags", name: "assets", label: "Assets", placeholder: "e.g. Stocks, Crypto", max: 8 },
      { type: "tags", name: "platforms", label: "Platforms", placeholder: "e.g. Robinhood", max: 5 },
    ],
  },
  {
    key: "student",
    label: "Student",
    description: "Show your studies, interests, and achievements.",
    icon: FaGraduationCap,
    iconColor: "text-blue-500",
    fields: [
      { type: "tags", name: "subjects", label: "Subjects", placeholder: "e.g. Math, CS", max: 8 },
      { type: "key-value", name: "achievements", label: "Achievements", placeholder: "e.g. Award, GPA", max: 5 },
    ],
  },
]; 