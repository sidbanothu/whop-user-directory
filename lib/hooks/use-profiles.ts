import { useState, useEffect } from "react";
import { Profile } from "@/lib/types/profile";

export function useProfiles(experienceId: string) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`/api/profiles?experienceId=${experienceId}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        setProfiles(data.profiles);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch profiles"));
      } finally {
        setIsLoading(false);
      }
    }

    if (experienceId) {
      fetchProfiles();
    }
  }, [experienceId]);

  return { profiles, isLoading, error };
} 