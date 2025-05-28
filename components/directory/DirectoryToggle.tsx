import Link from "next/link";
import clsx from "clsx";

interface DirectoryToggleProps {
  experienceId: string;
  activeTab: "directory" | "developers" | "creators" | "traders";
}

export function DirectoryToggle({ experienceId, activeTab }: DirectoryToggleProps) {
  return (
    <div className="tabs flex bg-white/20 backdrop-blur-lg rounded-full p-1 shadow-md gap-2 min-w-fit">
      <Link
        href={`/experiences/${experienceId}`}
        className={clsx(
          "tab px-6 py-2 rounded-full font-medium text-base transition-all",
          activeTab === "directory"
            ? "bg-white text-indigo-500 shadow"
            : "text-white hover:bg-white/30 hover:text-indigo-100"
        )}
      >
        All Members
      </Link>
      <Link
        href={`/experiences/${experienceId}?tab=developers`}
        className={clsx(
          "tab px-6 py-2 rounded-full font-medium text-base transition-all",
          activeTab === "developers"
            ? "bg-white text-indigo-500 shadow"
            : "text-white hover:bg-white/30 hover:text-indigo-100"
        )}
      >
        Developers
      </Link>
      <Link
        href={`/experiences/${experienceId}?tab=creators`}
        className={clsx(
          "tab px-6 py-2 rounded-full font-medium text-base transition-all",
          activeTab === "creators"
            ? "bg-white text-indigo-500 shadow"
            : "text-white hover:bg-white/30 hover:text-indigo-100"
        )}
      >
        Creators
      </Link>
      <Link
        href={`/experiences/${experienceId}?tab=traders`}
        className={clsx(
          "tab px-6 py-2 rounded-full font-medium text-base transition-all",
          activeTab === "traders"
            ? "bg-white text-indigo-500 shadow"
            : "text-white hover:bg-white/30 hover:text-indigo-100"
        )}
      >
        Traders
      </Link>
    </div>
  );
} 