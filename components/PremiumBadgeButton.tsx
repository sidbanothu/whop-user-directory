"use client";

import { useState } from "react";
// If you use the Whop iframe SDK, uncomment the next line:
// import { useIframeSdk } from "@whop/sdk";

export function PremiumBadgeButton({ userId, experienceId }: { userId: string, experienceId: string }) {
  // Uncomment if using the iframe SDK:
  // const iframeSdk = useIframeSdk();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/charge-premium", {
        method: "POST",
        body: JSON.stringify({ userId, experienceId }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();

      // If using the iframe SDK (recommended for best UX):
      // if (data.planId) {
      //   const res = await iframeSdk.inAppPurchase({ plan_id: data.planId });
      //   if (res.status !== "ok") throw new Error(res.error);
      //   // Optionally, refetch user profile here
      //   return;
      // }

      // Fallback: redirect to checkout page
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      setError(err.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-all"
      >
        {loading ? "Processing..." : "Get Premium Badge ($1)"}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
} 