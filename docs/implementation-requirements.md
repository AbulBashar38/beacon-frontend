# Beacon Implementation Requirements

This document translates [`requirement.md`](../requirement.md) into an engineering checklist for the current frontend and backend. The hackathon requirements remain the product source of truth; this file exists to keep implementation and verification focused.

## Product priorities

Work must be prioritized in this order:

1. Mandatory citizen reporting and submission confirmation
2. Public tracking with progress history
3. Government report review and lifecycle management
4. AI analysis, severity explainability, and duplicate visibility
5. Persistent API/database integration and resilient error handling
6. Operational analytics and map visualization
7. Bonus features and visual polish

Bonus features must not delay incomplete mandatory requirements.

## Required user journeys

### Citizen submission

- Validate description and location on the client.
- Submit through `POST /api/reports`.
- Support optional contact information.
- Persist optional photo or URL evidence when an upload service is available.
- Display both the backend report ID and public tracking code after success.
- Preserve retryable form data when submission fails.

### Public tracking

- Query `GET /api/reports/track/:trackingCode`.
- Display AI summary, category, severity, current status, assigned department, submission date, and public progress history.
- Never display contact details, citizen identity, internal notes, coordinates, or other protected information.
- Provide clear invalid-code, loading, offline, and retry states.

### Government report management

- Authenticate administrators through `POST /api/auth/login`.
- Send the JWT on every protected request.
- List, search, filter, sort, and paginate reports through `GET /api/reports`.
- Display complete report information through `GET /api/reports/:id`.
- Show AI category, confidence, severity score, severity rationale, normalized summary, and suggested action when available.
- Assign a department through `PATCH /api/reports/:id/assign`.
- Update lifecycle status through `PATCH /api/reports/:id/status`.
- Add public or internal progress notes through `POST /api/reports/:id/progress`.
- Display duplicate relationships through `GET /api/reports/:id/duplicates`.
- Clearly distinguish citizen-visible information from internal government information.

## API integration rules

- The frontend API base URL is configured with `NEXT_PUBLIC_API_BASE_URL`.
- The default local URL is `http://localhost:8080/api/`.
- Axios configuration belongs in one shared client.
- Request and response types belong in the API layer, not page components.
- Backend enum values must be translated to user-facing labels in dedicated mappers.
- API errors must be normalized into actionable messages.
- Protected requests must handle expired or invalid authentication consistently.
- Live map polling must not reset manual camera position unless the user changes a filter.

## State requirements

Every API-driven screen must support:

- Initial loading
- Successful data
- Empty data
- Validation failure
- Unauthorized access
- Backend unavailable
- Request timeout
- Retry
- Partial or nullable AI output

Mock data must not silently replace failed production API data.

## Current implementation status

### Implemented

- Axios API client and configurable backend URL
- Admin JWT login and bearer-token injection
- Public report submission
- API-backed admin issue listing
- API-backed dashboard statistics
- API-backed report builder data
- Live map polling and geospatial filtering
- Public tracking page and progress timeline
- Loading, empty, connection-error, and retry states

### Mandatory gaps

- Admin report details and management page
- Department assignment UI connected to the API
- Status and progress-note updates connected to the API
- Public/internal note separation
- Duplicate-report chain UI
- Backend report ID on the submission success view
- Persistent photo or evidence upload
- Consistent unauthorized-session redirect/logout behavior

## Definition of done

A feature is complete only when:

- It uses the real backend contract where an endpoint exists.
- Validation and API errors are visible and recoverable.
- Loading and empty states are intentional.
- It is keyboard accessible and responsive.
- It passes ESLint, TypeScript, and the production build.
- Its core action can be demonstrated end-to-end against the running backend.
- It does not expose citizen PII in public views.
