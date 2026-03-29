import AppLayout from "../layouts/AppLayout";

const categories = [
  "Fiction",
  "Non-fiction",
  "Academic",
  "Competitive Exams",
  "Free Books",
  "Comics",
];

export default function Categories() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat}
            className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:shadow-md transition cursor-pointer"
          >
            <h2 className="text-lg font-medium">{cat}</h2>
          </div>
        ))}
      </div>

      <div className="text-9xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis dolorem
        cupiditate consequatur praesentium repellendus eligendi illum dolore
        molestiae, magni distinctio maxime autem sunt corporis, minima, voluptas
        consectetur voluptates doloribus! Labore!
      </div>
    </AppLayout>
  );
}
