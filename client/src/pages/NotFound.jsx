import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-4">
      <div
        className="w-full max-w-2xl rounded-3xl border border-[var(--border)]
        bg-[var(--surface)] shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        p-8 sm:p-12 text-center"
      >
        {/* Icon */}
        <div
          className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center
          bg-[var(--bg)] border border-[var(--border)] mb-6"
        >
          <SearchX size={42} className="text-[var(--accent)]" />
        </div>

        {/* 404 */}
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-[var(--accent)] mb-3">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed mb-8">
          The page you’re looking for doesn’t exist, may have been moved, or the
          link might be incorrect.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/home"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
            px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-medium
            hover:opacity-90 transition"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
            px-6 py-3 rounded-xl border border-[var(--border)]
            bg-[var(--bg)] hover:bg-[var(--surface)] transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
