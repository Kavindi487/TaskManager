# Task Manager App

A full-stack Task Manager application built with **Angular 19**, **Spring Boot 3**, **MySQL 8**, **JWT authentication**, **Docker Compose**, and **GitHub Actions CI/CD**.

---

## Features

| Feature | Details |
|---|---|
| ✅ JWT Authentication | Secure register / login with BCrypt + JJWT |
| ✅ Full CRUD | Create, read, update, delete tasks via REST API |
| ✅ Status Filtering | Filter tasks by To Do / In Progress / Done |
| ✅ Reactive Forms | Angular `FormBuilder` + `Validators` throughout |
| ✅ Optimistic UI | Instant feedback on edit/delete without waiting for API |
| ✅ Kanban View | Progress page shows tasks in 3-column board |
| ✅ Overview Dashboard | Stats, completion rate, recent tasks at a glance |
| ✅ Docker Compose | One-command full-stack deployment |
| ✅ GitHub Actions CI | Backend (Maven) + Frontend (npm) build checks |
| ✅ Skeleton Loaders | Shimmer placeholders while data loads |

---

## Tech Stack

- **Frontend**: Angular 19, TypeScript, SCSS, Reactive Forms
- **Backend**: Spring Boot 3.3, Spring Security, Spring Data JPA
- **Database**: MySQL 8
- **Auth**: JWT (JJWT 0.12.6), BCrypt
- **DevOps**: Docker, Docker Compose, GitHub Actions

---

## Local Development

### Prerequisites
- Java 17+
- Node 20+
- MySQL 8 running locally

### Backend
```bash
cd backend
mvn spring-boot:run
```
Backend starts on `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend starts on `http://localhost:4200` and proxies `/api` to `http://localhost:8080`.

---

## Database Setup (Local)

Create the database (Spring will create tables automatically):

```sql
CREATE DATABASE task_manager_db;
```

Default credentials in `backend/src/main/resources/application.properties`:
- **Host**: `localhost:3306`
- **Database**: `task_manager_db`
- **Username**: `root`
- **Password**: `123456789`

Update these values if your local MySQL uses different credentials.

---

## Docker (Full Stack)

Run everything with a single command:

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| MySQL | localhost:3306 |

The MySQL container includes a health check — the backend waits for the database to be fully ready before starting.

---

## Authentication API

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |

Both return: `{ token, id, name, email }`

---

## Task API

All task endpoints require `Authorization: Bearer <token>` header.

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
├── backend/
│   └── src/main/java/com/example/backend/
│       ├── config/          # CORS, Security config
│       ├── controller/      # REST controllers
│       ├── dto/             # Request/Response DTOs
│       ├── entity/          # JPA entities
│       ├── exception/       # Global exception handler
│       ├── repository/      # Spring Data repositories
│       ├── security/        # JWT filter + service
│       └── service/         # Business logic (interface + impl)
├── frontend/
│   └── src/app/
│       ├── components/      # Reusable UI components
│       ├── guards/          # Auth guard
│       ├── interceptors/    # JWT HTTP interceptor
│       ├── models/          # TypeScript interfaces
│       ├── pages/           # Route-level components
│       └── services/        # HTTP services
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## CI/CD

GitHub Actions runs on every push/PR to `main`:
- **Backend job**: `mvn clean verify` with JDK 17
- **Frontend job**: `npm ci && npm run build`


## Test Credentials

Register a new account at `http://localhost:4200/signup` or use these pre-created credentials (after running the app once and registering):

| Field    | Value                      |
|----------|----------------------------|
| Email    | test@taskmanager.com       |
| Password | test123                    |

> If the above account doesn't exist yet, register it manually on first run — the app auto-creates the database tables on startup.

## JWT Info

- Tokens are valid for **24 hours** (configured via `APP_JWT_EXPIRATION_MS=86400000`)
- The token is stored in `localStorage` under the key `tm_token`
- All `/api/tasks` endpoints require `Authorization: Bearer <token>` — handled automatically by the Angular interceptor