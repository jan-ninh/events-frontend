import { EventCard } from "./EventCard";

export const EventGrid = ({ events = [] }) => {
  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-semibold">No events yet</h2>
        <p className="mt-2 text-base-content/70">Create an event to bring your community together.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 items-stretch gap-8">
      {sortedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
