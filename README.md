# Fort Leonard Wood Digital Tour — Interactive Demo

A working, clickable demonstration of the self-guided digital tour platform proposed
in Devis's Technical Volume for **RFQ1821563 — Create and Maintain FLW Tour Visualization**.

It is a **progressive web app (PWA)**: it runs in any modern browser, on phone, tablet,
or desktop, with **no download, no account, and no personal data collected** — exactly the
model described in the proposal.

---

## How to run it

**Option A — just open the file (simplest):**
1. Double-click `index.html`. It opens in your default browser.
2. An internet connection is recommended the first time so the interactive map can load
   its open-source (OpenStreetMap) tiles. Everything else works offline; if the map can't
   reach the internet it automatically offers the **List view** of all stops.

**Option B — serve it locally (most reliable, mirrors production):**
```bash
cd "07_Demo Site"
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser. (Any static file server works.)

**To demo on a phone:** serve it with Option B on your laptop, then open the laptop's
IP address (e.g. `http://192.168.x.x:8080`) on a phone on the same Wi-Fi, or use the
**iOS phone / Android** toggles in the gray demo bar to show the mobile mock-up on screen.

---

## What to click (a 3-minute walkthrough)

1. **Home** — leads with the history of Fort Leonard Wood, then the two tours. Note the
   privacy-first banner.
2. **Start a Tour → Map** — interactive map with numbered points of interest, the tour
   route line, and a stop card. Toggle **History / Engineer** to switch tours. Use
   **List view** to see the accessible, no-map alternative.
3. **View Details** on any stop — opens the point-of-interest page: Overview / History /
   Media / Directions tabs, a **Listen to Narration** player (click ▶ — it reads aloud
   using the browser), a geofence indicator, and nearby stops.
4. **Search** — try `Sapper Grove`, a memorial name, `museum`, or a deliberate typo like
   `brdging gallery`. Search is fuzzy, typo-tolerant, and runs in the browser.
5. **Near Me** — enable location (optional) and click **Simulate driving the tour** to see
   geofence prompts fire and narration auto-start as you "arrive" at each stop.
6. **Share / QR** (top-right of the demo bar) — the QR/link access path.
7. **View as: iOS phone / Android / Desktop** (demo bar) — the same app, responsive across
   devices (the SOW's mock-up requirement).

> The gray bar at the very top is **demo scaffolding only** (device switcher, QR). It is
> not part of the delivered application.

---

## How the demo maps to the SOW

| SOW requirement | Where to see it in the demo |
|---|---|
| Cross-platform, responsive; **no software download** (2.1.e.f) | iOS / Android / Desktop toggles; runs in-browser |
| History of the installation + **≥ 2 customizable tours**, one framework (2.1) | Home history section; History & Engineer tours |
| Interactive map, POIs (**NTE 100**), click for info that can be **read to the user** (2.1.b) | Map view; POI detail with narration player |
| **Up to 50 POIs per tour**, flexible content structure (2.1.e.a/b) | Structured POI content model in `data.js` |
| Specialized **search** — names at Sapper Grove, museum displays (2.1.e.c) | Search view (people index + exhibit index) |
| **Multimedia** — embedded/linked video, leadership messages (2.1.e.d) | Media tab; external-link privacy prompt |
| **Wayfinding & geofencing** on every POI, autoplay at locations (2.1.e.e) | Directions tab; Near Me geofence simulation |
| **No download / cross-platform** accessibility (2.1.e.f) | PWA; add-to-home-screen; responsive |
| **Privacy & security** — no PII, no accounts (2.1.e.h, 10.1, 14.1) | Privacy banner; no login anywhere; feedback stores nothing |
| **Mock-up for Android and iOS** (2.1.f) | View-as device toggles |
| **Available 24/7 via app/website link** (2.1.g) | Public link + QR share |
| **Accessibility** (public-facing) | List-view map alternative, narration, captions notes, 508/WCAG badge |

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell, header, bottom nav, device frame |
| `styles.css` | All styling (palette matches the Technical Volume mockups) |
| `data.js` | Tours, POIs, museum-exhibit and memorial search indexes |
| `app.js` | All interactivity: views, map, search, narration, geofencing |

**Technology:** vanilla HTML/CSS/JS + **MapLibre GL JS** (the open-source mapping library
named in the Technical Volume) rendering **OpenStreetMap** open-source tiles.

---

## Important: this is a demonstration

All historical text, imagery, audio, names, museum exhibits, memorial entries, and map
coordinates in this demo are **notional placeholders** created to show how the platform
behaves. Per the SOW, in production **all content is provided and approved by Fort Leonard
Wood**. Names shown under "Person / Memorial" are fictional and clearly labeled "(Notional)".
