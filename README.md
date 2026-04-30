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
- **cors** — cross-origin request handling

## Features

- Add transactions with description, amount, type (income/expense) and category
- Per-field form validation with React Hook Form + Zod
- Edit transactions via pre-filled modal
- Delete transactions with AlertDialog confirmation
- Summary cards with balance, total income and total expenses
- Dashboard tab with monthly bar chart and category donut chart
- Fallback UI when only one expense category exists
- Data persisted in SQLite via REST API
- Inline error feedback for failed API mutations

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

## Project structure

```
finance-tracker/
├── server/
│   ├── routes/
│   │   └── transactions.js   ← GET, POST, PUT, DELETE
│   ├── database.js           ← SQLite connection and table setup
│   └── index.js              ← Express server entry point
└── src/
    ├── components/
    │   ├── charts/
    │   │   ├── CategoryChart.jsx
    │   │   └── MonthlyChart.jsx
    │   ├── ui/               ← shadcn/ui components
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
    │   └── useTransactions.js
    ├── lib/
    │   └── formatters.js
    ├── pages/
    │   └── HomePage.jsx
    └── App.jsx
```

## Technical decisions

**Centralized state via `useTransactions`**
All state logic (CRUD, API calls, derived calculations) lives in the custom hook. `App.jsx` only consumes the hook and distributes data via props, keeping it focused on composition.

**Derived state without `useState`**
Balance, total income, total expenses, monthly chart data and category chart data are all calculated directly from the transactions array — no parallel state that could go out of sync.

**React Hook Form + Zod**
Forms managed by RHF with Zod schema validation. `register()` for native inputs, `Controller` for shadcn `Select` components. `useWatch()` instead of `watch()` for React Compiler compatibility.

**`key` prop on `EditDialog`**
`HomePage` passes `key={transaction.id}` to `EditDialog`, causing React to remount the component when a different transaction is selected — initializing `useForm` with the correct values without needing a `useEffect`.

**Separated error states**
`error` captures failures on the initial data fetch and renders a full error screen. `mutationError` captures failures on add/edit/delete and renders inline, without taking down the page.

**REST API with Express**
Four routes covering the full CRUD. Server-side validation on POST and PUT. PUT fetches the updated row after the UPDATE query to return all fields including `date` in the response.

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
- [ ] Phase 5 — Authentication with JWT
