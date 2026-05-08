import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Camera, Crosshair, MapPin, User } from "lucide-react";
import { toast } from "react-hot-toast";
import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";

const getImageSrc = (image) => {
  if (!image) return "";
  if (typeof image !== "string") return URL.createObjectURL(image);
  if (image.startsWith("data:")) return image;
  return `data:image/jpeg;base64,${image}`;
};

export default function EditProfile() {
  const { user, fetchMe } = useAuth();
  const navigate = useNavigate();
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [locationCoords, setLocationCoords] = useState({
    latitude: user?.location?.latitude ?? null,
    longitude: user?.location?.longitude ?? null,
  });

  const imagePreview = useMemo(
    () => getImageSrc(profileImage || user?.profileImage),
    [profileImage, user?.profileImage],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.location?.address || "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.location?.address || "",
    });

    setLocationCoords({
      latitude: user?.location?.latitude ?? null,
      longitude: user?.location?.longitude ?? null,
    });
  }, [reset, user]);

  const applyPosition = (position) => {
    setLocationCoords({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    if (!user?.location?.address) {
      setValue("address", "Current location");
    }

    toast.success("Current location detected");
    setDetectingLocation(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not supported in this browser");
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      applyPosition,
      (error) => {
        if (error.code !== error.TIMEOUT) {
          toast.error(error.message || "Location permission denied");
          setDetectingLocation(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          applyPosition,
          (fallbackError) => {
            toast.error(
              fallbackError.message ||
                "Could not detect location. Try again or check browser permission.",
            );
            setDetectingLocation(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 300000,
            timeout: 30000,
          },
        );
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 20000,
      },
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be under 5MB");
      return;
    }

    setProfileImage(file);
  };

  const onSubmit = async (data) => {
    const latitude = locationCoords.latitude;
    const longitude = locationCoords.longitude;

    if (
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude))
    ) {
      toast.error("Please use current location first");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("phone", data.phone || "");
    formData.append("address", data.address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const res = await updateProfile(formData);

      if (res.data?.success) {
        toast.success(res.data.message || "Profile updated");
        await fetchMe();
        setProfileImage(null);
        setTimeout(() => {
          navigate(-1);
        }, 150);
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(
        typeof message === "string"
          ? message
          : message?.message || "Failed to update profile",
      );
    }
  };

  return (
    <AppLayout showSearch={false} showProfilePrompt={false}>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Edit profile</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={34} className="text-[var(--text-muted)]" />
                )}
              </div>

              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium cursor-pointer hover:opacity-90">
                  <Camera size={16} />
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>

                <p className="text-xs text-[var(--text-muted)]">
                  JPG, PNG, or WebP under 5MB.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Full Name
              </label>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Username
              </label>
              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Username must be 20 characters or less",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Only letters, numbers, and underscores",
                  },
                })}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Email
              </label>
              <input
                {...register("email")}
                readOnly
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text-muted)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phone", {
                  pattern: {
                    value: /^$|^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
                placeholder="Enter phone number"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Location
              </label>

              <div className="mt-1 flex flex-col sm:flex-row gap-2">
                <input
                  {...register("address", {
                    required: "Location address is required",
                  })}
                  placeholder="Enter your area or city"
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={detectingLocation}
                  className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface)] text-sm flex items-center justify-center gap-2"
                >
                  <Crosshair size={16} />
                  {detectingLocation ? "Detecting" : "Use GPS"}
                </button>
              </div>

              {errors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.address.message}
                </p>
              )}

              <p className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1">
                <MapPin size={12} />
                {Number.isFinite(Number(locationCoords.latitude)) &&
                Number.isFinite(Number(locationCoords.longitude))
                  ? `${Number(locationCoords.latitude).toFixed(5)}, ${Number(locationCoords.longitude).toFixed(5)}`
                  : "GPS coordinates not saved yet"}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--bg)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition"
              >
                {isSubmitting ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
