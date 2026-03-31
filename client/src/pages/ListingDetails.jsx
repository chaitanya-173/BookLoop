import AppLayout from "../layouts/AppLayout";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getListingById } from "../services/listingService";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Clock,
  Heart,
  Share2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: listing.title,
        text: "Check this book on BookLoop",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  } catch (err) {
    toast.error("Failed to share");
  }
};

export default function ListingDetails() {
  const [expanded, setExpanded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await getListingById(id);
      if (res.data?.success) {
        setListing(res.data.data);
      }
    };
    fetchListing();
  }, [id]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % listing.images.length);
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length,
    );
  };

  if (!listing) return <p className="p-5">Loading...</p>;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-5">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 🔙 BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT IMAGE */}
            <div className="space-y-3">
              <div
                className="relative w-full h-[350px] flex items-center justify-center 
            bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              >
                <img
                  src={`data:image/jpeg;base64,${listing.images[current]}`}
                  className="max-h-full max-w-full object-contain"
                />

                {/*  ARROWS */}
                <button
                  onClick={prev}
                  className="absolute left-2 bg-black/40 text-white p-2 rounded-full"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={next}
                  className="absolute right-2 bg-black/40 text-white p-2 rounded-full"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-2">
                {listing.images.map((img, i) => (
                  <img
                    key={i}
                    onClick={() => setCurrent(i)}
                    src={`data:image/jpeg;base64,${img}`}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border 
                  ${current === i ? "border-[var(--accent)]" : "border-[var(--border)]"}`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">
              {/* TITLE + ACTIONS */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-semibold">{listing.title}</h1>
                  <p className="text-lg font-bold text-[var(--accent)]">
                    {listing.type === "donate" ? "Free" : `₹ ${listing.price}`}
                  </p>
                </div>

                {/* SHARE */}
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)]">
                    <Heart size={16} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)]"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {/* CATEGORY */}
              <span
                className="inline-block text-xs px-3 py-1 rounded-full 
            bg-[var(--surface)] border border-[var(--border)]"
              >
                {listing.category}
              </span>

              <p className="text-sm text-[var(--text-muted)]">
                Condition: {listing.condition}
              </p>

              {listing.author && (
                <p className="text-sm">Author: {listing.author}</p>
              )}

              <div className="border-t border-[var(--border)]"></div>

              {/* DESCRIPTION */}
              {listing.description && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p
                    className={`text-sm text-[var(--text-muted)] ${
                      expanded ? "" : "line-clamp-3"
                    }`}
                  >
                    {listing.description}
                  </p>

                  {listing.description?.length > 120 && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-xs text-[var(--accent)] mt-1 hover:underline"
                    >
                      {expanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}

              {listing.description && (
                <div className="border-t border-[var(--border)]"></div>
              )}

              {/* SELLER */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Seller Info</h3>

                <p className="flex items-center gap-2 text-sm">
                  <User size={14} /> {listing.user?.name}
                </p>

                <p className="flex items-center gap-2 text-sm">
                  <Mail size={14} /> {listing.user?.email}
                </p>

                <p className="flex items-center gap-2 text-sm">
                  <Phone size={14} /> 8318641930
                </p>

                <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Clock size={14} />
                  {new Date(listing.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* LOCATION BOX (BOTTOM) */}
          <div
            className="rounded-2xl border border-[var(--border)] p-4 
        bg-[var(--surface)] max-w-2xl w-full flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          >
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase">
                Location
              </p>
              <p className="text-sm font-medium">Greater Noida</p>
            </div>

            <span
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full 
          bg-[rgba(34,197,94,0.12)] text-[rgb(34,197,94)] font-medium"
            >
              <MapPin size={12} />
              {"<100 m"}
            </span>
          </div>

          {/* 🛡 SAFETY BOX */}
          <div
            className="rounded-2xl border border-[var(--border)] p-4 
            bg-[var(--surface)] space-y-3 max-w-2xl w-full shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          >
            {/* Header */}
            <div className="flex items-center gap-2 text-red-500 font-semibold text-sm">
              <ShieldAlert size={16} />
              Tips for a safe deal
            </div>

            {/* Tips */}
            <ul className="text-xs text-[var(--text-muted)] space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 text-red-400" />
                Never give money or product in advance.
              </li>

              <li className="flex items-start gap-2">
                <CreditCard size={14} className="mt-0.5 text-red-400" />
                Do not share UPI PIN while receiving money.
              </li>

              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="mt-0.5 text-red-400" />
                Be safe, meet buyers/sellers in public places.
              </li>
            </ul>

            {/* Divider */}
            <div className="border-t border-[var(--border)]"></div>

            {/* Footer note */}
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              BookLoop is not responsible for any fraudulent activities. It is
              just a medium to connect you with nearby sellers.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
