import Navbar from "../components/Navbar";

export default function AppLayout({ children, showSearch = true }) {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      <Navbar showSearch={showSearch} />

      <div className="h-24"></div>

      <main className="max-w-7xl mx-auto px-4 pb-10">{children}</main>
    </div>
  );
}
