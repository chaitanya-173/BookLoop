import { getDistanceMeters } from "./distance";

export const SORT_OPTIONS = [
  { key: "distance_asc", label: "Distance: Nearest first" },
  { key: "distance_desc", label: "Distance: Farthest first" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "date_desc", label: "Date Posted: Newest first" },
  { key: "date_asc", label: "Date Posted: Oldest first" },
  { key: "name_asc", label: "Name: A to Z" },
  { key: "name_desc", label: "Name: Z to A" },
];

export const DEFAULT_SORT = "distance_asc";

const sortByDistance = (listings, viewerLocation, direction) => {
  return [...listings].sort((a, b) => {
    const distanceA = getDistanceMeters(viewerLocation, a.user?.location);
    const distanceB = getDistanceMeters(viewerLocation, b.user?.location);
    const aFinite = Number.isFinite(distanceA);
    const bFinite = Number.isFinite(distanceB);

    if (aFinite && bFinite) {
      return direction === "asc" ? distanceA - distanceB : distanceB - distanceA;
    }

    // Listings without a resolvable distance always sink to the bottom,
    // regardless of sort direction, then fall back to newest-first.
    if (aFinite) return -1;
    if (bFinite) return 1;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

/**
 * Sorts listings by the given sort key. Falls back to nearest-first
 * (the app default) for an unrecognized or missing key.
 */
export const sortListings = (listings, sortKey = DEFAULT_SORT, viewerLocation) => {
  const arr = [...listings];

  switch (sortKey) {
    case "distance_asc":
      return sortByDistance(arr, viewerLocation, "asc");
    case "distance_desc":
      return sortByDistance(arr, viewerLocation, "desc");
    case "price_asc":
      return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    case "price_desc":
      return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    case "date_desc":
      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "date_asc":
      return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "name_asc":
      return arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    case "name_desc":
      return arr.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    default:
      return sortByDistance(arr, viewerLocation, "asc");
  }
};

// Kept for any code that still wants plain nearest-first sorting directly.
export const sortListingsByDistance = (listings, viewerLocation) =>
  sortByDistance(listings, viewerLocation, "asc");