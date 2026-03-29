import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      
      {/* LEFT */}
      <div className={`w-1/2 flex items-center justify-center transition-all duration-500 ${isSignup ? "order-2" : "order-1"}`}>
        {isSignup ? (
          <Signup switchToLogin={() => setIsSignup(false)} />
        ) : (
          <div className="max-w-md px-10">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to BookLoop 📚
            </h1>
            <p className="text-[var(--text-muted)]">
              Discover, buy and sell books near you. Simple, fast and free.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className={`w-1/2 flex items-center justify-center transition-all duration-500 ${isSignup ? "order-1" : "order-2"}`}>
        {isSignup ? (
          <div className="max-w-md px-10">
            <h1 className="text-4xl font-bold mb-4">
              Join BookLoop 🚀
            </h1>
            <p className="text-[var(--text-muted)]">
              Create your account and start your journey.
            </p>
          </div>
        ) : (
          <Login switchToSignup={() => setIsSignup(true)} />
        )}
      </div>

    </div>
  );
}