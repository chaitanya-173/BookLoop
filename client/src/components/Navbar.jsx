import { NavLink, Link } from "react-router-dom";
import { Sun, Moon, Menu, X, Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";
import { useState } from "react";
import logoLight from "../assets/BookLoop_light_logo.png";
import logoDark from "../assets/BookLoop_dark_logo.png";

export default function Navbar({ showSearch = true }) {
  const { dark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "text-[var(--primary)] font-medium"
      : "hover:text-[var(--primary)] transition";

  return (
    <div className="fixed top-3 sm:top-4 left-0 w-full z-50 flex justify-center px-3 sm:px-4">
      <div
        className="w-full max-w-6xl rounded-2xl border border-[var(--border)]
        bg-[var(--bg)]/80 backdrop-blur-lg shadow-lg
        px-3 sm:px-4 md:px-6 py-3 transition-all duration-300"
      >
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* MOBILE LOGO ONLY */}
            <Link to="/" className="shrink-0">
              <img
                src={dark ? logoDark : logoLight}
                alt="BookLoop"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-5">
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
          </div>

          {/* SEARCH */}
          {showSearch && (
            <div className="hidden md:flex flex-1 justify-end px-2">
              <div
                className={`origin-right transition-all duration-300 ease-in-out ${
                  searchExpanded ? "w-[420px]" : "w-[310px]"
                }`}
              >
                <SearchBar
                  onFocus={() => setSearchExpanded(true)}
                  onBlur={() => setSearchExpanded(false)}
                />
              </div>
            </div>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            <div className="hidden md:block">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[var(--surface)] transition"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {/* MOBILE SEARCH ICON */}
            <button className="md:hidden p-2 rounded-lg hover:bg-[var(--surface)] transition">
              <Search size={20} />
            </button>

            <ProfileDropdown />

            {/* DESKTOP SELL */}
            <Link
              to="/sell"
              className="hidden sm:inline-block px-3 md:px-4 py-2 rounded-lg text-white font-medium
              bg-[var(--accent)] hover:opacity-90 transition whitespace-nowrap text-sm"
            >
              + Sell
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--surface)] transition"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={navClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/categories"
              className={navClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </NavLink>

            <NavLink
              to="/favourites"
              className={navClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Wishlist
            </NavLink>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-1 py-2 text-left hover:text-[var(--primary)] transition"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              {dark ? "Light Mode" : "Dark Mode"}
            </button>

            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 px-4 py-2 rounded-lg text-white font-medium
bg-[var(--accent)] hover:opacity-90 transition text-center"
            >
              + Sell Book
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
