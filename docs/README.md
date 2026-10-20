# Published Coach Kit (static)

These are build outputs, committed on purpose: this repository is served as a plain static
site, with no backend and no build step at request time, so that a coach can be handed one
https link.

- `index.html` — the whole app in one file (no external requests, works offline once opened).
- `coach_kit.html` — the same file, for the in-app "Download the app file" button.

## Turn on the public link (one time, needs repo admin)
Settings → Pages → **Build and deployment → Deploy from a branch** → Branch:
`arena/01a01f71-https-github-com-stackblitz-la`, folder: `/docs` → Save.

The app then lives at
`https://<owner>.github.io/https-github.com-stackblitz-labs-bolt.diy/`
and that URL is what you send to 40 coaches, a state FA, or a WhatsApp group. Regenerate
these two files after any code change with `npm run build && node bundle-single-file.cjs`
followed by `cp tactical_coach_preview.html docs/index.html && cp tactical_coach_preview.html docs/coach_kit.html`.
