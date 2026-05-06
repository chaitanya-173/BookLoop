import AppLayout from "../layouts/AppLayout";
import { useEffect, useState } from "react";
import { getWishlist } from "../services/listingService";
import BookCard from "../components/BookCard";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Favourites() {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();

        if (res.data?.success) {
          setWishlistBooks(res.data.data);
        }
      } catch (error) {
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
        <div className="p-5">Loading wishlist...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-5 space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-2xl font-semibold">My Wishlist</h1>
          </div>

          <p className="text-sm text-[var(--text-muted)] ml-7">
            {wishlistBooks.length} saved books
          </p>
        </div>

        {/* EMPTY STATE */}
        {wishlistBooks.length === 0 ? (
          <div
            className="rounded-3xl border border-[var(--border)] 
            bg-[var(--surface)] p-10 text-center
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          >
            <Heart
              size={48}
              className="mx-auto text-[var(--text-muted)] mb-4"
            />

            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-sm text-[var(--text-muted)]">
              Save books you love and revisit them anytime.
            </p>
          </div>
        ) : (
          /* BOOK GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
