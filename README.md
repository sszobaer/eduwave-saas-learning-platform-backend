# EduWave – Backend API

EduWave is a Learning Management System (LMS)–based SaaS platform designed to provide a secure, scalable, and extensible backend for modern digital learning environments. This repository contains the **backend REST API** built using **NestJS**, serving as the core service layer of the EduWave platform.

The backend is implemented using a **customized NestJS architecture** with clear separation of concerns and includes **role-based access control (RBAC)** for secure and controlled access.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Tech Stack](#tech-stack)
* [Features](#features)
* [Custom Folder Structure](#custom-folder-structure)
* [Prerequisites](#prerequisites)
* [Environment Setup](#environment-setup)
* [Installation](#installation)
* [Running the Application](#running-the-application)
* [Authentication & Authorization](#authentication--authorization)
* [Frontend Integration](#frontend-integration)
* [Future Enhancements](#future-enhancements)
* [Contributors](#contributors)

---

## Project Overview

EduWave provides backend services for an LMS platform, including user management, course management, and secure access control. The API is designed to be frontend-agnostic and scalable, enabling future integration with AI-powered learning features and real-time communication systems.

---

## Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **API Style:** REST
* **Authentication:** JWT
* **Authorization:** Role-Based Access Control (RBAC)
* **Database:** Configurable (Relational / NoSQL)
* **Package Manager:** npm / yarn

---

## Features

* Custom NestJS backend architecture
* Secure authentication using JWT
* Role-based access control (Admin, Instructor, Learner)
* User, course, and content management APIs
* File upload support
* Modular, scalable, and maintainable codebase
* Frontend-ready RESTful endpoints

---

## Custom Folder Structure

The project follows a **customized and organized directory structure** for better maintainability and scalability:

```bash
src/
├── controllers/      # API route handlers
├── decorators/       # Custom decorators (e.g., roles, user)
├── dtos/             # Data Transfer Objects
├── entities/         # Database entities / models
├── guards/           # Auth and role-based guards
├── modules/          # Feature modules
├── services/         # Business logic and services
├── utils/            # Shared utility functions
├── app.module.ts     # Root application module
└── main.ts           # Application entry point

test/                 # Test files
uploads/              # Uploaded files storage
.env                  # Environment variables
.gitignore
```

---

## Prerequisites

Ensure the following are installed:

* Node.js (v18+ recommended)
* npm or yarn
* Database service (PostgreSQL, MySQL, MongoDB, etc.)

---

## Environment Setup

Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=1h

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
DB_NAME=eduwave

# SMTP / Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM="EduWave LMS Platform" <noreply@example.com>

#PORT
PORT = 3000

```

> ⚠️ Never commit `.env` files to version control.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/sszobaer/eduwave-saas-learning-platform-backend.git
cd eduwave-saas-learning-platform-backend
npm install
```

---

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

API will be available at:

```
http://localhost:3000
```

---

## Authentication & Authorization

* Uses **JWT-based authentication**
* Protected routes require a valid JWT token
* Token must be passed via header:

```http
Authorization: Bearer <token>
```

* Role-based guards restrict access based on user roles

---

## Frontend Integration

Frontend development is currently **in progress**.
The backend API is designed to integrate seamlessly with modern frontend frameworks such as **React**, **Next.js**, or **Angular** (We are doing on Next.js).

---

## Future Enhancements

* AI-powered personalized learning paths
* Intelligent content recommendations
* Real-time chat and messaging system
* Advanced analytics and reporting
* Notification and activity tracking

---

## Contributors

We welcome contributions to EduWave.

### Core Contributors

* **Zobaer Ahmed** – Backend Development & System Architecture
* **Abir Ghose** - Backend Development
* **Sazzad Khan** - Backend Development

If you would like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

