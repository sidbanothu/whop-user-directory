"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function CreateProfileButton({ experienceId }: { experienceId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch("/api/create-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experienceId }),
    });
    if (res.ok) {
      router.push(`/experiences/${experienceId}/edit-profile`);
    } else {
      alert("Failed to create profile. Please try again.");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? "Creating..." : "Create My Profile"}
    </button>
  );
} 