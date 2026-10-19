# Impact-first pivot: from "Tactical Coach" to a Nigerian grassroots coach-kit

Question asked: *"Is there another product we can build alternatively from this one?"* — then constrained to:
**impact first, money out of the picture, and the builder is in Nigeria.**

Everything below assumes the existing engine (SVG pitch, drag players, keyframe animation, marking tools,
presentation mode, single-file offline bundle) is the *asset*. The pivot is about **who it is for and how it
travels**, not about new tech.

---

## 1. The actual problem in Nigerian grassroots (with receipts)

**The bottleneck is coaching knowledge, not tools or facilities or data.**

- Nigeria's National Institute for Sports DG: **"over 40,000 coaches in Nigeria are not certified"**
  ([Sports247, Sept 2026](https://www.sports247.ng/nff-launches-caf-a-license-coaching-course-after-a-nine-year-hiatus/)).
- Historically Nigeria had graded **~400 CAF C-license coaches (2015)** vs Ghana's 2,000+ and Egypt's 8,000+
  ([ResearchGate, Nigerian football micro-level practices](https://www.researchgate.net/publication/382109778_Nigerian_football_micro_level_practices_article_2024)).
- Analysts: "many talented players still rely mainly on **informal grassroots systems with limited professional
  guidance**" ([NAN News](https://nannews.ng/nigerian-football-transforming-individual-brilliance-into-national-success/)).
- The NFF president says it plainly: "**We need to educate our grassroots coaches.** That is the way to go for
  holistic development of the game"
  ([The Sun](https://thesun.ng/nff-pledges-wider-access-to-caf-coaching-courses-across-nigeria/)).
- Coach education runs through **small, recurring, state-FA cohorts**: ~40 coaches on a week-long CAF D-License
  ([Delta State](https://guardian.ng/sport/football/delta-trains-40-grassroots-coaches-in-caf-d-licence-course/),
  [Osun State](https://sportsration.com/osun-fa-to-host-nff-caf-d-licence-coaching-course)); the CAF A-License
  came back after **nine years for 25 places**
  ([Voice of Nigeria](https://von.gov.ng/nigeria-resumes-caf-a-license-coaching-course-after-nine-years/)).
- Course entry criteria themselves exclude people on device and literacy grounds: candidates must **"be able to
  read and write in English"** and have **"access to a laptop/tablet for the duration of the programme"**
  ([NFF course requirements](https://von.gov.ng/nff-finalises-plans-for-caf-license-coaching-courses/)).
- Academies are being told to professionalise or lose recognition: **"any academy that failed to comply with its
  standards would not be acknowledged"**
  ([Daily Trust](https://dailytrust.com/inside-nigerias-football-academies-where-stars-are-born/)). Meanwhile a
  real one — Pepsi Football Academy — runs **3,000+ students, 14 centres, 54 coaches**
  ([Wikipedia](https://en.wikipedia.org/wiki/Pepsi_Football_Academy)). That is the shape of the customer:
  many young coaches, many sites, one curriculum to hold together.

**And the hardware reality is a device problem, not a data problem** (this reverses a lazy assumption):

| Reality | Number | Source |
| --- | --- | --- |
| Data is *cheap* in Nigeria | ~**$0.38/GB**, among the most affordable in Africa | [Broadcast Media Africa (ITU/GSMA)](https://broadcastmediaafrica.com/2025-01-16/nigeria-offers-most-affordable-mobile-data-in-africa-report/) |
| The phone is the wall | entry-level smartphone ≈ **44% of avg monthly income**, **76%** for the poorest quintile in SSA | [GSMA via TechNode Africa](https://technext24.com/news/140-m-nigerians-not-using-mobile-internet-gsma/) |
| It is getting worse | a $100 phone ≈ **₦135k vs a ₦70k minimum wage**; sub-$100 shipments **−34%**; smartphone shipments **−11%** in Q2 2026; >4 in 5 phones sold in Nigeria are under $200 | [WeTracker](https://weetracker.com/2026-08-24/feature-phone-surge-nigeria-device-financing-crisis/) |
| 140m Nigerians don't use mobile internet despite coverage | — | [GSMA report](https://technext24.com/news/140-m-nigerians-not-using-mobile-internet-gsma/) |
| Platform | **Android 88%**; **WhatsApp on 95%** of smartphones; **Xender (offline file transfer) 77%**; TikTok 70% | [KPMG/Orange study via ThisDay](https://www.thisdaylive.com/2026-09-27/kpmg-report-nigeria-rapidly-becoming-a-mobile-first-economy/), [TechNode](https://technext24.com/news/whatsapp-is-installed-on-95-of-nigerian-smartphones-study-finds/) |

**Design consequences, stated bluntly:** the product must be one small file that a coach receives **in WhatsApp**,
opens in Chrome, needs no account, no server, no download after that, and works on a ₦100k Tecno with a cracked
screen in a huddle of 12 kids. The unit of sharing is an **image or 20-second clip into a WhatsApp group**, and
**Xender-style phone-to-phone transfer** is a legitimate distribution channel, not a hack. Print is weak here
(photocopy cost, few printers); voice notes beat text because of the literacy gate above.

---

## 2. Three products you can build from this one — ranked by impact per engineering hour

### Option A (recommended): **Coach Kit — the offline practical teaching kit for D/C-license coach education**
*For: state FA courses, tutor–coach educators, and the 40 graduates who leave with a licence and no support.*

- **Why this is the highest-leverage object:** distribution already exists. The course *is* the funnel — 40
  coaches at once, already motivated, already gathered, sponsored by someone, repeated in 37 states. One kit
  handed out at one course reaches 40 × ~30 kids ≈ **1,200 children per cohort** (arithmetic, not a promise).
  Compare: a consumer app needs 1,200 individual installs.
- **What it is, concretely:** the current app re-skinned around three surfaces —
  1. **Drill library** (offline, age band × theme × space × equipment-availability) with animated demo + big cues.
  2. **"My session"** — the existing workspace, repurposed as the *course assignment* (learners must build and
     defend a session plan; that is already how CAF D courses assess practical planning).
  3. **Tutor mode** — an offline rubric sheet on the phone, marks a learner's saved session, exports the marks as
     a text/PDF summary. Nobody needs a laptop for this to work.
- **Why it fits Nigeria specifically:** it removes the two documented exclusion gates (English literacy →
  **audio cues + picture-first UI**; laptop/tablet → **345 KB single-file app on the phone they already have**).
- **Delta from current code (all cheap, no engine risk):** inline the fonts (we still call Google Fonts — that
  alone disqualifies it at a pitch with no signal); manifest/"Add to home screen"; per-step **voice note**
  (WhatsApp-style, ~50–80 KB/min); **vertical drill-card export + native Web Share** into WhatsApp/Status;
  default marking size **large** (huddle-legible, not whiteboard-legible); locale for en-NG, **Pidgin**, Hausa,
  Yoruba, Igbo; equipment reality toggles (cones → stones/bottles/backpacks as markers; sand/court/concrete
  surface contrast).
- **Honest hard part:** it is *content*, not code. 60–120 drills written in plain language, validated by a
  Nigerian coach educator, licensed openly. That is the work, and it is why an app team alone can't do it — a
  single partnership with one coach educator or one FA technical director makes it real.

### Option B: **Academy Kit — curriculum + records for multi-centre academies**
*For: academies like Pepsi (3,000 students, 14 centres, 54 coaches), and the new Nigeria Football Academies
Championship ecosystem whose Super League started in 2026
([OLT Sports](https://oltsport.com/what-now-for-nigeria-africa-caught-super-falcons/)).*

- **The job:** keep 54 mostly young coaches delivering a *consistent* session, and **produce the evidence** the
  NFF now demands for academy recognition. Records are not admin trivia in that context — they are compliance.
- **Build delta:** age-stage progression map (what U9 learns vs U15), "today's class" per coach, offline
  attendance roll, monthly academy report generated locally as text/CSV to send to owners/sponsors/parents,
  WhatsApp parent recap card ("today we worked on 1v1 defending — ask your child to show you"). Retention of
  paying families is the academy's oxygen, so the recap is the feature that makes them care.
- **Why it's option B not A:** needs a partnership per academy and a bit of admin surface — more months, fewer
  kids reached per unit of effort. But per academy it's thousands of kids, every week, forever.

### Option C: **Aim the same kit at the two most under-served programmes in the country**

**Girls' football.** The Super Falcons missed a Women's World Cup for the first time since 1991 and the entire
coaching staff was sacked after a first-ever WAFCON quarter-final exit
([Xinhua](https://english.news.cn/africa/20260818/fdfe41781b264b9a8ca03d4c992cae7b/c.html)); the public response
is explicitly "rebuild from grassroots with **quality coaching**, facilities, regular competition and pathways"
([Premium Times](https://www.premiumtimesng.com/sports/football/904631-nigeria-must-return-to-grassroots-to-rebuild-womens-football-omidiran.html)).
The FIFA Talent Development Scheme for Girls (launched Dec 2025) already says the quiet part: "a technically
talented girl, identified at 13, is only served by a system with **qualified coaches** to develop her at 14, 15
and 16… the investment in coach education is as important as any pitch or boot sponsorship"
([Sporting Tribune](https://sportingtribune.com/how-grassroots-academies-are-shaping-future-of-womens-football-in-nigeria/)).
→ Impact case: build **girls'/women's edition content** (school teams, NWFL-club feeder sides, female coach
mentors) and hand it to the people already funding this exact gap.

**Disability & amputee football.** The Nigeria Amputee Football Federation's stated mission is to "build
sustainable **grassroots academies across all 36 Nigerian states and the FCT**", providing "ergonomic crutches,
**technical coaching**, and tournament circuits" ([NAFF](https://www.naff.com.ng/)). The game is **7-a-side** with
crutch-using outfield players and one-armed goalkeepers
([Pravda Nigeria](https://nigeria.news-pravda.com/nigeria/2026-09-23/8346.html)); Nigeria finished 4th at the
2024 African Amputee AFCON ([Wikipedia](https://en.wikipedia.org/wiki/2024_African_Amputee_Football_Cup_of_Nations)).
→ Impact case: our engine already does 7v7 and custom pitch dimensions; a **modified-games kit for amputee and
blind football** (small-sided, sound-ball 5v5, zone-based rather than line-based) is a day of geometry and a
lifetime of "nobody else has this for them". Federation-level partners say yes fast here, because there is no
incumbent at all.

**My pick:** build **A** as the product, ship it into one real D-license course, and author its content with
Option C as the *first* content pack (girls' football, then amputee). That way you get both reach and depth.

---

## 3. What this reverses from the UK-framed analysis last turn

Be explicit, because these were reasoned from UK evidence:

| Earlier advice | Nigeria verdict |
| --- | --- |
| "Print / one-page handout is a core surface" | **Demote.** Photocopying costs money and printers are rare; the local channel is a WhatsApp image. Keep "Save as PDF" as a fallback for tutor submission only. |
| "Offline because data is expensive" | **Still offline, but for the right reason:** data is cheap (~$0.38/GB); **devices and income are the wall**, plus 140m people who have coverage but don't use mobile internet. Offline is an equity feature, not a cost-saving one. |
| "Freeze-frame video → draw on the still" | **Defer.** Footage is not the constraint in Nigeria — structured coaching is. Clip storage also hurts on 32 GB phones. Keep the code path, drop the roadmap priority. |
| "Markings should be small and subtle" | **Invert the default for this use.** The screen is a phone held in a huddle of kids, not a projector: **large markings + huge cues** are the correct default in Coach Kit, small only for the coach's own laptop prep. |
| "Sell a club licence / bulk seats" | **Drop.** With impact as the objective: **open licence (CC BY-NC)**, so any FA, academy or NGO can copy, translate and reprint it without asking. Enclosing the content would defeat the point. |
| Presentation mode, animation, slow-mo, age bands, no-account, local-first | **Keep — now more central.** Motion and pictures are the parts that don't need fluent English, which is exactly the exclusion we're trying to remove. |

---

## 4. Distribution is the product (9-day window worth noting)

- A **CAF D-License course begins 28 October 2026 at Lanreleke Sports Academy, Osun State** — 40 screened
  grassroots coaches ([source](https://sportsration.com/osun-fa-to-host-nff-caf-d-licence-coaching-course)).
  That is roughly a week from today, and reachable from Lagos. If a working v0.1 exists by then, the test is
  concrete: ask the FA technical lead if you may hand 40 coaches an offline kit on their own phones, then ask
  them what broke.
- Fallbacks in the same spirit: a Lagos State FA / LSFA-linked programme
  ([example of LSFA partnering on a 100-girl, 20-academy programme](https://theeagleonline.com.ng/untold-reality-of-grassroots-female-football-in-lagos/)),
  one academy's coach meeting (Pepsi-scale academies exist and run weekly staff briefings), a university
  sports-science or NIS cohort, or a church/community league.
- **The install path must be a WhatsApp message:** file + 3-line instructions in plain English and Pidgin.
  No Play Store review, no account, no QR that dies after the weekend. Put a "Forward this to another coach"
  button *inside* the app — it makes copying the app as easy as copying a drill, which is the entire growth
  mechanism in a market with no marketing budget.

---

## 5. Impact measurement without a server

Keep zero analytics. Generate locally, coach sends it if they want to:
1. **Coach log:** sessions run, players present, minutes, themes coached — one screen, exportable as text. This
   doubles as the artefact an academy needs for NFF standards, and the evidence a course tutor marks.
2. **Course-level report** (for tutors/FAs): number of learners submitting a session plan, mean rubric score,
   most-used drills. Aggregate file, no personal data, nothing uploaded.
3. **Two outcome questions in-app after 4 weeks** (1-tap): "Did players understand the movement better than a
   chalkboard?" and "How many sessions did you actually run?" — that's enough to know whether we're fooling
   ourselves.

Kill criteria (say them before you build): if 40 coached-at-a-course coaches can't install and open it unaided
in 10 minutes, or fewer than half run a session from it within 3 weeks, the pivot is wrong and the answer is
**paper + a coach educator**, not software.

---

## 6. One paragraph, if you want the argument in a WhatsApp message to a partner

Nigeria has 40,000+ uncertified football coaches, coach education happens in 40-person state courses, and the
course entry rules themselves require English literacy and a laptop. So the highest-impact thing this codebase
can become is not a tactics board for individual coaches — it is a **free, offline, phone-only coaching kit**:
animated drills with voice cues in plain English and Pidgin, a session planner a learner can submit on the phone
in their pocket, and a drill card that travels by WhatsApp and Xender because there is no account, no server and
nothing to pay. First content pack: girls' grassroots and amputee football, the two programmes where the
national need is loudest and the tooling is empty.

---

## Shipped — Coach Kit v0.1 (2026-10-19)

Built from the existing engine; nothing in the tactical engine, animation, save format or
presentation flow was removed.

| From this plan | In the build |
| --- | --- |
| #1 zero-network | Google Fonts links gone from `index.html`, `tailwind.config.js` (system stack) and the single-file bundle. Built JS makes **no third-party request at all**; the only remaining external URL is the two optional demo clips in the video panel, now labelled as needing internet. |
| #2 age band + persisted marking size | `Session.ageGroup`, `Session.markingSize`, `Session.drillId`, `Session.kitMeta` added as optional fields; every drill carries its band and opens huddle-sized. |
| #3 slow motion | Speed row is now `¼× · 0.5× · 1× · 1.5× · 2×`. |
| #6 shapes/zones | Drills ship with zones and label callouts; the workspace marking tools are unchanged so a coach can draw their own. |
| #9 print → **WhatsApp instead** | `src/utils/exportCard.ts` renders a 1080×1350 drill card on a canvas (no SVG serialisation) and shares it through the Web Share sheet, saving the PNG if sharing is unavailable. Plus `drillToText()` for a chat bubble. |
| #10 install + first-run | `public/manifest.webmanifest`, network-first `public/sw.js` (so an online coach never gets stuck on a stale build), install prompt in the Kit, and a `HOW-TO-INSTALL.txt` / `README-COACH-KIT.md` written for a coach rather than a developer. |
| Voice cues (was P2, promoted for the literacy gate) | `src/utils/voiceNotes.ts`: MediaRecorder → IndexedDB, ~45 s cap, memory fallback when IDB is blocked (file:// origin). A recordable cue strip sits under the toolbar in the workspace. |
| Impact measurement, no server | `src/utils/coachLog.ts`: sessions / minutes / player attendances / most-used drills, shareable as text, all local. |
| Season-loss insurance | `src/utils/sessionMirror.ts`: every save mirrors into IndexedDB; on boot, if local storage lost sessions (or holds fewer) the app offers to restore them. |
| Localisation | `src/i18n/kit.ts`: en / **pcm (Nigerian Pidgin)** / yo / ha / ig for the Kit surface. Draft translations, flagged for native-speaker review. |
| Content | `src/data/drills.ts`: **20 drills** authored for Nigerian grassroots realities — improvised equipment (bottles, stones, bags), one ball per two players, 30-kid groups, heat/hydration flags, plus girls' packs (U13 confidence, U15 wings, U17 block) and inclusive packs (amputee 7-a-side, blind 5-a-side with sound and direction calls). Each drill compiles into a normal editable `Session` via `sessionFromDrill()`. |

Verification run at build time: `tsc --noEmit` clean; production build 405 kB JS (114 kB gzipped),
439 kB standalone file; a data test over all 20 drills (bounds, crop fit, cue length, session
round-trip) passed; server-side render smoke test of the Kit panel, the pitch with a drill-loaded
session, and the Dashboard all rendered without errors.

Still open, in priority order: (1) native-speaker review of the four translations; (2) a real
coach-educator pass over the drill wording; (3) freeze-frame → draw on the still (deferred on
purpose — footage is not the Nigerian bottleneck); (4) multi-coach library sharing by file
(the "academy library" merge), which is the thing that turns this into an academy tool.
