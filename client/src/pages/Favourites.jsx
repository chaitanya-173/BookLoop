import { Heart } from "lucide-react";

const dummyBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    price: "₹199",
    location: "Delhi",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Rich Dad Poor Dad",
    price: "₹149",
    location: "Noida",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "The Alchemist",
    price: "₹120",
    location: "Ghaziabad",
    image: "https://via.placeholder.com/150",
  },
];

export default function Favourites() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-6 py-10">
      
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-6">
          My favourites
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {dummyBooks.map((book) => (
            <div
              key={book.id}
              className="bg-[var(--surface)] border border-[var(--border)] 
              rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              
              {/* Image */}
              <div className="w-full h-40 bg-[var(--bg)]">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium">
                    {book.title}
                  </h3>

                  <Heart size={16} className="text-[var(--accent)]" />
                </div>

                <p className="text-sm font-semibold">
                  {book.price}
                </p>

                <p className="text-xs text-[var(--text-muted)]">
                  {book.location}
                </p>

              </div>
            </div>
          ))}

        </div>

        {/* Empty state (optional later) */}
        {dummyBooks.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] mt-6">
            No favourites yet
          </p>
        )}

      </div>
    </div>
  );
}