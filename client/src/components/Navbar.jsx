import { NavLink, Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";

export default function Navbar({ showSearch = true }) {
  const { dark, toggleTheme } = useTheme();

  const navClass = ({ isActive }) =>
    isActive
      ? "text-[var(--primary)] font-medium"
      : "hover:text-[var(--primary)] transition";

  return (
    <div className="fixed top-4 left-0 w-full z-50 flex justify-center px-4">
      <div
        className={`w-full max-w-6xl rounded-2xl border border-[var(--border)] 
        bg-[var(--bg)]/70 backdrop-blur-lg shadow-lg px-6 h-16 
        flex items-center justify-between transition-all duration-300
        ${showSearch ? "gap-6" : "gap-10"}`}
      >
        {/* LEFT */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            to="/"
            className="text-lg font-bold text-[var(--primary)] whitespace-nowrap"
          >
            📚 BookLoop
          </Link>

          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/categories" className={navClass}>
            Categories
          </NavLink>

          <NavLink to="/favourites" className={navClass}>
            Wishlist
          </NavLink>
        </div>

        {/* SEARCH */}
        {showSearch && (
          <div className="flex-1 max-w-md min-w-[220px]">
            <SearchBar />
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--surface)] transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <ProfileDropdown />

          <Link
            to="/sell"
            className="px-4 py-2 rounded-lg text-white font-medium 
            bg-[var(--accent)] hover:opacity-90 transition whitespace-nowrap"
          >
            + Sell
          </Link>
        </div>
      </div>
    </div>
  );
}
