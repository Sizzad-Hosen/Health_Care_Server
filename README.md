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

## API Reference

All API endpoints use this base URL unless noted:

```text
http://localhost:5000/api/v1
```

Protected endpoints require a bearer token:

```http
Authorization: Bearer <accessToken>
```

Common list query parameters:

```text
page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

Standard JSON response shape:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  },
  "data": {}
}
```

### Auth Module

Base path: `/auth`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Login user and receive access token |
| POST | `/auth/refreshtoken` | Refresh cookie | Generate new access token |
| POST | `/auth/forgot-password` | Public | Send password reset email |
| POST | `/auth/reset-password` | Reset token | Reset password |
| POST | `/auth/change-password` | `SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `PATIENT` | Change logged-in user's password |

Login request:

```json
{
  "email": "patient@example.com",
  "password": "123456"
}
```

Forgot password request:

```json
{
  "email": "patient@example.com"
}
```

Reset password request:

```http
Authorization: Bearer <resetToken>
```

```json
{
  "password": "newPassword123"
}
```

Change password request:

```json
{
  "oldPassword": "123456",
  "newPassword": "newPassword123"
}
```

### User Module

Base path: `/user`

User create and profile update endpoints use `multipart/form-data`.

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/user/me` | Any logged-in user | Get logged-in user's profile |
| POST | `/user/create-admin` | Public in current code | Create admin account |
| POST | `/user/create-doctor` | Public in current code | Create doctor account |
| POST | `/user/create-patient` | Public | Create patient account |
| PATCH | `/user/update-my-profile` | `SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `PATIENT` | Update own profile |

Create patient request:

```text
Content-Type: multipart/form-data
field: data
optional field: file
```

```json
{
  "password": "123456",
  "patient": {
    "name": "Ayesha Rahman",
    "email": "ayesha@example.com",
    "contactNumber": "+8801712345678",
    "address": "Dhaka, Bangladesh"
  }
}
```

Create admin request:

```json
{
  "password": "123456",
  "admin": {
    "name": "Admin User",
    "email": "admin@example.com",
    "contactNumber": "+8801712345678"
  }
}
```

Create doctor request:

```json
{
  "password": "123456",
  "doctor": {
    "name": "Dr. Karim",
    "email": "doctor@example.com",
    "contactNumber": "+8801712345678",
    "address": "Dhaka",
    "registrationNumber": "BMDC-12345",
    "experience": 8,
    "gender": "MALE",
    "appointmentFee": 700,
    "qualification": "MBBS, FCPS",
    "currentWorkingPlace": "City Hospital",
    "designation": "Consultant"
  }
}
```

Update own profile request:

```text
Content-Type: multipart/form-data
field: data
optional field: file
```

```json
{
  "name": "Updated Name",
  "contactNumber": "+8801712345678",
  "address": "Updated address"
}
```

### Admin Module

Base path: `/admin`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/admin` | Public in current code | Get admins with filtering and pagination |
| GET | `/admin/:id` | `SUPER_ADMIN` | Get admin by id |
| PATCH | `/admin/:id` | Public in current code | Update admin |
| DELETE | `/admin/:id` | Public in current code | Hard delete admin |
| DELETE | `/admin/soft/:id` | Public in current code | Soft delete admin |

Filter examples:

```text
GET /admin?searchTerm=admin&page=1&limit=10
```

Update admin request:

```json
{
  "name": "Updated Admin",
  "email": "updated-admin@example.com",
  "contactNumber": "+8801712345678"
}
```

### Doctor Module

Base path: `/doctor`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/doctor` | Public | Get doctors with filtering and pagination |
| GET | `/doctor/:id` | Public | Get doctor by id |
| PATCH | `/doctor/:id` | `SUPER_ADMIN`, `ADMIN`, `DOCTOR` | Update doctor |
| DELETE | `/doctor/:id` | `SUPER_ADMIN`, `ADMIN` | Hard delete doctor |
| DELETE | `/doctor/soft/:id` | `SUPER_ADMIN`, `ADMIN` | Soft delete doctor |

Filter examples:

```text
GET /doctor?searchTerm=karim&gender=MALE&specialties=cardiology&page=1&limit=10
```

Update doctor request:

```json
{
  "name": "Dr. Updated",
  "contactNumber": "+8801712345678",
  "registrationNumber": "BMDC-99999",
  "experience": 10,
  "gender": "MALE",
  "apointmentFee": 800,
  "qualification": "MBBS, MD",
  "currentWorkingPlace": "Updated Hospital",
  "designation": "Senior Consultant",
  "specialties": [
    {
      "specialtiesId": "specialty-id"
    },
    {
      "specialtiesId": "old-specialty-id",
      "isDeleted": true
    }
  ]
}
```

Note: The doctor update validator currently uses `apointmentFee`, while doctor creation uses `appointmentFee`.

### Patient Module

Base path: `/patient`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/patient` | Public in current code | Get patients with filtering and pagination |
| GET | `/patient/:id` | Public in current code | Get patient by id |
| PATCH | `/patient/:id` | Public in current code | Update patient profile, health data, or medical report |
| DELETE | `/patient/:id` | Public in current code | Hard delete patient |
| DELETE | `/patient/soft/:id` | Public in current code | Soft delete patient |

Filter examples:

```text
GET /patient?searchTerm=ayesha&email=ayesha@example.com&page=1&limit=10
```

Update patient request:

```json
{
  "name": "Ayesha Rahman",
  "contactNumber": "+8801712345678",
  "address": "Dhaka",
  "patientHealthData": {
    "gender": "FEMALE",
    "dateOfBirth": "1995-01-15T00:00:00.000Z",
    "bloodGroup": "A_POSITIVE",
    "hasAllergies": false,
    "hasDiabetes": false,
    "height": "165 cm",
    "weight": "58 kg",
    "smokingStatus": false,
    "dietaryPreferences": "Regular",
    "pregnancyStatus": false,
    "mentalHealthHistory": "None",
    "immunizationStatus": "Complete",
    "hasPastSurgeries": false,
    "recentAnxiety": false,
    "recentDepression": false,
    "maritalStatus": "UNMARRIED"
  },
  "medicalReport": {
    "reportName": "Blood Test",
    "reportLink": "https://example.com/report.pdf"
  }
}
```

### Specialties Module

Base path: `/specalties`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/specalties` | Public | Get all specialties |
| POST | `/specalties` | Public in current code | Create specialty |
| DELETE | `/specalties/:id` | `SUPER_ADMIN`, `ADMIN` | Delete specialty |

Create specialty request:

```text
Content-Type: multipart/form-data
field: data
optional field: file
```

```json
{
  "title": "Cardiology"
}
```

### Schedule Module

Base path: `/schedules`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/schedules` | Public in current code | Get available schedules |
| GET | `/schedules/:id` | Public in current code | Get schedule by id |
| POST | `/schedules` | Public in current code | Create 30-minute schedule slots |
| DELETE | `/schedules/:id` | Public in current code | Delete schedule |

Filter examples:

```text
GET /schedules?startDate=2026-06-12&endDate=2026-06-20&page=1&limit=10
```

Create schedule request:

```json
{
  "startDate": "2026-06-12",
  "endDate": "2026-06-14",
  "startTime": "09:00",
  "endTime": "17:00"
}
```

### Doctor Schedules Module

Base path: `/doctorSchedules`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/doctorSchedules` | `SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `PATIENT` | Get doctor schedules with filtering |
| GET | `/doctorSchedules/my-schedule` | `DOCTOR` | Get logged-in doctor's schedules |
| POST | `/doctorSchedules` | `DOCTOR` | Assign schedules to logged-in doctor |
| DELETE | `/doctorSchedules/:id` | `DOCTOR` | Remove logged-in doctor's schedule by schedule id |

Filter examples:

```text
GET /doctorSchedules?searchTerm=karim&isBooked=false&doctorId=doctor-id&page=1&limit=10
GET /doctorSchedules/my-schedule?startDate=2026-06-12&endDate=2026-06-20&isBooked=false
```

Create doctor schedule request:

```json
{
  "scheduleIds": [
    "schedule-id-1",
    "schedule-id-2"
  ]
}
```

### Appointment Module

Base path: `/appointments`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/appointments` | `SUPER_ADMIN`, `ADMIN` | Get all appointments with filtering |
| GET | `/appointments/my-appointment` | `PATIENT`, `DOCTOR` | Get logged-in user's appointments |
| POST | `/appointments` | `PATIENT` | Book an appointment |
| PATCH | `/appointments/status/:id` | `SUPER_ADMIN`, `ADMIN`, `DOCTOR` | Change appointment status |

Filter examples:

```text
GET /appointments?status=SCHEDULED&paymentStatus=UNPAID&patientEmail=patient@example.com
GET /appointments/my-appointment?status=SCHEDULED&page=1&limit=10
```

Create appointment request:

```json
{
  "doctorId": "doctor-id",
  "scheduleId": "schedule-id"
}
```

Change appointment status request:

```json
{
  "status": "COMPLETED"
}
```

Allowed appointment statuses:

```text
SCHEDULED, INPROGRESS, COMPLETED, CANCELED
```

### Payment Module

Base path: `/payments`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/payments/init-payment/:appointmentId` | Public in current code | Initialize SSLCommerz payment |
| GET | `/payments/ipn` | SSLCommerz callback | Validate payment callback/query |

Initialize payment example:

```text
POST /payments/init-payment/appointment-id
```

IPN validation example:

```text
GET /payments/ipn?tran_id=transaction-id&status=VALID
```

### Prescription Module

Base path: `/prescriptions`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/prescriptions` | `SUPER_ADMIN`, `ADMIN` | Get prescriptions with filtering |
| GET | `/prescriptions/my-prescription` | `PATIENT` | Get logged-in patient's prescriptions |
| POST | `/prescriptions` | `DOCTOR` | Create prescription |

Filter examples:

```text
GET /prescriptions?patientEmail=patient@example.com&doctorEmail=doctor@example.com
```

Create prescription request:

```json
{
  "appointmentId": "appointment-id",
  "instructions": "Take medicine twice daily after meals."
}
```

### Review Module

Base path: `/reviews`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/reviews` | Public | Get reviews with filtering |
| POST | `/reviews` | `PATIENT` | Create appointment review |

Filter examples:

```text
GET /reviews?patientEmail=patient@example.com&doctorEmail=doctor@example.com
```

Create review request:

```json
{
  "appointmentId": "appointment-id",
  "rating": 4.5,
  "comment": "Helpful consultation."
}
```

### Meta Module

Base path: `/meta`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/meta` | `SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `PATIENT` | Get role-based dashboard metadata |

Example:

```text
GET /meta
Authorization: Bearer <accessToken>
```

### Task Module

Base path: `/tasks`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/tasks` | Public in current code | Get tasks with filtering |
| GET | `/tasks/:id` | Public in current code | Get task by id |
| POST | `/tasks` | Public in current code | Create task |
| PATCH | `/tasks/:id` | Public in current code | Update task |
| DELETE | `/tasks/:id` | Public in current code | Delete task |

Filter examples:

```text
GET /tasks?status=pending&priority=high&page=1&limit=10
```

Create task request:

```json
{
  "title": "Follow up with patient",
  "description": "Call patient after prescription review",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-06-20T10:00:00.000Z"
}
```

Update task request:

```json
{
  "status": "completed"
}
```

Allowed task values:

```text
status: pending, in-progress, completed
priority: low, medium, high
```

### Endpoint Coverage Report

This README documents the currently registered API modules from `src/app/modules/routes/index.ts`:

- Auth: login, refresh token, forgot password, reset password, change password.
- User: profile, admin creation, doctor creation, patient registration, profile update.
- Admin: list, detail, update, hard delete, soft delete.
- Doctor: list, detail, update, hard delete, soft delete.
- Patient: list, detail, update, hard delete, soft delete.
- Specialties: list, create, delete.
- Schedule: list, detail, create slots, delete.
- Doctor schedules: list, my schedules, assign schedules, delete schedule assignment.
- Appointments: list, my appointments, create, status update.
- Payments: initialize payment and validate IPN.
- Prescriptions: list, my prescriptions, create.
- Reviews: list and create.
- Meta: dashboard summary data.
- Tasks: full CRUD.

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
