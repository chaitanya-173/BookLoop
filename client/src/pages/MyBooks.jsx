import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useListings } from "../context/ListingsContext";
import BookCard from "../components/BookCard";
import SortDropdown from "../components/SortDropdown";
import { useAuth } from "../context/AuthContext";
import { BookGridSkeleton } from "../components/BookCardSkeleton";
import EmptyState from "../components/EmptyState";
import { sortListings } from "../utils/listingSort";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyBooks() {
  const { listings, loading } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Distance is meaningless when every listing belongs to you, so this page
  // defaults to newest-first instead of the app-wide nearest-first default.
  const [sortKey, setSortKey] = useState("date_desc");

  if (loading) {
    return (
      <AppLayout>
        <BookGridSkeleton />
      </AppLayout>
    );
  }

  const myBooks = sortListings(
    listings.filter((book) => book.user?._id === (user?._id || user?.id)),
    sortKey,
    user?.location,
  );

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">My Books</h2>
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>

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