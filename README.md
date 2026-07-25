# Beacon

Beacon is an AI-powered civic infrastructure reporting platform built for the
AI & API Hackathon 2026. Citizens can report public problems such as potholes,
broken streetlights, water leaks, and illegal dumping. Government
administrators can review, map, assign, update, and resolve those reports.

The repository contains both applications:

```text
.
├── src/       Next.js frontend
└── backend/   Express, Prisma, and PostgreSQL API
```

## Project links

| Resource | URL |
| --- | --- |
| Live application | [beacon-frontend-mu.vercel.app](https://beacon-frontend-mu.vercel.app/) |
| GitHub repository | [AbulBashar38/beacon-frontend](https://github.com/AbulBashar38/beacon-frontend) |
| Database ERD | [Beacon ERD on DrawSQL](https://drawsql.app/teams/abul-basar/diagrams/beacon) |

## What Beacon does

### Citizen experience

- Submit a report without signing in
- Optionally create an account and retain a personal report history
- Upload photographic evidence and supporting URLs
- Find a structured address and select map coordinates
- Receive an internal report ID and public tracking code
- Copy both identifiers after submission
- Receive the identifiers by email when an email address is supplied
- Track public progress without signing in

### Government experience

- Secure administrator dashboard
- Live metrics, charts, report queue, and Bangladesh issue map
- Search, filter, sort, and paginate reports
- Inspect citizen input, images, AI analysis, duplicate links, and activity
- Assign a responsible department
- Update status and add public or internal progress notes
- Search and paginate users
- Download an overview PDF

## AI pipeline

Each submitted report passes through this backend pipeline:

1. Validate and normalize the request with Zod.
2. Analyze the description, location, category hint, and uploaded images.
3. Generate an operational category, confidence, severity, rationale, summary,
   department, and suggested action.
4. Generate a semantic embedding from the canonical summary.
5. Compare recent records using semantic, category, geographic, and temporal
   similarity.
6. Link likely duplicates while retaining every submitted report.
7. Persist the report and initial public progress update.
8. Send a confirmation email when a valid recipient and SMTP configuration are
   available.

### Models

| Purpose | Default model | Reason |
| --- | --- | --- |
| Text and image triage | `gpt-4o-mini` | Fast, economical multimodal analysis |
| Triage fallback | `gpt-4o` | More capable fallback when the primary call fails |
| Duplicate embeddings | `text-embedding-3-small` | Semantic similarity across differently worded reports |

Models are configurable through backend environment variables. If AI is
unavailable, Beacon stores the report with conservative manual-review values
instead of losing the citizen submission.

## Technology

### Frontend

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS and customized shadcn/Radix primitives
- React Hook Form and Zod
- Axios
- Motion
- Recharts
- Mapbox GL through `react-map-gl/mapbox`
- Cloudinary unsigned uploads
- jsPDF

### Backend

- Node.js, Express 5, and TypeScript
- Prisma 7 and PostgreSQL
- OpenAI text, vision, and embedding APIs
- JWT authentication and bcrypt
- Zod validation
- Nodemailer with generic SMTP
- Vitest and Supertest
- Swagger UI

## Database design

The database relationships and report lifecycle entities are documented in the
[Beacon entity-relationship diagram on DrawSQL](https://drawsql.app/teams/abul-basar/diagrams/beacon).

## Application routes

### Public and citizen routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page, live map, and public report form |
| `/track` | Track a report using its public code |
| `/login` | Email/password login |
| `/register` | Citizen registration |
| `/forgot-password` | Password recovery interface |
| `/dashboard` | Signed-in citizen reports |

### Administrator routes

| Route | Purpose |
| --- | --- |
| `/admin/dashboard` | Operational overview |
| `/admin/map` | Filterable live map |
| `/admin/issues` | Searchable and paginated report table |
| `/admin/issues/[id]` | Complete report detail and management |
| `/admin/users` | User administration |

## Local setup

### Prerequisites

- Node.js 20 or later
- npm
- PostgreSQL
- OpenAI API key
- Public Mapbox token
- Cloudinary unsigned upload preset
- Optional SMTP account for confirmation emails

### 1. Install dependencies

```bash
npm install
cd backend
npm install
cd ..
```

### 2. Configure the frontend

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/
APP_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_public_mapbox_token
NEXT_PUBLIC_MAP_STYLE_URL=mapbox://styles/mapbox/dark-v11
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
# Optional: enables Google Search Console ownership verification.
GOOGLE_SITE_VERIFICATION=
```

Only a public `pk.` Mapbox token may be placed in a `NEXT_PUBLIC_` variable.
Set `APP_URL` to the canonical production origin when deploying so social
metadata, the sitemap, and structured data use the public domain.

### 3. Configure the backend

```bash
cp backend/.env.example backend/.env
```

At minimum, configure:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/beacon
PORT=8080
APP_URL=http://localhost:3000
PUBLIC_URL=http://localhost:8080

BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_ACCESS_EXPIRES_IN=1d

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_FALLBACK_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

For email confirmation, also configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=notifications@example.com
SMTP_PASS=your_app_password
SMTP_FROM="Beacon Reports <notifications@example.com>"
```

For Gmail, use an app password rather than the normal account password.

### 4. Prepare the database

```bash
cd backend
npm run prisma:generate
npx prisma migrate dev
```

### 5. Start both applications

Backend:

```bash
cd backend
npm run dev
```

Frontend, in another terminal:

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/api/docs`
- Health check: `http://localhost:8080/api/health`

## Authentication and API access

- `POST /api/reports` is public. A valid optional citizen token links the report
  to that account; absent, expired, or invalid optional authentication continues
  as a guest submission.
- Public tracking and public map/landing data do not require login.
- Citizen history requires a valid citizen JWT.
- Report administration, analytics, and user listing require an administrator
  JWT.
- Authentication is stored in local or session storage according to the
  “Remember me” choice. Logout is handled by clearing the frontend session.

## Main API endpoints

### Public

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a citizen account |
| `POST` | `/api/auth/login` | Obtain a JWT |
| `POST` | `/api/reports` | Submit a report |
| `GET` | `/api/reports/track/:trackingCode` | Privacy-safe tracking |
| `GET` | `/api/reports/public/map` | Privacy-safe map points |
| `GET` | `/api/reports/public/landing` | Real landing-page metrics |
| `GET` | `/api/health` | Service health |

### Authenticated citizen

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/auth/me` | Current user |
| `GET` | `/api/reports/mine` | Reports owned by the citizen |

### Administrator

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/reports` | Filtered, sorted, paginated reports |
| `GET` | `/api/reports/stats/summary` | Dashboard analytics |
| `GET` | `/api/reports/:id` | Complete report detail |
| `PATCH` | `/api/reports/:id/status` | Update status |
| `PATCH` | `/api/reports/:id/assign` | Assign department |
| `POST` | `/api/reports/:id/progress` | Add progress update |
| `GET` | `/api/reports/:id/duplicates` | Duplicate chain |
| `DELETE` | `/api/reports/:id` | Soft-delete a report |
| `GET` | `/api/users` | Filtered and paginated users |

## Domain values

```text
Categories:  pothole, broken_streetlight, water_leak, illegal_dumping, other
Severity:    low, medium, high, critical
Status:      pending, under_review, assigned, in_progress, resolved, rejected
Departments: roads_and_highways, electrical, water_and_sewerage,
             waste_management, general
```

## Duplicate detection

The default composite score is:

```text
semantic similarity  0.55
category match       0.15
geographic proximity 0.20
time proximity       0.10
```

The default threshold is `0.80`, radius is `500 m`, and lookback is `7 days`.
These values are configurable in `backend/.env`. A match sets
`duplicateOfId` and `duplicateScore`; it does not delete, reject, merge, or
automatically synchronize the report.

## Email behavior

Confirmation email is attempted only after the database transaction succeeds.
It contains the internal report ID, public tracking code, AI summary, and
tracking link. A delivery failure is logged but does not roll back the report.
If SMTP is not configured or the contact value is not an email address, the
email step is skipped.

## Validation and testing

Frontend:

```bash
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm run build
npm test
```

The current backend suite covers authentication, validation, report creation,
AI response normalization, image vision input, duplicate detection, tracking,
email dispatch, middleware, and report operations.

## Important implementation notes

- Uploaded images are sent to the AI as vision inputs after Cloudinary upload.
- Evidence URLs are stored separately and are not assumed to be images.
- Public responses exclude citizen PII and internal progress notes.
- Administrators can see public and internal report history.
- The landing page uses real public API data and hides unavailable sections.
- The overview dashboard loads current API data once and supports manual retry;
  short polling is disabled.
- Never commit `.env` or `.env.local`.

## License

This hackathon project currently uses the repository’s package-level license
metadata. Add an explicit root `LICENSE` file before public distribution.
