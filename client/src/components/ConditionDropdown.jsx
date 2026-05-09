import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const conditions = ["new", "like new", "good", "fair"];

export default function ConditionDropdown({
  selectedCondition,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs text-[var(--text)] uppercase">
        Condition *
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)]
border border-[var(--border)] text-sm flex items-center
justify-between gap-2 hover:border-[var(--primary)] transition"
      >
        <span
  className={`${selectedCondition ? "" : "text-[var(--text-muted)]"} line-clamp-1`}
>
          {selectedCondition
            ? selectedCondition.charAt(0).toUpperCase() +
              selectedCondition.slice(1)
            : "Select condition"}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border
          border-[var(--border)] bg-[var(--surface)]
          shadow-lg max-h-72 overflow-y-auto"
        >
          {conditions.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => {
                onSelect(condition);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm
              hover:bg-[var(--bg)] transition"
            >
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}