# Festivio – Frontend (Client Side)

## 🌐 Project Name
**Festivio – Membership & Event Management for Local Clubs (Frontend)**

## 🎯 Project Purpose
Festivio frontend is a modern, responsive React-based web application that allows users to discover clubs and events, join clubs, manage memberships, and access role-based dashboards (Admin, Club Manager, Member).  
This repository contains **only the client-side implementation** of the project.

## 🔗 Live Site URL
👉 **[Live Client Site](https://cute-dusk-f1718c.netlify.app)**

## 🧩 Tech Stack (Frontend)
- React.js
- React Router DOM
- Firebase Authentication
- React Hook Form
- TanStack Query (React Query)
- Axios
- Tailwind CSS
- DaisyUI
- Framer Motion
- Stripe.js (client-side)
- SweetAlert2 / React Hot Toast

## ✨ Key Frontend Features

### 🔐 Authentication & Authorization
- Firebase Authentication (Email/Password + Google Login)
- Password validation with React Hook Form
- JWT token handling for secure API communication
- Private Routes to protect dashboard pages
- Auth state persistence on page reload

### 🧭 Public Pages
- Home page with:
  - Hero section
  - Dynamic Featured Clubs section (TanStack Query)
  - Framer Motion animations
- Clubs listing page with:
  - Server-side search by club name
  - Category-based filtering
  - Sorting (Newest, Oldest, Fee based)
- Club Details page with:
  - Club information
  - Join club button (Free / Paid)
- Events listing page
- Event Details page
- Login & Register pages
- Custom 404 / Error page

### 💳 Membership & Payment UI
- Stripe payment integration (test mode – client side)
- Conditional flow:
  - Free clubs → instant join
  - Paid clubs → Stripe checkout flow
- UI feedback for payment success/failure

### 📊 Role-Based Dashboard UI
Single dashboard layout with different menus based on role.

#### 👑 Admin Dashboard (UI Only)
- Overview cards (users, clubs, payments, events)
- Users management table
- Clubs approval management table
- Payments history table
- Charts for platform statistics

#### 🏢 Club Manager Dashboard (UI Only)
- Manager overview summary
- My Clubs (Create, Update club forms)
- Club Members list
- Events CRUD UI
- Event registrations list

#### 👤 Member Dashboard (UI Only)
- Member overview
- Joined clubs list
- Registered events list
- Payment history UI

### 📝 Forms & State Management
- All forms built using **React Hook Form**
- Server data fetching & mutation using **TanStack Query**
- Loading spinners & skeletons during data fetching
- Error handling with user-friendly messages

### 🎨 UI / UX Design
- Fully responsive (mobile, tablet, desktop)
- Consistent color theme across public pages & dashboard
- Clean grid-based layout
- Equal-height cards for clubs & events
- Reusable components
- Recruiter-friendly design with proper spacing & alignment

## 🔒 Environment Variables (Client)
All sensitive keys are secured using environment variables:
- Firebase configuration
- Stripe publishable key
- Backend API base URL

Example:
```
VITE_apiKey=your_firebase_key
VITE_authDomain=your_auth_domain
VITE_projectId=your_project_id
VITE_stripe_pk=your_stripe_publishable_key
VITE_API_URL=your_backend_url
```

## 📦 Important NPM Packages Used
- react
- react-router-dom
- firebase
- @tanstack/react-query
- react-hook-form
- axios
- framer-motion
- stripe-js
- sweetalert2
- react-hot-toast
- tailwindcss
- daisyui

## 🚀 Deployment Notes (Frontend)
- Deployed on Netlify / Vercel
- Firebase authorized domains configured
- No reload errors on private routes
- Production-ready build with environment variables

## 📌 Notes
- This repository contains **frontend only**
- Backend APIs are consumed securely via Axios
- All dashboard data is fetched dynamically from server APIs

---

### 👤 Admin Test Account (For Full Project Testing)
Email : rwedfgrm1.2.zx@gmail.com
Pass : adsfawerwqerqwer

---

© 2025 ClubSphere – Frontend Client
