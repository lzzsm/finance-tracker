import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock do useTransactions para controlar o estado retornado
vi.mock("@/hooks/useTransactions");
import { useTransactions } from "@/hooks/useTransactions";

// Mock dos componentes filhos pesados para isolar o teste ao HomePage
vi.mock("@/components/SummaryCards", () => ({
  default: () => <div data-testid="summary-cards" />,
}));
vi.mock("@/components/TransactionForm", () => ({
  default: () => <div data-testid="transaction-form" />,
}));
vi.mock("@/components/TransactionList", () => ({
  default: () => <div data-testid="transaction-list" />,
}));
vi.mock("@/components/charts/MonthlyChart", () => ({
  default: () => <div data-testid="monthly-chart" />,
}));
vi.mock("@/components/charts/CategoryChart", () => ({
  default: () => <div data-testid="category-chart" />,
}));
vi.mock("@/components/EditDialog", () => ({ default: () => null }));
vi.mock("@/components/DeleteDialog", () => ({ default: () => null }));

import HomePage from "@/pages/HomePage";

const BASE_STATE = {
  transactions: [],
  loading: false,
  error: null,
  mutationError: null,
  mutationSuccess: null,
  setMutationError: vi.fn(),
  setMutationSuccess: vi.fn(),
  page: 1,
  totalPages: 1,
  filters: { search: "", type: "", category: "" },
  setPage: vi.fn(),
  updateFilters: vi.fn(),
  addTransaction: vi.fn(),
  editTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  monthlyData: [],
  categoryData: [],
};

function renderPage(stateOverrides = {}) {
  useTransactions.mockReturnValue({ ...BASE_STATE, ...stateOverrides });
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <HomePage token="token" onLogout={vi.fn()} />
    </QueryClientProvider>,
  );
}

beforeEach(() => vi.clearAllMocks());

describe("HomePage — Toast", () => {
  test("exibe toast de sucesso quando mutationSuccess está setado", () => {
    renderPage({ mutationSuccess: "Transação adicionada com sucesso." });
    expect(
      screen.getByText("Transação adicionada com sucesso."),
    ).toBeInTheDocument();
  });

  test("exibe toast de erro quando mutationError está setado", () => {
    renderPage({ mutationError: "Erro ao adicionar transação." });
    expect(
      screen.getByText("Erro ao adicionar transação."),
    ).toBeInTheDocument();
  });

  test("chama setMutationSuccess após 4 segundos", async () => {
    vi.useFakeTimers();
    const setMutationSuccess = vi.fn();
    renderPage({
      mutationSuccess: "Transação adicionada com sucesso.",
      setMutationSuccess,
    });

    await act(async () => vi.advanceTimersByTime(4100));

    expect(setMutationSuccess).toHaveBeenCalledWith(null);
    vi.useRealTimers();
  });

  test("chama setMutationError após 4 segundos", async () => {
    vi.useFakeTimers();
    const setMutationError = vi.fn();
    renderPage({
      mutationError: "Erro ao adicionar transação.",
      setMutationError,
    });

    await act(async () => vi.advanceTimersByTime(4100));

    expect(setMutationError).toHaveBeenCalledWith(null);
    vi.useRealTimers();
  });
});

describe("HomePage — loading e erro", () => {
  test("exibe skeleton quando loading é true", () => {
    renderPage({ loading: true });
    expect(
      document.querySelector("[data-slot='skeleton']"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Finanças")).not.toBeInTheDocument();
  });

  test("exibe mensagem de erro quando error está setado", () => {
    renderPage({ error: "Erro ao buscar transações." });
    expect(
      screen.getByText("Erro ao conectar com o servidor."),
    ).toBeInTheDocument();
  });

  test("renderiza layout principal quando não há loading nem erro", () => {
    renderPage();
    expect(screen.getByText("Finanças")).toBeInTheDocument();
  });
});
