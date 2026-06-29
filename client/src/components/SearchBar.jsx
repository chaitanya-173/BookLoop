import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

export default function SearchBar({ onFocus, onBlur }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const delay = setTimeout(() => {
      const trimmed = query.trim();

      // Only search from allowed browsing pages
      const allowedPaths = ["/", "/categories", "/my-books", "/favourites"];

      if (!allowedPaths.includes(location.pathname)) return;

      if (trimmed) {
        navigate(`/?search=${encodeURIComponent(trimmed)}`);
      } else if (location.pathname === "/") {
        navigate("/");
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, location.pathname, navigate]);

  return (
    <div className="w-full relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search books..."
        className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
      />

      {query && (
        <button
          onClick={() => {
            setQuery("");
            navigate("/");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
