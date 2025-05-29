-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "experience_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "avatar_url" TEXT,
    "sections" JSONB DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_premium_member" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceSettings" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "profileSections" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profiles_community_id_idx" ON "profiles"("experience_id");

-- CreateIndex
CREATE INDEX "profiles_user_id_idx" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_username_idx" ON "profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_community_username_idx" ON "profiles"("experience_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceSettings_experienceId_key" ON "ExperienceSettings"("experienceId");
