import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      
      {/* Navbar */}
      <Navbar />

      {/* Spacer (IMPORTANT 🔥) */}
      <div className="h-24"></div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 pb-10">
        {children}
      </main>
    </div>
  );
}