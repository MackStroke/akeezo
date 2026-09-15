# CLAUDE.md

AKEEZO — healthcare journey platform (medical tourism, emergency healthcare,
home healthcare in India). MERN monorepo: MongoDB/Mongoose, Express 5, React 19
+ Vite, npm workspaces.

The frontend UI is modelled on **MakeMyTrip**: a dark utility bar, an icon tab
strip, a segmented search card overlapping the hero, a gradient pill CTA that
straddles the card's bottom edge, Lato, and a 10px card radius. The palette
stays AKEEZO teal — MMT's *patterns*, not its blue.

Read [`README.md`](README.md) for the layout and [`docs/PHASES.md`](docs/PHASES.md)
for what is built and what is next. The product brief is
`User story- AKEEZO.pdf` (extract it with `pdftotext -layout`; `pdftoppm` is not
installed here, so the Read tool cannot render its pages).

## Commands

```bash
npm run dev      # API (5000) + frontend (5173)
npm run build    # production frontend build
```

## Frontend stack

Tailwind CSS v4 (`@tailwindcss/vite`, no config file — theme lives in
`client/src/styles/index.css`) plus **shadcn/ui** components in
`client/src/components/ui/`, built on the unified `radix-ui` package with
`lucide-react` icons. `components.json` is configured for JSX (`"tsx": false`)
and the `@/` alias resolves to `client/src`.

shadcn components are **our source** — when one does not fit, edit it (add a
variant) rather than fighting it with overrides from the call site. See the
`strip` variant in `components/ui/tabs.jsx`.

## Hard-won gotchas — do not reintroduce these

### Tooling

- **After installing frontend deps, restart the dev server and delete
  `node_modules/.vite`.** A stale Vite dep cache serves two React instances and
  the app dies with "Invalid hook call … more than one copy of React". There was
  only ever one React; the cache was the problem.
- **The shadcn CLI emitted `import { cn } from "cn"`** and then installed a
  real npm package called `cn` to satisfy it. Imports must point at
  `@/lib/utils`, and that package must not be in `package.json`. Check
  `client/package.json` after any `shadcn add`.
- **shadcn expects the unified `radix-ui` package**, not individual
  `@radix-ui/react-*` packages.
- **Never set `NODE_ENV` in `.env`.** Vite reads it and `vite build` then emits
  React's development build — 277 kB became 532 kB.
- **The API reads `API_PORT` before `PORT`.** Node's `--env-file` does not
  override variables already in the environment, so an ambient `PORT` (dev
  harnesses set one) beats `.env` and the API lands on the frontend's port.

### Theming

- **Never `light-dark()` on anything a form control paints.** Chrome resolves it
  against the light scheme inside widgets: the identical `var(--surface)`
  computed to `#101716` on a `<div>` and `#ffffff` on the `<input>` next to it,
  giving near-white text on a white field. Dark mode is a
  `@media (prefers-color-scheme: dark)` block redefining the tokens on `:root`.
- **There is no `.dark` class and no theme toggle.** Tailwind's default `dark:`
  variant (prefers-color-scheme) is what we use. If a toggle is ever added, add
  `@custom-variant` and a `[data-theme]` layer — do not sprinkle `.dark`.
- **In `@theme inline`, a token whose value is a literal will not
  theme-switch.** It is substituted into the utility at build time. Shadows hit
  this: `--shadow-widget` must be `var(--widget-shadow)`, with
  `--widget-shadow` defined per mode on `:root`.
- **`--primary` flips to mint in dark mode** (so accent buttons invert to dark
  ink on a light ground). Never use it for a surface that carries white text —
  the hero band did, and the white `h1` fell to 1.76:1. Use `--hero-band`,
  which stays teal in both modes.
- **`--emergency` is a FILL, `--emergency-ink` is TEXT.** White-on-`--emergency`
  only clears AA on the darker red, so `--emergency` is `#d92d20` in *both*
  modes. Emergency text uses `--emergency-ink`, which flips light in dark mode
  (`--emergency` at 4.41:1 on the emergency tint is a fail).
- **Tailwind merges `.text-foreground/60` into `.text-foreground`,** dropping
  the opacity. Do not rely on `/NN` opacity for a themed text token; pick a
  token that already has the contrast you need.

### Layout

- **`<fieldset>` needs `min-w-0`.** Its UA `min-width: min-content` makes it
  grow to fit its content and defeats an `overflow-x-auto` rail inside it,
  scrolling the whole page sideways on a phone. Same failure mode as an
  unconstrained `<select>`, which also needs `min-inline-size: 0`.
- **A `group-data-*` variant from shadcn's base outranks a plain class from the
  call site** (`[data-orientation] .h-9` beats `.h-auto`). Fix it in the
  component with a variant, or with a `!` important modifier — not by stacking
  more classes at the call site.
- **shadcn's `TabsTrigger` sets `after:opacity-0`,** which a variant cannot
  reliably override. The `strip` variant draws its active underline with a
  transparent-to-current bottom border plus `-mb-px` instead, so nothing shifts
  when a tab activates.
- **Scope dark-band text colours to a copy wrapper, not the band.** A blanket
  `.emergency-band h3 { color: #fff }` painted the nested light form card's
  heading white on white. The emergency band uses an `.emergency-copy`-style
  wrapper (`[&_h2]:text-white`) on the copy column only.

## Conventions

- Page content (FAQ, treatments, cities, navigation, contact details) lives in
  `client/src/lib/site.js`. The JSON-LD in `lib/structuredData.js` is derived
  from the same constants so the markup cannot drift from the rendered page.
- Sections are one file each in `client/src/sections/`; reusable pieces are in
  `client/src/components/`; shadcn primitives in `client/src/components/ui/`.
- The search widget (`components/SearchWidget.jsx`) is the primary intake. Its
  field anatomy (small label, large bold value, caption) lives in
  `components/WidgetField.jsx`.
- API responses are `{ ok, data }` / `{ ok, error: { message, fields? } }`.
  Validation failures are `422` with per-field messages.

## Non-negotiables for this product

- **Red is only ever emergency.** Never borrow the red ramp for decoration.
- **Health data does not leave the browser without explicit consent.** The
  widget gathers *what* the patient needs; `EnquiryDialog` collects *who they
  are* plus a required consent checkbox before anything is POSTed. Do not
  shortcut this by submitting straight from the widget.
- **The emergency path favours the caller over the data.** It submits in one
  step with only a name and number required, rate limits are loose on purpose,
  and every failure path shows a phone number instead of asking for a retry. A
  rejected emergency request is worse than a messy one.
- **The unconscious / not-breathing interlock must keep working.** Answering
  "no" to either question in the `#emergency` form raises a `role="alert"`
  telling the caller to phone instead. Never soften or bury it.
- **Never fabricate clinical or trust content.** No invented patient
  testimonials, review counts, `aggregateRating`, accreditations or outcome
  statistics. Proof points currently on the page ("7 languages", "20+
  countries", "NABH & JCI partners") are launch blockers for this reason.
- **Costs are estimates, never quotations,** and must be labelled as such
  wherever they appear.
- **Medical records do not go in MongoDB.** Phase 2 stores them in private
  object storage with encryption, virus scanning and per-view access logging.
- Keep the medical disclaimer in the FAQ section and the "not a substitute for
  your local emergency number" note on both emergency forms.

## Verifying UI changes

`.claude/launch.json` defines the `akeezo` dev server. After a visual change,
check at 375px and desktop width, in both colour schemes, and confirm:

- **The app actually mounted** (`document.getElementById('root').children.length`).
  A JSX syntax error gives a blank page, and a blank page passes every other
  check — including "no horizontal scroll".
- No horizontal *panning*: `window.scrollTo(9999,0)` must leave `scrollX` at 0.
  Do not trust `documentElement.scrollWidth` — content inside an
  `overflow-x-auto` rail inflates it without the page being scrollable.
- WCAG AA contrast in light **and** dark mode. The hero and emergency bands
  take their ground from a stacked sibling or a gradient, so an ancestor-walking
  auditor reads them as 1:1 — measure those two regions explicitly. Last
  verified: hero h1 7.73 (light) / 11.78 (dark), hero lede 6.09 / 8.95,
  emergency band 9.57–19.33, and 0 failures across the rest of the page in both
  modes.
- After changing `prefers-color-scheme` emulation, **reload before measuring**.
  Media emulation leaves some elements with stale computed colours and produces
  convincing phantom failures.
- No `:user-invalid` styling on untouched required fields.
- The emergency interlock still fires (drive the Radix select by keyboard —
  `.click()` alone does not change its state).
