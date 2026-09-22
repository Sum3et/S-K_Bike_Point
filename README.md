# 🏍️ S K Bike Point — Two-Wheeler Workshop & Customer Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker%20Compose-Ready-2496ed.svg)](https://www.docker.com/)

**S K Bike Point** is a modern, full-stack enterprise web application engineered specifically for two-wheeler motorcycle and scooter workshops, service centers, and automobile garages. It streamlines job-card creation, customer intake, real-time repair tracking, spare parts inventory control, and GST-compliant invoicing.

---

## 📸 Phase 1 Highlights & Features

- **🔐 Dual-Role Authentication & Security**:
  - Stateless JWT token-based authentication with BCrypt password hashing.
  - Role-based authorization: **Workshop Administrator** (`ROLE_ADMIN`) and **Customer** (`ROLE_CUSTOMER`).
  - Protected API endpoints and client-side route guards.
  - 1-Click Quick-Fill demo accounts on the login screen for rapid testing.

- **🛠️ Workshop Administrator Dashboard**:
  - 6 Key Workshop Performance KPIs: Total Customers, Total Registered Vehicles, Active Service Jobs, Today's Gross Revenue (₹ INR), Low-Stock Critical Parts, and Pending Invoices.
  - Interactive Revenue and Volume Performance Trend Charts (Recharts).
  - Live Service Job Queue Table with real-time status filtering (Received, Inspection, In Progress, Ready, Delivered).
  - Job Card Inspection Modal with detailed billing and diagnostic summary.
  - Low-Stock Spares Alert center with minimum replenishment triggers.

- **🛵 Customer Self-Service Portal**:
  - Multi-step Live Service Tracker displaying current repair progress percentage, assigned master mechanic, and estimated completion time.
  - Digital garage showing registered bikes/scooters with odometer mileage and last service dates.
  - Preventative maintenance alerts (e.g. Engine Oil & Spark Plug intervals).
  - Past service history records with instant GST invoice PDF download preview.
  - 1-Click Service Visit Appointment Booking.

- **⚡ Zero-Friction Dual-Mode Database**:
  - Configured for **PostgreSQL 16** in Docker / Production.
  - Automatic fallback to **H2 in-memory DB** with seeded demo accounts for instant local testing without prerequisite database installations.

---

## 👥 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Workshop Admin** | `admin@skbikepoint.com` | `Admin@123` |
| **Customer** | `customer@example.com` | `Customer@123` |
| **Customer 2** | `pooja.patel@example.com` | `Customer@123` |

*(You can also use the 1-Click QuickFill buttons directly on the Login page)*

---

## 🏗️ Architecture & Project Structure

```
S K Bike Point/
├── backend/
│   ├── src/main/java/com/skbikepoint/
│   │   ├── config/             # CorsConfig, AppConfig
│   │   ├── controller/         # AuthController, HealthController, AdminController, CustomerController
│   │   ├── dto/                # ApiResponse, LoginRequest, RegisterRequest, AuthResponse, UserDto, Dashboards
│   │   ├── entity/             # User entity, Role enum
│   │   ├── exception/          # GlobalExceptionHandler, CustomExceptions, ErrorResponse
│   │   ├── repository/         # UserRepository
│   │   ├── security/           # JwtTokenProvider, JwtAuthenticationFilter, SecurityConfig, UserPrincipal
│   │   ├── service/            # AuthService, UserService, DashboardService
│   │   └── util/               # DataInitializer (Auto-seeds demo users on startup)
│   ├── src/main/resources/     # application.yml, application-prod.yml
│   ├── pom.xml                 # Maven configuration (Java 21, Spring Boot 3.3.3, JJWT 0.12.6, Lombok)
│   └── Dockerfile              # Multi-stage JDK 21 Alpine container
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Input, Select, Card, StatCard, Badge, StatusBadge, Table, Modal, Spinner
│   │   │   ├── layout/         # Sidebar, Topbar, AdminLayout, CustomerLayout, PublicLayout
│   │   │   └── common/         # ProtectedRoute, ToastContainer, QuickFillCredentials
│   │   ├── pages/
│   │   │   ├── auth/           # LoginPage, RegisterPage
│   │   │   ├── admin/          # AdminDashboardPage, PlaceholderPage
│   │   │   ├── customer/       # CustomerDashboardPage
│   │   │   └── general/        # UnauthorizedPage, NotFoundPage
│   │   ├── services/           # api.ts (Central Axios + Bearer Interceptor), authService, healthService, dashboardService
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── hooks/              # useAuth, useToast
│   │   ├── types/              # auth.ts, user.ts, dashboard.ts, api.ts
│   │   ├── utils/              # storage.ts, formatters.ts, validators.ts
│   │   ├── routes/             # AppRoutes.tsx
│   │   └── index.css           # Workshop theme tokens & glassmorphism styling
│   ├── package.json, vite.config.ts, tailwind.config.js, tsconfig.json
│   ├── nginx.conf              # Production reverse-proxy config
│   └── Dockerfile              # Multi-stage static build container
│
├── docker-compose.yml          # Multi-container orchestration (postgres, backend, frontend)
├── .env.example                # Sample environment configuration
└── README.md                   # Documentation
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Java**: JDK 21+ (Java 21 / 22 / 26)
- **Docker & Docker Compose** (Optional for container deployment)

---

### Option A: Run with Docker Compose (Recommended for Production)

```bash
# 1. Clone repository and navigate to folder
cd "S K Bike Point"

# 2. Build and launch all services in detached mode
docker compose up --build -d

# 3. Access applications:
# Frontend UI: http://localhost:3000
# Backend API: http://localhost:8080/api/health
# PostgreSQL: localhost:5432
```

---

### Option B: Run Locally for Development

#### 1. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
> The frontend will start at **`http://localhost:5173`** with hot module replacement and automatic `/api` proxying.

#### 2. Start the Backend
```bash
cd backend
# Run with Maven (uses in-memory H2 database by default if Postgres isn't running)
mvn spring-boot:run
```
> The backend will start at **`http://localhost:8080`**.
> H2 Database Console is available at **`http://localhost:8080/h2-console`** (`JDBC URL: jdbc:h2:mem:skbikepointdb`, `User: sa`, `Password: `).

---

## 📡 Key REST API Endpoints

### 🩺 Health Check
- `GET /api/health` — Public status check (`{"status": "UP", "service": "S K Bike Point API"}`)

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login` — Sign in with email and password -> returns JWT token & user object
- `POST /api/auth/register` — Register a new customer account
- `GET /api/auth/me` — Retrieve current authenticated user profile (Bearer token required)

### 🛠️ Admin Management (`/api/admin` — Requires `ROLE_ADMIN`)
- `GET /api/admin/dashboard` — Key KPI metrics, revenue charts, job queue, low-stock inventory alerts
- `GET /api/admin/customers` — Full customer list and vehicle linkages

### 🛵 Customer Management (`/api/customer` — Requires `ROLE_CUSTOMER`)
- `GET /api/customer/dashboard` — Live active repair tracker, registered vehicles, invoice summary
- `GET /api/customer/profile` — Customer personal profile & preferences

---

## 🗺️ Roadmap & Upcoming Phases

- **Phase 2**: Full CRUD Customer & Vehicle Registry, Spares Inventory Ledger, Real-time Job Card Kanban, GST Billing & PDF Generation.
- **Phase 3**: WhatsApp Notification Gateway, Thermal POS Slip Printing (80mm), Mechanic Commission Calculation, and Automated Odometer Service Reminders.
