import AppLayout from "../layouts/AppLayout";
import { useEffect, useState } from "react";
import { getListings } from "../services/listingService";
import BookCard from "../components/BookCard";

export default function MyBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getListings();

      if (res.data?.success) {
        setBooks(res.data.data);
      }
    };

    fetch();
  }, []);

  return (
    <AppLayout>
      <div className="p-5">
        <h2 className="text-lg font-semibold mb-4">My Books</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
