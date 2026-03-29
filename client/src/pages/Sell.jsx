import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import AppLayout from "../layouts/AppLayout";
import CategoryDropdown from "../components/CategoryDropdown";
import { createListing } from "../services/listingService";
import { toast } from "react-hot-toast";

export default function Sell() {
  const [type, setType] = useState("sell");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: "",
    category: "",
    price: 0,
    condition: "",
    author: "",
    description: "",
  });

  const inputRef = useRef();

  const handleFiles = (files) => {
    const selected = Array.from(files);
    const total = [...images, ...selected].slice(0, 5);
    setImages(total);
  };

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookData({
      ...bookData,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  // SUBMIT LOGIC (UNCHANGED)
  const handleSubmit = async () => {
    const { title, category, price, condition, author, description } = bookData;
    console.log(bookData, images);

    if (!title || !category || !condition || images.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    if (type === "sell" && !price) {
      toast.error("Price is required");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("price", type === "sell" ? price : 0);
    formData.append("condition", condition);
    formData.append("author", author);
    formData.append("description", description);

    images.forEach((img) => {
      formData.append("images", img);
    });

    const res = await createListing(formData);

    if (res.data?.success) {
      const listingId = res.data.data._id; // 👈 important
      toast.success(res.data.message || "Listing created");
      navigate(`/listing/${listingId}`); // 🚀 redirect
    } else {
      toast.error(res.data?.message || "Failed to create listing");
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Sell your book</h2>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            {/* IMAGE UPLOAD (UNCHANGED) */}
            <div className="space-y-3">
              <p className="text-xs text-[var(--text)] uppercase">Images *</p>

              <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                }}
                className="w-full min-h-[140px] rounded-xl border border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-2 bg-[var(--bg)] cursor-pointer hover:border-[var(--primary)] transition"
              >
                <p className="text-sm text-[var(--text)]">
                  Drag & drop images here
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  or click to upload (max 5)
                </p>

                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg overflow-hidden border border-[var(--border)]"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() =>
                          setImages(images.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TITLE */}
            <div>
              <label className="text-xs text-[var(--text)] uppercase">
                Listing Title *
              </label>
              <input
                name="title"
                value={bookData.title}
                onChange={handleChange}
                placeholder="Enter Book Name"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* CATEGORY */}
            <CategoryDropdown
              onSelect={(val) =>
                setBookData((prev) => ({
                  ...prev,
                  category: val,
                }))
              }
            />

            {/* TYPE */}
            <div>
              <label className="text-xs text-[var(--text)] uppercase">
                Type *
              </label>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setType("sell")}
                  className={`flex-1 py-2 rounded-lg text-sm border ${type === "sell" ? "bg-[var(--primary)] text-white border-transparent" : "border-[var(--border)]"}`}
                >
                  Sell
                </button>

                <button
                  onClick={() => setType("donate")}
                  className={`flex-1 py-2 rounded-lg text-sm border ${type === "donate" ? "bg-[var(--primary)] text-white border-transparent" : "border-[var(--border)]"}`}
                >
                  Donate
                </button>
              </div>
            </div>

            {/* PRICE */}
            {type === "sell" && (
              <div>
                <label className="text-xs text-[var(--text)] uppercase">
                  Price (₹) *
                </label>
                <input
                  name="price"
                  value={bookData.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter price"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm"
                />
              </div>
            )}

            {/* CONDITION */}
            <div>
              <label className="text-xs text-[var(--text)] uppercase">
                Condition *
              </label>
              <select
                name="condition"
                value={bookData.condition}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            {/* AUTHOR */}
            <div>
              <label className="text-xs text-[var(--text)] uppercase">
                Author (optional)
              </label>
              <input
                name="author"
                value={bookData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-xs text-[var(--text)] uppercase">
                Add details (optional)
              </label>
              <textarea
                name="description"
                value={bookData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Add any extra details..."
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm resize-none"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition"
            >
              Post listing
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
