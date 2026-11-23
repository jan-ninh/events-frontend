import { apiConfig } from "./apiConfig";
import { get } from "./utils";

const API_EVENTS_ENDPOINT = `${apiConfig.baseUrl}/events`;

const getEventById = async (id) => get(`${API_EVENTS_ENDPOINT}/${id}`);

export const EventService = { getEventById };

// Fetch up to the API's allowed 100 records for client-side sorting.
// The currently small demo dataset is fully covered; no pagination UI yet.
export const fetchEvents = async () => get(`${API_EVENTS_ENDPOINT}?limit=100`);
