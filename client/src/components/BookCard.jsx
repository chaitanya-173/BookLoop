import { Heart, MapPin, Phone, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookCard({ book }) {
  const navigate = useNavigate();

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
          />
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation
            console.log("fav clicked");
          }}
          className="absolute top-2 right-2 bg-black/50 backdrop-blur 
          text-white p-2 rounded-full hover:scale-110 transition"
        >
          <Heart size={16} />
        </button>
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

        {/* CATEGORY TAG */}
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
          8318641930 {/* TODO: dynamic later */}
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
