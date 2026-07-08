# Go Mentorship Platform (Frontend — Student/Mentor Interface)

The primary web client for students and mentors (buddies) of the Go mentorship ecosystem. Built using Next.js 14, TypeScript, Tailwind CSS, and HeroUI, this responsive interface delivers roadmaps, gamification components, and administrative tracking tools.

---

## Technical Stack

* **Core Framework:** Next.js 14 (App Router utilizing decoupled client-side routing)
* **Language:** TypeScript
* **UI & Styling:** Tailwind CSS (Dark/Light mode via global CSS variables) & HeroUI (Card, Button, Modal, Progress, Chip, Avatar)
* **Animations:** Framer Motion (fluid viewport transitions and card flips)
* **Utility Engines:** Iconify (icon resolution), Sonner (toast notifications), next-themes (theme mapping orchestration)

---

## Production Deployment via Docker Compose

1. Clone the repository and navigate to the project root directory:
```bash
git clone https://github.com
cd mentorship-frontend-main
```

2. Build and execute the production container, passing the backend endpoint during the compilation pipeline:
```bash
docker compose build --build-arg NEXT_PUBLIC_API_URL=http://185.75.189.130:8080
docker compose up -d
```
The application will accept connections at `http://localhost:3000`.

---

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Spin up the Vite/Next.js development instance:
```bash
npm run dev
```

---

## Platform Features

### Student Framework
* **Interactive Roadmap:** Partitioned learning tracks including modular blocks for theory, conceptual questions, practice exercises, and homework assignments.
* **Curriculum Materials:** Embedded payload preview windows optimized for raw URLs, YouTube media streams, and GitHub code repositories.
* **Granular Tracking:** Structural tracking of content completion flags separated by required and optional progress states.
* **Gamification & Rewards:** 14 automated achievement types linked to a functional reward system.
* **Bonus Economy Ledger:** Audited transaction logs tracks user point accumulation convertible into enterprise platform tier discounts (up to 15%).
* **Assessment Framework:** Orchestrated scheduling systems for simulated mock interviews, production-level code evaluation, and live 1-on-1 mentor sessions.
* **Event Architecture:** Dynamic platform schedule calendar alongside customizable visibility layers for public profiles.

### Mentor (Buddy) Architecture
* **Assigned Mentee Roster:** Dedicated metrics tracking completion percentages, activity states, and automated inactivity timers.
* **Deep-Dive Profiling:** Read-only access to progress tracks and explicit administrative blocks verification tools.
* **Evaluation Framework:** Full lifecycle tools to initialize, grade, and finalize mock technical interviews with structured text feedback blocks.
* **Schedule Manipulation:** Write-access parameters to create and alter centralized event calendars.

---

## Authentication and API Lifecycle

Session states are maintained via encrypted `localStorage` entries combined with `httpOnly` secure tracking layer synchronization. Outbound requests are intercepted to inject `Authorization: Bearer <token>` tokens. 

Multi-role identity parameters trigger an explicit boundary selection screen upon entry, persisting user-defined viewport states across subsequent platform interactions.

---

## Verification Environment and Seeding

### Mock Database Credentials

* **Student Role Profile:** Account Username: `test_student` | Secure Password: `123`
* **Mentor Role Profile:** Account Username: `test_buddy` | Secure Password: `123`
* **Administrator Profile:** Account Username: `admin` | Secure Password: `123`

### API Health Check Probe
Verify API integration by performing a manual target handshake with the login engine:
```bash
curl -X POST http://185.75.189 \
  -H "Content-Type: application/json" \
  -d '{"login":"test_buddy","password":"123"}'
```