# Coach Kit — 60-second guide (for a coach, not a developer)

Coach Kit is the offline drill library and tactics board inside Tactical Coach. It needs no
internet after the first open, no account, no payment, and it stores everything on your phone.

## Get it on your phone

1. Save the file `coach_kit.html` (in this app: **Coach Kit → Get it on your phone → Download the app file**).
   On a computer, the same file is at `/tactical_coach_preview.html`.
2. Send that one file to each coach on **WhatsApp** (or phone-to-phone with Xender/ShareIt). It is under
   500 kB, so it costs almost no data.
3. Open the file in **Chrome** → menu → **Add to home screen**. Now it opens like an app, even in airplane mode.

## Use it on training night

| Button | What it does |
| --- | --- |
| **Age group chips** | Picks drills that fit U6–U8, U9–U11, U12–U14, U15–U17, Adult, Amputee, Blind. |
| **"I only have…"** | Filters to what is real: one ball between two, no cones, 25+ players, hot sun. |
| **Open on pitch** | Loads the drill as a live board you can drag, re-mark and animate. Nothing is locked. |
| **Say this** strip | The one sentence for this step, big enough to read while 14 kids wait. |
| **Record cue** | Records your voice for that step (~10 s). For players who learn by ear, and for a coach who cannot read a screen while managing a group. Stored on the phone only. |
| **Play / ¼× / 0.5×** | Slow motion. Repeat the run until they can see it. |
| **Present** | Fullscreen board with the laser pointer, for a wall, a classroom or a huddle. |
| **Share card** | Builds a vertical PNG of the drill with the area, the players, the cues and the "no equipment" line — straight into the WhatsApp share sheet. |
| **Copy text** | The plain-text version of the same card, for a chat bubble. |
| **I ran it / My log** | Counts sessions, minutes and players on your phone. Send the log to your academy chair, a sponsor or a course tutor as text. Nothing uploads. |

## Things worth knowing

- **Huddle size** toggle: ON = big markings and big type for a phone held in front of players.
  OFF = fine markings for a laptop or projector. It remembers your choice.
- **Language**: the interface has English, Nigerian Pidgin, Yoruba, Hausa and Igbo. The drill cues
  themselves carry an English line and a Pidgin line. *The non-English strings are v0.1 drafts and
  should be checked by native speakers before they are handed to a coach-education course.*
- **Video** is optional. The one part that needs internet is the two demo clips; your own files play
  offline. If you film players, follow your federation's rules: consent from parents, nothing in
  changing rooms, tell families that filming is part of coaching, and delete when you are done.
- **Your work is local, so protect it**: Coach Kit mirrors sessions into a second on-device store and
  will offer to restore them if browser storage is ever cleared. For a full season backup use
  **Dashboard → Backup All** and keep the JSON file somewhere safe (Drive, or a WhatsApp message to yourself).

## Handing it to a course or a league

Everything is free to copy, translate and reprint (open licence). The drill set lives in
`src/data/drills.ts` — each drill is plain data: age band, minutes, area, balls, the improvised-equipment
line, 2–3 animated steps, and the sentences to say. Adding 20 local drills is an afternoon of writing,
not an engineering project.
