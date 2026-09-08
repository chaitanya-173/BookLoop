import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  X,
  ScanLine,
  Keyboard,
  Loader2,
  Check,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import BarcodeScanner from "./BarcodeScanner";
import { lookupBookByIsbn } from "../services/bookLookupService";

/**
 * Modal for auto-filling the Sell form from an ISBN - either scanned via
 * camera or typed manually. Never applies the result directly; always shows
 * a confirmation step first, since a mismatched edition is worse than no
 * autofill at all.
 */
export default function BookLookupModal({ onClose, onConfirm }) {
  const [mode, setMode] = useState("scan"); // "scan" | "type"
  const [isbnInput, setIsbnInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanError, setScanError] = useState("");

  const runLookup = async (isbn) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await lookupBookByIsbn(isbn);

      if (res.data?.success) {
        setResult(res.data.data);
      } else {
        toast.error(res.data?.message || "Book not found");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't look that up right now. Try again or enter details manually.",
      );
    } finally {
      setLoading(false);
    }
  };

  // useCallback keeps BarcodeScanner's effect from restarting the camera
  // every render - passing a fresh inline function each time would do that.
  const handleDetected = (isbn) => {
    if (loading) return;
    runLookup(isbn);
  };

  const handleReset = () => {
    setResult(null);
    setIsbnInput("");
    setScanError("");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--accent)]" />
            Auto-fill from ISBN
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg)] transition"
          >
            <X size={18} />
          </button>
        </div>

        {!result && (
          <>
            {/* MODE TOGGLE */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
              <button
                onClick={() => setMode("scan")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                  mode === "scan"
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <ScanLine size={15} /> Scan barcode
              </button>

              <button
                onClick={() => setMode("type")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                  mode === "type"
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Keyboard size={15} /> Type ISBN
              </button>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="flex flex-col items-center gap-2 py-10 text-[var(--text-muted)]">
                <Loader2 size={22} className="animate-spin" />
                <p className="text-sm">Looking up book details...</p>
              </div>
            )}

            {/* SCAN MODE */}
            {mode === "scan" && !loading && (
              <div className="space-y-2">
                <BarcodeScanner
                  onDetected={handleDetected}
                  onError={setScanError}
                />

                <p className="text-xs text-[var(--text-muted)] text-center">
                  Point your camera at the barcode on the back of the book
                </p>

                {scanError && (
                  <p className="text-xs text-red-500 text-center">{scanError}</p>
                )}
              </div>
            )}

            {/* TYPE MODE */}
            {mode === "type" && !loading && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    value={isbnInput}
                    onChange={(e) => setIsbnInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isbnInput.trim()) {
                        runLookup(isbnInput.trim());
                      }
                    }}
                    placeholder="e.g. 9780134685991"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm outline-none focus:border-[var(--accent)]"
                  />

                  <button
                    onClick={() => isbnInput.trim() && runLookup(isbnInput.trim())}
                    className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition"
                  >
                    Fetch
                  </button>
                </div>

                <p className="text-xs text-[var(--text-muted)]">
                  Found on the back cover, usually above or below the barcode
                </p>
              </div>
            )}
          </>
        )}

        {/* CONFIRMATION */}
        {result && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">Is this your book?</p>

            <div className="flex gap-4 p-3 rounded-xl border border-[var(--border)]">
              {result.coverUrl ? (
                <img
                  src={result.coverUrl}
                  alt={result.title}
                  className="w-16 h-24 object-cover rounded-lg shrink-0 bg-[var(--bg)]"
                />
              ) : (
                <div className="w-16 h-24 rounded-lg bg-[var(--bg)] border border-[var(--border)] shrink-0 flex items-center justify-center">
                  <BookOpen size={20} className="text-[var(--text-muted)]" />
                </div>
              )}

              <div className="min-w-0">
                <p className="font-display text-base leading-snug line-clamp-2">
                  {result.title}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {result.author || "Author unknown"}
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              This fills in the title, author & description - you'll still add
              your own photos of the actual copy you're selling.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--bg)] transition"
              >
                <RotateCcw size={15} /> Try again
              </button>

              <button
                onClick={() => onConfirm(result)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition"
              >
                <Check size={15} /> Use this
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}