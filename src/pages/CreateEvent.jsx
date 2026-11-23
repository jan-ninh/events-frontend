import { useState } from "react";
import { useNavigate } from "react-router";
import { apiConfig } from "../api/apiConfig";
import { useAuth } from "../context/useAuth";
import { useBackendStatus } from "../context/useBackendStatus";
import { coverOptions, eventCoverUrl } from "../data/eventCovers";

const today = () => {
  const date = new Date();
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 10);
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isReady } = useBackendStatus();
  const [form, setForm] = useState({
    title: "", description: "", date: today(), location: "", imageTheme: "auto",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!isReady) { setError("The demo server is starting. Try again shortly."); return; }
    setError("");
    setPending(true);
    try {
      // Local wall-clock date becomes a UTC ISO timestamp at 18:00.
      const startsAt = new Date(`${form.date}T18:00:00`).toISOString();
      if (startsAt === "Invalid Date") throw new Error("Invalid date");
      const response = await fetch(`${apiConfig.baseUrl}/events`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          description: form.description,
          imageTheme: form.imageTheme,
          startsAt,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not create event");
      navigate(`/events/${data.id}`);
    } catch (err) {
      setError(err.message || "Could not create event");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-5 py-12">
      <form onSubmit={submit} className="bg-white rounded-xl shadow p-8 space-y-5">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Event</h1>
        <p className="text-sm text-gray-600">Bring people together with a new event.</p>
        {!isReady && <p role="status" className="p-3 bg-blue-50 text-blue-800 rounded">Starting demo server… Event creation will be available shortly.</p>}
        {error && <p role="alert" className="p-3 bg-red-50 text-red-700 rounded">{error}</p>}
        <label className="block text-gray-900 text-sm font-semibold">
          Title
          <input required minLength={3} maxLength={255} value={form.title}
            onChange={e=>setForm(x=>({...x,title:e.target.value}))}
            className="mt-2 block w-full p-3 rounded border border-gray-300" />
        </label>
        <label className="block text-gray-900 text-sm font-semibold">
          Date (event starts at 18:00 local time)
          <input required type="date" value={form.date}
            onChange={e=>setForm(x=>({...x,date:e.target.value}))}
            className="mt-2 block w-full p-3 rounded border border-gray-300" />
        </label>
        <label className="block text-gray-900 text-sm font-semibold">
          Location
          <input required minLength={2} value={form.location}
            onChange={e=>setForm(x=>({...x,location:e.target.value}))}
            className="mt-2 block w-full p-3 rounded border border-gray-300" />
        </label>
        <label className="block text-gray-900 text-sm font-semibold">
          Event cover
          <select
            value={form.imageTheme}
            onChange={e => setForm(x => ({ ...x, imageTheme: e.target.value }))}
            className="mt-2 block w-full p-3 rounded border border-gray-300 bg-white"
          >
            {coverOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <div className="rounded-xl overflow-hidden bg-gray-100 h-32">
          <img
            src={eventCoverUrl(form.imageTheme === "auto" ? "community" : form.imageTheme)}
            className="w-full h-full object-cover"
            alt="Selected event cover preview"
          />
        </div>
        <label className="block text-gray-900 text-sm font-semibold">
          Description
          <textarea rows={4} maxLength={5000} value={form.description}
            onChange={e=>setForm(x=>({...x,description:e.target.value}))}
            className="mt-2 block w-full p-3 rounded border border-gray-300" />
        </label>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={()=>navigate(-1)} className="py-3 px-4 rounded border border-gray-300 text-gray-800">Cancel</button>
          <button type="submit" disabled={pending || !isReady} className="py-3 px-5 rounded bg-blue-700 text-white disabled:opacity-50">
            {pending ? "Saving..." : "Create event"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateEvent;
