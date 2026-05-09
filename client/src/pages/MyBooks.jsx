import AppLayout from "../layouts/AppLayout";
import { useListings } from "../context/ListingsContext";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";
import { BookGridSkeleton } from "../components/BookCardSkeleton";
import EmptyState from "../components/EmptyState";
import { sortListingsByDistance } from "../utils/listingSort";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyBooks() {
  const { listings, loading } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <AppLayout>
        <BookGridSkeleton />
      </AppLayout>
    );
  }

  const myBooks = sortListingsByDistance(
    listings.filter((book) => book.user?._id === (user?._id || user?.id)),
    user?.location,
  );

  return (
    <AppLayout>
      <div className="p-4 sm:p-5">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">My Books</h2>

        {myBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {myBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No books listed yet"
            message="Your listed books will appear here after you post them."
            actionLabel="Sell a Book"
            onAction={() => navigate("/sell")}
          />
        )}
      </div>
    </AppLayout>
  );
}
