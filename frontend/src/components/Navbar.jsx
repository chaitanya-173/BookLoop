import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { Moon, Sun, Home } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <div className="w-full h-[60px] border-b border-[rgba(128,121,121,0.3)]">
      <div className="w-full h-full max-w-[1200px] mx-auto px-5 lg:px-0 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Scratch
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            – Code snippet manager
          </span>
        </Link>
        <div className="flex items-center gap-x-4">
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <Link
            to="/"
            className="text-sm font-medium text-black dark:text-white hover:text-primary-light dark:hover:text-primary-dark flex items-center gap-1"
          >
            <Home size={18} />
            New Snippet
          </Link>
          <Link
            to="/snippets"
            className="text-sm font-medium text-black dark:text-white hover:text-primary-light dark:hover:text-primary-dark"
          >
            All Snippets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
