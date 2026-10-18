# Calendar Mark — Calendar Event Manager

A responsive single-page calendar application built with **Next.js App Router, React, TypeScript, Zustand, date-fns, Jest, and React Testing Library**. It supports month/week views and creating, editing, deleting, searching, and filtering events.

## Requirements

- Node.js 20 or newer (recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Tests and production build

```bash
npm test
npm run test:coverage
npm run typecheck
npm run build
```

Jest runs in jsdom. Tests cover validation, create/update/delete state operations, unknown IDs, and form validation/submission.

## Expected dataset format

`src/data/events.json` follows the assessment's event shape:

```json
[
  {
    "id": "evt-001",
    "type": "meeting",
    "name": "Weekly safety briefing",
    "startDate": "2026-06-22T09:00:00",
    "endDate": "2026-06-22T09:30:00"
  }
]
```

The four sample entries currently in that file match the provided example. The app reads `name`, `type`, `startDate`, and `endDate` directly. Datetimes are treated as local time; no timezone suffix is expected.

## Usage

- Switch between **Month** and **Week** views.
- Use previous/next controls or **Today** to navigate.
- Select a day or choose **New event** to create an event.
- Select an event to edit it or delete it.
- Search by event name or type and filter by event type.

## Assumptions and decisions

- The JSON schema provided for the assessment is the source of truth: `id`, `type`, `name`, `startDate`, and `endDate`.
- `startDate` and `endDate` are local ISO datetime strings such as `2026-06-22T09:00:00`.
- The create/edit form currently creates events within a single calendar day. Validation supports ordered start/end datetimes, but the visual calendar places an event on its start date only.
- State is held in Zustand in memory. Changes are not persisted after a browser refresh.
- The interactive calendar is a client component under the Next.js App Router because it uses client-side state and browser interactions.

## Known limitations and future improvements

- Add persistent storage (for example, local storage or a backend API).
- Add richer multi-day event rendering, recurring events, drag-and-drop, and reminders.
- Add broader end-to-end tests and an accessibility review.
- Add explicit timezone handling if the product requirements need it.

## Project structure

```text
app/                    # Next.js App Router page and layout
src/
  components/            # Calendar grid and event modal
  data/events.json       # Assessment-shaped sample dataset
  lib/                   # Validation and tests
  store/                 # Zustand store and tests
  styles.css             # Responsive styling
  App.tsx                # Interactive calendar application
  types.ts               # Dataset types
jest.config.ts           # Jest configuration using next/jest
jest.setup.ts            # Testing Library matchers
README.md
```
