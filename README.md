# Varsha Ayurveda - Production Full-Stack E-Commerce Platform

A production-ready Ayurvedic e-commerce platform built with a high-performance monorepo architecture:
- **Customer Storefront:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, React Router v7
- **Admin Dashboard:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Charts & Management Suite
- **Backend API:** Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, Razorpay, JWT Auth, Nodemailer, Multer

---

## Architecture Overview

```
ayuerveda/
├── frontend/                # Customer-Facing Storefront (Port 5173)
│   ├── src/
│   │   ├── components/      # Navigation, ProductCard, CartSidebar, Footer, WhatsAppWidget
│   │   ├── pages/           # Home, Shop, ProductDetail, About, Gallery, Blog, BlogDetail, Contact, Cart, Checkout, Account, Orders
│   │   ├── layouts/         # MainLayout with responsive header & footer
│   │   ├── context/         # CartContext (localStorage persistence), AuthContext, SettingsContext
│   │   ├── services/        # Axios API client & domain services (products, orders, auth, etc.)
│   │   ├── routes/          # AppRoutes (React Router v7)
│   │   └── types/           # Domain TypeScript definitions
│   └── .env.example
│
├── backend/                 # Secure REST API Server (Port 5000)
│   ├── src/
│   │   ├── config/          # Environment variables, database, email, payment clients
│   │   ├── controllers/     # Auth, Product, Category, Blog, Order, Payment, Contact, Settings, Admin controllers
│   │   ├── middleware/      # JWT auth, RBAC, error handler, rate limiter, multer upload
│   │   ├── prisma/          # schema.prisma, seed.ts, migrations
│   │   ├── routes/          # REST route declarations
│   │   ├── services/        # Business logic, price calculations, stock management, Razorpay, WhatsApp
│   │   ├── validators/      # Zod validation schemas
│   │   ├── utils/           # Structured logger, OpenAPI 3.0 specification
│   │   └── app.ts / server.ts
│   ├── uploads/             # Managed local image uploads (abstracted for S3/R2 migration)
│   └── .env.example
│
├── admin/                   # Dedicated Admin Dashboard (Port 5174)
│   ├── src/
│   │   ├── components/      # Admin navigation, status badges, metric cards, charts
│   │   ├── pages/           # Dashboard, Products (CRUD), Categories, Orders, Customers, Blogs, Messages, Settings, Profile
│   │   ├── layouts/         # AdminLayout with responsive sidebar & topbar
│   │   ├── context/         # AdminAuthContext (RBAC protection)
│   │   ├── services/        # Admin API client with token management
│   │   └── routes/          # AdminRoutes with authentication guards
│   └── .env.example
│
└── package.json             # Root monorepo workspace configuration
```

---

## Prerequisites

- **Node.js**: v18.x or v20.x+
- **npm**: v9.x or v10.x+
- **PostgreSQL**: v14+ running locally or remotely (configured on port `5433` or standard `5432`)

---

## PostgreSQL Setup

1. Start your PostgreSQL service.
2. Create the application database:
   ```sql
   CREATE DATABASE varsha_ayurveda;
   ```
3. Update connection string in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:Password123@localhost:5433/varsha_ayurveda?schema=public"
   ```

---

## Database Migration & Seeding

Navigate to backend (or run from root using workspace scripts):

```bash
# Push schema to PostgreSQL database
npm --prefix backend run prisma:push

# Generate Prisma Client
npm --prefix backend run prisma:generate

# Seed initial admin user, original products, categories, blogs, and settings
npm --prefix backend run prisma:seed
```

### Seeded Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@varshaayurveda.in` | `Admin@12345` |
| **Customer** | `customer@example.com` | `Customer@12345` |

---

## Environment Variables

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:Password123@localhost:5433/varsha_ayurveda?schema=public"

JWT_SECRET="varsha_ayurveda_super_secret_jwt_key_2026_secure"
JWT_EXPIRES_IN="7d"

RAZORPAY_KEY_ID="rzp_test_51ZpQ4a159eEa7"
RAZORPAY_KEY_SECRET="sandbox_secret_placeholder"
RAZORPAY_WEBHOOK_SECRET="webhook_secret_placeholder"

FRONTEND_URL="http://localhost:5173"
ADMIN_URL="http://localhost:5174"
BACKEND_URL="http://localhost:5000"

WHATSAPP_NUMBER="919907303284"

SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM="Varsha Ayurveda <orders@varshaayurveda.in>"
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_51ZpQ4a159eEa7
```

### `admin/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Running the Project

### Development Mode

Run all services or pick individual workspaces:

```bash
# Run Backend API (Port 5000)
npm run dev:backend

# Run Storefront (Port 5173)
npm run dev:frontend

# Run Admin Dashboard (Port 5174)
npm run dev:admin
```

### Production Build

```bash
# Build all workspaces (TypeScript checks + Vite bundles)
npm run build
```

### Running Backend Tests

```bash
# Run complete Vitest suite (20 tests covering Auth, RBAC, Orders, Stock, Razorpay, etc.)
npm run test:backend
```

---

## Interactive API Documentation

When the backend is running, open your browser to:
- **Interactive Swagger UI:** `http://localhost:5000/api/docs`
- **OpenAPI 3.0 JSON Specification:** `http://localhost:5000/api/docs/openapi.json`

---

## REST API Endpoints Reference

### Public APIs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/auth/register` | Customer registration |
| `POST` | `/api/auth/login` | User and Admin login |
| `GET` | `/api/products` | Catalog listing (filtering by category, search, featured) |
| `GET` | `/api/products/:slug` | Detailed product specifications and images |
| `GET` | `/api/categories` | Active categories |
| `GET` | `/api/blogs` | Published blog articles |
| `GET` | `/api/blogs/:slug` | Blog article detail |
| `POST` | `/api/contact` | Submit contact inquiry |
| `GET` | `/api/settings` | Public website configuration & contact info |
| `POST` | `/api/orders/cod-whatsapp` | Place COD WhatsApp order (server-recalculated total) |
| `POST` | `/api/orders/create-razorpay` | Initialize Razorpay order with secure stock verification |
| `POST` | `/api/payments/razorpay/verify` | Verify Razorpay HMAC SHA-256 signature and mark order paid |
| `POST` | `/api/payments/razorpay/webhook` | Idempotent Razorpay webhook listener |

### Authenticated Customer APIs (`Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/me` | Fetch active user profile |
| `PUT` | `/api/auth/profile` | Update profile information |
| `GET` | `/api/orders/my-orders` | Customer's order history |
| `GET` | `/api/orders/:id` | Order details |

### Admin APIs (`Bearer <token>` with `ADMIN` role)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Analytics metrics, revenue, order distributions, SVG charts |
| `GET` | `/api/admin/orders` | Paginated orders with filtering & search |
| `GET` | `/api/admin/orders/:id` | Detailed order summary with customer & item snapshots |
| `PUT` | `/api/admin/orders/:id/status` | Update order/payment status (confirm COD, ship, deliver) |
| `POST` | `/api/admin/products` | Create new product with image uploads & specs |
| `PUT` | `/api/admin/products/:id` | Edit product, inventory stock, price, discounts |
| `DELETE` | `/api/admin/products/:id` | Delete product |
| `POST` | `/api/admin/categories` | Create category |
| `PUT` | `/api/admin/categories/:id` | Update category |
| `DELETE` | `/api/admin/categories/:id` | Delete category |
| `POST` | `/api/admin/blogs` | Create blog article |
| `PUT` | `/api/admin/blogs/:id` | Edit blog article |
| `DELETE` | `/api/admin/blogs/:id` | Delete blog article |
| `GET` | `/api/admin/customers` | Customer directory and order stats |
| `GET` | `/api/admin/contact-messages` | Inquiries management |
| `PUT` | `/api/admin/contact-messages/:id` | Mark message as READ or RESOLVED |
| `PUT` | `/api/admin/settings` | Update store configuration, phone, shipping rules |
| `POST` | `/api/admin/upload` | Upload product, blog, or category images |

---

## Order & Payment Flows

### 1. COD WhatsApp Flow
1. Customer enters delivery address on the checkout page.
2. Frontend submits `POST /api/orders/cod-whatsapp`.
3. **Backend recalculates all prices and shipping fees directly from PostgreSQL** (rejecting any client-tampered totals).
4. Stock is verified and atomically decremented within a database transaction.
5. Order record is created with:
   - `paymentMethod = COD_WHATSAPP`
   - `paymentStatus = COD_PENDING`
   - `orderStatus = PENDING`
6. Backend generates a structured WhatsApp URL with order items, totals, and shipping details.
7. Customer is redirected to WhatsApp with the pre-filled message, and the order is instantly accessible to administrators in `/admin/orders`.

### 2. Razorpay Payment Flow
1. Customer selects Razorpay at checkout and clicks "Pay Now".
2. Frontend calls `POST /api/orders/create-razorpay`.
3. Backend validates stock, calculates exact order total, creates an `Order` (`paymentStatus = PENDING`), and generates a Razorpay Order ID via the Razorpay SDK.
4. Frontend opens the Razorpay Checkout popup (UPI, Credit/Debit Cards, NetBanking, Wallets).
5. Upon successful transaction, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
6. Frontend sends these to `POST /api/payments/razorpay/verify`.
7. **Backend cryptographically computes HMAC SHA-256 signature** using `RAZORPAY_KEY_SECRET`.
8. Once verified, stock is reserved, `Payment` is recorded, and `Order` status transitions to `PAID` / `CONFIRMED`.
9. Idempotent webhook (`POST /api/payments/razorpay/webhook`) catches asynchronous payment events, preventing duplicate executions via `WebhookLog`.

---

## Security Best Practices Implemented

- **No Frontend Secrets:** Razorpay Key Secret, JWT Secret, and Database credentials are strictly stored in backend `.env`.
- **Server Price Validation:** Client-sent prices are strictly ignored; prices and order totals are calculated exclusively from the database.
- **SQL Injection Prevention:** Fully parameterized queries enforced via Prisma ORM.
- **Rate Limiting:** Express Rate Limiter limits abusive requests on sensitive endpoints.
- **Security Headers:** Helmet configured for cross-origin security headers.
- **Password Hashing:** `bcryptjs` with salt rounds for secure authentication.
- **Role-Based Access Control:** Strict `requireAdmin` middleware guards all admin routes.
