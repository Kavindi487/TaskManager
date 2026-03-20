# Task Manager App

A full-stack Task Manager application built with Angular, Spring Boot, MySQL, JWT authentication, Docker, and GitHub Actions.

## Features
- User signup and login with JWT authentication
- Create, read, update, and delete tasks
- Filter tasks by status: To Do, In Progress, Done
- Clean responsive dashboard UI
- Dockerized frontend, backend, and MySQL database
- GitHub Actions CI for backend and frontend builds

## Tech Stack
- Frontend: Angular 21
- Backend: Spring Boot 3, Spring Security, JPA
- Database: MySQL 8
- Auth: JWT
- DevOps: Docker Compose, GitHub Actions

## Local Development

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200` and proxies `/api` requests to the backend on `http://localhost:8080`.

## Default Local Database
- Database: `task_manager_db`
- Username: `root`
- Password: `123456789`

Update these values in `backend/src/main/resources/application.properties` if needed.

## Docker
Run everything with:
```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3306`

## Authentication API
- `POST /api/auth/register`
- `POST /api/auth/login`

## Task API
Requires `Authorization: Bearer <token>`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

## Suggested Git Commits
1. setup backend CRUD
2. add angular dashboard UI
3. add JWT authentication
4. dockerize application
5. add GitHub Actions CI
