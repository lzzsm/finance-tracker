import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MONTH_NAMES } from "@/constants/months";
import { API_URL } from "@/constants/api";

function buildParams(page, filters) {
  const params = new URLSearchParams({ page });
  if (filters.search) params.append("search", filters.search);
  if (filters.type) params.append("type", filters.type);
  if (filters.category) params.append("category", filters.category);
  return params;
}

function deriveStats(transactions) {
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

    if (!acc[key]) acc[key] = { mes: monthName, receitas: 0, despesas: 0 };

    if (t.type === "income") acc[key].receitas += t.amount;
    else acc[key].despesas += t.amount;

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

  return { totalIncome, totalExpense, balance, monthlyData, categoryData };
}

export function useTransactions(token) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
  });
  const [mutationError, setMutationError] = useState(null);
  const [mutationSuccess, setMutationSuccess] = useState(null);

  // Atraso de 1000ms antes de disparar o fetch de busca — evita requisição a cada tecla
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 1000);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const activeFilters = { ...filters, search: debouncedSearch };

  const { data, isPending, isError } = useQuery({
    queryKey: ["transactions", token, page, activeFilters],
    queryFn: async () => {
      const params = buildParams(page, activeFilters);
      const response = await fetch(`${API_URL}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar transações.");
      return response.json();
    },
    // select transforma o dado bruto antes de entregar pro componente.
    // só re-renderiza se o resultado mudar — o queryClient guarda o raw separado.
    select: (raw) => ({
      transactions: raw.transactions,
      totalPages: raw.totalPages,
      ...deriveStats(raw.transactions),
    }),
  });

  function updateFilters(newFilters) {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }

  function showSuccess(message) {
    setMutationSuccess(message);
    setMutationError(null);
  }

  const addMutation = useMutation({
    mutationFn: async ({ description, amount, type, category }) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, amount, type, category }),
      });
      if (!response.ok) throw new Error("Erro ao adicionar transação.");
      return response.json();
    },
    onSuccess: () => {
      showSuccess("Transação adicionada com sucesso.");
      invalidate();
    },
    onError: (err) => setMutationError(err.message),
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, description, amount, type, category }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, amount, type, category }),
      });
      if (!response.ok) throw new Error("Erro ao editar transação.");
      return response.json();
    },
    onSuccess: () => {
      showSuccess("Transação editada com sucesso.");
      invalidate();
    },
    onError: (err) => setMutationError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao excluir transação.");
    },
    onSuccess: () => {
      showSuccess("Transação excluída.");
      invalidate();
    },
    onError: (err) => setMutationError(err.message),
  });

  return {
    transactions: data?.transactions ?? [],
    totalPages: data?.totalPages ?? 1,
    totalIncome: data?.totalIncome ?? 0,
    totalExpense: data?.totalExpense ?? 0,
    balance: data?.balance ?? 0,
    monthlyData: data?.monthlyData ?? [],
    categoryData: data?.categoryData ?? [],
    loading: isPending,
    error: isError ? "Erro ao buscar transações." : null,
    mutationError,
    mutationSuccess,
    setMutationError,
    setMutationSuccess,
    page,
    filters,
    setPage,
    updateFilters,
    addTransaction: (description, amount, type, category) =>
      addMutation.mutate({ description, amount, type, category }),
    editTransaction: (id, description, amount, type, category) =>
      editMutation.mutate({ id, description, amount, type, category }),
    deleteTransaction: (id) => deleteMutation.mutate(id),
  };
}
