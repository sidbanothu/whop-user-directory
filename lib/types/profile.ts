export type ProfileSection = {
  type: "gamer" | "creator" | "trader" | "developer" | "student";
  title: string;
  data: { [key: string]: string | string[] | Record<string, string> };
};

export type Profile = {
  id: string;
  userId: string;
  experience_id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string | null;
  sections: ProfileSection[];
  createdAt: string;
  updatedAt: string;
  is_premium_member?: boolean;
}; 