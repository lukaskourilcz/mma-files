"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { WeekHistoryProps } from "@/components/article/WeekHistory";

/** Load the pagination island only when the end of the current week approaches. */
export function DeferredWeekHistory(props: WeekHistoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [History, setHistory] = useState<ComponentType<WeekHistoryProps> | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      void import("@/components/article/WeekHistory").then((module) => {
        if (active) setHistory(() => module.WeekHistory);
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

  return <div ref={rootRef}>{History ? <History {...props} /> : null}</div>;
}
