# Health Care Server

A TypeScript backend API for a health care appointment platform. The system supports user authentication, doctors, patients, schedules, appointments, prescriptions, reviews, payments, file uploads, and admin workflows.

## Project Problem

Many health care services still depend on manual appointment booking, phone calls, scattered patient records, and disconnected payment workflows. This creates several problems:

- Patients cannot easily find available doctors and book appointments online.
- Doctors need a structured way to manage schedules and patient appointments.
- Admin teams need controlled access to manage doctors, patients, specialties, and platform data.
- Prescriptions, reviews, and appointment history need to be connected to the correct patient and doctor.
- Payment processing needs to be integrated with appointment workflows.
- File uploads such as profile photos, medical documents, and specialty icons need safe storage.
- Backend code needs to be maintainable, testable, and production-ready as the platform grows.

## My Solution

I built a modular Express.js and TypeScript backend that provides the core API layer for a digital health care platform.

My solution includes:

- JWT-based authentication and role-based route protection.
- User, admin, doctor, and patient management APIs.
- Doctor schedule and appointment booking workflows.
- Prescription and review management.
- Payment initialization and validation through SSLCommerz.
- File upload support using Multer and Cloudinary.
- PostgreSQL database access through Prisma ORM.
- Zod-based environment validation to catch missing configuration early.
- Centralized error handling for consistent API responses.
- Health check endpoint for deployment monitoring.
- Graceful shutdown with Prisma disconnect.
- Unit and API smoke tests to protect key behavior.
- Incremental refactoring toward controller-service-repository architecture.

This project is not only a feature implementation. It also shows how an older Express backend can be improved step-by-step without breaking existing API behavior.

## Project Purpose

This backend solves the core API needs of a digital health care platform:

- Patients can register, manage profiles, find doctors, and book appointments.
- Doctors can manage schedules, appointments, prescriptions, and patient-related workflows.
- Admin users can manage users, doctors, patients, specialties, and platform data.
- The platform can initialize and validate payments through SSLCommerz.
- Profile images and specialty icons can be uploaded through Cloudinary.
- Protected routes use JWT-based authentication and role-based access control.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- JWT
- bcrypt / bcryptjs
- Multer
- Cloudinary
- SSLCommerz
- Nodemailer
- Node test runner
- Supertest

## Architecture

The codebase is being refactored module-by-module toward a layered backend architecture:

```text
Routes -> Controller -> Service -> Repository -> Database
```

Responsibilities:

- Routes define endpoints and attach middleware.
- Controllers handle HTTP request and response mapping.
- Services contain business logic.
- Repositories contain database access through Prisma.
- Shared middleware handles validation, authentication, errors, and not-found responses.

Reference modules already following this pattern:

- `Specalties`
- `Schedule`

This incremental approach keeps the public API stable while improving maintainability and testability.

## Improvements Already Added

- Centralized environment validation using Zod.
- Centralized error handling middleware.
- Async controller wrapper.
- Health check endpoint.
- Graceful shutdown with Prisma disconnect.
- TypeScript typecheck and build scripts.
- `.env.example` for onboarding.
- README documentation.
- API smoke tests with Supertest.
- Service unit tests for refactored modules.
- Controller-service-repository reference pattern for selected modules.

## Requirements

- Node.js 18+
- npm
- PostgreSQL

## Setup

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Update `.env` with real values for:

- PostgreSQL database URL
- JWT secrets
- Email credentials
- Cloudinary credentials
- SSLCommerz credentials

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations for production-like environments:

```bash
npx prisma migrate deploy
```

For local development:

```bash
npx prisma migrate dev
```

## Scripts

```bash
npm run dev        # start development server
npm run typecheck  # run TypeScript checks
npm test           # run unit and API tests
npm run build      # compile TypeScript to dist
npm run seed       # run Prisma seed script
```

## API Overview

Default local base URL:

```text
http://localhost:5000
```

Health endpoints:

```http
GET /
GET /health
```

Versioned API base path:

```text
/api/v1
```

Registered module routes:

```text
/api/v1/user
/api/v1/admin
/api/v1/auth
/api/v1/specalties
/api/v1/doctor
/api/v1/patient
/api/v1/schedules
/api/v1/doctorSchedules
/api/v1/appointments
/api/v1/payments
/api/v1/prescriptions
/api/v1/reviews
/api/v1/tasks
```

Note: `/specalties` keeps the current spelling to preserve existing API compatibility.

## Testing

Run all tests:

```bash
npm test
```

Current tests include:

- API smoke tests for `/`, `/health`, and unknown routes.
- Service unit tests for `Specalties`.
- Service unit tests for `Schedule`.

Run typecheck:

```bash
npm run typecheck
```

Run production build:

```bash
npm run build
```

## Production Build

```bash
npm run build
node dist/server.js
```

Before production deployment:

- Set `NODE_ENV=production`.
- Provide all required environment variables.
- Run Prisma migrations.
- Run `npx prisma migrate deploy` after pulling schema changes such as the `tasks` table.
- Configure trusted CORS origins.
- Remove sensitive debug logs.
- Add rate limiting and security headers.
- Review unauthenticated or commented auth routes.

## Current Production Readiness Status

The project builds and has a basic test gate, but it still needs hardening before production use.

Known risks:

- Some routes still need stricter role-based authorization.
- Some modules still access Prisma directly from services.
- Some debug logs print sensitive request/auth data and should be removed.
- CORS is currently permissive.
- Security headers and rate limiting are not fully configured.
- Test coverage is still limited.
- Dependency audit reports vulnerabilities that need careful package updates.

## Future Improvements

- Refactor all modules into controller-service-repository structure.
- Add integration tests for auth, appointments, payments, and user flows.
- Add request ID middleware and structured logging.
- Add Helmet and rate limiting.
- Add Dockerfile and deployment guide.
- Add CI/CD checks for typecheck, tests, build, and audit.
- Add Swagger/OpenAPI documentation.
- Improve Prisma error mapping.
- Add role-based authorization tests.
- Add refresh-token security improvements.
- Add transaction tests for multi-step database writes.

## Recruiter Summary

This project demonstrates backend API development with Express.js, TypeScript, PostgreSQL, and Prisma. It includes authentication, role-based access, appointment scheduling, payment integration, file uploads, modular refactoring, production-readiness improvements, and automated tests.

The codebase is being improved incrementally using clean architecture principles while preserving existing API behavior.
