import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "../constants/categories";

export default function CategoryDropdown({ onSelect, selectedCategory = "" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const selected = selectedCategory || "";

  return (
    <div className="relative">
      <label className="text-xs text-[var(--text)] uppercase">Category *</label>

      <div
        onClick={() => setOpen(!open)}
        className="w-full mt-1 px-4 py-3 rounded-xl 
bg-[var(--bg)] border border-[var(--border)] text-sm 
flex justify-between items-center cursor-pointer gap-2"
      >
        <span
          className={`${selected ? "" : "text-[var(--text-muted)]"} line-clamp-1`}
        >
          {selected || "Select category"}
        </span>

        <ChevronDown
  size={16}
  className={`transition-transform duration-300 ${
    open ? "rotate-180" : ""
  }`}
/>
      </div>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl max-h-[70vh] sm:max-h-72
          bg-[var(--surface)] border border-[var(--border)] 
          shadow-[0_10px_25px_rgba(0,0,0,0.2)] overflow-y-auto"
        >
          {CATEGORIES.map((cat, index) => (
            <div key={index}>
              <button
                onClick={() => setActive(active === index ? null : index)}
                className="w-full flex justify-between items-center 
                px-4 py-3 text-sm hover:bg-[var(--bg)]"
              >
                {cat.name}

                <ChevronDown
                  size={14}
                  className={`transition ${
                    active === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {active === index && (
                <div className="px-2 pb-2 space-y-1">
                  {cat.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const value = `${cat.name} • ${opt}`;

                        setOpen(false);
                        setActive(null);

                        onSelect(value);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg 
                      text-[var(--text-muted)] hover:text-[var(--text)] 
                      hover:bg-[var(--bg)]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}