import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import MonthlyChart from "@/components/charts/MonthlyChart";
import CategoryChart from "@/components/charts/CategoryChart";
import { TAB_CLASS } from "@/constants/styles";
import { useTransactions } from "@/hooks/useTransactions";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32 bg-zinc-800" />
            <Skeleton className="h-4 w-52 bg-zinc-800" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md bg-zinc-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-zinc-800" />
          ))}
        </div>
        <Skeleton className="h-10 w-48 bg-zinc-800" />
        <Skeleton className="h-64 rounded-xl bg-zinc-800" />
        <Skeleton className="h-96 rounded-xl bg-zinc-800" />
      </div>
    </div>
  );
}

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const styles =
    type === "error"
      ? "bg-red-950 border-red-800 text-red-300"
      : "bg-zinc-800 border-zinc-700 text-zinc-100";

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg border text-sm shadow-lg ${styles}`}
    >
      {message}
    </div>
  );
}

export default function HomePage({ token, onLogout }) {
  const {
    transactions,
    loading,
    error,
    mutationError,
    mutationSuccess,
    setMutationError,
    setMutationSuccess,
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
  } = useTransactions(token);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  function handleConfirmDelete() {
    deleteTransaction(deletingId);
    setDeletingId(null);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-zinc-300 font-medium">
            Erro ao conectar com o servidor.
          </p>
          <p className="text-zinc-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Finanças</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Controle suas receitas e despesas
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  aria-label="Sair"
                  className="cursor-pointer text-zinc-600 hover:text-zinc-300 hover:bg-transparent"
                >
                  <LogOut size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Sair</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <SummaryCards
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <Tabs defaultValue="transactions">
          <TabsList className="bg-transparent w-full rounded-none p-0 h-auto gap-1">
            <TabsTrigger value="transactions" className={TAB_CLASS}>
              Transações
            </TabsTrigger>
            <TabsTrigger value="dashboard" className={TAB_CLASS}>
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4 mt-6">
            <TransactionForm onAdd={addTransaction} />
            <TransactionList
              transactions={transactions}
              onEdit={setEditingTransaction}
              onDelete={setDeletingId}
              filters={filters}
              updateFilters={updateFilters}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4 mt-6">
            <MonthlyChart data={monthlyData} />
            <CategoryChart data={categoryData} />
          </TabsContent>
        </Tabs>
      </div>

      {editingTransaction && (
        <EditDialog
          key={editingTransaction.id}
          transaction={editingTransaction}
          onSave={editTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}

      <DeleteDialog
        open={!!deletingId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      {mutationError && (
        <Toast
          message={mutationError}
          type="error"
          onDismiss={() => setMutationError(null)}
        />
      )}

      {mutationSuccess && (
        <Toast
          message={mutationSuccess}
          type="success"
          onDismiss={() => setMutationSuccess(null)}
        />
      )}
    </div>
  );
}
