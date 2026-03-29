import { useForm } from "react-hook-form";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await signup(data);
    if (res.ok) navigate("/");
  };

  return (
    <AuthLayout type="signup">
      <div className="space-y-6">

        {/* Heading */}
        <h2 className="text-2xl font-semibold tracking-tight">
          Create account
        </h2>

        {/* Switch */}
        <p className="text-sm text-[var(--text-muted)]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[var(--primary)] cursor-pointer hover:underline font-medium"
          >
            Sign in
          </span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Full Name
            </label>
            <input
              {...register("name", {
                required: "Name required",
                minLength: { value: 2, message: "At least 2 chars" },
              })}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-3 rounded-xl 
              bg-[var(--surface)] border border-[var(--border)] 
              text-[var(--text)] text-sm
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
              focus:border-transparent
              transition-all duration-200
              hover:border-[var(--primary)]/40"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Username
            </label>
            <input
              {...register("username", {
                required: "Username required",
                minLength: { value: 3, message: "At least 3 chars" },
                maxLength: { value: 20, message: "Max 20 chars" },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Letters, numbers & _ only",
                },
              })}
              placeholder="Enter username"
              className="w-full mt-1 px-4 py-3 rounded-xl 
              bg-[var(--surface)] border border-[var(--border)] 
              text-[var(--text)] text-sm
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
              focus:border-transparent
              transition-all duration-200
              hover:border-[var(--primary)]/40"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter valid email",
                },
              })}
              placeholder="Enter email"
              className="w-full mt-1 px-4 py-3 rounded-xl 
              bg-[var(--surface)] border border-[var(--border)] 
              text-[var(--text)] text-sm
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
              focus:border-transparent
              transition-all duration-200
              hover:border-[var(--primary)]/40"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
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
                {...register("password", {
                  required: "Required",
                  minLength: {
                    value: 6,
                    message: "At least 6 characters",
                  },
                })}
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
            {isSubmitting ? "Creating..." : "Create account"}
          </button>

        </form>
      </div>
    </AuthLayout>
  );
}