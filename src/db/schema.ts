import { pgTable, uuid, text, timestamp, boolean, json, index } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  experienceId: text('experience_id').notNull(),
  username: text('username').notNull(),
  name: text('name').notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  sections: json('sections').default('[]'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  isPremiumMember: boolean('is_premium_member').default(false),
}, (table) => ({
  communityUsernameIdx: index('profiles_community_username_idx').on(table.experienceId, table.username),
  communityIdIdx: index('profiles_community_id_idx').on(table.experienceId),
  userIdIdx: index('profiles_user_id_idx').on(table.userId),
  usernameIdx: index('profiles_username_idx').on(table.username),
}));

export const experienceSettings = pgTable('experience_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  experienceId: text('experience_id').notNull().unique(),
  color: text('color').notNull(),
  profileSections: text('profile_sections').array().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}); 