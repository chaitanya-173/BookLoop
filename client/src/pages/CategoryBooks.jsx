import AppLayout from "../layouts/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import BookCard from "../components/BookCard";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BookGridSkeleton } from "../components/BookCardSkeleton";
import EmptyState from "../components/EmptyState";
import { sortListingsByDistance } from "../utils/listingSort";

export default function CategoryBooks() {
  const { categoryName } = useParams();
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

  // Filter matching category
  const normalizedCategory = decodeURIComponent(categoryName)
    .trim()
    .toLowerCase();

  let filteredBooks = [];

  if (normalizedCategory === "free-books") {
    filteredBooks = sortListingsByDistance(
      listings.filter((book) => book.type?.toLowerCase() === "donate"),
      user?.location,
    );
  } else {
    filteredBooks = sortListingsByDistance(
      listings.filter((book) => {
        const parentCategory = book.category
          ?.split("•")[0]
          .trim()
          .toLowerCase();

        return parentCategory === normalizedCategory;
      }),
      user?.location,
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-5 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <ArrowLeft size={16} />
            </button>

            <h1 className="text-xl sm:text-2xl font-semibold">
              {decodeURIComponent(categoryName)}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] ml-7">
            {filteredBooks.length} books found
          </p>
        </div>

        {/* BOOK GRID */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No books found"
            message="There are no books in this category yet."
            actionLabel="Explore categories"
            onAction={() => navigate("/categories")}
          />
        )}
      </div>
    </AppLayout>
  );
}
