import { Heart, MapPin, Phone, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toggleWishlist } from "../services/listingService";
import { formatDistance, getDistanceMeters } from "../utils/distance";
import { toast } from "react-hot-toast";

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const { user, toggleWishlistItem, isInWishlist } = useAuth();

  const wished = isInWishlist(book._id);
  const distanceMeters = getDistanceMeters(user?.location, book.user?.location);
  const distanceLabel = formatDistance(distanceMeters);

  const isOwner =
    user &&
    book.user &&
    (book.user._id === user._id || book.user._id === user.id);

  const canViewDetails = book.status !== "sold" || isOwner;

  const handleWishlist = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      toggleWishlistItem(book._id);
      await toggleWishlist(book._id);

      toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  return (
    <div
      onClick={() => {
        if (!canViewDetails) {
          toast.error("This book is no longer available");
          return;
        }

        navigate(`/listing/${book._id}`);
      }}
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl
      overflow-hidden shadow transition-all duration-300 group
      ${
        book.status === "sold"
          ? isOwner
            ? "grayscale opacity-70 cursor-pointer"
            : "grayscale opacity-70 cursor-not-allowed"
          : "hover:shadow-lg hover:scale-[1.03] cursor-pointer"
      }`}
    >
      {/* IMAGE */}
      <div className="relative">
        <div className="w-full h-28 sm:h-36 md:h-44 flex items-center justify-center bg-[var(--bg)]">
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
                className="text-sm sm:text-lg md:text-2xl font-bold text-white
                bg-black/50 px-3 py-1 rounded-lg tracking-widest"
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
          text-white p-1.5 sm:p-2 rounded-full hover:scale-110 transition z-20"
        >
          <Heart
            size={14}
            className={`transition sm:w-4 sm:h-4 ${
              wished ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-2 sm:p-3 md:p-4 space-y-1.5 sm:space-y-2">
        {/* TITLE + DISTANCE */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-1 sm:gap-2">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-1">
            {book.title}
          </h3>

          <span
            className="w-fit flex items-center gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full
            bg-[rgba(34,197,94,0.12)] text-[rgb(34,197,94)] font-medium shrink-0"
          >
            <MapPin size={10} className="sm:w-3 sm:h-3" />
            {distanceLabel}
          </span>
        </div>

        {/* PRICE */}
        <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm">
          {book.type === "donate" ? "Free" : `₹ ${book.price}`}
        </p>

        {/* CATEGORY */}
        <span
          className="inline-block text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full
          bg-[var(--bg)] border border-[var(--border)] line-clamp-1"
        >
          {book.category}
        </span>

        {/* DIVIDER */}
        <div className="border-t border-[var(--border)] my-1.5 sm:my-2"></div>

        {/* CONTACT */}
        <p className="text-[10px] sm:text-xs text-[var(--text-muted)] flex items-center gap-1 line-clamp-1">
          <Phone size={10} className="sm:w-3 sm:h-3 shrink-0" />
          {book.user?.phone || "Phone unavailable"}
        </p>

        <p className="text-[10px] sm:text-xs text-[var(--text-muted)] flex items-center gap-1 line-clamp-1">
          <User size={10} className="sm:w-3 sm:h-3 shrink-0" />
          {book.user?.name || "Seller"}
        </p>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pt-1 sm:pt-2">
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-[var(--text-muted)]">
            <Clock size={10} className="sm:w-3 sm:h-3" />
            {new Date(book.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();

              if (!canViewDetails) {
                toast.error("This book is no longer available");
                return;
              }

              navigate(`/listing/${book._id}`);
            }}
            className="text-[11px] sm:text-sm text-[var(--accent)] font-medium hover:underline"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
