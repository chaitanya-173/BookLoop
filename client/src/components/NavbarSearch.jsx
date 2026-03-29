import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function NavbarSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  // Auto focus when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest(".search-container")) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", handleClick);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <div className="relative search-container flex items-center">
      
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search books..."
        className={`transition-all duration-300 ease-in-out
        ${open ? "w-56 opacity-100 px-4 py-2 ml-2" : "w-0 opacity-0 p-0"}
        bg-[var(--surface)] border border-[var(--border)] rounded-lg
        text-sm outline-none`}
      />

      {/* Icon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-lg hover:bg-[var(--surface)] transition"
      >
        {open ? <X size={18} /> : <Search size={18} />}
      </button>
    </div>
  );
}