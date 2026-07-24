<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

@AGENTS.md

# Project: Beacon

**Beacon** — an AI-powered civic infrastructure reporting platform for the **AI & API Hackathon 2026**. Citizens report public infrastructure problems; government administrators review, manage, visualize, and resolve them.

# AI Instruction: Build a Premium Civic Infrastructure Platform UI

You are acting as a senior product designer and senior frontend engineer.

Design and implement a premium, highly polished, responsive frontend for an AI-powered civic infrastructure reporting platform for the **AI & API Hackathon 2026**.

The product allows citizens to report public infrastructure problems and allows government administrators to review, manage, visualize, and resolve those reports.

The UI must look like a serious, modern public-sector intelligence platform rather than a generic SaaS dashboard or a default shadcn/ui template.

The final interface should be visually impressive during a live hackathon demonstration while remaining usable, accessible, responsive, and realistic.

---

# Technology Stack

Use:

```text
Next.js with App Router
TypeScript
shadcn/ui
Tailwind CSS
Framer Motion
Lucide React
React Hook Form
Zod
Recharts
MapLibre GL JS + OpenFreeMap (via react-map-gl/maplibre)
next-themes
```

## Map stack (important)

Use **MapLibre GL JS + OpenFreeMap**. Do **not** use Mapbox GL JS or any Mapbox-hosted tiles, styles, or SDK.

```text
Library:   maplibre-gl (React wrapper: react-map-gl/maplibre)
Tiles:     OpenFreeMap (no access token required)
Style URL: https://tiles.openfreemap.org/styles/liberty  (configurable via env)
```

Rules:

- Import from `maplibre-gl` and `maplibre-gl/dist/maplibre-gl.css` — never `mapbox-gl`.
- No Mapbox access token, dependency, or tile/style URL anywhere in the project.
- Keep the style URL configurable via an env var, defaulting to an OpenFreeMap style.
- If any Mapbox reference appears, replace it with the MapLibre/OpenFreeMap equivalent.

Use GSAP only when Framer Motion is not suitable, such as:

```text
Complex SVG animation
Map path animation
Advanced scroll-controlled storytelling
Highly coordinated hero animation sequences
```

Framer Motion should remain the default animation solution.

---

# Core Development Rules

## 1. Do not create a default shadcn interface

Do not simply install shadcn components and use their default appearance.

Use shadcn components as accessible structural primitives, then customize them to create a coherent product design system.

Customize components centrally inside:

```text
components/ui
components/shared
components/layout
components/motion
```

Do not repeat large Tailwind class strings throughout page files.

Create reusable variants and shared components instead.

For example:

```tsx
<Button variant="primaryGlow" />
<Button variant="glass" />
<Card variant="interactive" />
<Badge variant="critical" />
<Dialog variant="premium" />
```

Use `class-variance-authority` for component variants.

---

## 2. Minimize page-level Tailwind class clutter

Avoid pages containing extremely long Tailwind class lists.

Bad example:

```tsx
<div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5 shadow-xl backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
```

Instead, create a reusable component:

```tsx
<DashboardPanel interactive>...</DashboardPanel>
```

Centralize:

- Card styling
- Form styling
- Shadows
- Borders
- Backgrounds
- Typography
- Section spacing
- Animation variants
- Responsive behavior

Use utility classes inside reusable components when needed, but avoid spreading raw utilities across every page.

---

## 3. Create a proper design system

Define reusable design tokens through CSS variables.

Create variables such as:

```css
--background
--foreground
--surface
--surface-elevated
--surface-muted
--border
--primary
--primary-foreground
--accent
--success
--warning
--danger
--info
--critical
--map-heat-low
--map-heat-medium
--map-heat-high
--radius-sm
--radius-md
--radius-lg
--radius-xl
--shadow-sm
--shadow-md
--shadow-lg
--shadow-glow
```

Use semantic color naming.

Do not hardcode random colors throughout components.

---

# Visual Direction

Create a visual identity that combines:

```text
Government reliability
AI intelligence
Geospatial monitoring
Modern civic technology
Operational clarity
```

The product should feel like a combination of:

- A civic operations command center
- A modern geospatial intelligence platform
- A premium government SaaS product
- A citizen-friendly reporting application

Avoid:

- Excessive gradients
- Neon cyberpunk styling
- Too many glassmorphism effects
- Oversized decorative blobs
- Generic purple SaaS visuals
- Overly playful illustrations
- Excessively rounded components
- Animation on every element
- Dense enterprise dashboard clutter

---

# Recommended Visual Style

Use a dark command-center interface for the admin dashboard and a clean, approachable interface for citizens.

Suggested visual direction:

```text
Primary: deep emerald, teal, or blue-green
Background: near-black navy or charcoal
Surfaces: layered slate panels
Accent: cyan or electric teal used carefully
Critical: controlled red
Warning: amber
Success: green
Typography: clear, technical, and professional
```

The dark theme should not be pure black.

Use subtle tonal separation between:

```text
Application background
Sidebar
Panels
Elevated cards
Popover surfaces
Map overlays
```

Create depth through:

- Fine borders
- Soft shadows
- Controlled backdrop blur
- Surface contrast
- Subtle gradients
- Grid textures used sparingly

---

# Typography

Use a professional font combination.

Recommended:

```text
Headings: Geist, Manrope, or Plus Jakarta Sans
Body: Geist or Inter
Numbers and IDs: Geist Mono
```

Typography hierarchy must be clear.

Examples:

```text
Page title
Section title
Card title
Metric value
Metadata
Helper text
Table text
Status label
Tracking code
```

Use monospaced styling for:

- Tracking codes
- Report IDs
- Coordinates
- Technical values

---

# Product Structure

The application contains two major experiences:

```text
Citizen Portal
Government Admin Portal
```

They should belong to the same brand, but their UX should be different.

Citizen portal:

```text
Mobile-first
Simple
Friendly
Guided
Low cognitive load
```

Admin portal:

```text
Desktop-first
Information-rich
Operational
Map-focused
Fast to scan
```

---

# Required Citizen Screens

Build the following citizen-facing screens.

## 1. Landing Page

Include:

- Navigation
- Strong hero section
- Report an Issue primary CTA
- Track a Report secondary CTA
- Animated civic issue visualization
- Supported issue categories
- Simple “How it works” section
- Platform impact statistics
- Recent public resolutions or success stories
- Footer

Hero should feel polished and memorable.

Possible hero visual:

```text
Stylized Bangladesh map
Animated issue signals
Floating status cards
Subtle route lines
Live issue counters
```

Do not make the hero animation distracting.

Use Framer Motion for:

- Staggered content reveal
- Floating issue markers
- Counter appearance
- CTA hover and press feedback
- Background ambient motion

---

## 2. Citizen Login and Registration

Create:

```text
/login
/register
/forgot-password
```

Use a split-layout or premium centered authentication card.

Include:

- Proper form hierarchy
- Password visibility toggle
- Validation states
- Loading state
- Error state
- Success feedback
- Social login placeholder only if relevant

Avoid making the authentication UI look like an untouched shadcn form.

---

## 3. Citizen Dashboard

Include:

- Welcome section
- Report new issue CTA
- Total reports
- Pending reports
- In-progress reports
- Resolved reports
- Recent reports
- Latest updates
- Quick tracking input

Use cards with subtle motion and clear visual hierarchy.

Do not overload the citizen dashboard with complex charts.

---

## 4. Report an Issue Flow

This is the most important citizen experience.

Create a guided multi-step form:

```text
Step 1: Describe the problem
Step 2: Add evidence
Step 3: Select location
Step 4: Review and submit
```

Use an animated stepper.

Required fields and UI:

```text
Issue title
Detailed description
Category
Image upload
Address search
Current location
Interactive map
Draggable marker
District
Division
Contact details
Submission preview
```

Category selection should use icon cards rather than only a basic select menu.

Categories may include:

```text
Pothole
Broken streetlight
Water leakage
Illegal dumping
Drainage problem
Road damage
Other
```

Image upload component should include:

- Drag and drop
- Camera upload support
- Image preview
- Remove image
- Upload progress
- File validation
- Compression notice

Location picker should include:

- Search input
- Use current location
- Map
- Selected address card
- Coordinate preview
- Marker movement feedback

Use subtle transitions between form steps.

Never animate form elements so aggressively that input becomes difficult.

---

## 5. Submission Success Page

Create a strong completion experience.

Include:

- Animated success confirmation
- Report ID
- Public tracking code
- Copy button
- View report button
- Return to dashboard
- Download acknowledgement action
- Explanation of what happens next

The tracking code should be visually prominent.

---

## 6. My Reports Page

Provide:

- Search
- Filter by status
- Filter by category
- Sort by date
- Desktop table view
- Mobile card view
- Empty state
- Loading skeleton
- Error state

Each issue should show:

```text
Title
Category
Location
Current status
Submission date
Last update
Tracking code
```

Use animated list transitions when filtering.

---

## 7. Citizen Issue Details

Include:

- Issue title
- Image
- Description
- Location map
- Status
- Category
- Severity
- Assigned department
- Submission date
- Tracking code
- Progress timeline
- Public updates

Create a visually strong vertical status timeline.

The citizen should clearly understand:

```text
What happened
Who is responsible
What the current status is
What happens next
```

---

## 8. Public Tracking Page

Allow tracking without logging in.

Include:

- Large tracking-code input
- Track action
- Recent tracking history in local storage if appropriate
- Invalid tracking code state
- Loading state
- Result view
- Privacy-safe issue information

---

# Required Admin Screens

## 1. Admin Dashboard

Create a premium government command-center dashboard.

The layout should include:

```text
Collapsible sidebar
Top navigation
Global search
Date range filter
Notification button
Profile menu
Main content region
```

Sidebar routes:

```text
Overview
Live Map
Issues
Analytics
Reports
Departments
Users
Settings
```

For the hackathon MVP, departments, users, and settings may use simplified interfaces.

---

## 2. Dashboard Overview

Include metric cards for:

```text
Total issues
New issues
Critical issues
In progress
Resolved
Potential duplicates
Average resolution time
```

Include:

- Bangladesh issue map
- Critical issue queue
- Category distribution chart
- Status distribution chart
- District ranking
- Recent activity
- Resolution performance

Avoid presenting every chart at the same visual priority.

The map should be the primary visual focus.

---

# Bangladesh Map Experience

The Bangladesh map must be one of the most impressive parts of the application.

Support:

```text
Marker view
Cluster view
Heatmap view
District summary view
Severity view
```

Map controls:

```text
Date range
Category
Severity
Status
Division
District
Department
```

Use an expandable filter panel or floating map toolbar.

When clicking a marker, cluster, or hotspot, open a polished drawer or side panel.

Example drawer information:

```text
Selected location
Total issue count
Critical issue count
Category breakdown
Status breakdown
Recent reports
View filtered issues
```

Use smooth map transitions.

Use Framer Motion for surrounding UI, drawers, legends, and controls.

Use the map library’s native camera transition system for map movement.

Do not place heavy React animations directly over map rendering if they affect performance.

---

## 3. Admin Issues List

Create an operational data table with:

```text
Report ID
Issue title
Category
Severity
Location
Department
Status
Submitted date
Last update
Actions
```

Required functionality:

- Global search
- Column sorting
- Multi-filtering
- Date filter
- Status filter
- Severity filter
- Category filter
- Division and district filters
- Pagination
- Column visibility
- Row selection
- Bulk actions
- Export selected

Use shadcn Table or TanStack Table, but customize it heavily.

Avoid the appearance of a plain spreadsheet.

Create:

- Sticky header
- Contextual status colors
- Hover actions
- Compact but readable rows
- Responsive card fallback
- Active filter chips
- Clear-all-filters action

---

## 4. Admin Issue Details

Use a responsive split layout.

Left side:

```text
Issue image
Citizen description
Location
Map
Submission metadata
Citizen information
```

Right side:

```text
Current status
Severity
Category
Assigned department
Status management
Public note
Internal note
Activity history
```

Include a sticky operational action panel.

Status update UI:

```text
New status
Assign department
Public progress note
Internal note
Estimated completion date
Save update
```

Create clear distinction between:

```text
Citizen-visible information
Internal government information
```

---

## 5. Reports and PDF Export

Create a report builder interface.

Filters:

```text
Date range
Division
District
Category
Severity
Status
Department
Map visualization type
Include issue details
Include charts
```

Actions:

```text
Preview report
Download PDF
Save configuration
Reset filters
```

The report preview should look like an official government report.

Sections:

```text
Report title
Generation date
Applied filters
Executive summary
Bangladesh map
Affected-area heatmap
Key statistics
Category breakdown
Severity breakdown
Status breakdown
District ranking
Issue table
```

The browser preview should closely resemble the final PDF.

---

# Shared Components to Build

Create reusable components including:

```text
AppShell
CitizenHeader
AdminSidebar
AdminTopbar
PageHeader
SectionHeader
MetricCard
DashboardPanel
InteractiveCard
StatusBadge
SeverityBadge
CategoryBadge
IssueCard
IssueTable
FilterToolbar
FilterChip
EmptyState
ErrorState
LoadingState
SkeletonCard
MapPanel
MapLegend
MapFilterDrawer
LocationPicker
ImageUploader
TrackingCodeCard
ProgressTimeline
ActivityFeed
ReportPreview
CommandSearch
ResponsiveDialog
ResponsiveDrawer
ConfirmDialog
```

Do not write all UI directly inside page components.

---

# shadcn/ui Customization Requirements

Use shadcn primitives where appropriate:

```text
Button
Card
Dialog
Drawer
Sheet
Input
Textarea
Select
Command
Popover
Tabs
Badge
Table
Dropdown Menu
Tooltip
Toast
Alert Dialog
Calendar
Skeleton
Progress
Accordion
Breadcrumb
Avatar
Separator
Scroll Area
```

Customize them to match the design system.

Examples:

```tsx
<Button variant="hero">
<Button variant="command">
<Button variant="subtle">
<Button variant="dangerSoft">

<Card variant="metric">
<Card variant="map">
<Card variant="interactive">

<Badge variant="resolved">
<Badge variant="critical">
<Badge variant="pending">
```

Create component variants rather than adding unique styles every time.

---

# Animation System

Create a centralized motion system.

Example files:

```text
lib/motion.ts
components/motion/fade-in.tsx
components/motion/stagger-container.tsx
components/motion/page-transition.tsx
components/motion/animated-number.tsx
```

Define reusable variants:

```ts
fadeIn;
fadeUp;
scaleIn;
staggerContainer;
staggerItem;
slideFromRight;
dialogMotion;
drawerMotion;
cardHoverMotion;
```

Use animations for:

- Page entry
- Section reveal
- Card appearance
- List filtering
- Drawer opening
- Modal opening
- Tab changes
- Stepper transitions
- Notification appearance
- Status change confirmation
- Animated metric values
- Map panel transitions

Do not animate:

- Every table row continuously
- Large backgrounds excessively
- Form inputs while typing
- Critical operational information
- Entire pages with long delays

Recommended timing:

```text
Micro-interactions: 120–180ms
Component transitions: 180–260ms
Drawers and dialogs: 220–320ms
Page transitions: 250–400ms
Hero sequences: under 1200ms total
```

Use spring motion carefully.

Respect:

```css
prefers-reduced-motion
```

---

# Micro-interaction Requirements

Add subtle interactions such as:

- Button press feedback
- Card hover elevation
- Copy tracking-code confirmation
- Animated filter chips
- Smooth status badge transition
- Form step progression
- Upload progress animation
- Map drawer reveal
- Metric count-up
- Success check animation
- Table row action reveal
- Skeleton-to-content transition

Every animation must have a UX purpose.

---

# Responsive Behavior

## Citizen application

Design mobile-first.

Important:

- Large touch targets
- Camera-friendly image upload
- Easy location selection
- Sticky mobile submission action
- Card-based report list
- Bottom sheet filters
- Simple navigation
- Avoid wide tables

## Admin dashboard

Design desktop-first, but maintain tablet and mobile usability.

On smaller screens:

- Collapse sidebar
- Convert tables to cards where needed
- Use drawers for filters
- Allow fullscreen map
- Stack dashboard panels
- Hide non-essential table columns
- Preserve primary actions

---

# Accessibility

Follow WCAG-aware implementation.

Required:

- Keyboard navigation
- Visible focus states
- Accessible color contrast
- Semantic headings
- Proper form labels
- ARIA labels for icon buttons
- Accessible dialogs and drawers
- Screen-reader-friendly error messages
- Do not communicate status only through color
- Reduced-motion support

---

# Form UX Rules

All forms must include:

```text
Client-side validation
Clear field labels
Helper text
Inline validation
Error summaries when appropriate
Loading state
Disabled submission state
Success state
Failure recovery
```

Do not use placeholders as the only labels.

Use React Hook Form and Zod.

Create reusable controlled field components.

---

# State Design

Every page and component must consider:

```text
Loading
Empty
Error
Success
Partial data
No results
Permission denied
Offline
Network retry
Invalid tracking code
Image upload failure
Map loading failure
Location permission denied
```

Use polished empty states and error states instead of blank sections.

---

# Suggested Folder Structure

```text
app/
  (public)/
    page.tsx
    track/
    report/
  (auth)/
    login/
    register/
  citizen/
    dashboard/
    reports/
    reports/[id]/
  admin/
    dashboard/
    map/
    issues/
    issues/[id]/
    analytics/
    reports/

components/
  ui/
  shared/
  layout/
  citizen/
  admin/
  maps/
  reports/
  forms/
  motion/

lib/
  motion.ts
  navigation.ts
  constants.ts
  mock-data.ts
  utils.ts
  validators/

styles/
  globals.css
```

---

# Mock Data Requirement

Initially implement the frontend using realistic mock data.

Mock data should include:

```text
Bangladesh divisions
Districts
Coordinates
Issue categories
Issue severity
Issue status
Departments
Citizen reports
Timeline history
Dashboard metrics
Map markers
Heatmap points
Report analytics
```

Do not use meaningless placeholder values such as:

```text
Lorem ipsum
Item 1
Test user
Sample data
```

Use realistic civic issue examples.

---

# Frontend MVP Priority

Build in this order:

## Phase 1

```text
Design system
Application shell
Landing page
Authentication UI
Citizen report form
Submission success
Citizen reports
Citizen issue details
Public tracking
```

## Phase 2

```text
Admin shell
Admin overview
Issues table
Issue details
Status management UI
```

## Phase 3

```text
Bangladesh map
Heatmap
Map filters
Analytics
```

## Phase 4

```text
Report builder
Report preview
PDF export UI
Advanced animation
Final polish
```

---

# UI Quality Requirements

The result must not look like:

- A copied admin template
- Default shadcn/ui
- A basic student project
- A generic CRUD dashboard
- A design with random gradients
- A page made entirely from unrelated cards

It should look like a cohesive, production-ready civic technology product.

Prioritize:

```text
Visual hierarchy
Consistency
Spacing
Alignment
Information clarity
Meaningful motion
Responsive behavior
Map usability
Professional presentation
```

---

# Final Deliverables

Produce:

1. Complete frontend architecture
2. Reusable design system
3. Customized shadcn components
4. Responsive citizen portal
5. Responsive admin dashboard
6. Animated Bangladesh map interface
7. Issue management experience
8. Tracking timeline
9. Report builder and preview
10. Realistic mock data
11. Loading, empty, error, and success states
12. Clean TypeScript code
13. No duplicated UI code
14. Minimal page-level Tailwind class clutter
15. Accessible animation and interaction

Before finishing each screen, evaluate:

```text
Does this look like a default shadcn page?
Does the page have one clear primary action?
Is the information hierarchy obvious?
Does the animation improve understanding?
Is the layout responsive?
Are component styles reusable?
Would this look convincing in a live judge demonstration?
```

Do not sacrifice usability for visual effects.

The final product should impress through precision, polish, clarity, interaction quality, and a coherent civic intelligence visual identity—not through excessive decoration.
