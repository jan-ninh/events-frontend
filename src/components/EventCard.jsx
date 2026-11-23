import defaultImage from "../assets/default-event.jpg";
import { Link } from "react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { eventCoverUrl, eventImageTheme } from "../data/eventCovers";

export const EventCard = ({ event }) => {
  const { id, title, description, date, location } = event;
  const imageSrc = eventCoverUrl(eventImageTheme(event));
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(date));

  return (
    <Link
      to={`/events/${id}`}
      className="event-card group flex flex-col overflow-hidden focus-visible:outline-2 focus-visible:outline-cyan-300"
      aria-label={`View event: ${title}`}
    >
      <figure className="event-cover overflow-hidden">
        <img
          src={imageSrc}
          alt={`Cover photo for ${title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(imageEvent) => {
            imageEvent.currentTarget.onerror = null;
            imageEvent.currentTarget.src = defaultImage;
          }}
        />
      </figure>
      <div className="event-card-body flex flex-1 flex-col gap-3 p-5">
        <h3 className="event-card-title text-xl font-bold leading-snug">{title}</h3>
        <div className="event-card-meta flex flex-col gap-1.5">
          <span className="flex items-center gap-2"><CalendarDays aria-hidden="true" size={16}/>{formattedDate}</span>
          {location && <span className="flex items-center gap-2"><MapPin aria-hidden="true" size={16}/>{location}</span>}
        </div>
        <p className="event-card-description mt-1 line-clamp-3 text-sm leading-relaxed">
          {description || "Discover this event."}
        </p>
      </div>
    </Link>
  );
};
