import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../context/useAuth";
import { useBackendStatus } from "../context/useBackendStatus";
import { apiConfig } from "../api/apiConfig";
import { EventService } from "../api/events";
import { lookupCity } from "../api/geocodeCity";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Loader, Skeleton } from "../components/Loader";
import "leaflet/dist/leaflet.css";
import { NotFound } from "./NotFound";
import { Calendar, MapPin } from "lucide-react";
import L from "leaflet";
import greenMarker from "../assets/markers/marker-icon-green.png";
import markerShadow from "../assets/markers/marker-shadow.png";

const customMarker = L.icon({
  iconUrl: greenMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isReady } = useBackendStatus();
  const [registrationState, setRegistrationState] = useState("checking");
  const [registrationError, setRegistrationError] = useState("");
  const [canDelete, setCanDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [event, setEvent] = useState(null);
  const [map, setMap] = useState({ status: "loading", coords: null, approximate: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!id || !isReady) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await EventService.getEventById(id);
        if(!data){
          throw new Error(`Failed to load event. Try again later.`);
        }
        setEvent(data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError("Failed to load event. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isReady]);

  useEffect(() => {
    if (!id || !token || !isReady) {
      setRegistrationState("signed-out");
      return;
    }
    let active = true;
    setRegistrationState("checking");
    fetch(`${apiConfig.baseUrl}/events/${id}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async response => {
      if (!response.ok) throw new Error("Could not check registration");
      return response.json();
    }).then(data => {
      if (active) setRegistrationState(data.results.length ? "joined" : "available");
    }).catch(() => {
      if (active) setRegistrationState("error");
    });
    return () => { active = false; };
  }, [id, token, isReady]);

  // Existing events without stored coordinates can still be shown on a city-level map.
  useEffect(() => {
    if (!event) return;
    if (Number.isFinite(event.latitude) && Number.isFinite(event.longitude)) {
      setMap({
        status: "ready",
        coords: { latitude: event.latitude, longitude: event.longitude },
        approximate: false,
      });
      return;
    }
    const controller = new AbortController();
    let active = true;
    setMap({ status: "loading", coords: null, approximate: true });
    lookupCity(event.location, { signal: controller.signal })
      .then((coords) => {
        if (!active) return;
        setMap({
          status: coords ? "ready" : "unavailable",
          coords,
          approximate: true,
        });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setMap({ status: "unavailable", coords: null, approximate: true });
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [event]);

  useEffect(() => {
    setCanDelete(false);
    if (!id || !token || !isReady) return;
    const controller = new AbortController();
    fetch(`${apiConfig.baseUrl}/events/${id}/permissions`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Permission lookup failed");
        return response.json();
      })
      .then((permissions) => {
        if (!controller.signal.aborted) setCanDelete(permissions.canDelete === true);
      })
      .catch(() => setCanDelete(false));
    return () => controller.abort();
  }, [id, token, isReady]);

  async function deleteEvent() {
    if (!isReady || !canDelete || !token || isDeleting) return;
    if (!window.confirm(`Delete "${event.title}" permanently? Registrations will also be deleted.`)) {
      return;
    }
    setDeleteError("");
    setIsDeleting(true);
    try {
      const response = await fetch(`${apiConfig.baseUrl}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 204) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete event");
      }
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.message || "Could not delete event");
      setIsDeleting(false);
    }
  }

  async function joinEvent() {
    if (!token || !isReady) return;
    setRegistrationError("");
    setRegistrationState("joining");
    try {
      const response = await fetch(`${apiConfig.baseUrl}/events/${id}/registrations`, {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 409) {
        setRegistrationState("joined");
      } else if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      } else {
        setRegistrationState("joined");
      }
    } catch (err) {
      setRegistrationError(err.message || "Registration failed");
      setRegistrationState("available");
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {!isReady && <div role="status" className="mb-4 rounded-xl border border-cyan-300/30 bg-slate-800 p-4 text-cyan-100">Starting demo server… The event will load automatically.</div>}
        {/* LOADING */}
        {loading && <Loader />}
        {loading && <Skeleton />}
        {/* ERROR */}
        {
          error && <NotFound />
          // (
          //   <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
          //     <p className="font-semibold">{error}</p>
          //   </div>
          // )
        }
        {/* SUCCESS */}
        {event && (
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            {/* TITLE + BUTTONS */}
            <div className="flex justify-between gap-4 mb-4 flex-col sm:flex-row sm:items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                {canDelete && (
                  <button
                    type="button"
                    onClick={deleteEvent}
                    disabled={isDeleting || !isReady}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 disabled:opacity-60"
                  >
                    {isDeleting ? "Deleting..." : "Delete event"}
                  </button>
                )}
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-xl bg-evGreen text-gray-900 font-semibold shadow-md hover:bg-evGreen-dark transition-all"
                >
                  ⬅ Back
                </button>
              </div>
            </div>

            {deleteError && (
              <p role="alert" className="mb-4 p-3 rounded bg-red-50 text-red-800">
                {deleteError}
              </p>
            )}

            {/* INFO BLOCKS */}
            <div className="bg-white rounded-xl p-4 shadow-md mb-6">
              <p className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-red-500" />
                {new Intl.DateTimeFormat("de-DE", {
                  dateStyle: "medium",
                }).format(new Date(event.date))}
              </p>

              <p className="flex items-center gap-2 text-gray-700 mt-2">
                <MapPin className="w-5 h-5 text-evGreen-dark" />
                {event.location}
              </p>
            </div>


            {/* Participant registration uses authenticated identity from backend */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <h2 className="text-gray-900 font-semibold mb-2">Join this event</h2>
              {registrationState === "signed-out" && (
                <p className="text-sm text-gray-700">
                  <Link to="/sign-in" className="text-blue-700 underline">Sign in</Link> to register.
                </p>
              )}
              {registrationState === "joined" && (
                <p className="text-sm text-green-800" role="status">You're registered for this event.</p>
              )}
              {(registrationState === "checking" || registrationState === "joining") && (
                <p className="text-sm text-gray-700" role="status">Checking registration...</p>
              )}
              {registrationState === "error" && (
                <p className="text-sm text-red-700">Could not load your registration. Please sign in again.</p>
              )}
              {registrationState === "available" && (
                <button onClick={joinEvent} disabled={!isReady} className="rounded-lg bg-blue-700 px-4 py-2 text-white font-semibold">
                  Register for this event
                </button>
              )}
              {registrationError && <p className="mt-2 text-red-700 text-sm" role="alert">{registrationError}</p>}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <h2 className="font-semibold mb-2 text-gray-800">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* MAP */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-6">
              {map.status === "ready" && map.coords ? (
                <>
                  <MapContainer
                    key={`${map.coords.latitude}-${map.coords.longitude}`}
                    center={[map.coords.latitude, map.coords.longitude]}
                    zoom={map.approximate ? 12 : 14}
                    style={{ height: "260px", width: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[map.coords.latitude, map.coords.longitude]}
                      icon={customMarker}
                    >
                      <Popup>
                        {map.approximate
                          ? `Approximate city centre for ${event.location}`
                          : event.location}
                      </Popup>
                    </Marker>
                  </MapContainer>
                  {map.approximate && (
                    <p className="bg-gray-50 px-4 py-2 text-xs text-gray-600">
                      Approximate city location, not the exact event venue.
                      {" "}Location data: Open-Meteo / GeoNames.
                    </p>
                  )}
                </>
              ) : map.status === "loading" ? (
                <div className="p-6 text-center text-gray-600 bg-gray-100" role="status">
                  Looking up the event location…
                </div>
              ) : (
                <div className="p-6 text-center text-gray-600 bg-gray-100">
                  Couldn't determine map coordinates.{" "}
                  <a
                    href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    Search on OpenStreetMap
                  </a>
                </div>
              )}
            </div>

            {/* FOOTER INFO */}
            <div className="text-sm text-gray-400">
              Created: {new Date(event.createdAt).toLocaleString("de-DE")}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
