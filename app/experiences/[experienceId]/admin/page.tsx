import { whopApi } from "@/lib/whop-api";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";

export default async function AdminDashboardPage({ params }) {
  const headersList = await headers();
  const { experienceId } = params;
  const { userId } = await verifyUserToken(headersList);

  // Check if user has admin access
  const result = await whopApi.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  if (!result.hasAccessToExperience.hasAccess || 
      result.hasAccessToExperience.accessLevel !== 'admin') {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You must be an admin to access this page.</p>
      </div>
    );
  }

  // No content needed, admin settings are now in a modal
  return null;
} 
