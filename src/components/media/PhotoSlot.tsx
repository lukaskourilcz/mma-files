import Image from "next/image";
import { getDictionary } from "@/i18n";
import type { Locale, StoryImage } from "@/lib/types";

type PhotoTone = "paper" | "chrome";
type CreditMode = "none" | "overlay";

/** Deterministic desk artwork rather than a licensed photograph. */
function isEditorialArtwork(image: StoryImage): boolean {
  // The publisher name is reserved for the legal line, not internal artwork.
  return image.origin === "svg" || /boardlessai/iu.test(image.credit);
}

/**
 * The one credit path.
 *
 * Three surfaces used to say this three different ways: an overlay chip on a
 * cover, a caption strip under an article photo, and a Czech literal typed
 * into the article page for editorial artwork. They are one component now,
 * and every string comes from the dictionary.
 */
export function PhotoCredit({
  image,
  locale,
  mode = "caption",
}: {
  image: StoryImage;
  locale: Locale;
  /** `caption` sits under the picture; `overlay` sits on its lower corner. */
  mode?: "caption" | "overlay";
}) {
  const dict = getDictionary(locale);
  const artwork = isEditorialArtwork(image);
  const credit = artwork
    ? mode === "overlay"
      ? dict.labels.editorialArtworkShort
      : dict.labels.editorialArtwork
    : dict.labels.photoBy(image.credit);

  if (mode === "overlay") {
    return (
      <span className="absolute bottom-3 right-3 z-20 max-w-[70%] bg-chrome/80 px-1.5 py-1 font-mono text-[length:var(--text-mono-xs)] leading-relaxed text-text-inverse-muted">
        {credit}
      </span>
    );
  }

  const className =
    "block border-t border-rule bg-paper px-3 py-2 font-mono text-[length:var(--text-mono-xs)] leading-relaxed text-text-meta";

  // Editorial artwork has no external source to point at; a photograph does.
  return !artwork && image.creditUrl ? (
    <a
      href={image.creditUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} underline decoration-transparent underline-offset-2 hover:decoration-current`}
    >
      {credit}
    </a>
  ) : (
    <figcaption className={className}>{credit}</figcaption>
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
    return (
      <>
        <Image
          src={useThumbnail ? image.thumbnailSrc ?? image.src : image.src}
          alt={image.alt[locale] ?? image.alt.cs ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          style={image.focalPoint ? { objectPosition: image.focalPoint } : undefined}
          className="object-cover"
        />
        {creditMode === "overlay" ? (
          <PhotoCredit image={image} locale={locale} mode="overlay" />
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
      <span className="relative z-10 max-w-[80%] text-center font-mono text-[length:var(--text-mono-xs)] font-medium uppercase leading-relaxed tracking-[var(--tracking-kicker)]">
        {note ?? dict.labels.photoPending}
      </span>
    </span>
  );
}
