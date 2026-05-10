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
- **TanStack Query (React Query)** — server state management with caching and automatic refetch
- **lucide-react** — icons
- **tailwind-merge** — safe Tailwind class merging
- **uuid** — unique ID generation

**Backend**

- **Node.js + Express** — REST API
- **SQLite (better-sqlite3)** — local database
- **bcrypt** — password hashing
- **jsonwebtoken** — JWT generation and verification
- **express-rate-limit** — brute force protection on auth routes
- **dotenv** — environment variable management
- **cors** — restricted cross-origin request handling

**Testing**

- **Vitest** — test runner integrated with Vite
- **React Testing Library** — component testing with userEvent
- **supertest** — HTTP integration testing for Express routes

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt — passwords never stored in plain text
- Protected routes — all transaction endpoints require a valid token
- Per-user data isolation — each user only sees their own transactions
- Rate limiting on auth routes — 10 attempts per 15 minutes
- Add transactions with description, amount, type (income/expense) and category
- Per-field form validation with React Hook Form + Zod
- Backend input validation — type and category validated against allowed values
- Edit transactions via pre-filled modal
- Delete transactions with AlertDialog confirmation
- Search transactions by description with 1s debounce
- Filter transactions by type and category
- Paginated transaction list (10 per page) with ellipsis navigation
- Summary cards with balance, total income and total expenses — responsive on mobile
- Dashboard tab with monthly bar chart and category donut chart
- Fallback UI when only one expense category exists
- Toast notifications with auto-dismiss for mutation success and error feedback
- Skeleton loading screen preserving layout during initial fetch
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
    │   ├── setup.js                      ← jest-dom matchers setup
    │   ├── formatters.test.js            ← unit tests for formatter functions
    │   ├── HomePage.test.jsx             ← Toast, skeleton and error state tests
    │   ├── SummaryCards.test.jsx         ← component tests
    │   ├── TransactionForm.test.jsx      ← form validation and interaction tests
    │   ├── TransactionFormFields.test.jsx ← shared fields rendering and interaction
    │   ├── useAuth.test.js              ← hook tests with mocked fetch
    │   └── useTransactions.test.jsx     ← debounce and mutation state tests
    ├── components/
    │   ├── charts/
    │   │   ├── CategoryChart.jsx
    │   │   └── MonthlyChart.jsx
    │   ├── ui/                           ← shadcn/ui components
    │   ├── DeleteDialog.jsx
    │   ├── EditDialog.jsx
    │   ├── SummaryCards.jsx
    │   ├── TransactionForm.jsx
    │   ├── TransactionFormFields.jsx     ← shared form fields between form and dialog
    │   └── TransactionList.jsx
    ├── constants/
    │   ├── api.js
    │   ├── auth.js                       ← TOKEN_KEY constant
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

Install dependencies:

```bash
npm install
```

Copy the environment file and fill in the values:

```bash
cp .env.example .env
```

Run both processes in separate terminals:

```bash
# frontend
npm run dev

# backend
npm run server
```

Run the test suite:

```bash
npm test
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

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
- [x] Phase 11 — TOKEN_KEY constant, pagination ellipsis and expanded test coverage
