import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-6 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-6">
          Edit profile
        </h2>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Full Name
              </label>
              <input
                {...register("name", { required: "Name required" })}
                className="w-full mt-1 px-4 py-3 rounded-xl 
                bg-[var(--bg)] border border-[var(--border)] 
                text-sm focus:outline-none 
                focus:ring-2 focus:ring-[var(--primary)]"
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
                {...register("username", { required: "Username required" })}
                className="w-full mt-1 px-4 py-3 rounded-xl 
                bg-[var(--bg)] border border-[var(--border)] 
                text-sm focus:outline-none 
                focus:ring-2 focus:ring-[var(--primary)]"
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
                {...register("email", { required: "Email required" })}
                className="w-full mt-1 px-4 py-3 rounded-xl 
                bg-[var(--bg)] border border-[var(--border)] 
                text-sm focus:outline-none 
                focus:ring-2 focus:ring-[var(--primary)]"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter valid 10-digit number",
                  },
                })}
                placeholder="Enter phone number"
                className="w-full mt-1 px-4 py-3 rounded-xl 
                bg-[var(--bg)] border border-[var(--border)] 
                text-sm focus:outline-none 
                focus:ring-2 focus:ring-[var(--primary)]"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Location
              </label>
              <input
                {...register("location")}
                placeholder="Enter your city"
                className="w-full mt-1 px-4 py-3 rounded-xl 
                bg-[var(--bg)] border border-[var(--border)] 
                text-sm focus:outline-none 
                focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--bg)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg 
                bg-[var(--accent)] text-white text-sm font-medium 
                hover:opacity-90 transition"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}