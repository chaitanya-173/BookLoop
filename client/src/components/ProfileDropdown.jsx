import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { submitFeedback } from "../services/authService";
import {
  User,
  Pencil,
  BookOpen,
  MapPin,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("experience");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const ref = useRef();
  const profileImage = user?.profileImage
    ? `data:image/jpeg;base64,${user.profileImage}`
    : user?.avatar;

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const closeDropdown = () => {
    setOpen(false);
    setFeedbackOpen(false);
  };

  const handleSubmitFeedback = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      closeDropdown();
      return;
    }

    if (feedbackMessage.trim().length < 5) {
      toast.error("Please write a little more feedback");
      return;
    }

    try {
      setSubmittingFeedback(true);
      const res = await submitFeedback({
        category: feedbackCategory,
        message: feedbackMessage.trim(),
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Feedback submitted");
        setFeedbackMessage("");
        setFeedbackCategory("experience");
        closeDropdown();
      } else {
        toast.error(res.data?.message || "Failed to submit feedback");
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(
        typeof message === "string"
          ? message
          : message?.message || "Failed to submit feedback",
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

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
        <div className="absolute right-0 mt-2 sm:translate-x-1 w-[92vw] max-w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl overflow-hidden z-50">
          {/* Top Profile Section */}
          <div className="flex flex-col items-center py-5 px-4 border-b border-[var(--border)]">
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--bg)] flex items-center justify-center mb-3">
                <User size={32} />
              </div>
            )}

            <p className="font-semibold text-base sm:text-lg text-center line-clamp-1">
              {user?.name || "Guest"}
            </p>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] text-center break-all">
              {user?.email || "Not logged in"}
            </p>
          </div>

          {/* Options */}
          <div className="py-2">
            <MenuItem
              icon={<Pencil size={16} />}
              text="Edit Profile"
              onClick={() => {
                navigate("/edit-profile");
                closeDropdown();
              }}
            />

            <MenuItem
              icon={<BookOpen size={16} />}
              text="My Books"
              onClick={() => {
                navigate("/my-books");
                closeDropdown();
              }}
            />

            <MenuItem
              icon={<MapPin size={16} />}
              text="Update Location"
              onClick={() => {
                navigate("/edit-profile");
                closeDropdown();
              }}
            />

            <MenuItem
              icon={<MessageSquare size={16} />}
              text="Feedback"
              onClick={() => setFeedbackOpen((current) => !current)}
            />
          </div>

          {feedbackOpen && (
            <form
              onSubmit={handleSubmitFeedback}
              className="border-t border-[var(--border)] p-4 space-y-3"
            >
              <select
                value={feedbackCategory}
                onChange={(event) => setFeedbackCategory(event.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none"
              >
                <option value="experience">Experience</option>
                <option value="bug">Bug</option>
                <option value="idea">Idea</option>
                <option value="other">Other</option>
              </select>

              <textarea
                value={feedbackMessage}
                onChange={(event) => setFeedbackMessage(event.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Tell us what should be better..."
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm resize-none focus:outline-none"
              />

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-[var(--border)] text-xs hover:bg-[var(--bg)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
                >
                  {submittingFeedback ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          )}

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
              closeDropdown();
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
      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-[var(--bg)]"
    >
      {icon}
      {text}
    </button>
  );
}
