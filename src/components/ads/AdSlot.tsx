import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { HousePromotion } from "./HousePromotion";
import {
  getAdCreative,
  getAdSlotDefinition,
  type AdSlotName,
} from "@/lib/ads";
import type { Locale } from "@/lib/types";

type MastheadVariant = "standard" | "compact";

interface AdSlotProps {
  name: AdSlotName;
  locale: Locale;
  /** The 728×90 masthead form is selected at build time, never as a fallback. */
  mastheadVariant?: MastheadVariant;
  className?: string;
}

type AdStyle = CSSProperties & {
  "--ad-mobile-width"?: string;
  "--ad-mobile-height"?: string;
  "--ad-desktop-width": string;
  "--ad-desktop-height": string;
};

function Creative({
  children,
  href,
}: {
  children: ReactNode;
  href: string | null;
}) {
  return href ? (
    <a href={href} rel="sponsored noopener noreferrer" className="absolute inset-0">
      {children}
    </a>
  ) : (
    children
  );
}

export function AdSlot({
  name,
  mastheadVariant = "standard",
  className = "",
}: AdSlotProps) {
  const definition = getAdSlotDefinition(name);
  const desktop =
    name === "masthead-billboard" && mastheadVariant === "compact"
      ? definition.desktop.variants[0]!
      : definition.desktop;
  const mobile = definition.mobile;
  const creative = getAdCreative(name);
  const rail = name === "article-rail";
  const style: AdStyle = {
    "--ad-desktop-width": `${desktop.width}px`,
    "--ad-desktop-height": `${desktop.height}px`,
    ...(mobile
      ? {
          "--ad-mobile-width": `${mobile.width}px`,
          "--ad-mobile-height": `${mobile.height}px`,
        }
      : {}),
  };

  const responsiveSize = rail
    ? "hidden lg:block lg:h-[var(--ad-desktop-height)] lg:w-[var(--ad-desktop-width)]"
    : "h-[var(--ad-mobile-height)] w-[var(--ad-mobile-width)] md:h-[var(--ad-desktop-height)] md:w-[var(--ad-desktop-width)]";

  return (
    <div
      role="complementary"
      aria-label={creative ? "Reklama" : "Partnerský magazín DNESKAi"}
      data-ad-slot={name}
      style={style}
      className={`relative mx-auto my-8 max-w-full ${responsiveSize} ${
        rail ? "lg:sticky lg:top-[calc(var(--layout-chrome-h)+24px)]" : ""
      } overflow-hidden ${className}`}
    >
      {creative ? (
        <Creative href={creative.href}>
          <Image
            src={creative.src}
            alt={creative.alt}
            fill
            loading="lazy"
            sizes={rail ? "300px" : `(min-width: 768px) ${desktop.width}px, ${mobile?.width ?? 0}px`}
            className="object-contain"
          />
        </Creative>
      ) : (
        <HousePromotion />
      )}
    </div>
  );
}

export type { AdSlotName } from "@/lib/ads";
