"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function SearchBar({ experienceId, tab }: { experienceId: string; tab?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 300);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      if (tab && tab !== "all") {
        params.set("tab", tab);
      }
      router.push(`/experiences/${experienceId}?${params.toString()}`);
    },
    [router, searchParams, experienceId, tab]
  );

  return (
    <div className="relative w-full">
      <input
        type="search"
        placeholder="Search members by name, skills, or interests..."
        className="w-full pl-8 pr-8 py-4 rounded-full bg-white/95 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-lg text-gray-700 placeholder-gray-500 font-semibold text-center transition-all border-none"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ boxShadow: '0 2px 16px 0 rgba(80, 63, 205, 0.08)' }}
      />
    </div>
  );
} 