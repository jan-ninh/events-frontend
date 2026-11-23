# Evendule — React frontend, integrated with Jan's Events API

This repository is **a fork of the WBS Coding School team frontend**
originally maintained by [DariaKozlova-web](https://github.com/DariaKozlova-web/events-frontend).
It retains the team history, including commits from `jan-ninh` made in December 2025.

The **new integration branch** is Jan's later AI-assisted follow-up:
[feature/own-backend-integration](https://github.com/jan-ninh/events-frontend/tree/feature/own-backend-integration).

## What is new in the integration branch?

- Local Vite proxy sends `/api` requests to Jan's own Express/SQLite backend
- Signup/login updated for new backend response contracts
- Session verification on reload via `/api/auth/profile`
- Authenticated event creation, persisted in Jan's SQLite database
- Event detail and listing display SQLite-backed records
- User can register for an event, with session-bound identity and duplicate registration protection

**Backend repository:** [jan-ninh/events-api-jan](https://github.com/jan-ninh/events-api-jan).
The backend is an independently implemented local learning project, not a copy of the WBS API. Check its project-provenance notes for attribution.

## Run locally (two terminals)

Requirements: Node.js 22.13+; Git; npm. This is a local demo, **not a public deployment**.

**Terminal 1 — Backend**

```bash
git clone -b feature/event-registration https://github.com/jan-ninh/events-api-jan.git
cd events-api-jan
npm ci
npm test
npm start
```

API: `http://127.0.0.1:3001/health`. The backend repository must be accessible to you.

**Terminal 2 — Frontend**

```bash
git clone -b feature/own-backend-integration https://github.com/jan-ninh/events-frontend.git
cd events-frontend
npm ci
npm run dev
```

Open the Vite URL printed in terminal 2 (usually `http://localhost:5173`).
The Vite proxy forwards relative `/api` calls to the locally running backend.
Do **not** set `VITE_API_BASE_URL` to the old WBS or Daria backend. An existing
`.env` file can override the default `/api` path.

## Test the full integration manually

1. Visit **Sign Up**. Enter name, email and a password of at least 12 characters.
2. On success you are signed in and returned to the home page.
3. Click **Create Event**, enter title, date and location, optionally a description.
4. You should arrive on the **Event Details** page showing the saved data.
5. Click **Register for this event**. You should see a confirmed registration.
6. Refresh the browser. Session and registration state should still be recognized.
7. Sign out and back in, and verify you can still view the event.

The API is a local portfolio prototype. Public server deployment requires further
security work (login throttling, organizer roles, session lifecycle, migrations, privacy).

## Ownership and claims

The UI originated in the WBS team project. The fork does **not** mean all UI code
was authored by Jan. The December 2025 Git commits evidence his actual team
contributions. The newer integration work and independent backend are separate
AI-assisted, user-reviewed improvements. Read the individual commits to distinguish them.

Current frontend is **React and JavaScript (JSX)**, not a TypeScript frontend.
The linked backend is **Node.js/Express and SQLite (JavaScript)**.
