import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge Tailwind and conditional classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
  //return twMerge(clsx(...inputs)); // flatten inputs for clsx
}
