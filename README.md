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

## 7. Database Information

# **EduWave LMS — Normalized Database Design**

---

## **1. organizations**

| Column     | Type         | PK / FK | Description            |
| ---------- | ------------ | ------- | ---------------------- |
| org_id     | SERIAL       | PK      | Organization ID        |
| name       | VARCHAR(255) |         | Organization name      |
| domain     | VARCHAR(255) |         | Subdomain or domain    |
| created_at | TIMESTAMP    |         | Creation timestamp     |
| updated_at | TIMESTAMP    |         | Last updated timestamp |

---

## **2. roles**

| Column     | Type        | PK / FK | Description                           |
| ---------- | ----------- | ------- | ------------------------------------- |
| role_id    | SERIAL      | PK      | Role ID                               |
| role_name  | VARCHAR(50) |         | Role name (Admin / Teacher / Student) |
| created_at | TIMESTAMP   |         | Creation timestamp                    |
| updated_at | TIMESTAMP   |         | Last updated timestamp                |

---

## **3. users**

| Column      | Type                | PK / FK                    | Description            |
| ----------- | ------------------- | -------------------------- | ---------------------- |
| user_id     | SERIAL              | PK                         | User ID                |
| org_id      | INT                 | FK → organizations(org_id) | Tenant / organization  |
| role_id     | INT                 | FK → roles(role_id)        | Role of the user       |
| full_name   | VARCHAR(255)        |                            | User’s full name       |
| email       | VARCHAR(255) UNIQUE |                            | Email for login        |
| password    | VARCHAR(255)        |                            | Hashed password        |
| profile_img | TEXT                |                            | Optional image         |
| created_at  | TIMESTAMP           |                            | Creation timestamp     |
| updated_at  | TIMESTAMP           |                            | Last updated timestamp |

---

## **4. courses**

| Column             | Type          | PK / FK                    | Description                |
| ------------------ | ------------- | -------------------------- | -------------------------- |
| course_id          | SERIAL        | PK                         | Course ID                  |
| org_id             | INT           | FK → organizations(org_id) | Organization               |
| created_by_user_id | INT           | FK → users(user_id)        | Teacher who created course |
| title              | VARCHAR(255)  |                            | Course title               |
| description        | TEXT          |                            | Course description         |
| price              | DECIMAL(10,2) |                            | Course fee                 |
| thumbnail_url      | TEXT          |                            | Course thumbnail           |
| created_at         | TIMESTAMP     |                            | Creation timestamp         |
| updated_at         | TIMESTAMP     |                            | Last updated timestamp     |

---

## **5. course_tags**

| Column     | Type         | PK / FK | Description                     |
| ---------- | ------------ | ------- | ------------------------------- |
| tag_id     | SERIAL       | PK      | Tag ID                          |
| tag_name   | VARCHAR(100) |         | Tag name (Python, AI, Frontend) |
| created_at | TIMESTAMP    |         | Creation timestamp              |
| updated_at | TIMESTAMP    |         | Last updated timestamp          |

---

## **6. course_tags_mapping** *(Many-to-Many)*

| Column                | Type      | PK / FK                  | Description        |
| --------------------- | --------- | ------------------------ | ------------------ |
| course_tag_mapping_id | SERIAL    | PK                       | Mapping ID         |
| course_id             | INT       | FK → courses(course_id)  | Linked course      |
| tag_id                | INT       | FK → course_tags(tag_id) | Linked tag         |
| created_at            | TIMESTAMP |                          | Creation timestamp |

---

## **7. enrollments**

| Column          | Type      | PK / FK                   | Description                |
| --------------- | --------- | ------------------------- | -------------------------- |
| enrollment_id   | SERIAL    | PK                        | Enrollment ID              |
| student_user_id | INT       | FK → users(user_id)       | Student                    |
| course_id       | INT       | FK → courses(course_id)   | Enrolled course            |
| payment_id      | INT       | FK → payments(payment_id) | Optional payment reference |
| enrolled_at     | TIMESTAMP |                           | Enrollment date            |
| created_at      | TIMESTAMP |                           | Creation timestamp         |
| updated_at      | TIMESTAMP |                           | Last updated timestamp     |

---

## **8. lectures**

| Column             | Type         | PK / FK                 | Description                 |
| ------------------ | ------------ | ----------------------- | --------------------------- |
| lecture_id         | SERIAL       | PK                      | Lecture ID                  |
| course_id          | INT          | FK → courses(course_id) | Linked course               |
| created_by_user_id | INT          | FK → users(user_id)     | Teacher who created lecture |
| title              | VARCHAR(255) |                         | Lecture topic               |
| scheduled_at       | TIMESTAMP    |                         | Scheduled time              |
| jitsi_link         | TEXT         |                         | Jitsi meeting URL           |
| created_at         | TIMESTAMP    |                         | Creation timestamp          |
| updated_at         | TIMESTAMP    |                         | Last updated timestamp      |

---

## **9. attendance**

| Column          | Type        | PK / FK                   | Description             |
| --------------- | ----------- | ------------------------- | ----------------------- |
| attendance_id   | SERIAL      | PK                        | Attendance ID           |
| lecture_id      | INT         | FK → lectures(lecture_id) | Linked lecture          |
| student_user_id | INT         | FK → users(user_id)       | Student                 |
| status          | VARCHAR(20) |                           | Present / Absent        |
| marked_at       | TIMESTAMP   |                           | Timestamp of attendance |
| created_at      | TIMESTAMP   |                           | Creation timestamp      |
| updated_at      | TIMESTAMP   |                           | Last updated timestamp  |

---

## **10. assignments**

| Column             | Type         | PK / FK                 | Description            |
| ------------------ | ------------ | ----------------------- | ---------------------- |
| assignment_id      | SERIAL       | PK                      | Assignment ID          |
| course_id          | INT          | FK → courses(course_id) | Linked course          |
| created_by_user_id | INT          | FK → users(user_id)     | Teacher who created    |
| title              | VARCHAR(255) |                         | Assignment title       |
| description        | TEXT         |                         | Instructions           |
| due_date           | TIMESTAMP    |                         | Submission deadline    |
| created_at         | TIMESTAMP    |                         | Creation timestamp     |
| updated_at         | TIMESTAMP    |                         | Last updated timestamp |

---

## **11. assignment_submissions**

| Column          | Type      | PK / FK                         | Description            |
| --------------- | --------- | ------------------------------- | ---------------------- |
| submission_id   | SERIAL    | PK                              | Submission ID          |
| assignment_id   | INT       | FK → assignments(assignment_id) | Linked assignment      |
| student_user_id | INT       | FK → users(user_id)             | Student                |
| submission_url  | TEXT      |                                 | Submitted file URL     |
| marks           | INT       |                                 | Grading marks          |
| feedback        | TEXT      |                                 | Teacher feedback       |
| submitted_at    | TIMESTAMP |                                 | Submission timestamp   |
| created_at      | TIMESTAMP |                                 | Creation timestamp     |
| updated_at      | TIMESTAMP |                                 | Last updated timestamp |

---

## **12. quizzes**

| Column             | Type         | PK / FK                 | Description            |
| ------------------ | ------------ | ----------------------- | ---------------------- |
| quiz_id            | SERIAL       | PK                      | Quiz ID                |
| course_id          | INT          | FK → courses(course_id) | Linked course          |
| created_by_user_id | INT          | FK → users(user_id)     | Teacher who created    |
| title              | VARCHAR(255) |                         | Quiz title             |
| total_marks        | INT          |                         | Total marks            |
| created_at         | TIMESTAMP    |                         | Creation timestamp     |
| updated_at         | TIMESTAMP    |                         | Last updated timestamp |

---

## **13. quiz_questions**

| Column         | Type         | PK / FK               | Description            |
| -------------- | ------------ | --------------------- | ---------------------- |
| question_id    | SERIAL       | PK                    | Question ID            |
| quiz_id        | INT          | FK → quizzes(quiz_id) | Linked quiz            |
| question_text  | TEXT         |                       | Question text          |
| options        | JSONB        |                       | Options array          |
| correct_answer | VARCHAR(255) |                       | Correct answer         |
| created_at     | TIMESTAMP    |                       | Creation timestamp     |
| updated_at     | TIMESTAMP    |                       | Last updated timestamp |

---

## **14. quiz_submissions**

| Column             | Type      | PK / FK               | Description            |
| ------------------ | --------- | --------------------- | ---------------------- |
| quiz_submission_id | SERIAL    | PK                    | Submission ID          |
| quiz_id            | INT       | FK → quizzes(quiz_id) | Linked quiz            |
| student_user_id    | INT       | FK → users(user_id)   | Student                |
| obtained_marks     | INT       |                       | Marks scored           |
| answers            | JSONB     |                       | Submitted answers      |
| submitted_at       | TIMESTAMP |                       | Submission timestamp   |
| created_at         | TIMESTAMP |                       | Creation timestamp     |
| updated_at         | TIMESTAMP |                       | Last updated timestamp |

---

## **15. payments**

| Column          | Type          | PK / FK                 | Description                |
| --------------- | ------------- | ----------------------- | -------------------------- |
| payment_id      | SERIAL        | PK                      | Payment ID                 |
| student_user_id | INT           | FK → users(user_id)     | Student who paid           |
| course_id       | INT           | FK → courses(course_id) | Linked course              |
| amount          | DECIMAL(10,2) |                         | Paid amount                |
| transaction_id  | VARCHAR(100)  |                         | Gateway transaction ID     |
| payment_status  | VARCHAR(50)   |                         | Pending / Success / Failed |
| created_at      | TIMESTAMP     |                         | Creation timestamp         |
| updated_at      | TIMESTAMP     |                         | Last updated timestamp     |

---

## **16. certificates**

| Column          | Type      | PK / FK                 | Description            |
| --------------- | --------- | ----------------------- | ---------------------- |
| certificate_id  | SERIAL    | PK                      | Certificate ID         |
| student_user_id | INT       | FK → users(user_id)     | Student                |
| course_id       | INT       | FK → courses(course_id) | Course completed       |
| certificate_url | TEXT      |                         | PDF link               |
| issued_at       | TIMESTAMP |                         | Issued date            |
| created_at      | TIMESTAMP |                         | Creation timestamp     |
| updated_at      | TIMESTAMP |                         | Last updated timestamp |

---

## **17. notifications**

| Column          | Type      | PK / FK             | Description            |
| --------------- | --------- | ------------------- | ---------------------- |
| notification_id | SERIAL    | PK                  | Notification ID        |
| user_id         | INT       | FK → users(user_id) | Recipient              |
| message         | TEXT      |                     | Notification text      |
| is_read         | BOOLEAN   |                     | Read status            |
| created_at      | TIMESTAMP |                     | Creation timestamp     |
| updated_at      | TIMESTAMP |                     | Last updated timestamp |

---

## **18. file_storage**

| Column              | Type         | PK / FK                         | Description                |
| ------------------- | ------------ | ------------------------------- | -------------------------- |
| file_id             | SERIAL       | PK                              | File ID                    |
| uploaded_by_user_id | INT          | FK → users(user_id)             | Who uploaded               |
| course_id           | INT          | FK → courses(course_id)         | Optional course            |
| lecture_id          | INT          | FK → lectures(lecture_id)       | Optional lecture           |
| assignment_id       | INT          | FK → assignments(assignment_id) | Optional assignment        |
| file_name           | VARCHAR(255) |                                 | Original filename          |
| file_url            | TEXT         |                                 | Storage path / URL         |
| file_type           | VARCHAR(50)  |                                 | text / pdf / video / image |
| created_at          | TIMESTAMP    |                                 | Creation timestamp         |
| updated_at          | TIMESTAMP    |                                 | Last updated timestamp     |

---

## **19. reviews**

| Column          | Type      | PK / FK                 | Description            |
| --------------- | --------- | ----------------------- | ---------------------- |
| review_id       | SERIAL    | PK                      | Review ID              |
| course_id       | INT       | FK → courses(course_id) | Reviewed course        |
| student_user_id | INT       | FK → users(user_id)     | Reviewer               |
| rating          | INT       | 1–5 stars               |                        |
| comment         | TEXT      | Optional review text    |                        |
| created_at      | TIMESTAMP |                         | Creation timestamp     |
| updated_at      | TIMESTAMP |                         | Last updated timestamp |

---

## **Relationships Summary (Normalized)**

| From Table                                      | To Table | Relationship                                 | Description |
| ----------------------------------------------- | -------- | -------------------------------------------- | ----------- |
| organizations → users                           | 1:N      | Each org has many users                      |             |
| roles → users                                   | 1:N      | Each user has one role                       |             |
| users → courses                                 | 1:N      | Teacher creates multiple courses             |             |
| courses → course_tags_mapping → course_tags     | M:N      | Courses can have multiple tags               |             |
| courses → enrollments                           | 1:N      | Students enroll in courses                   |             |
| users → enrollments                             | 1:N      | Each student can enroll in many courses      |             |
| courses → lectures                              | 1:N      | Course can have multiple lectures            |             |
| lectures → attendance                           | 1:N      | Attendance per lecture per student           |             |
| users → attendance                              | 1:N      | Each student has multiple attendance records |             |
| courses → assignments                           | 1:N      | Course can have many assignments             |             |
| assignments → assignment_submissions            | 1:N      | Students submit multiple assignments         |             |
| users → assignment_submissions                  | 1:N      | Each student submits many                    |             |
| courses → quizzes                               | 1:N      | Course has multiple quizzes                  |             |
| quizzes → quiz_questions                        | 1:N      | Each quiz has multiple questions             |             |
| quizzes → quiz_submissions                      | 1:N      | Multiple student submissions per quiz        |             |
| users → quiz_submissions                        | 1:N      | Each student submits many quizzes            |             |
| users → payments                                | 1:N      | Student can pay multiple courses             |             |
| courses → payments                              | 1:N      | Course can have multiple payments            |             |
| users → certificates                            | 1:N      | Student receives certificates                |             |
| courses → certificates                          | 1:N      | Certificates tied to course completion       |             |
| users → notifications                           | 1:N      | Users receive multiple notifications         |             |
| courses / lectures / assignments → file_storage | 1:N      | Files related to course/lecture/assignment   |             |
| users → file_storage                            | 1:N      | Users can upload many files                  |             |
| courses → reviews                               | 1:N      | Multiple reviews per course                  |             |
| users → reviews                                 | 1:N      | Each student can write many reviews          |             |

---

This **full normalized schema** uses:

* **Descriptive column names** (`student_user_id`, `created_by_user_id`)
* **Many-to-many mapping


** where necessary (`course_tags_mapping`)

* **Timestamps** (`created_at`, `updated_at`) on all tables
* **Ready for PostgreSQL implementation** and ERD generation

---


