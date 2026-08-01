"use client";

import { useId, useState } from "react";
import { Container } from "@/components/ui/primitives";
import type { Dictionary } from "@/i18n";

/**
 * Layout preview only.
 *
 * No email provider is wired up. The form does not submit anywhere, stores
 * nothing, and says so on the page — a capture field that quietly discards an
 * address would be worse than no field at all. When a provider is chosen, wire
 * the submit handler here and update the privacy page in the same change.
 */
export function NewsletterModule({
  dict,
  variant = "band",
}: {
  dict: Dictionary;
  variant?: "band" | "panel";
}) {
  const [email, setEmail] = useState("");
  const inputId = useId();

  const form = (
    <form
      className="mt-6 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <label htmlFor={inputId} className="sr-only">
        {dict.newsletter.placeholder}
      </label>
      <input
        id={inputId}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={dict.newsletter.placeholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-describedby={`${inputId}-note`}
        className="min-w-0 flex-1 rounded-[6px] border border-rule-dark-strong bg-graphite px-4 py-3 text-[0.9375rem] text-white placeholder:text-muted focus:border-ember focus:outline-none"
      />
      <button
        type="submit"
        disabled
        aria-disabled="true"
        className="label-mono shrink-0 cursor-not-allowed rounded-[6px] border border-rule-dark-strong px-5 py-3 text-muted"
      >
        {dict.newsletter.submit}
      </button>
    </form>
  );

  const note = (
    <p
      id={`${inputId}-note`}
      className="mt-4 max-w-lg text-xs leading-relaxed text-muted"
    >
      {dict.newsletter.notWired}
    </p>
  );

  if (variant === "panel") {
    return (
      <div className="sheet-dark p-6 text-white md:p-8">
        <h2 className="text-xl leading-tight tracking-[-0.03em] text-white md:text-2xl">
          {dict.newsletter.title}
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-paper-muted">
          {dict.newsletter.dek}
        </p>
        {form}
        {note}
      </div>
    );
  }

  return (
    <section aria-labelledby="newsletter" className="bg-ink py-14 text-white md:py-20">
      <Container>
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <span aria-hidden="true" className="mb-4 block h-[2px] w-10 bg-ember" />
            <h2
              id="newsletter"
              className="text-[1.75rem] leading-[1.1] tracking-[-0.035em] text-white md:text-[2.25rem]"
            >
              {dict.newsletter.title}
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-paper-muted">
              {dict.newsletter.dek}
            </p>
          </div>
          <div className="md:col-span-6">
            {form}
            {note}
          </div>
        </div>
      </Container>
    </section>
  );
}
