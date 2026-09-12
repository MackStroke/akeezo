# AKEEZO

> A healthcare journey platform that helps patients discover, plan, access and
> coordinate healthcare — from emergency assistance and hospital care to medical
> tourism and recovery at home.

MERN monorepo. **Phase 1 (landing page) is complete** — see
[`docs/PHASES.md`](docs/PHASES.md) for the full roadmap and the launch blockers
that are still open.

## Stack

| Layer | Choice |
| --- | --- |
| Database | MongoDB + Mongoose 8 |
| API | Express 5 on Node 20+, ESM, Zod validation |
| Frontend | React 19 + Vite 6 |
| UI | Tailwind CSS v4 + shadcn/ui (unified `radix-ui`, `lucide-react`) |
| Design language | MakeMyTrip-style: icon tab strip, segmented search card, gradient pill CTA, Lato, 10px radius — in AKEEZO teal |

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

The frontend is on <http://localhost:5173>, the API on <http://localhost:5000>.
Vite proxies `/api` to the API, so the browser sees one origin and CORS never
applies in dev.

**MongoDB is optional locally.** Leave `MONGODB_URI` blank and the repository
layer writes to JSON files under `server/.data/` so the forms work end to end
without a local Mongo. It is a demo convenience with no concurrency guarantees —
the API refuses to start without a real `MONGODB_URI` when
`NODE_ENV=production`.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | API + frontend together |
| `npm run dev:server` | API only |
| `npm run dev:client` | Frontend only |
| `npm run build` | Production frontend build into `client/dist` |
| `npm start` | Production API |

## Layout

```
client/
  index.html            meta, Open Graph, canonical
  src/
    App.jsx             page composition
    main.jsx            entry; injects JSON-LD once
    components/
      SearchWidget.jsx  the MMT-style tabbed intake — primary conversion point
      WidgetField.jsx   one segmented cell: label / big value / caption
      EnquiryDialog.jsx step two: identity + the required consent gate
      EmergencyForm.jsx full emergency intake with the triage interlock
      ui/               shadcn primitives (our source — edit, don't wrap)
    sections/           one file per landing-page section
    lib/
      site.js           contact details + content constants (single source of truth)
      api.js            fetch client with timeout and field-level errors
      utils.js          cn() — every shadcn component imports this
      structuredData.js JSON-LD graph, derived from site.js
    styles/
      index.css         Tailwind entry + @theme tokens (light, dark, forced colors)
server/
  src/
    app.js              Express app: helmet, CORS, routes
    index.js            entry + graceful shutdown
    config/             env validation, Mongo connection
    models/             Lead, EmergencyRequest
    routes/             leads, emergency, health
    middleware/          error handler, rate limits
    utils/              journey ids, repository facade
docs/PHASES.md          delivery roadmap
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness; reports the active store |
| `POST` | `/api/leads` | Planned-care / home-care enquiry → `AKZ-<CC>-NNNNNN` |
| `POST` | `/api/emergency` | Emergency request → `AKZ-EMG-NNNNNN` |

Responses are `{ ok: true, data }` or `{ ok: false, error: { message, fields? } }`.
Validation failures return `422` with per-field messages the UI renders inline.

```bash
curl -X POST http://localhost:5000/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"intent":"medical_tourism","name":"Test","phone":"+254712345678","country":"Kenya","consent":true}'
```

## Conventions worth knowing before you edit

- **Content lives in `client/src/lib/site.js`**, not in components. The FAQ,
  treatments, cities and navigation are consumed by both the rendered page and
  the JSON-LD, so they cannot drift apart.
- **shadcn components are ours to edit.** When one does not fit, add a variant
  in `components/ui/*.jsx` rather than piling overrides on the call site — a
  `group-data-*` variant in shadcn's base outranks a plain class anyway.
- **Do not use `light-dark()` for anything a form control renders.** Chrome
  resolves it against the light scheme inside widgets — the same
  `var(--surface)` came back white on an `<input>` and dark on the `<div>`
  beside it. Theme tokens are overridden in a
  `@media (prefers-color-scheme: dark)` block instead.
- **`--primary` inverts in dark mode; `--hero-band` does not.** Anything
  carrying white text needs a token that stays dark in both themes.
- **`--emergency` is a fill (white text on it); `--emergency-ink` is text.**
- **Delete `node_modules/.vite` and restart after installing frontend deps,**
  or a stale dep cache produces phantom duplicate-React hook errors.
- **Do not set `NODE_ENV` in `.env`.** Vite reads that file too, and pinning it
  to `development` makes `vite build` emit React's dev build (277 kB → 532 kB).
- **Use `API_PORT`, not `PORT`,** for the API locally. Node's `--env-file` will
  not override an already-set variable, so an ambient `PORT` from a dev harness
  silently wins.
- **Red means emergency.** Never reuse the red ramp for decoration.
- **Emergency paths get the benefit of the doubt.** Looser rate limits, almost
  everything optional, one-step submit, and a phone number on every failure
  path. A rejected emergency request is a worse outcome than a messy one.
- **Consent gates health data.** The widget collects the requirement; the
  enquiry dialog collects identity and a required consent checkbox before
  anything is sent.

## Medical and legal

AKEEZO coordinates healthcare services. It does not practise medicine or give
medical advice, and every cost shown is an estimate subject to medical
evaluation and hospital confirmation. The landing page says so in the disclaimer
under the FAQ and on both emergency forms; keep it there. Health information is
collected only behind an explicit consent checkbox — read the launch blockers in
[`docs/PHASES.md`](docs/PHASES.md) before going live.
