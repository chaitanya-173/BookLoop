import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Pencil,
  Heart,
  MapPin,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-[var(--surface)]"
      >
        <User size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 translate-x-1 w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl overflow-hidden z-50">
          {/* Top Profile Section */}
          <div className="flex flex-col items-center py-5 px-4 border-b border-[var(--border)]">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[var(--bg)] flex items-center justify-center mb-3">
                <User size={32} />
              </div>
            )}

            <p className="font-semibold text-lg">{user?.name || "Guest"}</p>

            <p className="text-sm text-[var(--text-muted)]">
              {user?.email || "Not logged in"}
            </p>
          </div>

          {/* Options */}
          <div className="py-2">
            <MenuItem
              icon={<Pencil size={16} />}
              text="Edit Profile"
              onClick={() => navigate("/edit-profile")}
            />

            <MenuItem
              icon={<Heart size={16} />}
              text="My Favourites"
              onClick={() => navigate("/favourites")}
            />

            <MenuItem
              icon={<MapPin size={16} />}
              text="Update Location"
              onClick={() => navigate("/edit-profile")}
            />

            <MenuItem
              icon={<MessageSquare size={16} />}
              text="Feedback"
              onClick={() => alert("Open feedback modal")}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border)]" />

          {/* Logout / Sign in */}
          <button
            onClick={() => {
              if (user) {
                logout();
              } else {
                navigate("/login");
              }
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-[var(--bg)]"
          >
            <LogOut size={16} />
            {user ? "Log Out" : "Sign In"}
          </button>
        </div>
      )}
    </div>
  );
}

/* Reusable Menu Item */
function MenuItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--bg)]"
    >
      {icon}
      {text}
    </button>
  );
}
