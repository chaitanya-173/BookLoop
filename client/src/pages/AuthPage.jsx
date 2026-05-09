import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row overflow-y-auto md:overflow-hidden
      bg-[var(--bg)] text-[var(--text)]"
    >
      {/* LEFT */}
      <div
        className={`
          w-full md:w-1/2 flex items-center justify-center
          px-6 py-10 md:px-10
          transition-all duration-500
          ${isSignup ? "md:order-2" : "md:order-1"}
        `}
      >
        {isSignup ? (
          <div className="w-full max-w-md">
            <Signup switchToLogin={() => setIsSignup(false)} />
          </div>
        ) : (
          <div className="w-full max-w-md text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Welcome to BookLoop 📚
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Discover, buy and sell books near you. Simple, fast and free.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div
        className={`
          w-full md:w-1/2 flex items-center justify-center
          px-6 py-10 md:px-10
          transition-all duration-500
          ${isSignup ? "md:order-1" : "md:order-2"}
        `}
      >
        {isSignup ? (
          <div className="w-full max-w-md text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Join BookLoop 🚀
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Create your account and start your journey.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <Login switchToSignup={() => setIsSignup(true)} />
          </div>
        )}
      </div>
    </div>
  );
}