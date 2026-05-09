import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasCoordinates } from "../utils/distance";

export default function ProfileCompletionPrompt() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const missingPhone = !user.phone;
  const missingLocation = !hasCoordinates(user.location);

  if (!missingPhone && !missingLocation) return null;

  return (
    <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-start gap-3">
        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0 text-[var(--accent)]"
        />

        <div>
          <p className="text-sm sm:text-base font-medium">
            Complete your profile
          </p>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            Add your phone and location to help buyers contact you and see
            accurate distances.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/edit-profile")}
        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
      >
        Edit profile
      </button>
    </div>
  );
}
