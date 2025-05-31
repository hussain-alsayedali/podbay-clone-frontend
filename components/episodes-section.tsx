"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { EpisodeCard, type Episode } from "@/components/episode-card";
import { EpisodeListCard } from "@/components/episode-list-card";
import { EpisodeCompactCard } from "@/components/episode-compact-card";
import {
  HorizontalScrollCarousel,
  type HorizontalScrollCarouselRef,
} from "@/components/horizontal-scroll-carousel";
import { Button } from "@/components/ui/button";
import { EpisodeDivider } from "@/components/episode-divider";
import { useSearchStore } from "@/lib/search-store";
import { useDropdown } from "@/hooks/use-dropdown";

interface EpisodesSectionProps {
  episodes: Episode[];
  searchQuery: string;
}

export function EpisodesSection({
  episodes,
  searchQuery,
}: EpisodesSectionProps) {
  const episodeLayoutMode = useSearchStore((s) => s.episodeLayoutMode);
  const setEpisodeLayoutMode = useSearchStore((s) => s.setEpisodeLayoutMode);

  const episodeCarouselRef = useRef<HorizontalScrollCarouselRef>(null);
  const {
    isOpen: isDropdownOpen,
    setIsOpen: setIsDropdownOpen,
    dropdownRef,
  } = useDropdown();

  if (episodes.length === 0) return null;
  const renderCompactLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
      {episodes.map((episode, index) => (
        <div key={episode.id}>
          <EpisodeCard episode={episode} />
          <EpisodeDivider />
        </div>
      ))}
    </div>
  );
  const renderScrollLayout = () => (
    <HorizontalScrollCarousel ref={episodeCarouselRef}>
      {episodes.map((episode) => (
        <div key={episode.id} className="min-w-[300px]">
          <EpisodeCompactCard episode={episode} />
        </div>
      ))}
    </HorizontalScrollCarousel>
  );
  const renderGridLayout = () => (
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
      {episodes.map((episode) => (
        <EpisodeCompactCard key={episode.id} episode={episode} />
      ))}
    </div>
  );
  const renderListLayout = () => (
    <div className="space-y-0">
      {episodes.map((episode, index) => (
        <div key={episode.id}>
          <EpisodeListCard episode={episode} />
          <EpisodeDivider />
        </div>
      ))}
    </div>
  );

  const renderLayoutContent = () => {
    switch (episodeLayoutMode) {
      case "compact":
        return renderCompactLayout();
      case "scroll":
        return renderScrollLayout();
      case "grid":
        return renderGridLayout();
      case "list":
        return renderListLayout();
      default:
        return renderCompactLayout();
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4 border-b border-custom-gray pb-4 pl-4">
        <h2 className="text-[16px] font-semibold text-white">
          {searchQuery ? `Top episodes for ${searchQuery}` : "Popular episodes"}
        </h2>
        <div className="flex space-x-2">
          {episodeLayoutMode === "scroll" && (
            <>
              <button
                onClick={() => episodeCarouselRef.current?.scrollLeft()}
                className="p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={() => episodeCarouselRef.current?.scrollRight()}
                className="p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}
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
              <MoreVertical size={18} className="text-white" />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50 gradient-dropdown">
                {/* Triangle pointer */}
                <div className="absolute -top-1 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#7B5FC7]"></div>                <div className="p-1">                  {["compact", "scroll", "grid", "list"]
                    .filter((mode) => mode !== episodeLayoutMode)
                    .map((mode) => (
                    <button
                      key={mode}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/10 transition-colors h-10 cursor-pointer flex items-center space-x-2"
                      onClick={() => {
                        setEpisodeLayoutMode(mode as any);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>
                        Switch to {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {renderLayoutContent()}
    </section>
  );
}
