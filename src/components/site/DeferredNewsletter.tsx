"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { NewsletterCopy } from "@/components/site/NewsletterModule";

type NewsletterProps = { copy: NewsletterCopy; variant?: "band" | "panel" };

/** Keep the inert newsletter preview out of the first-load bundle. */
export function DeferredNewsletter(props: NewsletterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [Newsletter, setNewsletter] = useState<ComponentType<NewsletterProps> | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      void import("@/components/site/NewsletterModule").then((module) => {
        if (active) setNewsletter(() => module.NewsletterModule);
      });
    };
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) {
      load();
      return () => { active = false; };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(root);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-[260px]">
      {Newsletter ? <Newsletter {...props} /> : null}
    </div>
  );
}
