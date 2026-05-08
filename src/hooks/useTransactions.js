import { useState, useEffect } from "react";
import { MONTH_NAMES } from "@/constants/months";
import { API_URL } from "@/constants/api";

export function useTransactions(token) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutationError, setMutationError] = useState(null);

  // Estado de paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estado de filtros
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
  });

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        // Monta query string apenas com filtros preenchidos
        const params = new URLSearchParams({ page });
        if (filters.search) params.append("search", filters.search);
        if (filters.type) params.append("type", filters.type);
        if (filters.category) params.append("category", filters.category);

        const response = await fetch(`${API_URL}?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erro ao buscar transações.");

        const data = await response.json();
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [token, page, filters]);

  // Quando o filtro muda, volta pra página 1
  function updateFilters(newFilters) {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }

  async function addTransaction(description, amount, type, category) {
    setMutationError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, amount, type, category }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar transação.");

      await response.json();
      // Re-busca a página atual pra refletir a nova transação corretamente
      setFilters((prev) => ({ ...prev }));
    } catch (err) {
      setMutationError(err.message);
    }
  }

  async function editTransaction(id, description, amount, type, category) {
    setMutationError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, amount, type, category }),
      });

      if (!response.ok) throw new Error("Erro ao editar transação.");

      const updated = await response.json();
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setMutationError(err.message);
    }
  }

  async function deleteTransaction(id) {
    setMutationError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao excluir transação.");

      // Re-busca pra atualizar a paginação corretamente após deleção
      setFilters((prev) => ({ ...prev }));
    } catch (err) {
      setMutationError(err.message);
    }
  }

  // Estado derivado calculado a partir das transações da página atual
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
    loading,
    error,
    mutationError,
    page,
    totalPages,
    filters,
    setPage,
    updateFilters,
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
