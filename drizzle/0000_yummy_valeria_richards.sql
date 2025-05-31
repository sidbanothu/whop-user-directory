CREATE TABLE "experience_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" text NOT NULL,
	"color" text NOT NULL,
	"profile_sections" text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "experience_settings_experience_id_unique" UNIQUE("experience_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"experience_id" text NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"avatar_url" text,
	"sections" json DEFAULT '[]',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_premium_member" boolean DEFAULT false
);
--> statement-breakpoint
CREATE INDEX "profiles_community_username_idx" ON "profiles" USING btree ("experience_id","username");--> statement-breakpoint
CREATE INDEX "profiles_community_id_idx" ON "profiles" USING btree ("experience_id");--> statement-breakpoint
CREATE INDEX "profiles_user_id_idx" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profiles_username_idx" ON "profiles" USING btree ("username");