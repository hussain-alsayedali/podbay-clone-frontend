import { create } from "zustand";

type EpisodeLayoutMode = "compact" | "scroll" | "grid" | "list";
type PodcastLayoutMode = "scroll" | "grid";

interface SearchState {
  searchQuery: string;
  inputValue: string;
  isSearching: boolean;
  episodeLayoutMode: EpisodeLayoutMode;
  podcastLayoutMode: PodcastLayoutMode;
  setSearchQuery: (query: string) => void;
  setInputValue: (value: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setEpisodeLayoutMode: (mode: EpisodeLayoutMode) => void;
  setPodcastLayoutMode: (mode: PodcastLayoutMode) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: "",
  inputValue: "",
  isSearching: false,
  episodeLayoutMode: "compact",
  podcastLayoutMode: "scroll",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setInputValue: (value) => set({ inputValue: value }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setEpisodeLayoutMode: (mode) => set({ episodeLayoutMode: mode }),
  setPodcastLayoutMode: (mode) => set({ podcastLayoutMode: mode }),
}));
