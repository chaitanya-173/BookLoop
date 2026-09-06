import { NavLink, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Heart, User, Plus } from "lucide-react";

/**
 * Fixed bottom navigation for mobile/tablet (hidden on lg+, where the top
 * navbar's own nav links take over). Sits above safe-area insets so it
 * doesn't collide with the iOS home indicator.
 */
export default function BottomNav() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
      isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
    }`;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 w-full z-50 lp-glass border-t border-[var(--border)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative h-16 flex items-stretch max-w-6xl mx-auto px-2">
        <NavLink to="/home" end className={linkClass}>
          <Home size={21} strokeWidth={2.2} />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>

        <NavLink to="/categories" className={linkClass}>
          <LayoutGrid size={21} strokeWidth={2.2} />
          <span className="text-[10px] font-medium">Categories</span>
        </NavLink>

        {/* Center gap reserved for the raised Sell FAB */}
        <div className="flex-1" />

        <NavLink to="/favourites" className={linkClass}>
          <Heart size={21} strokeWidth={2.2} />
          <span className="text-[10px] font-medium">Wishlist</span>
        </NavLink>

        <NavLink to="/edit-profile" className={linkClass}>
          <User size={21} strokeWidth={2.2} />
          <span className="text-[10px] font-medium">Profile</span>
        </NavLink>

        {/* Raised center Sell button */}
        <button
          onClick={() => navigate("/sell")}
          aria-label="Sell a book"
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full
          bg-[var(--accent)] text-white flex items-center justify-center
          shadow-[0_8px_24px_-6px_var(--accent)] border-4 border-[var(--bg)]
          active:scale-95 transition-transform"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}