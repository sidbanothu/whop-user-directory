import Link from "next/link";
import clsx from "clsx";

interface DirectoryToggleProps {
  experienceId: string;
  activeTab: "directory" | "edit-profile";
}

export function DirectoryToggle({ experienceId, activeTab }: DirectoryToggleProps) {
  return (
    <div className="flex w-full max-w-md rounded-lg bg-gray-100 p-1 mb-6">
      <Link
        href={`/experiences/${experienceId}`}
        className={clsx(
          "flex-1 text-center py-2 rounded-md font-medium text-sm transition-colors",
          activeTab === "directory"
            ? "bg-white text-black shadow-sm"
            : "text-gray-500 hover:text-black"
        )}
      >
        User Directory
      </Link>
      <Link
        href={`/experiences/${experienceId}/edit-profile`}
        className={clsx(
          "flex-1 text-center py-2 rounded-md font-medium text-sm transition-colors",
          activeTab === "edit-profile"
            ? "bg-white text-black shadow-sm"
            : "text-gray-500 hover:text-black"
        )}
      >
        Edit Profile
      </Link>
    </div>
  );
} 