import { getDistanceMeters } from "./distance";

export const sortListingsByDistance = (listings, viewerLocation) => {
  return [...listings].sort((a, b) => {
    const distanceA = getDistanceMeters(viewerLocation, a.user?.location);
    const distanceB = getDistanceMeters(viewerLocation, b.user?.location);

    if (Number.isFinite(distanceA) && Number.isFinite(distanceB)) {
      return distanceA - distanceB;
    }

    if (Number.isFinite(distanceA)) return -1;
    if (Number.isFinite(distanceB)) return 1;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};
