import AppLayout from "../layouts/AppLayout";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { getListingById, toggleWishlist } from "../services/listingService";
import { useAuth } from "../context/AuthContext";
import ListingOwnerMenu from "../components/ListingOwnerMenu";
import EmptyState from "../components/EmptyState";
import { formatDistance, getDistanceMeters } from "../utils/distance";
import {
  MapPin,
  User,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Heart,
  BookX,
  Share2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function ListingDetails() {
  const [expanded, setExpanded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, toggleWishlistItem, isInWishlist } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [current, setCurrent] = useState(0);

  const wished = listing ? isInWishlist(listing._id) : false;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await getListingById(id);

        if (res.data?.success) {
          setListing(res.data.data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: `${listing.title} | BookLoop`,
      text: `Check out "${listing.title}" on BookLoop ${
        listing.type === "donate" ? "for free 📚" : `for ₹${listing.price} 📚`
      }`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Book shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Book link copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      toggleWishlistItem(listing._id);
      await toggleWishlist(listing._id);

      toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % listing.images.length);
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length,
    );
  };

  if (loading) {
    return (
      <AppLayout showSearch={false}>
        <div className="grid md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-[350px] rounded-2xl bg-[var(--surface)] border border-[var(--border)]" />

          <div className="space-y-4">
            <div className="h-7 w-2/3 rounded bg-[var(--surface)]" />
            <div className="h-5 w-24 rounded bg-[var(--surface)]" />
            <div className="h-8 w-40 rounded-full bg-[var(--surface)]" />
            <div className="h-20 rounded-2xl bg-[var(--surface)]" />
            <div className="h-32 rounded-2xl bg-[var(--surface)]" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (notFound || !listing) {
    return (
      <AppLayout showSearch={false}>
        <EmptyState
          icon={BookX}
          title="Listing not found"
          message="This book may have been deleted or is no longer available."
          actionLabel="Browse books"
          onAction={() => navigate("/home")}
        />
      </AppLayout>
    );
  }

  const isOwner =
    user &&
    listing.user &&
    (listing.user._id === user._id || listing.user._id === user.id);
  const sellerLocation = listing.user?.location;
  const distanceLabel = formatDistance(
    getDistanceMeters(user?.location, sellerLocation),
  );
  const sellerPhone = listing.user?.phone?.trim();
  const whatsappUrl = sellerPhone
    ? `https://wa.me/91${sellerPhone}?text=${encodeURIComponent(
        `Hi, I found your book "${listing.title}" on BookLoop. Is it still available?`,
      )}`
    : "";

  const parentCategory = listing.category?.split("•")[0]?.trim();
  const bookmarkLabel = listing.status === "sold" ? "SOLD" : parentCategory;

  return (
    <AppLayout showSearch={false}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-9 h-9 rounded-xl
  border border-[var(--border)] bg-[var(--surface)]
  text-[var(--text-muted)] hover:text-[var(--text)]
  hover:bg-[var(--bg)] transition"
        >
          <ArrowLeft size={16} />
        </button>

        {/* ============ THE OPEN BOOK ============ */}
        <div className="relative" style={{ perspective: 1600 }}>
          {/* Stacked page-edges behind the spread, giving it physical thickness */}
          <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-[28px] bg-[var(--border)] opacity-80 -z-10" />
          <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[28px] bg-[var(--border)] opacity-55 -z-20" />
          <div className="absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-[28px] bg-[var(--border)] opacity-30 -z-30" />

          <div
            className="relative grid md:grid-cols-2 rounded-[28px] overflow-hidden
            border border-[var(--border)] bg-[var(--surface)]
            shadow-[0_40px_90px_-25px_rgba(0,0,0,0.4)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* PAGE-EDGE STACK - mimics the look of stacked paper along the outer right & bottom edges */}
            <div
              className="hidden md:block absolute top-2 bottom-2 right-0 w-[6px] z-10 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, color-mix(in srgb, var(--text-muted) 35%, transparent) 0px, color-mix(in srgb, var(--text-muted) 35%, transparent) 1px, transparent 1px, transparent 3px)",
              }}
            />
            <div
              className="absolute left-2 right-2 bottom-0 h-[6px] z-10 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(to right, color-mix(in srgb, var(--text-muted) 35%, transparent) 0px, color-mix(in srgb, var(--text-muted) 35%, transparent) 1px, transparent 1px, transparent 3px)",
              }}
            />

            {/* DOG-EAR FOLD - bottom-right corner page fold */}
            <div
              className="hidden md:block absolute bottom-0 right-0 w-9 h-9 z-20 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, transparent 50%, color-mix(in srgb, var(--text-muted) 25%, var(--surface)) 50.5%)",
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                boxShadow: "-2px -2px 6px rgba(0,0,0,0.15)",
              }}
            />

            {/* BOOKMARK RIBBON */}
            {bookmarkLabel && (
              <div
                className={`absolute top-0 right-6 sm:right-10 z-30 px-3 pt-2 pb-3 text-[10px] font-mono
                tracking-widest uppercase text-white text-center shadow-md
                ${listing.status === "sold" ? "bg-red-500" : "bg-[var(--accent)]"}`}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                }}
              >
                {bookmarkLabel}
              </div>
            )}

            {/* SPINE - curved binding shadow, desktop only */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-16 -translate-x-1/2 z-20 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.06) 30%, rgba(0,0,0,0.22) 48%, rgba(0,0,0,0.22) 52%, rgba(0,0,0,0.06) 70%, transparent 100%)",
              }}
            />
            {/* Headband caps - the little stitched caps at the top & bottom of a hardcover spine */}
            <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-5 h-2 rounded-b-full bg-[var(--border)] z-20 pointer-events-none" />
            <div className="hidden md:block absolute left-1/2 bottom-0 -translate-x-1/2 w-5 h-2 rounded-t-full bg-[var(--border)] z-20 pointer-events-none" />

            {/* LEFT PAGE - the cover, already "there" when the book appears */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                boxShadow: "inset -22px 0 20px -20px rgba(0,0,0,0.3)",
              }}
              className="relative p-5 sm:p-8 md:pr-12 space-y-4 bg-[var(--surface)]"
            >
              <div
                className={`relative w-full h-[320px] sm:h-[380px] flex items-center justify-center 
                bg-[var(--bg)] rounded-2xl border border-[var(--border)] 
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                ${listing.status === "sold" ? "grayscale opacity-80" : ""}`}
              >
                <img
                  src={`data:image/jpeg;base64,${listing.images[current]}`}
                  className="max-h-full max-w-full object-contain"
                  alt={listing.title}
                />

                {/* SOLD OVERLAY */}
                {listing.status === "sold" && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span
                        className="text-2xl font-bold text-white 
                        bg-black/50 px-4 py-1 rounded-lg tracking-widest"
                      >
                        SOLD
                      </span>
                    </div>

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute w-[140%] h-[2px] bg-white/40 rotate-45 top-1/2 -left-10"></div>
                    </div>
                  </>
                )}

                {/* ARROWS */}
                {listing.images.length > 1 && (
                  <>
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
                  </>
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-2">
                {listing.images.map((img, i) => (
                  <img
                    key={i}
                    onClick={() => setCurrent(i)}
                    src={`data:image/jpeg;base64,${img}`}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border
                    ${
                      current === i
                        ? "border-[var(--accent)]"
                        : "border-[var(--border)]"
                    }`}
                    alt={`thumbnail-${i}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* RIGHT PAGE - swings open from the spine, like an actual page turning */}
            <motion.div
              initial={{ rotateY: -105, opacity: 0.2 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{
                rotateY: { duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.5, delay: 0.35 },
              }}
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                transformPerspective: 1400,
                boxShadow: "inset 22px 0 20px -20px rgba(0,0,0,0.3)",
              }}
              className="relative p-5 sm:p-8 md:pl-12 space-y-4 bg-[var(--bg)]/40"
            >
              {/* TITLE + ACTIONS */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl leading-tight">
                    {listing.title}
                  </h1>

                  <p className="text-lg font-bold text-[var(--accent)] mt-1">
                    {listing.type === "donate" ? "Free" : `₹ ${listing.price}`}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 items-center shrink-0">
                  <button
                    onClick={handleWishlist}
                    className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)]"
                  >
                    <Heart
                      size={16}
                      className={`transition ${
                        wished ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)]"
                  >
                    <Share2 size={16} />
                  </button>

                  {isOwner && <ListingOwnerMenu book={listing} />}
                </div>
              </div>

              {/* CATEGORY */}
              <span
                className="inline-block text-xs px-3 py-1 rounded-full 
                bg-[var(--surface)] border border-[var(--border)]"
              >
                {listing.category}
              </span>

              <p className="text-sm text-[var(--text-muted)] font-medium">
                Condition: {listing.condition}
              </p>

              {listing.author && (
                <p className="text-sm text-[var(--text-muted)]">
                  Author: {listing.author}
                </p>
              )}

              <div className="border-t border-dashed border-[var(--border)]"></div>

              {/* DESCRIPTION */}
              {listing.description && (
                <div>
                  <h3 className="font-display text-base mb-1">Description</h3>

                  <p
                    className={`text-sm text-[var(--text-muted)] leading-relaxed ${
                      expanded ? "" : "line-clamp-3"
                    }`}
                  >
                    {listing.description}
                  </p>

                  {listing.description.length > 120 && (
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
                <div className="border-t border-dashed border-[var(--border)]"></div>
              )}

              {/* SELLER INFO */}
              <div className="space-y-2">
                <h3 className="font-display text-base">Seller Info</h3>

                <p className="flex items-center gap-2 text-sm">
                  <User size={14} />
                  {listing.user?.name}
                </p>

                <p className="flex items-center gap-2 text-sm">
                  <Mail size={14} />
                  {listing.user?.email}
                </p>

                <p className="flex items-center gap-2 text-sm">
                  <Phone size={14} />
                  {listing.user?.phone || "Phone unavailable"}
                </p>

                {sellerPhone && !isOwner && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href={`tel:${sellerPhone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
                    >
                      <Phone size={15} />
                      Call seller
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface)]"
                    >
                      <MessageCircle size={15} />
                      WhatsApp
                    </a>
                  </div>
                )}

                <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Clock size={14} />
                  {new Date(listing.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        {/* ============ END OPEN BOOK ============ */}

        {isOwner && listing.status !== "sold" && (
          <div
            className="rounded-2xl border border-[var(--border)] p-4
    bg-[var(--surface)] space-y-2 max-w-2xl w-full
    shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          >
            <h3 className="text-sm font-semibold text-[var(--accent)]">
              Manage your listing
            </h3>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              If this book has been sold or is no longer available, please
              mark it as unavailable or delete it to keep BookLoop accurate
              for other users.
            </p>
          </div>
        )}

        {/* LOCATION */}
        <div
          className="rounded-2xl border border-[var(--border)] p-4 
            bg-[var(--surface)] max-w-2xl w-full flex justify-between items-center 
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase">
              Location
            </p>

            <p className="text-sm font-medium">
              {sellerLocation?.address || "Location unavailable"}
            </p>
          </div>

          <span
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full 
              bg-[rgba(34,197,94,0.12)] text-[rgb(34,197,94)] font-medium"
          >
            <MapPin size={12} />
            {distanceLabel}
          </span>
        </div>

        {/* SAFETY BOX */}
        <div
          className="rounded-2xl border border-[var(--border)] p-4 
            bg-[var(--surface)] space-y-3 max-w-2xl w-full 
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-2 text-red-500 font-semibold text-sm">
            <ShieldAlert size={16} />
            Tips for a safe deal
          </div>

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

          <div className="border-t border-[var(--border)]"></div>

          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            BookLoop is not responsible for fraudulent activities. It simply
            connects nearby buyers and sellers.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}