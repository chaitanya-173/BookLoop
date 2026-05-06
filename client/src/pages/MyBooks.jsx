import AppLayout from "../layouts/AppLayout";
import { useListings } from "../context/ListingsContext";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";

export default function MyBooks() {
  const { listings, loading } = useListings();
  const { user } = useAuth();

  if (loading) {
    return (
      <AppLayout>
        <div className="p-5">Loading books...</div>
      </AppLayout>
    );
  }

  const myBooks = listings.filter(
    (book) => book.user?._id === (user?._id || user?.id),
  );

  return (
    <AppLayout>
      <div className="p-5">
        <h2 className="text-lg font-semibold mb-4">My Books</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {myBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
