"use client";
import { Suspense } from "react";
import { InputSearch } from "./input-search";
import { Search } from "lucide-react";

export function InputSearchFallback() {
  return (
    <div className="relative">
      <input
        type="search"
        disabled
        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-[#7C3AED] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-center pr-10"
        placeholder="Loading search..."
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export function InputSearchWrapper({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Suspense fallback={<InputSearchFallback />}>
      <InputSearch className={className} {...props} />
    </Suspense>
  );
}
