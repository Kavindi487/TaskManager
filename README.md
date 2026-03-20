# Task Manager App

A full-stack Task Manager built with **Angular 19**, **Spring Boot 3**, **MySQL 8**, **JWT Authentication**, **Docker Compose**, and **GitHub Actions CI/CD**.

---

## Features

| Feature | Details |
|---|---|
| ✅ JWT Authentication | Secure register / login with BCrypt + JJWT |
| ✅ Full CRUD | Create, read, update, delete tasks |
| ✅ Status Filtering | Filter by To Do / In Progress / Done |
| ✅ Reactive Forms | Angular FormBuilder + Validators throughout |
| ✅ Optimistic UI | Instant feedback on edit/delete |
| ✅ Kanban Board | Progress page with 3-column task board |
| ✅ Overview Dashboard | Stats, completion rate, recent tasks |
| ✅ Skeleton Loaders | Shimmer placeholders while loading |
| ✅ Docker Compose | One-command full-stack deployment |
| ✅ GitHub Actions CI | Automated backend + frontend build checks |

---

## Tech Stack

- **Frontend**: Angular 19, TypeScript, SCSS, Reactive Forms
- **Backend**: Spring Boot 3.3, Spring Security, Spring Data JPA, Lombok
- **Database**: MySQL 8
- **Auth**: JWT (JJWT 0.12.6), BCrypt password hashing
- **DevOps**: Docker, Docker Compose, GitHub Actions

---

## Option A — Run with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

**1. Open a terminal in the project root** (where `docker-compose.yml` is):
```
cd TaskManager
```

**2. Build and start all services:**
```bash
docker compose up --build
```
This starts MySQL, the Spring Boot backend, and the Angular frontend all at once.
First build takes ~3–5 minutes (downloads dependencies). Subsequent builds are faster.

**3. Open the app:**

| Service  | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| MySQL | localhost:3306 |

**4. To stop:**
```bash
docker compose down
```

**To stop and wipe the database too:**
```bash
docker compose down -v
```

---

## Option B — Run Locally (Without Docker)

### Prerequisites
- Java 17+
- Node 20+
- MySQL 8 running locally

### Step 1 — Set up the database

Open MySQL and run:
```sql
CREATE DATABASE IF NOT EXISTS task_manager_db;
```

Default credentials expected by the app:
- Host: `localhost:3306`
- Database: `task_manager_db`
- Username: `root`
- Password: `123456789`

To use different credentials, edit `backend/src/main/resources/application.properties`.

### Step 2 — Start the backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend starts at http://localhost:8080. Spring will create all tables automatically.

### Step 3 — Start the frontend
```bash
cd frontend
npm install
ng serve
```
Frontend starts at http://localhost:4200 and proxies `/api` calls to the backend.

---

## Test Credentials

Register a new account at http://localhost:4200/signup, or use these after registering once:

| Field    | Value                |
|----------|----------------------|
| Email    | test@taskmanager.com |
| Password | test123              |

---

## Authentication API

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ "name", "email", "password" }` |
| POST | `/api/auth/login` | `{ "email", "password" }` |

Both return: `{ "token", "id", "name", "email" }`

## JWT Info

- Tokens expire after **24 hours**
- Stored in browser `localStorage` under key `tm_token`
- Automatically attached to all API requests via Angular HTTP interceptor
- Secret key is configured via environment variable `APP_JWT_SECRET`

---

## Task API

All endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (optional `?status=TO_DO`) |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

---

## Project Structure

```
TaskManager/
├── backend/
│   ├── Dockerfile
│   └── src/main/java/com/example/backend/
│       ├── config/          # CORS + Security configuration
│       ├── controller/      # REST controllers (Auth, Task)
│       ├── dto/             # Request & Response DTOs
│       ├── entity/          # JPA entities (Task, AppUser)
│       ├── exception/       # Global exception handler
│       ├── repository/      # Spring Data JPA repositories
│       ├── security/        # JWT filter + JWT service
│       └── service/         # Business logic (interface + impl)
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf           # Proxies /api to backend in Docker
│   └── src/app/
│       ├── components/      # Reusable UI components
│       ├── guards/          # Route auth guard
│       ├── interceptors/    # JWT HTTP interceptor
│       ├── models/          # TypeScript interfaces
│       ├── pages/           # Route pages (login, signup, tasks, overview, progress)
│       └── services/        # HTTP services (Auth, Task)
├── docker-compose.yml
└── .github/workflows/ci.yml # GitHub Actions CI
```

---

## CI/CD

GitHub Actions runs on every push to `main`:
- **Backend**: `mvn clean verify` with JDK 17
- **Frontend**: `npm ci && npm run build`
