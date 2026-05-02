import { describe, test, expect } from "vitest";
import { formatCurrency, formatDate } from "@/lib/formatters";

describe("formatCurrency", () => {
  test("formata valor inteiro corretamente", () => {
    expect(formatCurrency(1500)).toBe("R$\u00a01.500,00");
  });

  test("formata valor decimal corretamente", () => {
    expect(formatCurrency(99.9)).toBe("R$\u00a099,90");
  });

  test("formata zero corretamente", () => {
    expect(formatCurrency(0)).toBe("R$\u00a00,00");
  });

  test("formata valor negativo corretamente", () => {
    expect(formatCurrency(-500)).toBe("-R$\u00a0500,00");
  });
});

describe("formatDate", () => {
  test("converte string ISO pra formato pt-BR", () => {
    expect(formatDate("2024-01-15T12:00:00.000Z")).toBe("15/01/2024");
  });

  test("formata mês e dia com zero à esquerda", () => {
    expect(formatDate("2024-03-05T12:00:00.000Z")).toBe("05/03/2024");
  });
});
