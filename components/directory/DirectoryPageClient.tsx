"use client";
import { Suspense } from "react";
import { DirectoryGrid } from "./DirectoryGrid";
import { SearchBar } from "./SearchBar";

export function DirectoryPageClient() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Community Directory</h1>
        <SearchBar />
      </div>
      <Suspense fallback={<div>Loading profiles...</div>}>
        <DirectoryGrid />
      </Suspense>
    </main>
  );
} 