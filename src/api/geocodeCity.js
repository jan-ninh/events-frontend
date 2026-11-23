// Resolve a city name to approximate coordinates for the local event map.
// City-level lookup intentionally does not claim to pinpoint an event venue.
export async function lookupCity(location, { signal } = {}) {
  if (typeof location !== "string") return null;
  // Examples: "Bochum, Ruhrgebiet" -> "Bochum"
  const city = location.split(",")[0].trim();
  if (city.length < 2) return null;

  const params = new URLSearchParams({
    name: city,
    count: "5",
    language: "de",
    format: "json",
  });
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    { signal },
  );
  if (!response.ok) throw new Error("Location lookup failed");

  const data = await response.json();
  const matches = (data.results || []).filter(
    (place) => place.name?.toLocaleLowerCase("de") === city.toLocaleLowerCase("de"),
  );
  // Prefer a German city when an identical name exists in several countries.
  const match = matches.find((place) => place.country_code === "DE") || matches[0];
  if (
    !match ||
    !Number.isFinite(match.latitude) ||
    !Number.isFinite(match.longitude)
  ) {
    return null;
  }
  return { latitude: match.latitude, longitude: match.longitude };
}
