import Image from "next/image";
import { getDictionary } from "@/i18n";
import type { Locale, StoryImage } from "@/lib/types";

type PhotoTone = "paper" | "chrome";
type CreditMode = "none" | "overlay";

function readerCredit(image: StoryImage): string | null {
  // The publisher name is reserved for the legal line, not internal artwork.
  return /boardlessai/iu.test(image.credit) ? null : image.credit;
}

export function PhotoCredit({
  image,
  displayCredit,
}: {
  image: StoryImage;
  /** Reader-safe override for internally produced artwork. */
  displayCredit?: string;
}) {
  const credit = displayCredit ?? readerCredit(image);
  if (!credit) return null;
  return image.creditUrl ? (
    <a
      href={image.creditUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-t border-rule bg-paper px-3 py-2 font-mono text-[11px] leading-relaxed text-text-meta underline decoration-transparent underline-offset-2 hover:decoration-current"
    >
      {credit}
    </a>
  ) : (
    <figcaption className="border-t border-rule bg-paper px-3 py-2 font-mono text-[11px] leading-relaxed text-text-meta">
      {credit}
    </figcaption>
  );
}

export function PhotoSlot({
  image,
  locale,
  note,
  sizes = "100vw",
  priority = false,
  useThumbnail = false,
  tone = "paper",
  creditMode = "none",
}: {
  image?: StoryImage;
  locale: Locale;
  note?: string;
  sizes?: string;
  priority?: boolean;
  useThumbnail?: boolean;
  tone?: PhotoTone;
  creditMode?: CreditMode;
}) {
  const dict = getDictionary(locale);

  if (image) {
    const credit = creditMode === "overlay" ? readerCredit(image) : null;
    return (
      <>
        <Image
          src={useThumbnail ? image.thumbnailSrc ?? image.src : image.src}
          alt={image.alt[locale] ?? image.alt.cs ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          style={image.focalPoint ? { objectPosition: image.focalPoint } : undefined}
          className="object-cover"
        />
        {credit ? (
          <span className="absolute bottom-3 right-3 z-20 max-w-[70%] bg-chrome/80 px-1.5 py-1 font-mono text-[10px] leading-relaxed text-text-inverse-muted">
            {credit}
          </span>
        ) : null}
      </>
    );
  }

  const chrome = tone === "chrome";
  return (
    <span
      className={`absolute inset-0 flex items-center justify-center overflow-hidden [container-type:size] ${
        chrome ? "bg-chrome-raised text-text-inverse-meta" : "bg-well text-text-meta"
      }`}
      style={{
        backgroundImage: `repeating-linear-gradient(135deg, ${
          chrome ? "var(--color-rule-dark)" : "var(--color-rule)"
        } 0 1px, transparent 1px 12px)`,
      }}
    >
      <span
        aria-hidden="true"
        className={`absolute opacity-60 ${chrome ? "bg-rule-dark" : "bg-rule-strong"}`}
        style={{
          width: "min(40cqw, 40cqh)",
          height: "min(40cqw, 40cqh)",
          clipPath:
            "polygon(29.3% 0, 70.7% 0, 100% 29.3%, 100% 70.7%, 70.7% 100%, 29.3% 100%, 0 70.7%, 0 29.3%)",
        }}
      />
      <span className="relative z-10 max-w-[80%] text-center font-mono text-[11px] font-medium uppercase leading-relaxed tracking-[0.14em]">
        {note ?? dict.labels.photoPending}
      </span>
    </span>
  );
}
