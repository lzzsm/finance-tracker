import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SummaryCards from "@/components/SummaryCards";

// Restringe a busca a elementos <p> com texto normalizado
// evita falsos positivos em elementos pai que herdam o textContent dos filhos
function byParagraph(text) {
  return (_, element) => {
    if (element?.tagName !== "P") return false;
    const normalized = element.textContent?.replace(/\s+/g, " ").trim();
    return normalized === text;
  };
}

describe("SummaryCards", () => {
  test("exibe os três labels corretamente", () => {
    render(<SummaryCards balance={0} totalIncome={0} totalExpense={0} />);

    expect(screen.getByText("Saldo")).toBeInTheDocument();
    expect(screen.getByText("Receitas")).toBeInTheDocument();
    expect(screen.getByText("Despesas")).toBeInTheDocument();
  });

  test("exibe saldo positivo em branco", () => {
    render(<SummaryCards balance={1000} totalIncome={1000} totalExpense={0} />);

    const balanceEl = screen
      .getAllByText(byParagraph("R$ 1.000,00"))
      .find((el) => el.classList.contains("text-white"));

    expect(balanceEl).toBeInTheDocument();
  });

  test("exibe saldo negativo em vermelho", () => {
    render(<SummaryCards balance={-500} totalIncome={0} totalExpense={500} />);

    const balanceEl = screen.getByText(byParagraph("-R$ 500,00"));
    expect(balanceEl).toHaveClass("text-red-400");
  });

  test("exibe receitas em verde", () => {
    render(<SummaryCards balance={500} totalIncome={500} totalExpense={0} />);

    const incomeEl = screen
      .getAllByText(byParagraph("R$ 500,00"))
      .find((el) => el.classList.contains("text-emerald-400"));

    expect(incomeEl).toBeInTheDocument();
  });
});
