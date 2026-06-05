# BrightSmile Dental — Full-Stack Application

A production-ready dental clinic management system with a public patient website, patient portal, and secure admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.2, Spring Security 6 + JWT |
| Database | MySQL 8 with Flyway migrations |
| Email | Spring Mail + Thymeleaf HTML templates |
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| API Client | Axios + TanStack Query |
| Container | Docker Compose |

---

## Quick Start (Docker)

```bash
# 1. Clone and configure environment
cp .env.example .env
# Edit .env with your database, JWT secret, and SMTP credentials

# 2. Start everything
docker-compose up --build

# App:      http://localhost
# API:      http://localhost:8080
# Swagger:  http://localhost:8080/swagger-ui
```

---

## Local Development

### Backend (Spring Boot)

**Prerequisites:** Java 21, Maven 3.9+, MySQL 8

```bash
cd brightsmile-api

# Create database
mysql -u root -p -e "CREATE DATABASE brightsmile;"

# Configure application
cp src/main/resources/application.yml src/main/resources/application-local.yml
# Edit DB credentials, JWT secret, SMTP settings

# Run
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

API runs at `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui`

### Frontend (React)

**Prerequisites:** Node 20+

```bash
cd brightsmile-web

npm install
npm run dev        # http://localhost:3000
npm run build      # Production build → dist/
```

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@brightsmile.com` | `Admin@1234` |

> **Change the admin password immediately after first login!**

---

## Project Structure

```
brightsmile-api/        Spring Boot backend
├── config/             Security, CORS configuration
├── controller/         REST controllers (public + admin)
├── service/            Business logic
├── repository/         JPA repositories
├── model/entity/       JPA entities
├── model/dto/          Request/response DTOs
├── security/           JWT utilities and filter
├── scheduler/          Appointment reminder scheduler
└── resources/
    ├── db/migration/   Flyway SQL scripts
    └── templates/email/ Thymeleaf email templates

brightsmile-web/        React + Vite frontend
├── src/
│   ├── pages/public/   Home, Services, About, Contact, Book
│   ├── pages/portal/   Patient login, register, dashboard
│   ├── pages/admin/    Full admin dashboard
│   ├── components/     Reusable UI + booking form
│   ├── context/        AuthContext (JWT state)
│   ├── api/            Axios instance + endpoint functions
│   └── router/         Protected + Admin route guards
```

---

## API Endpoints (summary)

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/services` | List visible services |
| GET | `/api/services/{id}` | Service detail |
| GET | `/api/slots?date=&doctorId=` | Available time slots |
| POST | `/api/appointments` | Book appointment |
| POST | `/api/auth/register` | Patient registration |
| POST | `/api/auth/login` | Login → JWT |
| POST | `/api/contact` | Contact form |

### Patient Portal (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/portal/appointments` | My appointments |
| PUT | `/api/portal/appointments/{id}/cancel` | Cancel appointment |

### Admin (JWT + Admin/Receptionist role)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard/stats` | KPI metrics |
| CRUD | `/api/admin/appointments` | Appointment management |
| CRUD | `/api/admin/patients` | Patient management |
| CRUD | `/api/admin/services` | Service management |
| CRUD | `/api/admin/team` | Team/doctor management |
| GET/PUT | `/api/admin/schedule/{doctorId}` | Doctor schedule |
| POST | `/api/admin/schedule/block` | Block time slots |

---

## Slot Availability Logic

Given `date` + `doctorId`:
1. Fetch doctor's `Schedule` for the day of week
2. Generate 30-min slots from `startTime` → `endTime`
3. Subtract: booked appointments + blocked slots + past slots
4. Return list of `{ datetime, available }` objects

---

## Email Features

- **Booking confirmation** — sent immediately on booking
- **24-hour reminder** — scheduled job runs hourly
- **2-hour reminder** — scheduled job runs every 15 minutes
- **Cancellation notice** — sent when appointment is cancelled
- **Email verification** — sent on patient registration

Configure SMTP in `.env` (Gmail, SendGrid, Mailgun, etc.)

---

## Security

- Passwords: BCrypt strength 12
- JWT access token: 15-minute expiry
- JWT refresh token: 7-day expiry, stored in HttpOnly cookie
- CORS: restricted to configured frontend URL
- All admin endpoints: role-checked on both frontend and backend
- SQL injection prevention: JPA parameterized queries throughout
