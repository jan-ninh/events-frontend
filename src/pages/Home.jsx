import { fetchEvents } from "../api/events";
import { useEffect, useMemo, useState } from "react";
import { EventGrid } from "../components/EventGrid";
import { sortChoices, sortEvents } from "../utils/sortEvents";
import { useBackendStatus } from "../context/useBackendStatus";

export const Home = () => {
  const { isReady } = useBackendStatus();
  const [events, setEvents] = useState([]);
  const [sortOrder, setSortOrder] = useState("created-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sortedEvents = useMemo(() => sortEvents(events, sortOrder), [events, sortOrder]);

  useEffect(() => {
    if (!isReady) return;
    let active = true;
    setError("");
    setLoading(true);
    fetchEvents()
      .then((data) => {
        if (active) setEvents(Array.isArray(data?.results) ? data.results : []);
      })
      .catch(() => {
        if (active) setError("Events could not be loaded. Please refresh the page.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [isReady]);

  return (
    <div className="px-5 pb-20 pt-12 sm:px-7 sm:pt-16">
      <div className="mx-auto max-w-7xl">
        <header className="home-heading mb-9 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="home-eyebrow mb-3">DISCOVER · MEET · CREATE</p>
            <h1 className="home-title">Find your next experience.</h1>
            <p className="home-description mt-4">
              Explore developer meetups, workshops and community events.
              Discover something worth showing up for.
            </p>
          </div>

          <div className="home-sort-control shrink-0">
            <label htmlFor="event-sort" className="home-sort-label">Sort events</label>
            <select
              id="event-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="home-sort-select"
            >
              {sortChoices.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </header>

        <aside className="mb-7 rounded-xl border border-sky-300/20 bg-slate-800/55 px-4 py-3 text-sm leading-relaxed text-slate-200" aria-label="About this portfolio demo">
          <span className="font-semibold text-cyan-200">Live portfolio demo.</span>
          {" "}Events and accounts are temporary and may reset when the free server restarts. The three sample events return automatically. Please use fictional details.
        </aside>

        <div className="home-section-heading mb-5 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold tracking-wide text-white">Explore events</h2>
          {isReady && !loading && !error && (
            <p className="text-sm text-slate-300">
              {events.length} {events.length === 1 ? "event" : "events"}
            </p>
          )}
        </div>

        {!isReady ? (
          <div className="home-feedback" role="status">Waiting for the demo server to start…</div>
        ) : loading ? (
          <div className="home-feedback" role="status">Loading events…</div>
        ) : error ? (
          <div className="home-feedback" role="alert">{error}</div>
        ) : (
          <EventGrid events={sortedEvents} />
        )}
      </div>
    </div>
  );
};
