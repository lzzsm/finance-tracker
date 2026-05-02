import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// beforeEach roda antes de cada test — garante estado limpo
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});

describe("useAuth", () => {
  test("começa não autenticado quando não há token no localStorage", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });

  test("começa autenticado quando há token salvo no localStorage", () => {
    localStorageMock.getItem.mockReturnValue("token-salvo");

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe("token-salvo");
  });

  test("login com sucesso salva token e autentica", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "novo-token" }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("user@test.com", "senha123");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe("novo-token");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "token",
      "novo-token",
    );
  });

  test("login com erro seta authError e não autentica", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email ou senha incorretos." }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("user@test.com", "errada");
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.authError).toBe("Email ou senha incorretos.");
  });

  test("logout remove token e desautentica", async () => {
    localStorageMock.getItem.mockReturnValue("token-existente");

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
  });
});
