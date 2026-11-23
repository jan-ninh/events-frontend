// Pure client-side sorting: never mutate the API response.
export const sortChoices = [
  { value: "created-desc", label: "Recently added" },
  { value: "event-asc", label: "Event date: earliest" },
  { value: "event-desc", label: "Event date: latest" },
  { value: "created-asc", label: "Created: oldest" },
];

export function sortEvents(events, order = "created-desc") {
  const selected = sortChoices.some((choice) => choice.value === order)
    ? order
    : "created-desc";
  const key = selected.startsWith("created-") ? "createdAt" : "startsAt";
  const descending = selected.endsWith("-desc");

  const getTime = (event) => {
    const raw = key === "startsAt" ? (event?.startsAt ?? event?.date) : event?.createdAt;
    const time = Date.parse(raw ?? "");
    return Number.isFinite(time) ? time : null;
  };

  return [...(Array.isArray(events) ? events : [])].sort((a, b) => {
    const left = getTime(a);
    const right = getTime(b);
    // Missing timestamps go last in either direction.
    if (left === null && right !== null) return 1;
    if (right === null && left !== null) return -1;
    if (left !== null && right !== null && left !== right) {
      return descending ? right - left : left - right;
    }
    // Deterministic tie-break (API IDs are unique).
    return descending
      ? (Number(b?.id) || 0) - (Number(a?.id) || 0)
      : (Number(a?.id) || 0) - (Number(b?.id) || 0);
  });
}
