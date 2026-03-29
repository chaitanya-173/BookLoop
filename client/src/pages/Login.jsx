import { useForm } from "react-hook-form";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login({
      identifier: data.identifier,
      password: data.password,
    });
    if (res.ok) navigate("/");
  };

  return (
    <AuthLayout type="login">
      <div className="space-y-6">

        {/* Heading */}
        <h2 className="text-2xl font-semibold tracking-tight">
          Sign in
        </h2>

        {/* Switch */}
        <p className="text-sm text-[var(--text-muted)]">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[var(--primary)] cursor-pointer hover:underline font-medium"
          >
            Create account
          </span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Identifier */}
          <div>
            <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Email or Username
            </label>
            <input
              {...register("identifier", { required: "Required" })}
              placeholder="Enter your email or username"
              className="w-full mt-1 px-4 py-3 rounded-xl 
              bg-[var(--surface)] border border-[var(--border)] 
              text-[var(--text)] text-sm
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
              focus:border-transparent
              transition-all duration-200
              hover:border-[var(--primary)]/40"
            />
            {errors.identifier && (
              <p className="text-xs text-red-500 mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Required" })}
                placeholder="Enter password"
                className="w-full mt-1 px-4 py-3 pr-10 rounded-xl 
                bg-[var(--surface)] border border-[var(--border)] 
                text-[var(--text)] text-sm
                focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
                focus:border-transparent
                transition-all duration-200
                hover:border-[var(--primary)]/40"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl 
            bg-[var(--accent)] 
            hover:opacity-90 active:scale-[0.98]
            transition-all duration-150 
            text-white font-medium shadow-sm"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

        </form>
      </div>
    </AuthLayout>
  );
}