const EARTH_RADIUS_METERS = 6371000;

const toRadians = (degrees) => degrees * (Math.PI / 180);

export const hasCoordinates = (location) =>
  Number.isFinite(Number(location?.latitude)) &&
  Number.isFinite(Number(location?.longitude));

export const getDistanceMeters = (from, to) => {
  if (!hasCoordinates(from) || !hasCoordinates(to)) return null;

  const lat1 = Number(from.latitude);
  const lon1 = Number(from.longitude);
  const lat2 = Number(to.latitude);
  const lon2 = Number(to.longitude);

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (meters) => {
  if (!Number.isFinite(meters)) return "--";

  const kilometers = meters / 1000;
  if (kilometers < 0.1) return "<0.1 km";

  return `${kilometers < 10 ? kilometers.toFixed(1) : Math.round(kilometers)} km`;
};
