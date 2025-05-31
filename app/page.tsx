"use client";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { PodcastsSection } from "@/components/podcasts-section";
import { EpisodesSection } from "@/components/episodes-section";
import { type Podcast } from "@/components/podcast-card";
import { type Episode } from "@/components/episode-card";
import { useEffect, useState } from "react";
import { useSearchStore } from "@/lib/search-store";
export default function SearchPage() {
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const query = searchQuery;
      if (query === "") return;
      console.log("Fetching data for:", query);
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3333/track/search/${query}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        console.log("Fetched data:", data);
        setPodcasts(
          (data.podcasts || []).map((p: any, index: number) => ({
            id: p.collectionId || p.trackId || p.id || `podcast-${index}`,
            title:
              p.collectionName || p.artistName || p.trackName || "Untitled",
            author: p.artistName || "Unknown",
            imageUrl: p.artworkUrl600 || "/placeholder.svg",
          }))
        );
        setEpisodes(
          (data.podcastEpisodes || []).map((e: any, index: number) => ({
            id: e.trackId || e.collectionId || e.id || `episode-${index}`,
            title: e.trackName || "Untitled",
            podcastName: e.collectionName || e.artistName || "Unknown",
            imageUrl: e.artworkUrl600 || "/placeholder.svg",
            duration: e.trackTimeMillis
              ? `${Math.floor(e.trackTimeMillis / 60000)}:${String(
                  Math.floor((e.trackTimeMillis % 60000) / 1000)
                ).padStart(2, "0")}`
              : "--:--",
            description: e.description || e.longDescription || e.summary || "",
            trackTimeMillis: e.trackTimeMillis,
            releaseDate: e.releaseDate ? new Date(e.releaseDate) : undefined,
          }))
        );
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchQuery]);

  return (
    <div className="flex h-screen bg-background text-card-foreground pb-8">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto space-y-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
                <div className="text-white text-lg">Loading...</div>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <PodcastsSection podcasts={podcasts} searchQuery={searchQuery} />
              <EpisodesSection episodes={episodes} searchQuery={searchQuery} />

              {podcasts.length === 0 && episodes.length === 0 && (
                <div className="text-center text-muted-foreground mt-8">
                  <p className="text-lg">No results found</p>
                  {searchQuery && (
                    <p className="text-sm mt-2">
                      Try searching for different keywords
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
