"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

export type MediatecaFilterOption = {
  value: string;
  label: string;
  count?: number;
};

type MediatecaFilterSelectProps = {
  id?: string;
  label: string;
  value: string;
  options: MediatecaFilterOption[];
  onChange: (value: string) => void;
  "aria-label"?: string;
};

export default function MediatecaFilterSelect({
  id,
  label,
  value,
  options,
  onChange,
  "aria-label": ariaLabel,
}: MediatecaFilterSelectProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const selected = options.find((option) => option.value === value) ?? options[0];
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  useEffect(() => {
    if (!open) return;

    setHighlightIndex(selectedIndex);

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, selectedIndex]);

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setHighlightIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setHighlightIndex(options.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options[highlightIndex];
      if (option) selectOption(option.value);
    }
  };

  return (
    <div ref={rootRef} className="relative flex min-w-0 flex-1 flex-col gap-2">
      <label
        htmlFor={triggerId}
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--gold-700)]"
      >
        {label}
      </label>

      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel ?? label}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-[18px] border bg-white px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] shadow-[0_2px_8px_rgba(13,31,10,0.04)] transition ${
          open
            ? "border-[#2e7d32] ring-4 ring-[#2e7d32]/15"
            : "border-[#e8dfd3] hover:border-[#d9cfbe] hover:bg-[#fafaf8]"
        }`}
      >
        <span className="min-w-0 truncate">
          {selected?.label}
          {typeof selected?.count === "number" ? (
            <span className="text-[#7a756e]"> ({selected.count})</span>
          ) : null}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#7a756e] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className="absolute top-[calc(100%+0.4rem)] z-40 max-h-72 w-full overflow-auto rounded-[18px] border border-[#e8dfd3] bg-[#fafaf8] p-1.5 shadow-[0_16px_40px_rgba(13,31,10,0.12)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightIndex;
            return (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => selectOption(option.value)}
                  className={`flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "bg-[#2e7d32] font-semibold text-white"
                      : isHighlighted
                        ? "bg-[#f0eae0] text-[#1a1a1a]"
                        : "text-[#4a4540] hover:bg-[#f0eae0]"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center ${
                      isSelected ? "text-white" : "text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                    {typeof option.count === "number" ? (
                      <span className={isSelected ? "text-white/80" : "text-[#7a756e]"}>
                        {" "}
                        ({option.count})
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
