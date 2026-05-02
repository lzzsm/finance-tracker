# finance-tracker

A personal finance tracking app built progressively — each phase introduces new technologies and concepts.

## Stack

**Frontend**
- **React 19** — functional components, hooks and React Compiler
- **Vite** — bundler and dev server
- **Tailwind CSS v4** — utility-first styling with custom dark theme
- **shadcn/ui** — accessible and customizable component library
- **React Hook Form** — performant form management
- **Zod** — schema validation
- **Recharts** — bar and pie charts
- **lucide-react** — icons
- **tailwind-merge** — safe Tailwind class merging
- **uuid** — unique ID generation

**Backend**
- **Node.js + Express** — REST API
- **SQLite (better-sqlite3)** — local database
- **bcrypt** — password hashing
- **jsonwebtoken** — JWT generation and verification
- **cors** — cross-origin request handling

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt — passwords never stored in plain text
- Protected routes — all transaction endpoints require a valid token
- Per-user data isolation — each user only sees their own transactions
- Add transactions with description, amount, type (income/expense) and category
- Per-field form validation with React Hook Form + Zod
- Edit transactions via pre-filled modal
- Delete transactions with AlertDialog confirmation
- Summary cards with balance, total income and total expenses
- Dashboard tab with monthly bar chart and category donut chart
- Fallback UI when only one expense category exists
- Inline error feedback for failed API mutations

## shadcn/ui components

| Component | Usage |
|---|---|
| `Card` | Summary cards and section containers |
| `Button` | Actions and form submits |
| `Input` | Text and number fields |
| `Label` | Accessible labels linked to inputs |
| `Select` | Type and category selection |
| `Badge` | Category tag on transaction rows |
| `Separator` | Divider between list items |
| `Tabs` | Toggle between Transactions and Dashboard |
| `Dialog` | Edit transaction modal |
| `AlertDialog` | Delete confirmation modal |

## Project structure

```
finance-tracker/
├── server/
│   ├── middleware/
│   │   └── auth.js               ← JWT verification middleware
│   ├── routes/
│   │   ├── auth.js               ← POST /auth/register, POST /auth/login
│   │   └── transactions.js       ← GET, POST, PUT, DELETE (protected)
│   ├── database.js               ← SQLite connection, users and transactions tables
│   └── index.js                  ← Express server entry point
└── src/
    ├── components/
    │   ├── charts/
    │   │   ├── CategoryChart.jsx
    │   │   └── MonthlyChart.jsx
    │   ├── ui/                   ← shadcn/ui components
    │   ├── DeleteDialog.jsx
    │   ├── EditDialog.jsx
    │   ├── SummaryCards.jsx
    │   ├── TransactionForm.jsx
    │   └── TransactionList.jsx
    ├── constants/
    │   ├── api.js
    │   ├── categories.js
    │   ├── months.js
    │   ├── schemas.js
    │   └── styles.js
    ├── hooks/
    │   ├── useAuth.js
    │   └── useTransactions.js
    ├── lib/
    │   └── formatters.js
    ├── pages/
    │   ├── AuthPage.jsx
    │   └── HomePage.jsx
    └── App.jsx
```

## Getting started

Run both processes in separate terminals:

```bash
# frontend
npm run dev

# backend
npm run server
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

## Roadmap

- [x] Phase 1 — React + shadcn/ui + localStorage
- [x] Phase 2 — Charts with Recharts
- [x] Phase 3 — Validation with React Hook Form + Zod
- [x] Phase 4 — REST API with Node + Express + SQLite
- [x] Phase 5 — Authentication with JWT