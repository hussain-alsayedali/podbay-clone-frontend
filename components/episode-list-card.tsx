import Image from "next/image";
import { formatDurationFromMillis, formatRelativeDate } from "@/lib/utils";
import { type Episode } from "@/components/episode-card";
import { useMemo, useState, useRef, useEffect } from "react";
import { MoreVertical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EpisodeListCardProps {
  episode: Episode;
}

const TITLE_COLORS = ["#9d8457", "#4396c9", "#a161c2"];

export function EpisodeListCard({ episode }: EpisodeListCardProps) {
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
    <div className="flex items-start space-x-4 p-1 transition-colors ml-3">
      <div className="relative min-w-[60px] max-w-[100px] w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={episode.imageUrl || "/placeholder.svg"}
          alt={episode.title}
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>{" "}
      <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[80px]">
        <div className="space-y-1">
          <h4 className="text-sm font-medium line-clamp-2 text-white leading-tight">
            {episode.title}
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color }}>
              {episode.podcastName}
            </p>
            <div className="flex items-center content-center flex-col ">
              <Button
                variant="ghost"
                size="icon"
                className="text-white cursor-pointer h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Play episode:", episode.title);
                }}
              >
                <Play size={16} className="text-[#6a6a81] fill-[#6a6a81]" />
              </Button>
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground cursor-pointer h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  <MoreVertical size={16} />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50 gradient-dropdown p-1">
                    <div className="absolute -top-1 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#7B5FC7]"></div>
                    <div className="py-2">
                      {menuItems.map((item, index) => (
                        <div key={index}>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/10 transition-colors h-10 rounded-sm cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDropdownOpen(false);
                              console.log(`Clicked: ${item}`);
                            }}
                          >
                            {item}
                          </button>
                          {(item === "Add to My Queue" ||
                            item === "Go to Podcast") && (
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
          </div>
          {episode.description && episode.description.trim() && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {episode.description}
            </p>
          )}
        </div>
        <div className="flex items-center mt-2">
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            {episode.releaseDate && (
              <span>{formatRelativeDate(episode.releaseDate)}</span>
            )}
            {episode.trackTimeMillis && (
              <>
                {episode.releaseDate && <span>•</span>}
                <span>{formatDurationFromMillis(episode.trackTimeMillis)}</span>
              </>
            )}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
