# finance-tracker

A personal finance tracking app built progressively — each phase introduces new technologies and concepts.

## Stack

**Frontend**

- **React 19** — functional components, hooks and React Compiler
- **Vite** — bundler and dev server
- **Tailwind CSS v4** — utility-first styling with custom dark theme
- **shadcn/ui** — accessible and customizable component library
- **React Hook Form + Zod** — form management and schema validation
- **Recharts** — bar and pie charts
- **TanStack Query** — server state management with caching and automatic refetch
- **lucide-react** — icons
- **tailwind-merge** — safe Tailwind class merging

**Backend**

- **Node.js + Express** — REST API
- **SQLite (better-sqlite3)** — local database
- **bcrypt** — password hashing
- **jsonwebtoken** — JWT authentication
- **express-rate-limit** — brute force protection on auth routes
- **dotenv + cors** — environment config and restricted cross-origin handling

**Testing**

- **Vitest** — test runner integrated with Vite
- **React Testing Library** — component and hook testing with userEvent
- **supertest** — HTTP integration testing for Express routes

## Features

- JWT authentication — register, login and logout with bcrypt password hashing
- Per-user data isolation — each user only sees their own transactions
- Rate limiting on auth routes — brute force protection with 300ms debounce on submit
- Full CRUD for transactions — description, amount, type and category
- Per-field form validation on frontend (Zod) and backend (explicit allowlist)
- Search with 1s debounce, filters by type and category, paginated list with ellipsis navigation
- Summary cards — balance, income and expenses, responsive on mobile
- Dashboard — monthly bar chart and category donut chart
- Toast notifications with auto-dismiss and skeleton loading screen
- Automatic cache invalidation after mutations via React Query

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```
JWT_SECRET=your_secret_key_here
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3000
```

## shadcn/ui components

| Component     | Usage                                     |
| ------------- | ----------------------------------------- |
| `Card`        | Summary cards and section containers      |
| `Button`      | Actions and form submits                  |
| `Input`       | Text and number fields                    |
| `Label`       | Accessible labels linked to inputs        |
| `Select`      | Type and category selection               |
| `Badge`       | Category tag on transaction rows          |
| `Separator`   | Divider between list items                |
| `Tabs`        | Toggle between Transactions and Dashboard |
| `Dialog`      | Edit transaction modal                    |
| `AlertDialog` | Delete confirmation modal                 |
| `Pagination`  | Page navigation on transaction list       |
| `Skeleton`    | Loading placeholders                      |
| `Tooltip`     | Logout button label on hover              |

## Project structure

```
finance-tracker/
├── server/
│   ├── __tests__/
│   │   ├── auth.test.js              ← integration tests for auth routes
│   │   └── transactions.test.js      ← integration tests for transaction routes
│   ├── middleware/
│   │   └── auth.js                   ← JWT verification middleware
│   ├── routes/
│   │   ├── auth.js                   ← POST /auth/register, POST /auth/login
│   │   └── transactions.js           ← GET, POST, PUT, DELETE (protected)
│   ├── database.js                   ← SQLite connection, users and transactions tables
│   └── index.js                      ← Express server entry point
└── src/
    ├── __tests__/
    │   ├── setup.js
    │   ├── formatters.test.js
    │   ├── HomePage.test.jsx
    │   ├── SummaryCards.test.jsx
    │   ├── TransactionForm.test.jsx
    │   ├── TransactionFormFields.test.jsx
    │   ├── useAuth.test.js
    │   └── useTransactions.test.jsx
    ├── components/
    │   ├── charts/
    │   │   ├── CategoryChart.jsx
    │   │   └── MonthlyChart.jsx
    │   ├── ui/                           ← shadcn/ui components
    │   ├── DeleteDialog.jsx
    │   ├── EditDialog.jsx
    │   ├── SummaryCards.jsx
    │   ├── TransactionForm.jsx
    │   ├── TransactionFormFields.jsx
    │   └── TransactionList.jsx
    ├── constants/
    │   ├── api.js
    │   ├── auth.js
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

```bash
npm install
cp .env.example .env
```

Run both processes in separate terminals:

```bash
npm run dev     # frontend — http://localhost:5173
npm run server  # backend  — http://localhost:3000
npm test        # test suite
```

## Roadmap

- [x] Phase 1 — React + shadcn/ui + localStorage
- [x] Phase 2 — Charts with Recharts
- [x] Phase 3 — Validation with React Hook Form + Zod
- [x] Phase 4 — REST API with Node + Express + SQLite
- [x] Phase 5 — Authentication with JWT
- [x] Phase 6 — Testing with Vitest and React Testing Library
- [x] Phase 7 — Environment variables, search, filters and pagination
- [x] Phase 8 — React Query and expanded test coverage
- [x] Phase 9 — Security hardening and input validation
- [x] Phase 10 — UX polish, refactoring and responsiveness
- [x] Phase 11 — Debounce on auth, TOKEN_KEY constant, pagination ellipsis and test coverage
