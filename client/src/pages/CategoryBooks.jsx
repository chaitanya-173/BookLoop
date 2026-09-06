import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import BookCard from "../components/BookCard";
import TagFilterRow from "../components/TagFilterRow";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BookGridSkeleton } from "../components/BookCardSkeleton";
import EmptyState from "../components/EmptyState";
import { sortListingsByDistance } from "../utils/listingSort";
import { CATEGORIES } from "../constants/categories";

export default function CategoryBooks() {
  const { categoryName } = useParams();
  const { listings, loading } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTag, setActiveTag] = useState("All");

  // Reset the tag filter whenever the category itself changes
  useEffect(() => {
    setActiveTag("All");
  }, [categoryName]);

  if (loading) {
    return (
      <AppLayout>
        <BookGridSkeleton />
      </AppLayout>
    );
  }

  const normalizedCategory = decodeURIComponent(categoryName)
    .trim()
    .toLowerCase();

  const isFreeBooks = normalizedCategory === "free-books";
  const matchedCategory = CATEGORIES.find(
    (c) => c.name.toLowerCase() === normalizedCategory,
  );

  // Tag row items: sub-categories for a normal category, or top-level
  // categories for the "free books" view (which spans all categories)
  const tagItems = isFreeBooks
    ? ["All", ...CATEGORIES.map((c) => c.name)]
    : matchedCategory
      ? ["All", ...matchedCategory.options]
      : [];

  let filteredBooks = [];

  if (isFreeBooks) {
    filteredBooks = listings.filter(
      (book) => book.type?.toLowerCase() === "donate",
    );

    if (activeTag !== "All") {
      filteredBooks = filteredBooks.filter((book) => {
        const parentCategory = book.category?.split("•")[0].trim().toLowerCase();
        return parentCategory === activeTag.toLowerCase();
      });
    }
  } else {
    filteredBooks = listings.filter((book) => {
      const parentCategory = book.category?.split("•")[0].trim().toLowerCase();
      return parentCategory === normalizedCategory;
    });

    if (activeTag !== "All") {
      filteredBooks = filteredBooks.filter((book) => {
        const subCategory = book.category?.split("•")[1]?.trim();
        return subCategory === activeTag;
      });
    }
  }

  filteredBooks = sortListingsByDistance(filteredBooks, user?.location);

  return (
    <AppLayout>
      <div className="space-y-6">
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

            <h1 className="text-xl sm:text-2xl font-semibold">
              {decodeURIComponent(categoryName)}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] ml-12">
            {filteredBooks.length} books found
          </p>
        </div>

        {/* SUB-CATEGORY / CATEGORY TAGS */}
        {tagItems.length > 0 && (
          <TagFilterRow
            items={tagItems}
            active={activeTag}
            onSelect={setActiveTag}
          />
        )}

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
            message="There are no books matching this filter yet."
            actionLabel="Explore categories"
            onAction={() => navigate("/categories")}
          />
        )}
      </div>
    </AppLayout>
  );
}