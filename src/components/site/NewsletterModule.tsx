"use client";

import { useId, useState } from "react";
import { Container } from "@/components/ui/primitives";

/**
 * Only plain strings cross the server/client boundary — the dictionary itself
 * carries functions and cannot be serialised into a client component.
 */
export interface NewsletterCopy {
  title: string;
  dek: string;
  placeholder: string;
  submit: string;
  notWired: string;
}

/**
 * Layout preview only.
 *
 * No email provider is wired up. The form does not submit anywhere, stores
 * nothing, and says so on the page — a capture field that quietly discards an
 * address would be worse than no field at all. When a provider is chosen, wire
 * the submit handler here and update the privacy page in the same change.
 */
export function NewsletterModule({
  copy,
  variant = "band",
}: {
  copy: NewsletterCopy;
  variant?: "band" | "panel";
}) {
  const [email, setEmail] = useState("");
  const inputId = useId();

  const form = (
    <form
      className="flex w-full max-w-lg flex-col gap-2.5 sm:flex-row"
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <label htmlFor={inputId} className="sr-only">
        {copy.placeholder}
      </label>
      <input
        id={inputId}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={copy.placeholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-describedby={`${inputId}-note`}
        className="h-12 min-w-0 flex-1 border border-rule-strong bg-paper px-4 text-[15px] text-text placeholder:text-text-meta focus:border-text focus:outline-none"
      />
      <button
        type="submit"
        disabled
        aria-disabled="true"
        className="min-h-12 shrink-0 cursor-not-allowed bg-accent px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.1em] text-paper opacity-70 sm:opacity-100"
      >
        {copy.submit}
      </button>
    </form>
  );

  const note = (
    <p
      id={`${inputId}-note`}
      className="mt-3 max-w-lg text-xs leading-relaxed text-ink-meta"
    >
      {copy.notWired}
    </p>
  );

  if (variant === "panel") {
    return (
      <div className="sheet p-6 md:p-8">
        <h2 className="display text-[24px] leading-none text-ink md:text-[28px]">
          {copy.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{copy.dek}</p>
        <div className="mt-6">{form}</div>
        {note}
      </div>
    );
  }

  return (
    <section aria-labelledby="newsletter" className="border-b border-rule-strong bg-card">
      <Container className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2
            id="newsletter"
            className="display text-[length:var(--text-d4)] leading-none text-text"
          >
            {copy.title}
          </h2>
          <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-ink-muted">
            {copy.dek}
          </p>
        </div>
        <div>
          {form}
          {note}
        </div>
      </Container>
    </section>
  );
}
