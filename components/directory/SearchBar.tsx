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
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
        <Search className="w-5 h-5" />
      </span>
      <input
        type="search"
        placeholder="Search members by name, skills, or interests..."
        className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 backdrop-blur-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base text-gray-700 placeholder-gray-400 transition-all"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
} 