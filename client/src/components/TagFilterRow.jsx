/**
 * A row of pill-shaped filter tags. On mobile it scrolls sideways (single line,
 * no wrapping); on desktop (sm+) it wraps so every tag is visible at once,
 * no scrolling needed.
 */
export default function TagFilterRow({ items, active, onSelect }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap
      -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 scrollbar-hide"
    >
      {items.map((item) => {
        const isActive = active === item;

        return (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-colors
              ${
                isActive
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--text-muted)]"
              }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}