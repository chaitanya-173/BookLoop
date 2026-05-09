import AppLayout from "../layouts/AppLayout";
import { useEffect, useState } from "react";
import { getListings } from "../services/listingService";
import BookCard from "../components/BookCard";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookGridSkeleton } from "../components/BookCardSkeleton";
import EmptyState from "../components/EmptyState";
import { sortListingsByDistance } from "../utils/listingSort";

export default function NearbyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getListings();

        if (res.data?.success) {
          setBooks(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch nearby books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <BookGridSkeleton />
      </AppLayout>
    );
  }

  const sortedBooks = sortListingsByDistance(books, user?.location);

  return (
    <AppLayout>
      <div className="p-5 space-y-6">
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

            <h1 className="text-xl sm:text-2xl font-semibold">Nearby Books</h1>
          </div>
        </div>

        {/* EMPTY */}
        {sortedBooks.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No nearby books found"
            message="Try updating your location or check back later."
            actionLabel="Update Location"
            onAction={() => navigate("/edit-profile")}
          />
        ) : (
          /* GRID */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {sortedBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
