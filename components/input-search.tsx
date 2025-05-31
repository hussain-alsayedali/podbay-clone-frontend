import * as React from "react";
import { useSearchStore } from "@/lib/search-store";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { debounce } from "lodash";

export function InputSearch({
  className,
  ...props
}: React.ComponentProps<"input">) {
  const inputValue = useSearchStore((s) => s.inputValue);
  const isSearching = useSearchStore((s) => s.isSearching);
  const setInputValue = useSearchStore((s) => s.setInputValue);
  const setIsSearching = useSearchStore((s) => s.setIsSearching);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);
  const searchParams = useSearchParams();
  const router = useRouter();
  // Initialize input value from URL on mount
  React.useEffect(() => {
    const query = searchParams.get("q") || "";
    setInputValue(query);
    setSearchQuery(query);
  }, [searchParams, setInputValue, setSearchQuery]);

  function executeSearch() {
    const trimmedValue = inputValue.trim();
    setSearchQuery(trimmedValue);
    setIsSearching(false);

    // Update URL using Next.js router
    const params = new URLSearchParams(searchParams);
    if (trimmedValue) {
      params.set("q", trimmedValue);
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }
  // Create debounced search function
  const debouncedSearch = React.useMemo(
    () =>
      debounce(() => {
        const currentValue = useSearchStore.getState().inputValue.trim();
        if (currentValue) {
          useSearchStore.getState().setSearchQuery(currentValue);
          useSearchStore.getState().setIsSearching(false);

          // Update URL using Next.js router
          const params = new URLSearchParams(searchParams);
          params.set("q", currentValue);
          router.push(`/?${params.toString()}`, { scroll: false });
        }
      }, 250),
    [searchParams, router] // Remove inputValue dependency
  );

  // Cleanup debounced function on unmount
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);

    // Set loading state when user starts typing
    if (value.trim() && !isSearching) {
      setIsSearching(true);
    }

    // Cancel previous debounced call and start new one
    if (value.trim()) {
      debouncedSearch();
    } else {
      // If input is empty, cancel debounce and stop loading immediately
      debouncedSearch.cancel();
      setIsSearching(false);
    }
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      // Cancel debounce and search immediately
      debouncedSearch.cancel();
      executeSearch();
    }
  }
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    // Get pasted content
    const pastedText = e.clipboardData.getData("text");

    // Check if pasted text contains a URL with search parameters
    try {
      const url = new URL(pastedText);
      const searchParam = url.searchParams.get("q");

      if (searchParam) {
        // If it's a URL with search query, extract and use the query
        e.preventDefault();
        setInputValue(searchParam);

        // Cancel debounce and search immediately
        debouncedSearch.cancel();

        // Update search query and URL using Next.js router
        setSearchQuery(searchParam);
        const params = new URLSearchParams(searchParams);
        params.set("q", searchParam);
        router.push(`/?${params.toString()}`, { scroll: false });
      }
    } catch {
      // Not a valid URL, let default paste behavior happen
    }
  }
  return (
    <div className="relative">
      <input
        type="search"
        data-slot="input-search"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-[#7C3AED]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "text-center",
          "pr-10", // Add padding for the icon
          className
        )}
        placeholder="Search podcasts and episodes..."
        {...props}
      />

      {/* Loading/Search Icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
