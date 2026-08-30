"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { HomepagePredictionsLoadedProps } from "@/components/fightaiq/HomepagePredictionsLoaded";

/** Defer both the board renderer and its static JSON until the section approaches. */
export function HomepagePredictions(props: HomepagePredictionsLoadedProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [Loaded, setLoaded] = useState<ComponentType<HomepagePredictionsLoadedProps> | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      void import("@/components/fightaiq/HomepagePredictionsLoaded").then((module) => {
        if (active) setLoaded(() => module.HomepagePredictionsLoaded);
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
      { rootMargin: "500px 0px" },
    );
    observer.observe(root);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  return (
    /* The reservation matches the collapsed state, not the tallest possible
     * board: reserving 700px for two honest one-line boards shipped a dark
     * void down the homepage. */
    <div ref={rootRef} className="min-h-[180px]">
      {Loaded ? (
        <Loaded {...props} />
      ) : (
        <p role="status" className="font-mono text-[length:var(--text-mono-sm)] text-text-inverse-meta">
          {props.loadingLabel}
        </p>
      )}
    </div>
  );
}
