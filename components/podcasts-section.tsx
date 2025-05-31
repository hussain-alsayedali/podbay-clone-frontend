"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { PodcastCard, type Podcast } from "@/components/podcast-card";
import {
  HorizontalScrollCarousel,
  type HorizontalScrollCarouselRef,
} from "@/components/horizontal-scroll-carousel";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/lib/search-store";
import { useDropdown } from "@/hooks/use-dropdown";

interface PodcastsSectionProps {
  podcasts: Podcast[];
  searchQuery: string;
}

export function PodcastsSection({
  podcasts,
  searchQuery,
}: PodcastsSectionProps) {
  const podcastLayoutMode = useSearchStore((s) => s.podcastLayoutMode);
  const setPodcastLayoutMode = useSearchStore((s) => s.setPodcastLayoutMode);

  const podcastCarouselRef = useRef<HorizontalScrollCarouselRef>(null);
  const {
    isOpen: isDropdownOpen,
    setIsOpen: setIsDropdownOpen,
    dropdownRef,
  } = useDropdown();

  if (podcasts.length === 0) return null;

  return (
    <section className="mb-8 mt-12 pb-4">
      <div className="flex justify-between items-center mb-4 border-b border-custom-gray pb-4 pl-4">
        <h2 className="text-[16px] font-semibold text-white">
          {searchQuery ? `Top podcasts for ${searchQuery}` : "Popular podcasts"}
        </h2>
        <div className="flex space-x-2">
          {podcastLayoutMode === "scroll" && (
            <>
              <button
                onClick={() => podcastCarouselRef.current?.scrollLeft()}
                className="p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={() => podcastCarouselRef.current?.scrollRight()}
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
                <div className="absolute -top-1 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#7B5FC7]"></div>
                <div className="p-1">
                  {podcastLayoutMode === "scroll" ? (
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/10 transition-colors h-10 cursor-pointer flex items-center space-x-2"
                      onClick={() => {
                        setPodcastLayoutMode("grid");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>Switch to Grid</span>
                    </button>
                  ) : (
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/10 transition-colors h-10 cursor-pointer flex items-center space-x-2"
                      onClick={() => {
                        setPodcastLayoutMode("scroll");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>Switch to Scroll</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {podcastLayoutMode === "scroll" ? (
        <HorizontalScrollCarousel ref={podcastCarouselRef}>
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </HorizontalScrollCarousel>
      ) : (
        <div className="flex flex-wrap gap-4 pl-4">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      )}
    </section>
  );
}
