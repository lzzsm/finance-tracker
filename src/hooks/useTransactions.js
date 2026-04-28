import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MONTH_NAMES } from "@/constants/months";

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

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const monthlyMap = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
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

  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  const categoryMap = transactions
    .filter((t) => t.type === "expense")
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
