import type { ImageSourcePropType } from "react-native";
import { icons, type IconKey } from "@/constants/icons";

const NAME_ICON_KEYS: [string, IconKey][] = [
  ["spotify", "spotify"],
  ["notion", "notion"],
  ["figma", "figma"],
  ["github", "github"],
  ["adobe", "adobe"],
  ["canva", "canva"],
  ["claude", "claude"],
  ["anthropic", "claude"],
  ["openai", "openai"],
  ["chatgpt", "openai"],
  ["gpt", "openai"],
  ["dropbox", "dropbox"],
  ["medium", "medium"],
];

const CATEGORY_ICON_KEYS: Record<string, IconKey> = {
  Entertainment: "activity",
  "AI Tools": "openai",
  "Developer Tools": "github",
  Design: "figma",
  Productivity: "notion",
  Cloud: "dropbox",
  Music: "spotify",
  Other: "wallet",
};

function getSimpleIconSlugs(name: string): string[] {
  const words = name
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  if (words.length === 0) return [];

  const fullSlug = words.join("");
  const firstWord = words[0] ?? "";

  return [...new Set([fullSlug, firstWord].filter(Boolean))];
}

function getLocalIconByName(name: string): ImageSourcePropType | null {
  const normalizedName = name.trim().toLowerCase();

  for (const [keyword, iconKey] of NAME_ICON_KEYS) {
    if (normalizedName.includes(keyword)) {
      return icons[iconKey];
    }
  }

  return null;
}

function getRemoteIconByName(name: string): ImageSourcePropType | null {
  const slugs = getSimpleIconSlugs(name);

  if (slugs.length === 0) return null;

  return { uri: `https://cdn.simpleicons.org/${slugs[0]}` };
}

function getCategoryIcon(category?: string): ImageSourcePropType {
  if (category && category in CATEGORY_ICON_KEYS) {
    return icons[CATEGORY_ICON_KEYS[category]];
  }

  return icons.wallet;
}

export function getSubscriptionIcon(
  name: string,
  category?: string,
): ImageSourcePropType {
  return (
    getLocalIconByName(name) ??
    getRemoteIconByName(name) ??
    getCategoryIcon(category)
  );
}

export function getSubscriptionIconFallback(category?: string): ImageSourcePropType {
  return getCategoryIcon(category);
}
