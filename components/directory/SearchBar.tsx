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
    <div className="relative w-full max-w-xl mx-auto">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none flex items-center">
        <Search className="w-6 h-6" />
      </span>
      <input
        type="search"
        placeholder="Search members..."
        className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-50 border border-slate-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 text-lg text-gray-700 placeholder:text-slate-400 font-medium text-left transition-all"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ boxShadow: '0 2px 16px 0 rgba(80, 63, 205, 0.06)' }}
      />
    </div>
  );
} 