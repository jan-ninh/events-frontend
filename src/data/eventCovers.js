// Curated photographs from Unsplash (https://unsplash.com/license).
// A fixed selection avoids random images changing between page visits.
export const coverOptions = [
  { value: "auto", label: "Automatic mix" },
  { value: "tech", label: "Tech & coding" },
  { value: "workshop", label: "Workshops & learning" },
  { value: "gaming", label: "Gaming & entertainment" },
  { value: "outdoor", label: "Outdoors & nature" },
  { value: "food", label: "Food & social" },
  { value: "community", label: "Community & meetups" },
];

// Fixed Unsplash photo IDs. If an external picture fails, the EventCard
// falls back to our repository's existing bundled default image.
const photos = {
  tech: "photo-1498050108023-c5249f4df085",
  workshop: "photo-1516321318423-f06f85e504b3",
  gaming: "photo-1511512578047-dfb367046420",
  outdoor: "photo-1500534623283-312aade485b7",
  food: "photo-1517245386807-bb43f82c33c4",
  community: "photo-1511795409834-ef04bbd61622",
};

const photoThemes = Object.keys(photos);

export function eventImageTheme(event) {
  if (event?.imageTheme && photos[event.imageTheme]) return event.imageTheme;
  // Existing events get repeatable, varied images without migrating old content.
  const n = Number(event?.id);
  if (Number.isSafeInteger(n) && n > 0) return photoThemes[(n - 1) % photoThemes.length];
  return "community";
}

export function eventCoverUrl(theme) {
  const id = photos[theme] || photos.community;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&h=600&q=82`;
}
