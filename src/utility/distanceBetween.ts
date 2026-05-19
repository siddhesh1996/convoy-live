const EARTH_RADIUS_M = 6371000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distance in meters (default), or pass unit */
export function distanceBetween(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: 'm' | 'km' | 'mi' = 'm'
): number {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = EARTH_RADIUS_M * c;

  if (unit === 'km') return meters / 1000;
  if (unit === 'mi') return meters / 1609.344;
  return meters;
}