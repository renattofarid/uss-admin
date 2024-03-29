import { Category } from "@/services/posts";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OPTIONS_CATEGORY = [
  { value: Category.NEWS, label: "Noticias" },
  { value: Category.BITS, label: "Bits" },
  { value: Category.READS, label: "Reads" },
  { value: Category.TUBES, label: "Tubes" },
  { value: Category.PODCAST, label: "Podcast" },
  { value: Category.EDITORIAL, label: "Editorial" },
];
