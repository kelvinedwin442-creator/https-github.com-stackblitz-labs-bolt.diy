# Viability check: Tactical Coach vs. the real constraints on grassroots coaches

Prompt: *"Looking at the restrictions for grassroots coaches, is this viable?"*

Method: our n=2 UED form + national grassroots data + competitor pricing + FA safeguarding rules on filming
children, each checked against what the current build actually does.

**Bottom line up front:**

| Question | Verdict |
| --- | --- |
| Will grassroots coaches *use* a free, offline, printable tactics board with animation? | **Yes, plausibly** — the need (showing movement) is real and paper can't do it. |
| Is it viable as a **paid subscription sold to grassroots coaches**? | **No.** The data kills this model outright. |
| Is the **video/analysis pillar** viable as specced for youth coaches? | **Not as built.** It collides with safeguarding rules and with their actual habits. Reposition or shrink it. |
| Is it viable as a **portfolio piece / funnel / club-level tool**? | **Yes** — and that's where the money, if any, actually sits. |

---

## 1. The constraints, with receipts

| Constraint | Evidence | What it does to us |
| --- | --- | --- |
| **Time** | Volunteer club officials lose ~4.3 h/week to chasing subscriptions; 67% of senior team coaches considered quitting in the past year ([Sports Insight / GoCardless](https://sports-insight.co.uk/insight-update/burnout-and-broken-budgets/)). The FA's own guidance concedes "time is precious at grassroots level, especially when you've only got one training session a week" ([England Football Learning](https://learn.englandfootball.com/articles-and-resources/coaching/resources/2026/How-to-manage-a-training-session)). | Anything that becomes a *new weekly habit with a learning curve* gets dropped. Our form's respondents were "sometimes/rarely" visual-aid users. App must be faster than drawing on the whiteboard, not more capable. |
| **Money** | 7 in 10 clubs worried about funding, 29% of pitch-renting clubs faced ≥16% cost rises ([Guardian/FORZA](https://www.theguardian.com/football/2024/apr/30/cost-rises-bad-weather-harming-grassroots-football-survey-forza)); 81% of clubs hit by unpaid subs ([Sports Insight](https://sports-insight.co.uk/insight-update/burnout-and-broken-budgets/)). "Cost" was one of only two barriers in our form. | Zero willingness to pay at individual level. Pricing must be £0 for the coach. |
| **Free incumbents** | "Football Tactic Board" — free, no sign-up, 4.6 rating ([footyapps](https://footyapps.com/best/tactics)); "Soccer Tactic Board" — free, no registrations, 6 pitch views ([Google Play](https://play.google.com/store/apps/details?id=com.jenda.footballboard)); Tactico — free board with no account ([tactico.pro](https://tactico.pro/)). Paid rivals are explicitly judged "overkill for grassroots coaches; free browser alternatives cover most needs" ([hobbit.football](https://hobbit.football/tools/best-free-soccer-tactics-board-apps)). | Our differentiation cannot be "it exists and draws arrows". It has to be animation clarity, age-appropriateness, offline, print, and data that survives the season. |
| **Devices & conditions** | Two of three grass pitches rated poor and 96% of local authorities short on 3G ([Sports Business Journal](https://www.sportsbusinessjournal.com/Articles/2024-10-28/football-association-four-year-strategy/)); bad weather is a named threat to club survival ([Guardian/FORZA](https://www.theguardian.com/football/2024/apr/30/cost-rises-bad-weather-harming-grassroots-football-survey-forza)). Our form: 1 coach with smartphone+tablet, 1 with **none**. | No-signal floodlit-less grounds, wet hands, gloves, 20% battery, one phone for 16 kids. Offline-first is not a nice-to-have. The app must also work with **zero** devices → print/PDF is a core surface, not an export afterthought. (See #1 in the UED doc: we currently call Google Fonts over a CDN, so we are not actually offline.) |
| **Filming under-18s** | FA Guidance 8.3: written parental consent for public use of images, secure storage, no filming in changing rooms/toilets, parents must be told filming is part of the coaching programme, and the **land/facility owner decides** whether filming is allowed at all ([The FA 8.3](https://www.thefa.com/-/media/thefacom-new/files/rules-and-regulations/safeguarding/21-10-2025/83-photography-and-filming-children.ashx), [club-level restatement](https://falmouthcommunityfootball.uk/fa-guidance-photographing-filming-children)). Under-16s require parent/carer consent before any photo/video ([CPSU](https://thecpsu.org.uk/help-advice/topics/photography-and-filming-in-sports-and-activities)). | The "pause/freeze video" top-request from our respondent is the one feature their own age group is structurally restricted from doing on a Tuesday night. Some leagues ban phones entirely. Video cannot be the hero feature. |
| **Volunteers aren't supported** | ~1m volunteers, 160k coaches; 25% of volunteers say they don't feel valued ([FA written evidence to Parliament](https://committees.parliament.uk/writtenevidence/134345/html/)); limited coaches/volunteers is the single biggest barrier to participation (70%), and 99% of clubs are volunteer-reliant with 78% finding recruitment harder ([FORZA 2026](https://www.forza.com/uk/football/grassroots-report)). | Retention of the *coach* is the real problem; a tactics board is adjacent to it. Anything we add that increases their admin load is negative. |

---

## 2. Three different "viabilities" — do not conflate them

**(a) Use viability — viable, conditionally.**
The job-to-be-done from the form is not "make a diagram", it's "make a 9-year-old understand a run". A whiteboard can't move. That is a genuine wedge, and it's the only honest one: **animated movement + slow motion + big legible cues, free, offline, printable.** If those four things are excellent, a coach will open it. If any of them is fiddly, they'll use cones.

**(b) Business viability as coach-paid SaaS — not viable.**
Free tools with no sign-up already cover arrows and basic animation; paid rivals price at
$24–63/yr (TacticalPad [buy page](https://www.tacticalpad.com/en-us/new/buy.php)), £5–7/mo (JLA [pricing](https://jlatacticsboard.com/prices/) gates zones behind a plan and caps free saves at 3), $5/mo (tacticboard.app [pricing](https://www.tacticboard.app/)), and reviewers tell grassroots coaches they don't need it. Meanwhile our own user has no device and no budget. A grassroots-coach subscription is a market where the customer is a time-poor volunteer paying for their own shin pads. Don't build that.

**(c) Where money could actually sit — institution, not volunteer.**
Institutions do pay for coach support: The Coaching Manual is priced at $180/mo for a club ([hobbit.football comparison](https://hobbit.football/tools/football-coaching-software)), TacticalPad sells bulk licences for 4+ coaches, and the FA runs a partially funded places programme for coach education ([England Football Learning](https://learn.englandfootball.com/get-started)). So the viable commercial shapes are: club licence (one £50–£150/yr line in a club budget, shared by all teams, printed by the club), county FA / league CoachED distribution, academy & coach-educator use (projector, classrooms, tutor marking of learner sessions), or a free tool funded as a league's retention offer. All of those need **multi-seat sharing, print, and club branding** — none of which need a heavy backend if we keep export/import JSON as the sharing primitive.

---

## 3. The strategic correction the constraints force

**Demote video from "pillar" to "safe optional mode", and make it about stills, not surveillance.**
- Highest-value, lowest-risk feature is still **freeze-frame → draw on the still** (a coach's own clip, or a pro match clip, or a single frame). One frame is far easier to justify under 8.3 than a stored clip of identifiable children, and it is what our respondent actually asked for.
- Because there is **no backend and footage never leaves the device**, we can make that a compliance *selling point*: "your clips are not uploaded anywhere; you control deletion". Add a 5-line "before you film" checklist (consent via club annual membership form, tell parents it's part of coaching, never in changing rooms, ground owner's rules, delete after use). Cheap to build, and it signals we understand their world — which free competitors don't.
- Never add cloud upload, never add auto player detection (that's processing biometric-ish images of minors and drags in GDPR/consent the volunteer cannot manage). The original "do not build" list is, in hindsight, also the correct *legal* posture.

**Promote print to a first-class output.** For the coach who answered "None" for devices, and for the 20:00 floodlit pitch with no signal, the paper session card *is* the product. This is also the thing no app-based competitor bothers with.

**Ship offline honestly.** Kill the CDN font dependency; add manifest + service worker so "installed app opens with the lights off on a phone at 1 bar" is guaranteed.

---

## 4. What must be true for this to be viable (testable gates)

Not a survey of intentions — our two respondents both said "very likely", and the gap between "very likely" and a wet Tuesday night is the whole risk. Test behaviour with ~10 real coaches, one real training session each:

| Gate | Pass |
| --- | --- |
| Unassisted first session | ≥7/10 create + save a session in **under 5 minutes**, no help |
| Actually pitch-side | ≥5/10 open it **at training**, not only at home |
| Players understood | ≥5/10 report players "got it" better than the whiteboard |
| Offline trust | 0 failures in airplane mode, cold start < 2 s on a mid-range Android |
| Data safety | 0 lost sessions across app close/reopen/device-switch (with print/export as recovery) |
| Return | ≥4/10 use it for a **second** session the following week |

If we fail the second and last rows, grassroots is the wrong beachhead — the same engine is a better fit for **coach educators and academies** (projectors, devices in hand, learners assessed on session plans, budget exists).

---

## 5. If I had to name the single biggest viability risk in the code as it stands

Local-only persistence. `localStorage` (`tactical_coach_sessions_v1`) is device-bound and can be cleared by the OS under storage pressure; a season's work disappears and the coach blames the app, permanently. For a volunteer with no laptop, no account and no sync, that's not a technical detail — it's churn. Mitigations that don't break the "no backend / no collaboration" restrictions:
1. Move to **IndexedDB + StorageManager `persist()`** (large quota, marked non-evictable) with localStorage fallback.
2. Auto-**"season backup" file** (already have `exportAllSessionsBackup`) prompted weekly, and iOS "Save to Files"/Android download so it's recoverable.
3. Import-by-**paste-code/JSON file** = sharing with an assistant coach or the club, with no server at all.
4. **Print/PDF** as the ultimate durability layer.

---

## 6. Answer in one sentence

Viable as a free, offline-first, print-first **teaching** tool for youth coaches where the hero feature is *animated, slow-motion, age-scaled clarity* — and as a club/league/academy-level licence if we ever want revenue — but **not** viable as a paid coach subscription, and **not** as a video-analysis product for children's football.
