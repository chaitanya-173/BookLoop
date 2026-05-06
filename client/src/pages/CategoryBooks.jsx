import AppLayout from "../layouts/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import BookCard from "../components/BookCard";
import { ArrowLeft } from "lucide-react";

export default function CategoryBooks() {
  const { categoryName } = useParams();
  const { listings, loading } = useListings();
  const navigate = useNavigate();

  if (loading) {
    return (
      <AppLayout>
        <div className="p-5">Loading books...</div>
      </AppLayout>
    );
  }

  // Filter matching category
  const normalizedCategory = decodeURIComponent(categoryName)
    .trim()
    .toLowerCase();

  const filteredBooks = listings.filter((book) => {
    const parentCategory = book.category?.split("•")[0].trim().toLowerCase();
    return parentCategory === normalizedCategory;
  });

  return (
    <AppLayout>
      <div className="p-5 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <ArrowLeft size={16} />
            </button>

            <h1 className="text-2xl font-semibold">
              {decodeURIComponent(categoryName)}
            </h1>
          </div>

          <p className="text-sm text-[var(--text-muted)] ml-7">
            {filteredBooks.length} books found
          </p>
        </div>

        {/* BOOK GRID */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-[var(--text-muted)]">
            No books found in this category yet.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
