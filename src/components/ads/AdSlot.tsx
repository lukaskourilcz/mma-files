import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { getDictionary } from "@/i18n";
import {
  getAdCreative,
  getAdSlotDefinition,
  type AdSize,
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

function sizeLabel(size: AdSize): string {
  return `${size.width} × ${size.height}`;
}

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
  locale,
  mastheadVariant = "standard",
  className = "",
}: AdSlotProps) {
  const dict = getDictionary(locale);
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
      aria-label="Reklama"
      data-ad-slot={name}
      style={style}
      className={`relative mx-auto my-8 max-w-full ${responsiveSize} ${
        rail ? "lg:sticky lg:top-[calc(var(--layout-chrome-h)+24px)]" : ""
      } ${
        creative
          ? "overflow-hidden"
          : "border border-dashed border-rule-dashed bg-well"
      } ${className}`}
    >
      {creative ? (
        <Creative href={creative.href}>
          <Image
            src={creative.src}
            alt={creative.alt}
            fill
            loading="lazy"
            sizes={rail ? "300px" : `(min-width: 768px) ${desktop.width}px, ${mobile?.width ?? 0}px`}
            className="object-cover"
          />
        </Creative>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-text-meta">
          <span className="font-mono text-[12px] font-medium uppercase tracking-[0.14em]">
            {dict.ads.placeholder}
          </span>
          {mobile ? (
            <>
              <span className="font-mono text-[11px] tabular-nums md:hidden">
                {sizeLabel(mobile)}
              </span>
              <span className="hidden font-mono text-[11px] tabular-nums md:inline">
                {sizeLabel(desktop)}
              </span>
            </>
          ) : (
            <span className="font-mono text-[11px] tabular-nums">
              {sizeLabel(desktop)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export type { AdSlotName } from "@/lib/ads";
