import defaultImage from "../assets/default-event.jpg";
import { Link } from "react-router";
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
      className="card group bg-base-100 w-full h-full shadow-sm hover:shadow-xl transition-shadow duration-200 overflow-hidden focus-visible:outline-2 focus-visible:outline-blue-500"
      aria-label={`View event: ${title}`}
    >
      <figure className="h-52 bg-slate-700 overflow-hidden">
        <img
          src={imageSrc}
          alt={`Cover photo for ${title}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = defaultImage;
          }}
        />
      </figure>
      <div className="card-body p-5 gap-2">
        <h2 className="card-title text-lg leading-snug">{title}</h2>
        <p className="text-sm text-base-content/75">{formattedDate}</p>
        {location && <p className="text-sm text-base-content/80">{location}</p>}
        <p className="text-sm leading-relaxed line-clamp-3">{description || "Discover this event."}</p>
      </div>
    </Link>
  );
};
