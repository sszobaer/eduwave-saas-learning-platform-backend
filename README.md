**EduWave LMS - Backend Development Plan (Updated)**

---

## 1. Project Overview

**Project:** Multi-Tenant Learning Management System (EduWave LMS)
**Stack:** NestJS + PostgreSQL + Jitsi Meet + SSLCommerz Sandbox
**Team:** 3 Backend Developers
**Timeframe:** 2–3 weeks (18 days)
**Goal:** Build a production-like MVP for a multi-tenant LMS with core functionalities for courses, live lectures, quizzes, certificates, payments, and dashboards.

---

## 2. Modules and Functionalities

### Dev 1 – Core & User Management Lead

* **Auth Module:** JWT login/signup, password hashing, refresh tokens, role-based guards
* **User Management Module:** CRUD for users, role assignment, profile updates, admin-only access
* **Notification Module (Basic):** Email notification setup, triggers for assignment/lecture events

### Dev 2 – Course & Learning Operations Lead

* **Course Management:** CRUD, course-teacher-student relations
* **Lecture & Attendance Module:** Lecture scheduling, Jitsi Meet integration, attendance tracking
* **Assignment Module:** Create/submit assignments, grading & feedback, file upload
* **Quiz Module:** Quiz creation, multiple-choice questions, auto-grading, and score storage

### Dev 3 – Evaluation, Payment & Dashboard Lead

* **Payment Module:** SSLCommerz sandbox integration, payment verification, enrollment post-payment
* **Result/Grading Module:** Store grades, generate progress reports
* **Certificate Module:** Auto-generate completion certificates (PDF), dynamic course data injection
* **Analytics & Dashboard API:** Aggregate data (users, revenue, attendance, quiz stats), dashboard summary endpoints

---

## 3. Work Distribution Table

| Developer | Module / Feature          | Responsibilities                                                | Dependencies     | Complexity |
| --------- | ------------------------- | --------------------------------------------------------------- | ---------------- | ---------- |
| Dev 1     | Auth Module               | JWT login/signup, password hashing, refresh tokens, role guards | None             | Medium     |
| Dev 1     | User Management Module    | CRUD users, role assignment, profile updates                    | Auth             | Medium     |
| Dev 1     | Notification Module       | Email notifications, event triggers                             | User, Assignment | Light      |
| Dev 2     | Course Management Module  | CRUD courses, course-teacher-student relations                  | User             | Medium     |
| Dev 2     | Lecture & Attendance      | Lecture scheduling, Jitsi integration, attendance tracking      | Course           | Heavy      |
| Dev 2     | Assignment Module         | Assignment CRUD, submission, grading, file upload               | Course, User     | Heavy      |
| Dev 2     | Quiz Module               | Quiz creation, auto-grading, result storage                     | Course, User     | Medium     |
| Dev 3     | Payment Module            | SSLCommerz sandbox, payment verification, enrollment            | Course, User     | Heavy      |
| Dev 3     | Result/Grading Module     | Store grades, generate reports                                  | Assignment, Quiz | Medium     |
| Dev 3     | Certificate Module        | Generate completion certificates (PDF)                          | Result, Course   | Medium     |
| Dev 3     | Analytics & Dashboard API | Aggregate data, dashboard endpoints                             | All modules      | Medium     |

---

## 4. MVP Core Features

* Multi-tenant structure (tenant isolation via org_id)
* Authentication (JWT, roles: Admin, Teacher, Student)
* Course CRUD with file upload
* Lecture scheduling and live class integration (Jitsi Meet)
* Attendance tracking
* Quiz system with auto-grading
* Certificate generation (PDF)
* Payment integration (SSLCommerz sandbox)
* Dashboard summary: user/course counts, revenue, quiz stats

---

## 5. SCRUM Plan (3 Sprints)

### Sprint 1 – Foundation Setup (Days 1–5)

* NestJS project setup, DB + TypeORM entities
* Auth module complete (JWT, roles)
* Multi-tenant structure and middleware
* User CRUD endpoints
* Notification module (basic)

### Sprint 2 – Course, Lecture & Quiz (Days 6–11)

* Course CRUD complete
* Lecture entity & Jitsi Meet integration
* Attendance tracking APIs
* File upload system (notes, PDFs)
* Quiz creation & grading logic

### Sprint 3 – Payment, Certificate & Dashboard (Days 12–18)

* SSLCommerz payment integration (sandbox)
* Payment verification & enrollment API
* Certificate generation (PDF auto-template)
* Dashboard API (user/course counts, revenue, quiz performance)
* Final integration, testing, bug fixes, sample data seeding

---

## 6. Daily Scrum Focus

| Day   | Focus                                   | Expected Output                      |
| ----- | --------------------------------------- | ------------------------------------ |
| 1     | Nest app init + shared modules          | Project skeleton ready               |
| 2     | DB + entities + auth DTOs               | Tables + entities mapped             |
| 3     | JWT + roles                             | Auth endpoints ready                 |
| 4     | Tenant middleware + Org isolation       | Multi-tenant middleware ready        |
| 5     | Auth testing + docs                     | Auth fully functional                |
| 6     | Course CRUD                             | Courses module ready                 |
| 7     | Lecture entity + Jitsi                  | Lecture endpoints ready              |
| 8     | Attendance service                      | Attendance APIs ready                |
| 9     | File uploads + Quiz setup               | Upload & quiz endpoints ready        |
| 10    | Course + Lecture + Quiz integration     | Integration endpoints ready          |
| 11    | Sprint 2 testing                        | Bugs fixed, module stable            |
| 12    | Payment setup                           | Payment endpoints ready              |
| 13    | Webhook listener + DB update            | Sandbox testing complete             |
| 14    | Certificate generation + Dashboard APIs | Certificate & dashboard ready        |
| 15–17 | Integration testing                     | End-to-end tested & bugs fixed       |
| 18    | Final integration                       | Deployment ready, sample data seeded |

---

## 7. Notes / Best Practices

* API-first approach with OpenAPI documentation for mocks
* Feature toggles for Jitsi, quiz, and payments during development
* Daily 15-min standups for blockers
* CI/CD pipeline for deployment
* Migrations for DB and seeding data before final deployment

---

**This document summarizes the backend module division, MVP features, SCRUM plan, and work distribution for the EduWave LMS MVP project including quiz and certificate generation functionalities.**
