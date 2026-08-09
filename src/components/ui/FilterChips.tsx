"use client";

import { useRef } from "react";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function move(index: number) {
    const next = options[index];
    if (!next) return;
    onChange(next.value);
    buttons.current[index]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                move((index + 1) % options.length);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                move((index - 1 + options.length) % options.length);
              } else if (event.key === "Home") {
                event.preventDefault();
                move(0);
              } else if (event.key === "End") {
                event.preventDefault();
                move(options.length - 1);
              }
            }}
            className={`min-h-11 border px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] ${
              selected
                ? "border-text bg-text text-paper"
                : "border-rule-strong bg-card text-text hover:border-text"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
