# 6 Stretches

A guided timer for a short daily flexibility routine. It walks you through six stretches with a countdown ring, voice cues and beeps, so you can follow along without looking at your phone.

**Live app:** [tomheadifen.github.io/stretch-timer](https://tomheadifen.github.io/stretch-timer/)

The routine is based on [“Literally 5 Stretches is all you Need”](https://www.youtube.com/watch?v=QaKuVOhikaY) by MovementbyDavid, with wall angels added as a sixth.

## The routine

About 10½ minutes in total. Every stretch starts with 10 seconds to get into position, and holds are 30 seconds.

| # | Stretch | Targets | Format |
|---|---------|---------|--------|
| 1 | Pancake | Hamstrings, inner thighs | 2 sets, 15 s rest between |
| 2 | Figure Four | Glutes, outer hip | 2 sets each side, alternating |
| 3 | Hip Flexor | Front of hip, quads | 2 sets each side, alternating |
| 4 | Chest | Pecs, front shoulder | 2 sets each side, alternating |
| 5 | Lat | Side of back, shoulders | 2 sets, 15 s rest between |
| 6 | Wall Angels | Upper back, shoulders | 10 slow reps (~6 s each) |

There's no rest when alternating sides, since the other side is resting.

## Features

- **Guided player:** countdown ring, stick-figure diagram, form cues and a "next up" line for each step.
- **Sound and voice:** spoken cues ("Switch sides", "Rest"), a beep at each change and on the last three seconds, and vibration on Android. Can be muted.
- **Controls:** pause/resume (or Space bar), skip, and back (restarts the current step, or goes to the previous one if pressed within 2.5 s).
- **Screen stays on** during the routine where the browser supports it.
- **Light and dark themes**, remembered between visits.
- **Installable and offline:** add it to your home screen and it works without a connection.
- **Update prompt:** when a new version is published, it downloads in the background and a banner offers **Update**. The banner waits until you're not mid-routine.

## Install on your phone

Open the live app and tap **Download app**.

- **Android (Chrome):** the browser's install prompt appears. If not, use the menu (⋮) → **Install app** or **Add to Home screen**.
- **iPhone (Safari):** tap Share → **Add to Home Screen** → **Add**.

## How it's built

A single static page with no build step or dependencies.

| File | What it does |
|------|--------------|
| `index.html` | The whole app: markup, styles, stretch data and timer logic |
| `sw.js` | Service worker: offline use and the update prompt (serves the saved copy of each version) |
| `manifest.webmanifest` | Name, colours and icons for installing to the home screen |
| `icons/` | App icons and favicon |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

Settings (sound, theme) are kept in the browser's `localStorage`. Nothing is sent anywhere.

### Run locally

The service worker needs a web server rather than opening the file directly:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Change the routine

Everything is in the `<script>` near the bottom of `index.html`:

- **Timings:** `HOLD`, `REST`, `READY` and `REP_SECS` (in seconds).
- **Stretches:** the `EX` array. Each entry has a `name`, `target`, `cues`, a `fig` (key into the `FIG` diagrams) and a `mode`:
  - `sets`: two holds with a rest between
  - `sides`: left/right alternating, two sets each
  - `reps`: a timed block of `reps` repetitions

The total time and step sequence update automatically.

### Deploy

Pushing to the default branch publishes it through GitHub Pages.

**Every release, bump `VERSION` in `sw.js`** (e.g. `v3` → `v4`). The app runs from its saved copy, so this is what tells installed copies there's something new:

1. You push with a new `VERSION`.
2. Next time someone opens the app (or brings it back to the foreground), it downloads the new files in the background.
3. A "A new version is ready" banner appears with **Update**. Tapping it reloads into the new version; dismissing it keeps the current one until the next launch.

If you push without bumping `VERSION`, installed copies keep running the old files. If you add a new file the app needs, also add it to the `SHELL` list in `sw.js`.
