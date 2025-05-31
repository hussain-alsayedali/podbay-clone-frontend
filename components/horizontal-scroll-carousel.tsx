import type React from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface HorizontalScrollCarouselProps {
  children: React.ReactNode;
}

export interface HorizontalScrollCarouselRef {
  scrollLeft: () => void;
  scrollRight: () => void;
}

export const HorizontalScrollCarousel = forwardRef<
  HorizontalScrollCarouselRef,
  HorizontalScrollCarouselProps
>(({ children }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollLeft: () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: -1200,
          behavior: "smooth",
        });
      }
    },
    scrollRight: () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: 1200,
          behavior: "smooth",
        });
      }
    },
  }));

  return (
    <div
      ref={scrollContainerRef}
      className="flex space-x-4 overflow-x-auto pb-4 -mb-4 pl-4 custom-scrollbar"
    >
      {children}
      {/* Add a small invisible element at the end to ensure padding is respected if scrollbar is hidden */}
      <div className="flex-shrink-0 w-px"></div>
    </div>
  );
});

HorizontalScrollCarousel.displayName = "HorizontalScrollCarousel";
