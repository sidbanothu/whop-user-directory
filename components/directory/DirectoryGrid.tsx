"use client";

import { useSearchParams } from "next/navigation";
import { ProfileCard } from "./ProfileCard";
import { useProfiles } from "@/lib/hooks/use-profiles";

export function DirectoryGrid() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { profiles, isLoading, error } = useProfiles(query);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading profiles. Please try again later.
      </div>
    );
  }

  if (!profiles?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No profiles found. Try adjusting your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
} 