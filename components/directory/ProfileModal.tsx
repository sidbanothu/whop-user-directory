import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Profile } from "@/lib/types/profile";

interface ProfileModalProps {
  profile: Profile;
  onClose: () => void;
}

export function ProfileModal({ profile, onClose }: ProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("keydown", handleEscape); };
  }, [onClose]);

  // Close modal on click outside (backdrop)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="modal-content w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transform scale-100 transition-transform duration-300">
        {/* Modal Header (gradient background) */}
        <div className="modal-header bg-gradient-to-r from-indigo-400 to-purple-400 p-6 rounded-t-2xl relative">
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors" onClick={onClose}>&times;</button>
          <div className="flex items-center gap-4">
            <div className="avatar w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-indigo-500">{profile.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="profile-info text-white">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="profile-username text-lg opacity-90">@{profile.username}</div>
            </div>
          </div>
          {profile.bio && <p className="mt-2 text-white text-base">{profile.bio}</p>}
        </div>
        {/* Modal Body (sections) */}
        <div className="modal-body p-6 space-y-8">
          {profile.sections && profile.sections.length > 0 ? (
            profile.sections.map((section, idx) => (
              <div key={idx} className="section mb-6">
                <h3 className="section-title text-xl font-semibold mb-2 flex items-center gap-2">
                  <span className="section-icon inline-flex w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-400 rounded text-white text-xs items-center justify-center">
                    {section.type === "developer" ? "💻" : section.type === "gamer" ? "🎮" : section.type === "creator" ? "🎨" : section.type === "trader" ? "💹" : section.type === "student" ? "📚" : "🧑‍💼"}
                  </span>
                  {section.title || section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(section.data).map(([key, value], i) => (
                    <div key={i} className="min-w-[120px] mb-2">
                      <span className="block text-xs font-medium text-gray-500 mb-1 capitalize">{key.replace(/_/g, " ")}</span>
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1">
                          {value.map((v, j) => (
                            <span key={j} className="inline-block bg-gradient-to-br from-indigo-400 to-purple-400 text-white px-2 py-1 rounded-full text-xs font-medium">{v}</span>
                          ))}
                        </div>
                      ) : typeof value === "object" && value !== null ? (
                        <div className="flex flex-col gap-1">
                          {Object.entries(value).map(([subKey, subValue], k) => (
                            <div key={k} className="pl-2 border-l border-indigo-200">
                              <span className="block text-xs text-gray-400">{subKey}:</span>
                              <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">{String(subValue)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">{String(value)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No additional info provided.</div>
          )}
        </div>
      </div>
    </div>
  );
} 