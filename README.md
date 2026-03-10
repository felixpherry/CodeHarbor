# 🚢 CodeHarbor

**CodeHarbor** is a full-featured coding education platform management system built with Next.js 14. It provides a multi-role portal for admins, instructors, students, and parents — supporting course management, real-time class messaging, video calls, scheduling, evaluations, and online registrations.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)

---

## ✨ Features

### 🔐 Authentication & Roles
- Google OAuth and credentials-based login via **NextAuth.js**
- Four distinct user roles: **Admin**, **Instructor**, **Student**, **Parent**
- Role-based route guards and personalized dashboards
- Multi-step onboarding flow per role

### 🎓 Course & Program Management
- Hierarchical content structure: **Programs → Courses → Sessions**
- Rich-text session content with **Tiptap** editor and file attachments
- Course categories with age-level descriptions
- Skill level tagging (Beginner / Intermediate / Advanced)
- Publish/draft and soft-delete lifecycle controls

### 🗓️ Scheduling
- Period-based class scheduling with master day/shift configurations
- Instructor timetable management and conflict detection
- Per-class schedule dates with meeting URLs and recording links

### 📊 Evaluation & Grading
- Configurable course evaluation criteria with weights
- Per-student scores per evaluation component
- Session-level reports (attendance, feedback, score)
- Master grade scale with custom hex-coded categories

### 💬 Real-Time Communication
- **Socket.IO** powered class messaging channels
- File sharing within class chats
- Soft-deleted messages with audit trail

### 📹 Video Calls
- Integrated live sessions via **LiveKit** WebRTC
- Room-based video/audio with `@livekit/components-react`

### 📁 File Uploads
- Managed file uploads via **UploadThing** (images, documents, ID cards, NPWP)
- File keys stored for clean deletion and reference

### 📝 Registrations
- Online trial class registration form
- Full course enrollment with coupon support
- Instructor applicant registration with skills/education
- Approval workflows (Pending / Approved / Rejected)

### 🌐 Landing & CMS
- Public-facing landing page with admin-managed Hero, Logo, and FAQ sections

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Database** | MySQL |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Google OAuth + Credentials) |
| **UI Library** | [Mantine UI v7](https://mantine.dev/) |
| **Component Primitives** | [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), CSS Variables |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Rich Text** | [Tiptap](https://tiptap.dev/), [React Quill](https://zenoamaro.github.io/react-quill/) |
| **Real-Time** | [Socket.IO](https://socket.io/) |
| **Video** | [LiveKit](https://livekit.io/) |
| **File Uploads** | [UploadThing](https://uploadthing.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Drag & Drop** | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) |
| **Tables** | [TanStack Table v8](https://tanstack.com/table) |
| **Icons** | [Lucide React](https://lucide.dev/), [Tabler Icons](https://tabler.io/icons), [React Icons](https://react-icons.github.io/react-icons/) |
| **Date Utilities** | date-fns, Day.js, Luxon, Moment.js |
| **Package Manager** | [pnpm](https://pnpm.io/) |

---

## 🏗 Architecture

CodeHarbor uses **Next.js 14 App Router** with route groups to cleanly separate layout contexts for different sections of the application.

```
app/
├── (auth)/           # Login & registration pages
├── (landing)/        # Public marketing site
├── (onboarding)/     # Post-signup onboarding flows
├── (preferences)/    # User settings & preferences
└── (dashboard)/      # Authenticated application
    └── (routes)/
        ├── admin/        # Admin control panel
        ├── instructor/   # Instructor portal
        ├── student/      # Student portal
        ├── parent/       # Parent portal
        ├── classes/      # Class detail & messaging
        ├── schedule/     # Timetable views
        ├── dashboard/    # Role-specific dashboards
        └── profile/      # Account profile management
```

### API Layer

All API routes live under `app/api/` and are structured as Next.js Route Handlers. Real-time features are served through a custom **Socket.IO** server mounted alongside the Next.js server (via `pages/` directory for the socket endpoint).

### Data Flow

```
Client (React / TanStack Query)
        │
        ▼
Next.js API Route Handlers
        │
        ▼
Prisma Client  ──▶  MySQL Database
        │
        ▼
UploadThing (files) / LiveKit (video) / Socket.IO (messaging)
```

### Authentication Flow

1. User signs in via **Google OAuth** or **email + password** (bcrypt hashed).
2. **NextAuth.js** creates a JWT session.
3. Session is extended with the user's `role` and `accountId`.
4. Middleware enforces role-based access to dashboard routes.
5. New users are redirected to the **onboarding** flow to complete their profile.

---

## 🗄 Database Schema

The database is hosted on **MySQL** and managed through **Prisma ORM** (with `relationMode = "prisma"` for PlanetScale compatibility).

### Core Domain Models

| Model | Description |
|---|---|
| `Account` | Base user entity shared across all roles |
| `Admin` | Admin profile linked to Account |
| `Instructor` | Instructor profile with education, skills, and documents |
| `Student` | Student profile with academic details and parent linkage |
| `Parent` | Parent profile linked to one or more Students |
| `Program` | Top-level learning program (e.g., a coding track) |
| `Course` | Individual course within a program with levels and categories |
| `Session` | Lesson content unit belonging to a course |
| `Class` | A running instance of a course for a given period |
| `Schedule` | A single class meeting with date, time, and recording links |
| `Period` | Academic period (e.g., semester) with start/end dates |
| `InstructorSchedule` | Instructor's day/shift assignment for a period |
| `StudentCourse` | Enrollment record linking students to courses and classes |
| `CourseEvaluation` | Grading criteria with weights for a course |
| `StudentScore` | Individual student score per evaluation component |
| `SessionReport` | Per-session attendance, feedback, and score from instructor |
| `Message` | Real-time class chat messages from instructors or students |
| `CourseRegistration` | Full course enrollment form submission |
| `TrialClassRegistration` | Trial class sign-up form submission |
| `InstructorRegistration` | Instructor job application submission |
| `Coupon` | Discount codes for course registrations |
| `Skill` | Teaching skills taggable to instructors |
| `MasterDay` / `MasterShift` | Reference tables for scheduling configuration |
| `MasterGrade` | Grading scale categories with score ranges |
| `Hero` / `Logo` / `Faq` | CMS content for the public landing page |

### User Roles & Enums

```
Role:               ADMIN | PARENT | INSTRUCTOR | STUDENT
Status:             ACTIVE | BANNED
RegistrationStatus: PENDING | APPROVED | REJECTED
Level:              BEGINNER | INTERMEDIATE | ADVANCED
Gender:             MALE | FEMALE
DayOfWeek:          MONDAY … SUNDAY
LastEducation:      SMA | S1 | S2 | S3
```

---

## 📁 Project Structure

```
CodeHarbor/
├── app/                    # Next.js App Router pages & API routes
├── components/             # Shared React components
├── constants/              # App-wide constants
├── fonts/                  # Local font files
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions & server-side helpers
├── pages/                  # Next.js Pages Router (Socket.IO endpoint)
├── prisma/
│   └── schema.prisma       # Database schema
├── providers/              # React context providers
├── public/                 # Static assets
├── stores/                 # Zustand global state stores
├── types/                  # TypeScript type definitions
├── tailwind.config.ts      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── components.json         # shadcn/ui component config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MySQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/felixpherry/CodeHarbor.git
cd CodeHarbor

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your values (see Environment Variables below)

# Push the database schema
pnpm dlx prisma db push

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔑 Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXT_AUTH_SECRET=
NEXT_AUTH_URL=http://localhost:3000

# Database (MySQL)
DATABASE_URL=

# UploadThing (file uploads)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

---

## 📄 License

This project is private. All rights reserved.
