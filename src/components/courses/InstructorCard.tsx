import React from "react";
import { Building2 } from "lucide-react";
import { SocialIcon } from "@/components/common/SocialIcons";

// Expanding the inline type to handle actual API fields
interface FullInstructor {
  id?: string;
  name: string;
  role?: string;
  sub_title?: string;
  bio?: string;
  company?: string;
  color?: string;
  profile_image_url?: string;
  metadata?: Record<string, string>;
}

export function InstructorCard({ instructor }: { instructor: FullInstructor }) {
  // Extract initials for avatar fallback
  const initials = instructor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Handle case-insensitive metadata keys (e.g. "Github" vs "github")
  const meta = instructor.metadata || {};
  const getSocial = (key: string) => {
    const foundKey = Object.keys(meta).find(k => k.toLowerCase() === key.toLowerCase());
    return foundKey ? meta[foundKey] : null;
  };

  const twitter = getSocial("twitter");
  const linkedin = getSocial("linkedin");
  const youtube = getSocial("youtube");
  const github = getSocial("github");

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/30 transition-all duration-300">
      
      {/* Avatar */}
      <div 
        className={`w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-[1.5rem] bg-gradient-to-br ${instructor.color || "from-gray-700 to-gray-900"} flex items-center justify-center shadow-inner relative overflow-hidden group`}
      >
        {instructor.profile_image_url ? (
          <img 
            src={instructor.profile_image_url} 
            alt={instructor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl sm:text-5xl font-black text-white mix-blend-overlay group-hover:scale-110 transition-transform duration-500">
            {initials}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 leading-tight">
            {instructor.name}
          </h3>
          <p className="text-brand-600 dark:text-brand-400 font-bold text-sm">
            {instructor.sub_title ? `${instructor.role} • ${instructor.sub_title}` : instructor.role}
          </p>
        </div>
        
        {instructor.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed flex-1">
            {instructor.bio}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-auto">
          {instructor.company && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 text-xs font-bold shadow-sm">
              <Building2 size={14} className="text-gray-400" />
              {instructor.company}
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {twitter && (
              <a href={twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                <SocialIcon name="twitter" size={16} />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 transition-colors">
                <SocialIcon name="linkedin" size={16} />
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <SocialIcon name="youtube" size={16} />
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <SocialIcon name="github" size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
