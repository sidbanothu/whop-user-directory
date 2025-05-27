import { useState, useEffect } from "react";
import { Profile } from "@/lib/types/profile";
import { createClient } from "@/lib/supabase/client";

export function useProfiles(query: string) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true);
        setError(null);

        let queryBuilder = supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (query) {
          queryBuilder = queryBuilder.textSearch("search_vector", query);
        }

        const { data, error: supabaseError } = await queryBuilder;

        if (supabaseError) {
          throw supabaseError;
        }

        // Map snake_case to camelCase and parse sections
        const mapped = (data as any[]).map((profile) => ({
          ...profile,
          avatarUrl: profile.avatar_url,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
          sections: typeof profile.sections === "string" ? JSON.parse(profile.sections) : profile.sections,
        }));
        console.log("Fetched profiles:", mapped);
        setProfiles(mapped);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch profiles"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfiles();
  }, [query, supabase]);

  return { profiles, isLoading, error };
} 