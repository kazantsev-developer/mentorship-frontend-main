# Go Mentorship Platform (Frontend – Student/Buddy)

The official web frontend for students and mentors (buddies), powered by Next.js, TypeScript, Tailwind CSS, and HeroUI.

## Deployment via Docker Compose

1. Clone the repository and navigate to the project root:
```bash
git clone https://github.com/kazantsev-developer/mentorship-frontend-main
cd mentorship-frontend-main
```

2. Pass the backend API URL during compilation or create a `.env.local` file:
```bash
docker-compose build --build-arg NEXT_PUBLIC_API_URL=http://185.75.189.130:8080
docker-compose up -d
```
The frontend application will be accessible at http://localhost:3000.

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Demo Credentials

* **Student:** `test_student` / `123`
* **Buddy (Mentor):** `test_buddy` / `123`
* **Admin:** `admin` / `123`

## Tech Stack

* **Core Framework:** Next.js 14 (App Router, Client Components), TypeScript
* **Styling & UI:** Tailwind CSS with native CSS variables (Dark/Light mode support), HeroUI
* **Animations & Icons:** Framer Motion, Iconify
* **Utilities:** Sonner (Toast notifications), next-themes (Theme management)

## Key Features

### Student Interface
* **Interactive Roadmap:** Structured modules covering Theory, Q&A, Practice, and Assignments.
* **Resource Preview Cards:** Rich link previews for URL, YouTube, and GitHub resources.
* **Material Tracking:** Status indicators for mandatory and optional learning materials.
* **Progress Analytics:** Granular progress tracking per module alongside an overall completion metrics dashboard.
* **Gamification Engine:** Automated achievement system featuring 14 distinct unlockable badge types.
* **Bonus Economy:** Transaction history ledger with a conversion system offering up to a 15% discount.
* **Interview Prep:** Mock and live interview scheduling infrastructure.
* **Mentorship Sessions:** One-on-one mentor booking workflow.
* **Event Calendar:** Integrated scheduling calendar for milestone tracking.
* **Public Profile:** User portfolio customization with fine-grained privacy controls.

### Buddy (Mentor) Interface
* **Student Roster:** High-level dashboard monitoring assigned students, complete with progress status and inactivity alerts.
* **Deep-Dive Analytics:** Detailed inspection of student module completion metrics.
* **Module Verifications:** Approval mechanism for signing off on completed study modules.
* **Interview Management:** Lifecycle control for creating, conducting, and concluding mock interviews.
* **Feedback Loops:** Formal evaluation systems for structural interview debriefs.
* **Calendar Control:** Direct CRUD execution capabilities on the shared event calendar.

## Authentication Mechanism

* **Token Lifecycle:** JSON Web Tokens (JWT) are saved persistently across local storage and HTTP cookies.
* **Request Interception:** Outgoing requests automatically inject the `Authorization: Bearer <token>` header payload.
* **Multi-Role Handling:** Users with multiple assigned system roles are presented with a role selection gateway during authorization. The active workspace preference is cached across distinct sessions.

## API Connectivity Check

Validate connection to the backend infrastructure with the following request payload:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"test_buddy","password":"123"}'
```
