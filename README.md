# 📚 Library App

A modern **online library system** where users can browse books, borrow them, and manage their reading activity.

This project includes both **user features** and **admin management tools**, built with a modern **React + TypeScript architecture** and integrated with a REST API backend.

---

# 🌐 Live Demo

You can access the deployed application here:

🔗 https://library-app-zeta-murex.vercel.app/

---

# ✨ Features

## 👤 User Features

- Browse available books
- View detailed book information
- See ratings and reviews
- Add books to cart
- Borrow books through checkout
- Select borrowing duration
- View borrow status
- Prevent duplicate borrowing

---

## 👑 Admin Features

- Admin dashboard
- Manage books
- Manage users
- Manage borrowed books
- Add / edit / delete books
- Prevent deletion when books are still borrowed

---

# 🧱 Tech Stack

## Frontend

- React
- TypeScript
- React Router
- Redux Toolkit
- TanStack Query (React Query)
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express.js
- PostgreSQL

## Deployment

- Vercel (Frontend)
- Railway (Backend)

---

# 🧠 Project Architecture

```
src
 ├─ api
 │   ├─ auth.api.ts
 │   ├─ books.api.ts
 │   ├─ loans.api.ts
 │   ├─ reviews.api.ts
 │
 ├─ pages
 │   ├─ BooksPage.tsx
 │   ├─ BookDetailPage.tsx
 │   ├─ CheckoutPage.tsx
 │   ├─ AdminDashboard.tsx
 │
 ├─ components
 │   ├─ layout
 │   │   ├─ Navbar.tsx
 │   │   └─ Footer.tsx
 │   │
 │   ├─ books
 │   │   └─ BookCard.tsx
 │
 ├─ store
 │   ├─ authSlice.ts
 │   ├─ cartSlice.ts
 │
 ├─ types
 │   ├─ books.ts
 │   ├─ review.ts
 │
 └─ lib
     └─ client.ts
```

---

# 🔑 Authentication Flow

```
Login
 ↓
API returns JWT token
 ↓
Token stored in localStorage
 ↓
Redux store updated
 ↓
Authenticated API requests
```

---

# 📦 API Endpoints

Example API endpoints used by this frontend:

```
POST   /api/auth/login
POST   /api/auth/register

GET    /api/books
GET    /api/books/{id}

POST   /api/loans
GET    /api/me/loans
PATCH  /api/loans/{id}/return
```

---

# 📖 Borrowing Flow

```
Book Detail Page
      ↓
Add to Cart
      ↓
Checkout Page
      ↓
Confirm Borrow
      ↓
Create Loan API
      ↓
Borrow Success
```

The system prevents:

- borrowing the same book twice
- borrowing unavailable books

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```
git clone https://github.com/your-username/library-app.git
cd library-app
```

---

## 2️⃣ Install Dependencies

```
npm install
```

---

## 3️⃣ Run Development Server

```
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

# 📌 Future Improvements

Possible improvements for this project:

- Advanced book search filtering
- User profile editing
- Borrow history page
- Admin analytics dashboard
- Notification system
- Pagination optimization

---

# 👨‍💻 Author

Developed by **Dimas Denny**

This project was created as part of a **modern frontend portfolio project** focusing on:

- scalable React architecture
- API integration
- state management
- production-ready UI

---

# 📄 License

This project is licensed under the **MIT License**.
