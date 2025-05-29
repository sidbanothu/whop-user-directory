import { whopApi } from "@/lib/whop-api";
import { verifyUserToken } from "@whop/api";
import { headers } from "next/headers";
import { AdminSettings } from "@/components/admin/admin-settings";
import { prisma } from "@/lib/db";

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

  // Fetch settings from the database
  const settings = await prisma.experienceSettings.findUnique({
    where: { experienceId },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminSettings 
        experienceId={experienceId}
        currentSettings={settings || {}}
      />
    </div>
  );
} 
