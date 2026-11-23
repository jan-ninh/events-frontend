import { EventCard } from "./EventCard";

export const EventGrid = ({ events = [] }) => {
  if (events.length === 0) {
    return (
      <div className="home-feedback text-center py-20">
        <h2 className="text-xl font-semibold">No events yet</h2>
        <p className="mt-2 text-slate-300">Create an event to bring your community together.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
