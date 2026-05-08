import Navbar from "../components/Navbar";
import ProfileCompletionPrompt from "../components/ProfileCompletionPrompt";

export default function AppLayout({
  children,
  showSearch = true,
  showProfilePrompt = true,
}) {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      <Navbar showSearch={showSearch} />

      <div className="h-24"></div>

      <main className="max-w-7xl mx-auto px-4 pb-10">
        {showProfilePrompt && <ProfileCompletionPrompt />}
        {children}
      </main>
    </div>
  );
}
