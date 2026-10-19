# UED Research Form → Tactical Coach Improvement Plan

Source: `research/Untitled form.csv` (extracted from the uploaded `Ued form.csv` archive) — 16-question
Google Form for football coaches, collected 2026-09-01 → 2026-09-04.

> ⚠️ **Sample size: 2 respondents.** Treat everything below as *directional signals from real users*, not
> statistics. Both are experienced youth coaches (4–6 yrs), both called the concept "Very useful" and
> said they'd be "Very likely" to use it regularly — a strong early demand signal, but the ranking below is
> weighted by (a) how many respondents pointed at it and (b) how badly the current build misses it.
> Re-run the form at n ≥ 30 before committing to the P2 items.

---

## 1. What the data says

| Question | Responses (n=2) |
| --- | --- |
| Role | 1 Assistant coach, 1 Head Coach |
| Experience | 2× "4–6 years" |
| Age groups coached | 2× U8–U10 · 2× U11–U13 · 2× U14–U16 · 1× U17–U19 |
| How they teach tactics now | pitch demonstration · cones/markers · tactical whiteboard |
| Video use when teaching | Sometimes · Rarely |
| Visual-aid use | Sometimes · Rarely |
| Difficulty getting players to understand | 2× "Neither easy nor difficult" |
| Biggest challenges | players struggle with my explanation · different levels of understanding · hard to show player movement |
| Devices available | Smartphone · Tablet · **None** |
| Satisfaction with current tools | 2× Neutral |
| Usefulness of this kind of tool | 2× **Very useful** |
| Most wanted features | pause/freeze video · player markers · movement arrows · slow motion · create movement patterns · tactical shapes/zones |
| Where they'd use it | team tactical sessions · multiple situations |
| Biggest barrier | **lack of suitable devices** · **cost** |
| Likely to use regularly if simple + affordable | 2× **Very likely** |

### The six signals that matter

1. **They are youth coaches, not analysts.** Every respondent coaches U8–U16. The audience for the board is
   a 9-year-old in a huddle, not a performance director. Legibility and simplicity beat capability.
2. **Their problem is comprehension, not diagram-making.** The challenges are all "players don't get it /
   they get it at different levels / I can't show the movement". Nobody asked for a better drawing tool.
3. **Movement is the specific thing they can't convey** ("Difficult to show player movement") and
   **slow motion** is named as a wanted feature. Animation is the product's reason to exist over a whiteboard.
4. **Video is wanted but not a habit.** They use it "sometimes/rarely", yet "pause/freeze video" is a top pick.
   Translation: video must be *one tap* from the tactical board, never a required workflow step.
5. **Real-world constraints: weak devices, no device at all, no money, patchy signal.** "Lack of suitable
   devices" and "Cost" are the only two barriers given. Offline, free, tiny, installable, printable.
6. **Pain is mild ("Neither easy nor difficult", satisfaction "Neutral")** → they will not tolerate a slow or
   fiddly tool. The competitor is a pen and a whiteboard that's already in the changing room. Speed is the feature.

---

## 2. Ranked improvement backlog

Effort: XS < S < M < L. File references are the current build.

### P0 — close the gaps the data exposes directly

**#1 Fully offline app (currently broken) — XS**
- **Evidence:** barriers = "lack of suitable devices"/"cost"; usage = smartphone/tablet on the pitch.
- **Code reality:** `index.html` (lines 15–17) and the generated `tactical_coach_preview.html` still load
  Inter/Outfit/JetBrains Mono from `fonts.googleapis.com` / `fonts.gstatic.com`. The "offline single-file app"
  therefore blocks on a CDN request that will stall or fail at a training ground.
- **Do:** drop the CDN `<link>`s; use the local system font stack in `tailwind.config.js` (`fontFamily.sans`)
  or self-host subset `.woff2` in `public/fonts/` and inline them in `bundle-single-file.cjs`.
- **Also:** put the free/offline/no-account promise on the dashboard ("Works offline · No account · No cost")
  to defuse the cost barrier outright — no paywalls, no upsell screens.

**#2 Age-group as a first-class setting — M**
- **Evidence:** 100% youth coaches spanning four age bands.
- **Code reality:** `Session` (`src/types/tactics.ts`) has `format`, `phase`, `category` — no age band.
  `markingSize` is local state in `TacticalWorkspace.tsx:62` (`useState<MarkingSize>('small')`) and is **never
  persisted**, so every coach every session silently restarts at `small` — the worst default for a U8 group.
- **Do:** add `ageGroup: 'U8-U10' | 'U11-U13' | 'U14-U16' | 'U17-U19' | 'Senior'` to `Session`; pick it in the
  Dashboard quick-start. It sets defaults only — nothing locks the coach out:
  | Age band | Format | Pitch | Marking size | Cue style |
  | --- | --- | --- | --- | --- |
  | U8–U10 | 5v5 / 7v7 | half / small-sided | **large** | ≤4-word cues |
  | U11–U13 | 7v7 / 9v9 | three-quarter | **medium** | short cues + 1 label per step |
  | U14–U19 | 9v9 / 11v11 | full | **small** | full coaching points |
- Persist `markingSize` on the session; keep per-annotation `size` override as-is.

**#3 Real slow motion — XS**
- **Evidence:** "Slow motion" requested outright; "difficult to show player movement".
- **Code reality:** `AnimationTimeline.tsx:196` offers only `[0.5, 1, 1.5]`. 0.5× is not slow motion.
- **Do:** `[0.1, 0.25, 0.5, 1, 1.5, 2]`, and a one-tap **"Slow-mo replay"** button that replays the current
  step once at 0.25×. Do not touch the interpolation engine — it already takes a speed multiplier.

**#4 Make "show the movement" the headline action — M**
- **Evidence:** all three challenge answers point at comprehension and movement.
- **Do:**
  - **Whole-path ghost overlay:** while animating, draw every step's arrows faintly at once so players see the
    sequence's shape, not just the current frame (render from existing `step.annotations`, non-interactive).
  - **Repeat/echo count** on play (1× / 2× / 3×) — coaches repeat, they don't scrub.
  - Auto-replay on entering presentation mode, so the tactic is moving before the coach speaks.
  - Step chips show a tiny thumbnail of the shape, so "step 3 of 4" is legible at a glance.

**#5 Freeze video → draw on the still — M/L**
- **Evidence:** "Pause/freeze video" was the first feature listed; today freeze only *stops* the clip.
- **Code reality:** `VideoWorkspacePanel.tsx` has object-URL playback, `playbackRate`, bookmarks and frame step
  — no `canvas` capture, no way to mark up a frame, and nothing links a still back to the board.
- **Do:** add **"Freeze & Draw"**: `video` → offscreen `canvas.drawImage` → data-URL set as a background
  layer of the pitch (`pitchConfig.backgroundImage` + opacity) or as a per-step still. Existing drawing tools
  then work on top of it, and the annotated still is saved into the current `KeyframeStep` so it survives in
  presentation and export. Zero changes to the animation/save engines; one new optional layer.

### P1 — high value, next loop

**#6 Tactical shapes & zone presets — M.** R2's only requested feature. Today there is nothing beyond free-drawn
`zone-rect` / `zone-circle` (`src/types/tactics.ts:66-67`). Add one-tap: **Defensive block** (convex-hull
polygon auto-generated from a team's current positions), **Pressing trap** (sideline + trigger zone),
**Half-spaces / wide channels**, **Offside line**, **Compact vs. stretched shape**, and **"Shape from players"**
so the polygon follows players during animation. Reuse `generateVisionCone`-style geometry in `pitchGeometry.ts`.

**#7 Reusable movement patterns — M.** "Create movement patterns" was requested; steps exist but die with the
session. Add **"Save as pattern"** (captures the step sequence, relative to formation) and a Patterns section on
the Dashboard to drop a pattern into any session. Store in the same `localStorage` store, keyed separately.

**#8 Presentation legibility — S/M.** The coaching panel in `PresentationMode.tsx:157-166` is `text-xs` in a
bottom-right card — unreadable 5 m away in a changing room, which is exactly where it's used. Add a **cue card
mode**: current step's cue rendered large over the pitch (bottom banner, `text-2xl`→`text-4xl`, scaled by
marking size), with an audience control **Phone / Wall / Huddle** that sets text + marking scale together.
Keep the slide-out notes for the coach's own eyes.

**#9 Print / one-page handout — S.** The strongest answer to "no suitable device" and "cost": a printable
session card (title, format, objectives, N step thumbnails, coaching points) via a print stylesheet or a
multi-page PNG stitched from the existing `exportPitchAsPng` (`src/utils/exportImage.ts`). Paper in a kitbag
needs no battery, no signal, no licence.

**#10 Installable + first-run friendly — S/M.** No onboarding/empty-state guidance exists in `src/components`
(grep: none). Add a web app manifest + minimal service worker (app-shell cache) for "Add to Home Screen", a
30-second "See an example" demo that loads `session-high-press-11v11` and plays it, and one contextual next-step
hint per workflow stage (Set Up → Add Movements → Animate → Present). Both respondents are only *occasional*
visual-aid users: if minute one isn't obvious, they go back to cones.

### P2 — validate first (needs n ≥ 30)

- **Voice cues per step** (browser `MediaRecorder`, stored as blobs in IndexedDB): for coaches whose method is
  *explaining*, and for players who read differently — speaks to "different levels of understanding".
- **Outdoor/glove mode:** sun-cut high-contrast theme, larger hit targets (player touch radius already
  expanded in `PlayerMarker.tsx`), long-press confirm to avoid mis-taps in wind/cold.
- **Mirror-to-other-side / clone markings to opponent** for two-team briefings.
- **Day plan:** group several sessions into one training-day or matchday plan ("multiple situations").
- **Research v2 questions to add:** squad size; would you present *to* players or prep *alone*; typical network
  conditions; willingness to pay (since cost is a named barrier); readability level of players; do coaches share
  one device around a huddle.

---

## 3. What the data says *not* to build

- **No paywall, trial, or upsell** — "Cost" is one of only two named barriers, and "if it were simple and
  affordable" was the condition for "very likely". Keep the current free/offline posture loud and proud.
- **Don't make video a prerequisite** — video use is "sometimes/rarely". The board must deliver full value with
  zero footage, and the video panel stays optional (as now).
- **Don't chase analysis/statistics features** — nobody asked for data; both asked for *showing*. Keep the MVP
  boundary: no AI analysis, no auto-detection, no stats dashboards.
- **Don't add more drawing tools before fixing legibility and speed** — the pain is comprehension, not tooling.

---

## 4. Suggested ordering for the next session

1. #1 offline fonts (bug fix, 20 min) → #3 slow motion (15 min) → #8 presentation cue card
2. #2 age-group defaults + persisted marking size
3. #6 shape/zone presets → #4 movement-visibility set
4. #9 print handout → #10 install/first-run
5. #5 freeze & draw (biggest lift, biggest differentiation) → #7 patterns
