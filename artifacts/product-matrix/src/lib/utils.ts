import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const flagMap: Record<string, string> = {
  "usa": "🇺🇸", "united states": "🇺🇸", "us": "🇺🇸", "america": "🇺🇸",
  "china": "🇨🇳", "prc": "🇨🇳",
  "japan": "🇯🇵", 
  "germany": "🇩🇪", 
  "uk": "🇬🇧", "united kingdom": "🇬🇧", "britain": "🇬🇧",
  "france": "🇫🇷", 
  "india": "🇮🇳", 
  "brazil": "🇧🇷", 
  "canada": "🇨🇦", 
  "south korea": "🇰🇷", "korea": "🇰🇷", 
  "russia": "🇷🇺", 
  "australia": "🇦🇺", 
  "mexico": "🇲🇽", 
  "indonesia": "🇮🇩", 
  "netherlands": "🇳🇱", "dutch": "🇳🇱",
  "saudi arabia": "🇸🇦", 
  "turkey": "🇹🇷", "turkiye": "🇹🇷",
  "switzerland": "🇨🇭", "swiss": "🇨🇭",
  "taiwan": "🇹🇼", 
  "poland": "🇵🇱", 
  "sweden": "🇸🇪", 
  "belgium": "🇧🇪", 
  "italy": "🇮🇹", 
  "spain": "🇪🇸", 
  "vietnam": "🇻🇳", 
  "thailand": "🇹🇭", 
  "malaysia": "🇲🇾", 
  "singapore": "🇸🇬", 
  "philippines": "🇵🇭", 
  "chile": "🇨🇱", 
  "argentina": "🇦🇷", 
  "colombia": "🇨🇴",
  "peru": "🇵🇪", 
  "south africa": "🇿🇦", 
  "egypt": "🇪🇬", 
  "nigeria": "🇳🇬",
  "ireland": "🇮🇪",
  "new zealand": "🇳🇿",
  "uae": "🇦🇪", "united arab emirates": "🇦🇪",
  "global": "🌍", "worldwide": "🌍"
};

export function getFlagEmoji(country: string): string {
  if (!country) return "🌍";
  const normalized = country.toLowerCase().trim();
  return flagMap[normalized] || "🌍";
}
