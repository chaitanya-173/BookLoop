import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useListings } from "../context/ListingsContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { BookGridSkeleton } from "../components/BookCardSkeleton";
import EmptyState from "../components/EmptyState";
import { sortListingsByDistance } from "../utils/listingSort";
import { semanticSearchListings } from "../services/listingService";
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Trophy,
  Library,
  Laptop,
  Gift,
  SearchX,
} from "lucide-react";
import { toast } from "react-hot-toast";

const trendingCategories = [
  { name: "School", icon: GraduationCap },
  { name: "College / University", icon: Library },
  { name: "Entrance / Competitive", icon: Trophy },
  { name: "Fiction", icon: BookOpen },
  { name: "Non-fiction", icon: BookOpen },
  { name: "Others", icon: Laptop },
];

export default function Home() {
  const { listings, loading } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawSearchQuery = searchParams.get("search") || "";
  const searchQuery = rawSearchQuery.toLowerCase();

  // null = semantic results not ready/available yet -> fall back to keyword results.
  // Once semantic search resolves with matches, we silently upgrade to those (better ranked),
  // with zero visible toggle or loading state - same search box, just smarter results.
  const [smartResults, setSmartResults] = useState(null);

  useEffect(() => {
    setSmartResults(null);

    if (!rawSearchQuery.trim()) return;

    let cancelled = false;

    const runSmartSearch = async () => {
      try {
        const res = await semanticSearchListings(rawSearchQuery);

        if (!cancelled && res.data?.success && res.data.data?.length > 0) {
          setSmartResults(res.data.data);
        }
      } catch {
        // Silent fallback - keyword results are already showing, no need to alert the user
      }
    };

    runSmartSearch();

    return () => {
      cancelled = true;
    };
  }, [rawSearchQuery]);

  if (loading) {
    return (
      <AppLayout>
        <BookGridSkeleton />
      </AppLayout>
    );
  }

  // Search filter
  const filteredListings = sortListingsByDistance(
    searchQuery
      ? listings.filter((book) =>
          [book.title, book.author, book.category]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery),
        )
      : listings,
    user?.location,
  );

  // Nearby books
  const nearbyBooks = filteredListings
    .filter((book) => book.status !== "sold")
    .slice(0, 4);

  const handleShare = async () => {
    const shareData = {
      title: "BookLoop",
      text: "Discover affordable books near you on BookLoop 📚",
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("BookLoop shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("BookLoop link copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* SEARCH MODE */}
        {searchQuery ? (
          <section className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Search Results</h1>

              <p className="text-[var(--text-muted)] mt-1">
                {(smartResults ?? filteredListings).length} books found for "
                {rawSearchQuery}"
              </p>
            </div>

            {(smartResults ?? filteredListings).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {(smartResults ?? filteredListings).map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={SearchX}
                title="No matching books"
                message="Try a different title, author, or category."
                actionLabel="Clear search"
                onAction={() => navigate("/")}
              />
            )}
          </section>
        ) : (
          <>
            {/* HERO */}
            <section
              className="rounded-3xl p-5 sm:p-8 bg-[var(--surface)] border border-[var(--border)]
              shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="max-w-3xl space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  Discover affordable books near you
                </h1>

                <p className="text-[var(--text-muted)] text-base leading-relaxed">
                  Buy, sell, or donate books effortlessly with BookLoop — making
                  education accessible one book at a time.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <button
                    onClick={() => navigate("/categories")}
                    className="px-5 py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
                  >
                    Explore Categories
                  </button>

                  <button
                    onClick={() => navigate("/sell")}
                    className="px-5 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg)] transition"
                  >
                    Sell a Book
                  </button>
                </div>
              </div>
            </section>

            {/* NEARBY BOOKS */}
            <section className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Your Nearby Books
                </h2>

                <button
                  onClick={() => navigate("/nearby-books")}
                  className="flex items-center gap-1 text-[var(--accent)] font-medium hover:gap-2 transition-all"
                >
                  View More <ArrowRight size={18} />
                </button>
              </div>

              {nearbyBooks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {nearbyBooks.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No books available yet"
                  message="Be the first person nearby to list a book."
                  actionLabel="Sell a Book"
                  onAction={() => navigate("/sell")}
                />
              )}
            </section>

            {/* TRENDING CATEGORIES */}
            <section className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Trending Categories
                </h2>

                <button
                  onClick={() => navigate("/categories")}
                  className="flex items-center gap-1 text-[var(--accent)] font-medium hover:gap-2 transition-all"
                >
                  View All <ArrowRight size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingCategories.map((cat) => {
                  const Icon = cat.icon;

                  return (
                    <div
                      key={cat.name}
                      onClick={() =>
                        navigate(`/categories/${encodeURIComponent(cat.name)}`)
                      }
                      className="group rounded-2xl p-5 bg-[var(--surface)]
                      border border-[var(--border)]
                      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                      hover:scale-[1.03] hover:shadow-lg
                      transition-all duration-300 cursor-pointer text-center"
                    >
                      <div
                        className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center
                        bg-[var(--bg)] border border-[var(--border)] mb-3
                        group-hover:border-[var(--accent)]"
                      >
                        <Icon size={22} className="text-[var(--accent)]" />
                      </div>

                      <h3 className="text-sm font-medium">{cat.name}</h3>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* FREE BOOKS */}
            <section
              onClick={() => navigate("/categories/free-books")}
              className="rounded-3xl p-5 sm:p-8 cursor-pointer
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)]
              hover:scale-[1.01] transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Gift size={28} />

                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Get Free Books
                    </h2>
                  </div>

                  <p className="text-sm text-white/90 max-w-xl">
                    Discover donated books from nearby students and readers —
                    completely free and accessible.
                  </p>
                </div>

                <ArrowRight size={30} />
              </div>
            </section>

            {/* MISSION */}
            <section
              className="rounded-3xl p-8 bg-[var(--surface)] border border-[var(--border)]
              shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="space-y-5 max-w-3xl">
                <h2 className="text-3xl font-bold">
                  Join the mission to make books affordable 📖
                </h2>

                <p className="text-[var(--text-muted)] leading-relaxed">
                  Millions of books remain unused while students struggle to
                  afford them. BookLoop connects readers, learners, and sellers
                  to create an accessible ecosystem for knowledge sharing.
                </p>

                <button
                  onClick={handleShare}
                  className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition"
                >
                  Share BookLoop
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}