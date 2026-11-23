import test from "node:test";
import assert from "node:assert/strict";
import { sortEvents, sortChoices } from "../src/utils/sortEvents.js";

const events = [
  { id: 1, startsAt: "2027-01-10T18:00:00Z", createdAt: "2026-11-21T15:00:00Z" },
  { id: 2, startsAt: "2026-12-01T18:00:00Z", createdAt: "2026-11-23T10:00:00Z" },
  { id: 3, startsAt: "2026-12-18T18:00:00Z", createdAt: "2026-11-22T10:00:00Z" },
];
const ids = (rows) => rows.map((row) => row.id);

test("sort by event date ascending and descending", () => {
  assert.deepEqual(ids(sortEvents(events, "event-asc")), [2, 3, 1]);
  assert.deepEqual(ids(sortEvents(events, "event-desc")), [1, 3, 2]);
});

test("sort by creation timestamp descending and ascending", () => {
  assert.deepEqual(ids(sortEvents(events, "created-desc")), [2, 3, 1]);
  assert.deepEqual(ids(sortEvents(events, "created-asc")), [1, 3, 2]);
});

test("default sort highlights recent additions; never mutates source", () => {
  const untouched = structuredClone(events);
  assert.deepEqual(ids(sortEvents(events)), [2, 3, 1]);
  assert.deepEqual(events, untouched);
  assert.equal(sortChoices.length, 4);
});

test("missing dates sort last; identical timestamps are stable by ID", () => {
  const sample = [
    { id: 2, createdAt: "2026-11-22T00:00:00Z" },
    { id: 4 },
    { id: 1, createdAt: "2026-11-22T00:00:00Z" },
  ];
  assert.deepEqual(ids(sortEvents(sample, "created-desc")), [2, 1, 4]);
  assert.deepEqual(ids(sortEvents(sample, "created-asc")), [1, 2, 4]);
});

test("unknown sort falls back and empty input is handled", () => {
  assert.deepEqual(ids(sortEvents(events, "unknown")), [2, 3, 1]);
  assert.deepEqual(sortEvents(null), []);
});
