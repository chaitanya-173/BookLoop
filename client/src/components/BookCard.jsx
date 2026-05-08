import { Heart, MapPin, Phone, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toggleWishlist } from "../services/listingService";
import {
  formatDistance,
  getDistanceMeters,
} from "../utils/distance";
import { toast } from "react-hot-toast";

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const { user, toggleWishlistItem, isInWishlist } = useAuth();

  const wished = isInWishlist(book._id);
  const distanceMeters = getDistanceMeters(user?.location, book.user?.location);
  const distanceLabel = formatDistance(distanceMeters);

  const handleWishlist = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      toggleWishlistItem(book._id);
      await toggleWishlist(book._id);

      toast.success(
        wished ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  return (
    <div
      onClick={() => navigate(`/listing/${book._id}`)}
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl 
      overflow-hidden shadow transition-all duration-300 group
      ${
        book.status === "sold"
          ? "grayscale opacity-70 cursor-pointer"
          : "hover:shadow-lg hover:scale-[1.03] cursor-pointer"
      }`}
    >
      {/* IMAGE */}
      <div className="relative">
        <div className="w-full h-44 flex items-center justify-center bg-[var(--bg)]">
          <img
            src={`data:image/jpeg;base64,${book.images?.[0]}`}
            className="max-h-full max-w-full object-contain"
            alt={book.title}
          />
        </div>

        {/* SOLD OVERLAY */}
        {book.status === "sold" && (
          <>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span
                className="text-2xl font-bold text-white 
                bg-black/50 px-4 py-1 rounded-lg tracking-widest"
              >
                SOLD
              </span>
            </div>

            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute w-[140%] h-[2px] bg-white/40 rotate-45 top-1/2 -left-10"></div>
            </div>
          </>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-black/50 backdrop-blur 
          text-white p-2 rounded-full hover:scale-110 transition z-20"
        >
          <Heart
            size={16}
            className={`transition ${
              wished
                ? "fill-red-500 text-red-500"
                : "text-white"
            }`}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        {/* TITLE + DISTANCE */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-sm line-clamp-1">
            {book.title}
          </h3>

          <span
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full 
            bg-[rgba(34,197,94,0.12)] text-[rgb(34,197,94)] font-medium"
          >
            <MapPin size={12} />
            {distanceLabel}
          </span>
        </div>

        {/* PRICE */}
        <p className="text-[var(--accent)] font-semibold text-sm">
          {book.type === "donate"
            ? "Free"
            : `₹ ${book.price}`}
        </p>

        {/* CATEGORY */}
        <span
          className="inline-block text-xs px-2 py-1 rounded-full 
          bg-[var(--bg)] border border-[var(--border)]"
        >
          {book.category}
        </span>

        {/* DIVIDER */}
        <div className="border-t border-[var(--border)] my-2"></div>

        {/* CONTACT */}
        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          <Phone size={12} />
          {book.user?.phone || "Phone unavailable"}
        </p>

        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          <User size={12} />
          {book.user?.name || "Seller"}
        </p>

        {/* BOTTOM */}
        <div className="flex justify-between items-center pt-2">
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Clock size={12} />
            {new Date(book.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/listing/${book._id}`);
            }}
            className="text-sm text-[var(--accent)] font-medium hover:underline"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
