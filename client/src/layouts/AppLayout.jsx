import Navbar from "../components/Navbar";
import ProfileCompletionPrompt from "../components/ProfileCompletionPrompt";

export default function AppLayout({
  children,
  showSearch = true,
  showProfilePrompt = true,
}) {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <Navbar showSearch={showSearch} />

      <div className="h-24 sm:h-24 md:h-28" />

      <main className="max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-10">
        {showProfilePrompt && <ProfileCompletionPrompt />}
        {children}
      </main>
    </div>
  );
}
