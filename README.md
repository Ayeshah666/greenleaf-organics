# 🌱 GreenLeaf Organics — Full-Stack E-Commerce

A production-ready organic gardening e-commerce store built with **Next.js 15 (App Router)**, **MongoDB/Mongoose**, and **Tailwind CSS**.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Database | MongoDB + Mongoose |
| Auth | Custom JWT (httpOnly cookies) |
| State | Zustand (cart, persisted) |
| Styling | Tailwind CSS + CSS custom properties |
| UI fonts | Playfair Display + Inter |
| Images | Next.js Image (Unsplash CDN) |

---

## Features

- **10 real products** across 6 categories (Seeds, Soil, Tools, Fertilizers, Pest Control, Planters)
- **User auth** — register, login, logout via JWT cookies
- **Product listing** with category filtering, search, and sort
- **Product detail** pages with benefits, stock status, qty picker
- **Shopping cart** — persisted to localStorage via Zustand
- **3-step checkout** — shipping → payment (simulated) → confirm → order saved to DB
- **Account page** — order history with status badges
- **Admin panel** — dashboard, product CRUD (create/edit/delete), order management with inline status updates

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) **or** a MongoDB Atlas connection string

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Edit MONGODB_URI if using Atlas
```

`.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/greenleaf
NEXTAUTH_SECRET=change-me-in-production
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=change-me-in-production
```

### 3. Seed the database
```bash
npx ts-node --skip-project lib/seed.ts
```

This creates **10 products** and an admin user:
- Email: `admin@greenleaf.com`
- Password: `admin123`

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  (store)/          # Public store (Navbar + Footer layout)
    page.tsx          # Homepage — hero, categories, featured
    products/         # Product listing + detail
    cart/             # Cart page
    checkout/         # 3-step checkout flow
    account/          # Order history
    about/            # Brand story
  admin/            # Admin panel (sidebar layout, auth-gated)
    page.tsx          # Dashboard with stats
    products/         # List, new, edit
    orders/           # Order management with status updates
  api/              # REST API routes
    auth/             # register, login, logout, me
    products/         # CRUD
    orders/           # Create + list + status patch
  login/ register/  # Auth pages (outside store layout)

components/
  layout/           # Navbar, Footer
  product/          # ProductCard
  admin/            # ProductForm (shared new/edit)

models/             # Mongoose schemas (User, Product, Order)
lib/                # mongodb.ts, auth.ts (JWT), seed.ts
context/            # AuthContext.tsx, cartStore.ts (Zustand)
```

---

## Deployment (Vercel + MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://cloud.mongodb.com)
2. Push code to GitHub
3. Import repo into [Vercel](https://vercel.com)
4. Add environment variables in Vercel dashboard
5. Run seed against Atlas URI locally before first visit

---

## Admin Credentials (demo)
```
Email:    admin@greenleaf.com
Password: admin123
```
