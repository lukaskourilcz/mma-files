import Image from "next/image";
import { getDictionary } from "@/i18n";
import type { Locale, StoryImage } from "@/lib/types";

/**
 * A photo slot that is honest about being empty.
 *
 * With a photograph it renders the photograph and its credit. Without one it
 * renders a striped placeholder that says what belongs in the slot — not an
 * empty box, and never a stock image standing in for reporting.
 */
export function PhotoSlot({
  image,
  locale,
  note,
  sizes = "100vw",
  priority = false,
  useThumbnail = false,
}: {
  image?: StoryImage;
  locale: Locale;
  /** What belongs here: the fight, the moment, the subject. */
  note?: string;
  sizes?: string;
  priority?: boolean;
  useThumbnail?: boolean;
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
          style={image.focalPoint ? { objectPosition: image.focalPoint } : undefined}
          className="object-cover"
        />
        {image.creditUrl ? (
          <a href={image.creditUrl} target="_blank" rel="noopener noreferrer" className="label-mono-sm absolute bottom-2 right-2 z-20 bg-ink/80 px-1.5 py-1 text-paper-muted underline-offset-2 hover:underline">
            {image.credit}
          </a>
        ) : (
          <span className="label-mono-sm absolute bottom-2 right-2 z-10 bg-ink/70 px-1.5 py-1 text-paper-muted">{image.credit}</span>
        )}
      </>
    );
  }

  return (
    <span className="stripes absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center">
      <span className="label-mono-sm text-ink-meta">{dict.labels.photoPending}</span>
      {note ? (
        <span className="label-mono-sm max-w-[28ch] leading-[1.7] text-ink-meta">
          {note}
        </span>
      ) : null}
    </span>
  );
}
