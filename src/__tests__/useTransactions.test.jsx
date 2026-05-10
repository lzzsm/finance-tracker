import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/constants/api", () => ({ API_URL: "http://test/transactions" }));

import { useTransactions } from "@/hooks/useTransactions";

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
}

const EMPTY_RESPONSE = { transactions: [], totalPages: 1, total: 0, page: 1 };

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.useRealTimers());

// ---------------------------------------------------------------------------
// Debounce
// ---------------------------------------------------------------------------

describe("useTransactions — debounce na busca", () => {
  test("não dispara fetch imediatamente ao atualizar search", async () => {
    // shouldAdvanceTime permite que as Promises do React Query resolvam
    // enquanto ainda controlamos setTimeout manualmente
    vi.useFakeTimers({ shouldAdvanceTime: true });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => EMPTY_RESPONSE,
    });

    const { result } = renderHook(() => useTransactions("token"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    const callsBefore = globalThis.fetch.mock.calls.length;

    act(() => result.current.updateFilters({ search: "sal" }));

    // Debounce ainda não expirou — nenhum fetch extra deve ter ocorrido
    expect(globalThis.fetch.mock.calls.length).toBe(callsBefore);
  });

  test("dispara fetch após o debounce expirar", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => EMPTY_RESPONSE,
    });

    const { result } = renderHook(() => useTransactions("token"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    act(() => result.current.updateFilters({ search: "salário" }));

    // Avança além do debounce de 1000ms
    await act(async () => vi.advanceTimersByTime(1100));

    await waitFor(() =>
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("search=sal%C3%A1rio"),
        expect.any(Object),
      ),
    );
  });
});

// ---------------------------------------------------------------------------
// mutationSuccess / mutationError
// ---------------------------------------------------------------------------

describe("useTransactions — mutationSuccess", () => {
  test("seta mensagem de sucesso ao adicionar transação", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => EMPTY_RESPONSE })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "1", description: "Teste" }),
      })
      .mockResolvedValue({ ok: true, json: async () => EMPTY_RESPONSE });

    const { result } = renderHook(() => useTransactions("token"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.addTransaction("Salário", 3000, "income", "Salário");
    });

    await waitFor(() =>
      expect(result.current.mutationSuccess).toBe(
        "Transação adicionada com sucesso.",
      ),
    );
  });

  test("seta mensagem de sucesso ao excluir transação", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => EMPTY_RESPONSE })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValue({ ok: true, json: async () => EMPTY_RESPONSE });

    const { result } = renderHook(() => useTransactions("token"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.deleteTransaction("id-1");
    });

    await waitFor(() =>
      expect(result.current.mutationSuccess).toBe("Transação excluída."),
    );
  });

  test("seta mutationError quando addTransaction falha", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => EMPTY_RESPONSE })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erro" }),
      });

    const { result } = renderHook(() => useTransactions("token"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.addTransaction("X", 1, "income", "Outros");
    });

    await waitFor(() =>
      expect(result.current.mutationError).toBe("Erro ao adicionar transação."),
    );
  });
});
