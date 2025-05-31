import Image from "next/image";
import { formatDurationFromMillis, formatRelativeDate } from "@/lib/utils";
import { type Episode } from "@/components/episode-card";
import { useMemo, useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface EpisodeCompactCardProps {
  episode: Episode;
}

const TITLE_COLORS = ["#9d8457", "#4396c9", "#a161c2"];
const BG_COLORS = ["#25222c", "#1c2336", "#251c30"]; // yellow, blue, pink

export function EpisodeCompactCard({ episode }: EpisodeCompactCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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

    function handleScroll() {
      setIsDropdownOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true); // Use capture to catch all scroll events

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 192, // 192px is the width of dropdown (w-48)
      });
    }

    setIsDropdownOpen(!isDropdownOpen);
  };

  const menuItems = [
    "Add to My Queue",
    "Go to Episode",
    "Go to Podcast",
    "Download File",
  ];

  // Randomize color per card instance (stable for same id)
  const colorIndex = useMemo(() => {
    const idString = String(episode.id || "default");
    let hash = 0;
    for (let i = 0; i < idString.length; i++) {
      hash = idString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % TITLE_COLORS.length;
  }, [episode.id]);

  const titleColor = TITLE_COLORS[colorIndex];
  const backgroundColor = BG_COLORS[colorIndex];
  return (
    <div
      className="flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:brightness-110"
      style={{ backgroundColor }}
    >
      {/* Episode Image */}
      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={episode.imageUrl || "/placeholder.svg"}
          alt={episode.title}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Episode Content */}
      <div className="flex-1 min-w-0">
        {/* Episode Title */}
        <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight mb-1">
          {episode.title}
        </h3>

        {/* Podcast Name */}
        <p className="text-xs mb-2 line-clamp-1" style={{ color: titleColor }}>
          {episode.podcastName}
        </p>

        {/* Date and Duration */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {episode.releaseDate && (
            <span>{formatRelativeDate(episode.releaseDate)}</span>
          )}
          {episode.trackTimeMillis && (
            <>
              {episode.releaseDate && <span>•</span>}
              <span>{formatDurationFromMillis(episode.trackTimeMillis)}</span>
            </>
          )}
        </div>
      </div>

      {/* More Vertical Button */}
      <div className="relative" ref={dropdownRef}>
        {" "}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground cursor-pointer"
          onClick={handleDropdownToggle}
        >
          <MoreVertical size={18} />
        </Button>
        {isDropdownOpen &&
          createPortal(
            <div
              className="absolute w-48 rounded-lg shadow-lg z-50 gradient-dropdown p-1"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                pointerEvents: "auto",
              }}
            >
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
              </div>{" "}
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
