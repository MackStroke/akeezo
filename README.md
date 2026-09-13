# AKEEZO

> A healthcare journey platform that helps patients discover, plan, access and
> coordinate healthcare — from emergency assistance and hospital care to medical
> tourism and recovery at home.

MERN monorepo. **Phase 1 is complete** — public website, full admin panel, and MongoDB-backed data layer are live.

---

## Stack

| Layer | Choice |
| --- | --- |
| Database | MongoDB + Mongoose 8 |
| API | Express 5 on Node 20+, ESM, Zod validation |
| Frontend | React 19 + Vite 6 |
| UI | Tailwind CSS v4 + shadcn/ui (Radix UI, Lucide React) |
| Auth | JWT (admin) + localStorage session (customer portal) |

---

## Quick Start

```bash
npm install
cp .env .env.local    # fill in values
npm run dev
```

- Frontend → http://localhost:5173
- API → http://localhost:5000
- Vite proxies `/api` to the API — no CORS in dev.

**MongoDB is optional locally.** Leave `MONGODB_URI` blank and the server falls back to JSON files under `server/.data/`. Set it to use a real database:

```env
# Local
MONGODB_URI=mongodb://127.0.0.1:27017/akeezo

# Atlas
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/akeezo?retryWrites=true&w=majority
```

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | API + frontend together |
| `npm run dev:server` | API only |
| `npm run dev:client` | Frontend only |
| `npm run build` | Production frontend build into `client/dist` |
| `npm start` | Production API |

---

## What's Built

### 🌐 Website (Public)

| Feature | Details |
| --- | --- |
| **Landing Page** | Hero, services overview, cost estimator, FAQ, emergency CTA |
| **Lead/Enquiry Form** | Multi-step widget — intent, treatment, urgency, contact → saved to MongoDB |
| **Emergency SOS Form** | Full triage intake — vitals, location, contact → saved to MongoDB |
| **Blog** | `/blog` listing + `/blog/:slug` article detail with live view counter |
| **Customer Portal** | Patient login/signup + journey tracker with visa, hotel, doctor status |
| **SEO** | Dynamic meta, Open Graph, canonical URLs, JSON-LD structured data |
| **Floating Actions** | Fixed bar with emergency call, WhatsApp, chat buttons |

### 🛡️ Admin Panel (`/admin`)

| Feature | Details |
| --- | --- |
| **Secure Login** | JWT auth, protected routes |
| **Dashboard** | Live stats — leads, active cases, conversion rate, revenue in ₹ INR |
| **Leads Management** | Table with search/filter/bulk-select; detail page with status updates and internal notes |
| **Emergency Control Desk** | Live triage table (10s polling + audio ping); dispatch timeline and notes per case |
| **Registered Users** | Lists all platform users; links each user to their associated leads and queries |
| **Blog Manager** | Create / edit / publish / delete articles — fully synced to MongoDB |
| **Notification Bell** | Slide-out sidebar — active emergencies, new leads, system alerts |
| **Global Search** | Header search across the admin panel |
| **Admin Profile** | Real backend-synced name, role, avatar, department |
| **Theme Settings** | Light/dark mode, RTL/LTR direction |
| **Alert Dialogs** | Confirm prompts on all destructive actions (close case, mark as lost, sign out) |

### 🗄️ Database Collections (MongoDB)

| Collection | Stores |
| --- | --- |
| `leads` | Patient enquiries from the website form |
| `emergencyrequests` | Emergency SOS submissions |
| `users` | Registered platform users (patients) |
| `blogs` | Blog articles with view counts |

---

## API Reference

### Public

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness — reports active store |
| `POST` | `/api/leads` | Planned-care enquiry → `AKZ-<CC>-NNNNNN` |
| `POST` | `/api/emergency` | Emergency request → `AKZ-EMG-NNNNNN` |
| `GET` | `/api/blog` | All published blog posts |
| `GET` | `/api/blog/:slug` | Single post (increments view count) |

### Admin (JWT required)

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/login` | Obtain JWT |
| `GET` | `/api/admin/stats` | Dashboard counts |
| `GET/PATCH/DELETE` | `/api/admin/leads/:id` | Lead CRUD |
| `POST` | `/api/admin/leads/:id/notes` | Add internal note |
| `GET/PATCH` | `/api/admin/emergencies/:id` | Emergency detail and status |
| `GET/PATCH/DELETE` | `/api/admin/blog/:id` | Blog CRUD |
| `GET/PATCH` | `/api/admin/users/:id` | User detail and edit |

Responses: `{ ok: true, data }` or `{ ok: false, error: { message, fields? } }`

---

## Project Structure

```
client/src/
  App.jsx                        route composition
  pages/
    LandingPage.jsx              public homepage
    BlogPage.jsx                 public blog listing
    BlogPostPage.jsx             public blog article
    admin/
      AdminLayout.jsx            sidebar + header shell
      DashboardPage.jsx          stats overview
      LeadsPage.jsx              leads table
      LeadDetailsPage.jsx        lead detail + notes
      EmergenciesPage.jsx        emergency triage table
      EmergencyDetailsPage.jsx   dispatch and timeline
      AdminUsersPage.jsx         registered users list
      AdminUserDetailsPage.jsx   user profile + linked leads
      AdminBlogPage.jsx          blog CMS
      ProfilePage.jsx            admin profile
    customer/
      CustomerProfilePage.jsx    patient journey portal
  components/
    SearchWidget.jsx             tabbed intake - primary conversion
    EnquiryDialog.jsx            identity + consent gate
    EmergencyForm.jsx            emergency intake with triage interlock
    ui/                          shadcn primitives
  lib/
    site.js                      contact details + content constants
    blogStore.js                 localStorage fallback for blog
    utils.js                     cn() helper

server/src/
  app.js                         Express: helmet, CORS, routes
  index.js                       entry + graceful shutdown
  config/                        env validation, Mongo connection
  models/                        Lead, EmergencyRequest, User, Blog
  routes/                        leads, emergency, blog, admin, admin-blog,
                                 admin-users, admin-emergencies
  middleware/                    error handler
  utils/                         journey IDs, repository facade (Mongo or JSON fallback)
```

---

## Conventions

- **Content lives in `client/src/lib/site.js`** — FAQ, treatments, cities, nav shared between page and JSON-LD.
- **Currency is always ₹ INR** in the admin panel.
- **Red = emergency only.** Never reuse the red ramp for decoration.
- **Emergency paths get the benefit of the doubt** — looser rate limits, almost everything optional, phone on every failure path.
- **Consent gates health data** — explicit checkbox required before any form data is sent.
- **Do not set `NODE_ENV` in `.env`** — Vite reads that file and pins the build mode.
- **Use `API_PORT`, not `PORT`,** locally to avoid conflicts with dev harnesses.
- **Delete `node_modules/.vite`** after installing frontend deps to avoid stale cache phantom errors.

---

## Medical and Legal

AKEEZO coordinates healthcare services. It does not practise medicine or give medical advice, and every cost shown is an estimate subject to medical evaluation and hospital confirmation. Health information is collected only behind an explicit consent checkbox.
