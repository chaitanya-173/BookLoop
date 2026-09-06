import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Check } from "lucide-react";
import { SORT_OPTIONS } from "../utils/listingSort";

/**
 * A compact "Sort by" button + dropdown, meant to sit to the right of a page
 * or section title. Defaults to whatever `value` is passed in (the app-wide
 * default is nearest-first, set by each page).
 */
export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = SORT_OPTIONS.find((opt) => opt.key === value) || SORT_OPTIONS[0];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
        border border-[var(--border)] bg-[var(--surface)]
        hover:border-[var(--text-muted)] transition"
      >
        <ArrowUpDown size={15} className="text-[var(--accent)]" />
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">Sort</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--border)]
          bg-[var(--surface)] shadow-[0_10px_25px_rgba(0,0,0,0.2)] overflow-hidden z-40"
        >
          {SORT_OPTIONS.map((opt) => {
            const isActive = opt.key === value;

            return (
              <button
                key={opt.key}
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left
                  hover:bg-[var(--bg)] transition ${
                    isActive ? "text-[var(--accent)] font-medium" : "text-[var(--text)]"
                  }`}
              >
                {opt.label}
                {isActive && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}