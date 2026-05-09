import {
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteListing, toggleListingStatus } from "../services/listingService";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function ListingOwnerMenu({ book }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmed) return;

    try {
      await deleteListing(book._id);
      toast.success("Listing deleted");
      // window.location.href = "/my-books";
      navigate("/my-books");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleStatusToggle = async (e) => {
    e.stopPropagation();

    try {
      await toggleListingStatus(book._id);

      toast.success(
        book.status === "sold"
          ? "Listing marked as available"
          : "Listing marked as sold",
      );

      navigate(0);
    } catch {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)]"
      >
        <MoreVertical size={16} />
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-44 sm:w-48 rounded-xl 
          bg-[var(--surface)] border border-[var(--border)] 
          shadow-lg overflow-hidden z-50"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit-listing/${book._id}`);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-[var(--bg)]"
          >
            <Pencil size={14} />
            Edit Listing
          </button>

          <button
            onClick={handleStatusToggle}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-yellow-500 hover:bg-yellow-500/10"
          >
            {book.status === "sold" ? (
              <>
                <RotateCcw size={14} />
                Mark Available
              </>
            ) : (
              <>
                <CheckCircle size={14} />
                Mark Sold
              </>
            )}
          </button>

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-red-500 hover:bg-red-500/10"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
