import Image from "next/image";
import { useMemo } from "react";

export interface Podcast {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

interface PodcastCardProps {
  podcast: Podcast;
}

const TITLE_COLORS = ["#9d8457", "#4396c9", "#a161c2"];

export function PodcastCard({ podcast }: PodcastCardProps) {
  // Randomize color per card instance (stable for same id)
  const color = useMemo(() => {
    // Use a simple hash of the podcast id for stable color assignment
    const idString = String(podcast.id || "default");
    let hash = 0;
    for (let i = 0; i < idString.length; i++) {
      hash = idString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return TITLE_COLORS[Math.abs(hash) % TITLE_COLORS.length];
  }, [podcast.id]);

  return (
    <div
      className="flex-shrink-0 space-y-2 group"
      style={{
        minWidth: "160px",
        maxWidth: "240px",
        width: "clamp(160px, 20vw, 240px)",
      }}
    >
      <div
        className="rounded-lg overflow-hidden relative w-full"
        style={{
          height: "clamp(160px, 20vw, 240px)",
          aspectRatio: "1/1",
        }}
      >
        <Image
          src={podcast.imageUrl || "/placeholder.svg"}
          alt={podcast.title}
          fill={true}
          className="object-cover transition-transform duration-300"
        />
      </div>
      <a
        className="text-sm font-medium truncate group-hover:text-primary text-white block w-full"
        href={`/podcast/${podcast.id}`}
      >
        {podcast.title}
      </a>
      <p className="text-xs truncate" style={{ color }}>
        {podcast.author}
      </p>
    </div>
  );
}
