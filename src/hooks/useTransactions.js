import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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

  return {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
  };
}
