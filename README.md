# Fort Leonard Wood Digital Tour — "The Engineer Post" (Demo)

A working demonstration of the self-guided digital tour platform proposed by Devis for
**RFQ1821563 — Create and Maintain FLW Tour Visualization**.

This version recreates the **"Monument"** design direction from the design handoff, on the
official **U.S. Army palette**:

- **Army Gold** `#FFCC01` — accents and primary actions
- **Army Black** `#221F20` — dark chrome, headers, primary text
- **White** `#FFFFFF` — cards and sheets

It is a mobile-first **progressive web app**: opens from a public URL or QR code, **no app
store, no account, no registration, no personal data collected**. Location is optional and
processed on the device.

## Run it

Open `index.html` in a browser (internet recommended so the map tiles and web fonts load).
Or serve the folder: `python -m http.server 8080` → `http://localhost:8080`.

Live: **https://mgutierrez913.github.io/FLWDevisDemo/**

## Walkthrough

- **Tours (landing)** — "The Engineer Post" hero, intro narration, the two tours.
- **Tour detail** — route, stop list, and the **START TOUR & ENABLE NARRATION** gesture
  (unlocks audio for the whole tour, as browsers require).
- **Map** — dark MapLibre map, gold route + numbered markers, ALL STOPS / MEMORIALS /
  MUSEUMS / PARKING filters, Map/List toggle (508 alternative), draggable bottom sheet.
- **POI detail** — narration module, transcript, gallery, nearby stops, Navigate CTA, Report an issue.
- **Search** — typo-tolerant (`brdging`, `harriso`), grouped: People (Sapper Grove index),
  Museum Exhibits, Places, Tours, with match highlighting.
- **Near Me** — distance-sorted with compass bearings; location priming screen.
- **Player** — full-screen with scrubber, ±15s, speed, and auto-scrolling transcript.
- **Driving / geofence** — "Navigate to this stop" runs a simulated drive with arrival cards.
- **View as: iOS / Android / Desktop** (demo bar) — responsive across devices.

## Files

| File | Purpose |
|---|---|
| `index.html` | Shell, fonts, device frame, view containers, overlays |
| `styles.css` | "Monument" design system on the Army palette |
| `data.js` | Tours, stops, transcripts, search indexes |
| `app.js` | Views, map, narration/player, search, Near Me, geofence + driving sim |
| `uploads/` | Four supplied Fort Leonard Wood photos |

**Tech:** vanilla HTML/CSS/JS · MapLibre GL JS (OpenStreetMap / CARTO dark tiles) ·
Bodoni Moda + Archivo + IBM Plex Mono (Google Fonts).

## Demonstration content

All history, imagery, audio, names, exhibits, and coordinates are **notional placeholders**.
Per the SOW, in production all content is provided and approved by Fort Leonard Wood. Memorial
names in the Sapper Grove index are fictional and labeled "close match"/notional. Striped
panels mark imagery not yet supplied (e.g., the 1941 archival hero).
