# AKEEZO — Delivery phases

Stack: **MERN** — MongoDB + Mongoose, Express 5, React 19 (Vite), Node 20+.

The source brief (`User story- AKEEZO.pdf`) proposes three phases. This plan
keeps its intent but splits the work more finely, because "Phase 1" in the brief
bundles the marketing site, three intake journeys, document upload, a CRM and an
admin dashboard into one delivery — which is several months, not a first cut.

Phase 1 here is the landing page alone, shippable on its own.

Each phase below is independently deployable and leaves the product in a
coherent state. Nothing in a later phase is a prerequisite for an earlier one.

---

## Phase 1 — Landing page ✅ delivered

**Goal:** a complete, production-quality homepage that converts, and captures
enquiries into MongoDB. The business can start taking real cases with a phone,
a WhatsApp number and an inbox.

**Frontend** (`client/`)

- Homepage with the three entry points the brief demands — Plan my treatment,
  I need emergency help, Home healthcare — as the first thing on the page.
- Sections: hero, the coordinated journey, treatments, cities, itemised cost
  estimate, emergency band, home healthcare, continuum of care, partners, lead
  form, FAQ, medical disclaimer, footer.
- Emergency affordances permanently visible: a top strip with a tap-to-call
  number, a header CTA, and fixed WhatsApp + call buttons.
- Short emergency request form (four questions) with browser geolocation and a
  safety interlock: answering "not conscious" or "not breathing normally" raises
  an assertive alert telling the caller to phone instead.
- Accessible by construction — landmarks, one `<h1>`, skip link, native
  `<dialog>` drawer and `popover` menus, labelled controls, `:user-invalid`
  validation, WCAG AA contrast verified in light **and** dark mode.
- Modern CSS with cascade layers and a tiered token system. No CSS framework.
- JSON-LD: `Organization` + `MedicalBusiness`, `WebSite`, `WebPage`,
  `ItemList` of services, `FAQPage` built from the rendered FAQ.

**Backend** (`server/`)

- `POST /api/leads` — planned-care and home-care enquiries, returns a quotable
  `AKZ-<CC>-NNNNNN` journey id.
- `POST /api/emergency` — emergency requests, returns `AKZ-EMG-NNNNNN`, stores
  GPS as GeoJSON and opens an append-only timeline.
- `GET /api/health` — reports which store is active.
- Mongoose models for `Lead` and `EmergencyRequest`, Zod validation, Helmet,
  CORS allow-list, and separate rate limits (emergency deliberately looser).

### Launch blockers still open

These are not code. Phase 1 must not go live without them.

| Item | Why it blocks |
| --- | --- |
| Privacy policy, terms, medical disclaimer, patient-data consent pages | The footer links to `#faq` placeholders. The lead form already collects health information. |
| Real contact number, WhatsApp number and email | `.env` ships a placeholder `+91 11 4084 5678`. Every CTA depends on it. |
| Legal review of the consent checkbox wording | It authorises sharing medical details with third-party hospitals. |
| DPDP Act (India) position on health data | Storage, retention, deletion requests, cross-border transfer for overseas patients. |
| Someone on the other end of `/api/emergency`, 24/7 | The page promises "a coordinator is calling you now". Do not publish the emergency flow until that is staffed. |
| MongoDB Atlas cluster + `MONGODB_URI` | Without it the API silently uses the dev file store. |
| Transactional email/SMS on submission | Right now a submission is written to the database and logged. Nobody is notified. |
| Real proof points | "10 cities", "7 languages" and the accreditation claims must be true before launch. |
| Analytics + consent banner | None wired. Choose a privacy-respecting option given the health context. |

---

## Phase 2 — Journey intake

Turn the landing page's short forms into the full intake from the brief.

- **Medical tourism wizard**, the brief's 15 steps: requirement → medical
  details → what matters most → city → budget → hospital preference → doctor
  preference → estimate → length of stay → travel → accommodation → local
  experience → attendants → language → summary.
- **Emergency wizard** as four dedicated screens at `/emergency`, where GPS
  permission and triage branching each get their own view. Keep the one-page
  form on the homepage — for a caller in distress a single scroll beats four
  taps, and nothing can be abandoned halfway.
- **Home healthcare intake** — service, duration, shift pattern, location.
- **Medical record upload** — reports, scans, prescriptions, discharge
  summaries. This is the phase's real weight: presigned S3/GCS uploads, a
  virus scan, file-type and size limits, private buckets, encryption at rest,
  and an access log. Do not put medical records in MongoDB.
- Save-and-resume on a journey id, so a patient can come back to a half-finished
  wizard.
- React Router, and per-step client validation mirroring the Zod schemas.

New models: `Document`, `IntakeSession`. `Lead` gains the full requirement.

---

## Phase 3 — Admin: CRM and Emergency Control Desk

The first internal product. Until this exists the team works from an inbox.

- **Auth**: staff accounts, roles (coordinator, emergency desk, admin, finance),
  httpOnly refresh cookies, short-lived access tokens, audit logging.
- **Case management**: queue, assignment, status pipeline, notes, activity
  history, document viewer.
- **Emergency Control Desk**: live queue ordered by receipt time, audible alert
  on arrival, one-click dial-back, the brief's seven-step response protocol as a
  checklist, receiving-hospital picker, family-update log.
- WebSocket or SSE push for the emergency queue — polling is not acceptable here.
- Access control on medical records, logged per view.

---

## Phase 4 — Patient dashboard

- Patient auth (OTP on phone is the right choice for this audience, not a
  password).
- The brief's ten-stage journey tracker: assessment → hospital selection →
  doctor → estimate → appointment → travel → accommodation → treatment →
  recovery → return.
- Documents, estimates and itinerary in one place.
- Family view with its own scoped permissions.
- Emergency case tracking for the requester, ride-hailing style.

---

## Phase 5 — Directory and estimates

- `Hospital` and `Doctor` collections: specialties, accreditation (NABH/JCI),
  experience, languages, city, tariffs, international-patient services.
- Search, filter, and the side-by-side hospital comparison the brief calls for.
- Treatment cost estimator: line items per treatment and hospital, driving the
  itemised estimate the landing page currently illustrates with static figures.
- SEO landing pages per treatment, per city and per hospital — this is where the
  organic traffic actually comes from, and it needs prerendering or SSR
  (see *Known constraints*).

---

## Phase 6 — Partners and payments

- **International agent portal**: create patient, upload records, request
  hospital options, receive a proposal, white-label it for their own patient.
  The brief treats this as a core product, not an add-on.
- **B2B portal** for hotels, corporates, travel agencies, airlines, embassies,
  insurers/TPAs: login → raise case → track → documentation → billing.
- Payments and invoicing; multi-currency, since most patients pay from abroad.
- Partner-scoped data isolation — a hotel must never see another hotel's cases.

---

## Phase 7 — Intelligence and integrations

- AI-assisted intake: turn "my mother has breast cancer, we live in Kenya, budget
  8–10 lakh" into a structured requirement. Clinician-reviewed, never
  auto-diagnosing.
- Hospital and doctor recommendation engine weighted by the patient's stated
  priorities.
- Emergency dispatch integration and live ambulance tracking.
- Insurance/TPA, travel and accommodation integrations.
- Patient digital health record.

---

## Known constraints to decide early

**Rendering.** The landing page is a client-rendered SPA. Crawlers execute JS,
so it indexes, but for a business whose demand is search-driven this is the
wrong default from Phase 5 onward. Decide before building the directory: move to
Next.js, add prerendering (`vite-plugin-ssr`/`vite-ssg`), or accept the cost.
Deciding later means rewriting the directory.

**Journey id generation.** `makeJourneyId` uses a random 6-digit suffix per
process. Two API instances can collide. Before horizontal scaling, move it to a
`counters` collection with `findOneAndUpdate($inc)`.

**The dev file store.** `server/src/utils/store.js` falls back to JSON files when
`MONGODB_URI` is unset, so the UI is demoable without MongoDB installed. It has
no concurrency guarantees and must never run in production — `config/env.js`
refuses to start without a URI when `NODE_ENV=production`.

**Medical data.** Records are the most sensitive thing this product touches.
Settle storage, encryption, retention, access logging and deletion in Phase 2,
not after. Retrofitting this is far more expensive than building it in.
