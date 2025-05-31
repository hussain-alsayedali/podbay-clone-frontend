import Image from "next/image";
import { PlayCircle, MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useRef, useEffect } from "react";

export interface Episode {
  id: string;
  title: string;
  podcastName: string;
  imageUrl: string;
  duration: string;
  description?: string;
  releaseDate?: Date | string;
  trackTimeMillis?: number;
}

interface EpisodeCardProps {
  episode: Episode;
}

const TITLE_COLORS = ["#9d8457", "#4396c9", "#a161c2"];

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    "Add to My Queue",
    "Go to Episode",
    "Go to Podcast",
    "Download File",
  ];

  // Randomize color per card instance (stable for same id)
  const color = useMemo(() => {
    const idString = String(episode.id || "default");
    let hash = 0;
    for (let i = 0; i < idString.length; i++) {
      hash = idString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return TITLE_COLORS[Math.abs(hash) % TITLE_COLORS.length];
  }, [episode.id]);

  return (
    <div className="flex items-center space-x-4 p-3 rounded-sm hover:bg-black/20 transition-colors group cursor-pointer">
      <div className="relative w-[50px] h-[50px] rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={episode.imageUrl || "/placeholder.svg"}
          alt={episode.title}
          width={50}
          height={50}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-12">
        <h4 className="text-sm font-medium truncate text-white">
          {episode.title}
        </h4>
        <p className="text-xs truncate" style={{ color }}>
          {episode.podcastName}
        </p>
      </div>
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <MoreVertical size={18} />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50 gradient-dropdown p-1">
            <div className="absolute -top-1 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#7B5FC7]"></div>
            <div className="py-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/10 transition-colors h-10 rounded-sm cursor-pointer "
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                      console.log(`Clicked: ${item}`);
                    }}
                  >
                    {item}
                  </button>
                  {(item === "Add to My Queue" || item === "Go to Podcast") && (
                    <div className="mx-4 my-1">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
