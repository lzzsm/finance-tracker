import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Nomes dos meses em português pra usar nos gráficos
const MONTH_NAMES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(description, amount, type, category) {
    setTransactions((prev) => [
      {
        id: uuidv4(),
        description,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function editTransaction(id, description, amount, type, category) {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, description, amount: parseFloat(amount), type, category }
          : t,
      ),
    );
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  // --- Estado derivado simples ---
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // --- Dados para o gráfico de barras (receitas vs despesas por mês) ---
  // Precisamos de um objeto assim:
  // { "2024-01": { mes: "Jan", receitas: 3000, despesas: 1500 }, ... }
  const monthlyMap = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    // Chave única por ano+mês — garante que Jan/2024 e Jan/2025 não se misturam
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthName = `${MONTH_NAMES[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`;

    if (!acc[key]) {
      acc[key] = { mes: monthName, receitas: 0, despesas: 0 };
    }

    if (t.type === "income") {
      acc[key].receitas += t.amount;
    } else {
      acc[key].despesas += t.amount;
    }

    return acc;
  }, {});

  // Converte o objeto em array e ordena por data (a chave "2024-01" ordena corretamente)
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  // --- Dados para o gráfico de pizza (despesas por categoria) ---
  // Precisamos de um array assim:
  // [{ name: "Alimentação", valor: 800 }, { name: "Moradia", valor: 1200 }, ...]
  const categoryMap = transactions
    .filter((t) => t.type === "expense") // só despesas fazem sentido no pizza
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const categoryData = Object.entries(categoryMap).map(([name, valor]) => ({
    name,
    valor,
  }));

  return {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
    monthlyData,
    categoryData,
  };
}
