import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import adSlotSpec from "@/data/ad-slots.json";

export type AdSlotName =
  | "masthead-billboard"
  | "infeed-rectangle"
  | "article-top"
  | "article-mid"
  | "article-rail"
  | "footer-billboard";

export interface AdSize {
  width: number;
  height: number;
}

export interface AdCreative extends AdSize {
  src: string;
  alt: string;
  href: string | null;
}

interface AdSlotDefinition {
  id: AdSlotName;
  desktop: AdSize & { variants: AdSize[] };
  mobile: AdSize | null;
  pages: string[];
}

interface RuntimeAdSlot {
  enabled?: unknown;
  image?: unknown;
  alt?: unknown;
  href?: unknown;
}

const definitions = new Map(
  (adSlotSpec.slots as AdSlotDefinition[]).map((slot) => [slot.id, slot]),
);

export function getAdSlotDefinition(name: AdSlotName): AdSlotDefinition {
  const definition = definitions.get(name);
  if (!definition) throw new Error(`Missing ad slot definition: ${name}`);
  return definition;
}

function validCreative(slot: RuntimeAdSlot, name: AdSlotName): AdCreative | null {
  if (slot.enabled !== true || !slot.image || typeof slot.image !== "object") {
    return null;
  }
  const image = slot.image as Record<string, unknown>;
  if (
    typeof image.src !== "string" ||
    !image.src.startsWith("/ads/") ||
    !Number.isInteger(image.width) ||
    !Number.isInteger(image.height) ||
    typeof slot.alt !== "string" ||
    !slot.alt.trim() ||
    (slot.href !== null && typeof slot.href !== "string")
  ) {
    return null;
  }

  const definition = getAdSlotDefinition(name);
  const allowed = [
    definition.desktop,
    ...definition.desktop.variants,
    ...(definition.mobile ? [definition.mobile] : []),
  ];
  if (!allowed.some((size) => size.width === image.width && size.height === image.height)) {
    return null;
  }

  return {
    src: image.src,
    width: image.width as number,
    height: image.height as number,
    alt: slot.alt,
    href: slot.href as string | null,
  };
}

let manifest: Record<string, RuntimeAdSlot> | null | undefined;

function runtimeSlots(): Record<string, RuntimeAdSlot> | null {
  if (manifest !== undefined) return manifest;
  try {
    const value = JSON.parse(
      readFileSync(path.join(process.cwd(), "data", "boardless", "ads.json"), "utf8"),
    ) as { schemaVersion?: unknown; slots?: unknown };
    manifest =
      value.schemaVersion === "mma-ads/1" &&
      value.slots !== null &&
      typeof value.slots === "object" &&
      !Array.isArray(value.slots)
        ? (value.slots as Record<string, RuntimeAdSlot>)
        : null;
  } catch {
    manifest = null;
  }
  return manifest;
}

/** Missing, disabled and malformed entries all fail closed to the placeholder. */
export function getAdCreative(name: AdSlotName): AdCreative | null {
  const slot = runtimeSlots()?.[name];
  return slot ? validCreative(slot, name) : null;
}
