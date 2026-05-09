import AppLayout from "../layouts/AppLayout";
import { useEffect, useState } from "react";
import { getWishlist } from "../services/listingService";
import BookCard from "../components/BookCard";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookGridSkeleton } from "../components/BookCardSkeleton";
import EmptyState from "../components/EmptyState";
import { sortListingsByDistance } from "../utils/listingSort";

export default function Favourites() {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();

        if (res.data?.success) {
          setWishlistBooks(res.data.data);
        }
      } catch {
        console.error("Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <BookGridSkeleton />
      </AppLayout>
    );
  }

  const sortedWishlistBooks = sortListingsByDistance(
    wishlistBooks,
    user?.location,
  );

  return (
    <AppLayout>
      <div className="p-4 sm:p-5 space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 rounded-xl
  border border-[var(--border)] bg-[var(--surface)]
  text-[var(--text-muted)] hover:text-[var(--text)]
  hover:bg-[var(--bg)] transition"
            >
              <ArrowLeft size={16} />
            </button>

            <h1 className="text-xl sm:text-2xl font-semibold">My Wishlist</h1>
          </div>

          <p className="text-[var(--text-muted)] ml-12 text-xs sm:text-sm">
            {sortedWishlistBooks.length} saved books
          </p>
        </div>

        {/* EMPTY STATE */}
        {sortedWishlistBooks.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            message="Save books you love and revisit them anytime."
            actionLabel="Browse books"
            onAction={() => navigate("/")}
          />
        ) : (
          /* BOOK GRID */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {sortedWishlistBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
