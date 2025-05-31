import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert milliseconds to minutes
export function formatDurationFromMillis(trackTimeMillis?: number): string {
  if (!trackTimeMillis) return "";
  const minutes = Math.round(trackTimeMillis / 60000);
  return `${minutes} min`;
}

// Format date to "Feb 23, 2025" format
export function formatRelativeDate(date?: Date | string): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return dateObj.toLocaleDateString("en-US", options);
}
