import AppLayout from "../layouts/AppLayout";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Library,
  Laptop,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "School",
    icon: GraduationCap,
    desc: "Class 1–12, board prep & school essentials",
  },
  {
    name: "College / University",
    icon: Library,
    desc: "Degree, diploma & higher education books",
  },
  {
    name: "Entrance / Competitive",
    icon: Trophy,
    desc: "JEE, NEET, UPSC, SSC & exam prep",
  },
  {
    name: "Fiction",
    icon: BookOpen,
    desc: "Novels, fantasy, thrillers & literature",
  },
  {
    name: "Non-fiction",
    icon: BookOpen,
    desc: "Self-help, business, biographies & more",
  },
  {
    name: "Others",
    icon: Laptop,
    desc: "Computer science, design, niche subjects",
  },
];

export default function Categories() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Browse Categories
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            Explore books across academic, fiction, competitive and specialized
            categories.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <div
                key={cat.name}
                onClick={() =>
                  navigate(`/categories/${encodeURIComponent(cat.name)}`)
                }
                className="group p-5 sm:p-6 rounded-2xl bg-[var(--surface)] 
                border border-[var(--border)]
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                hover:shadow-lg hover:scale-[1.02]
                transition-all duration-300 cursor-pointer"
              >
                {/* ICON */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center
                  bg-[var(--bg)] border border-[var(--border)] mb-4
                  group-hover:border-[var(--accent)] transition"
                >
                  <Icon size={22} className="text-[var(--accent)]" />
                </div>

                {/* TITLE */}
                <h2 className="text-base sm:text-lg font-semibold mb-2">
                  {cat.name}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
                  {cat.desc}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                  Explore <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>

        {/* FUTURE NOTE */}
        <div
          className="rounded-2xl p-5 sm:p-6 bg-[var(--surface)] border border-[var(--border)] 
          shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            More categories coming soon 🚀
          </h3>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            We’re expanding BookLoop to include more specialized categories,
            advanced filters, and location-based sorting for smarter book
            discovery.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
