import {
  Heart,
  MapPin,
  Phone,
  User,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toggleWishlist, deleteListing } from "../services/listingService";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function BookCard({ book, showOwnerControls = false }) {
  const navigate = useNavigate();
  const { user, toggleWishlistItem, isInWishlist } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const wished = isInWishlist(book._id);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      toggleWishlistItem(book._id);
      const res = await toggleWishlist(book._id);
      toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error("Wishlist update failed");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmed) return;

    try {
      await deleteListing(book._id);

      toast.success("Listing deleted");

      window.location.reload(); // simple for now
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      onClick={() => navigate(`/listing/${book._id}`)}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl 
      overflow-hidden shadow hover:shadow-lg transition-all duration-300 
      hover:scale-[1.03] cursor-pointer group"
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

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-black/50 backdrop-blur 
          text-white p-2 rounded-full hover:scale-110 transition"
        >
          <Heart
            size={16}
            className={`transition ${
              wished ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {showOwnerControls && (
          <div className="absolute top-2 left-2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="bg-black/50 backdrop-blur text-white p-2 rounded-full hover:scale-110 transition"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div
                className="absolute mt-2 left-0 w-36 rounded-xl 
        bg-[var(--surface)] border border-[var(--border)] 
        shadow-lg overflow-hidden"
              >
                {/* Edit */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit-listing/${book._id}`);
                  }}
                  className="w-full flex items-center gap-2 px-4 pt-3 
          text-sm hover:bg-[var(--bg)]"
                >
                  <Pencil size={14} />
                  Edit
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-3 
          text-sm text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        {/* TITLE + DISTANCE */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>

          <span
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full 
            bg-[rgba(34,197,94,0.12)] text-[rgb(34,197,94)] font-medium"
          >
            <MapPin size={12} />
            {"<100 m"}
          </span>
        </div>

        {/* PRICE */}
        <p className="text-[var(--accent)] font-semibold text-sm">
          {book.type === "donate" ? "Free" : `₹ ${book.price}`}
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
            {new Date(book.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
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
