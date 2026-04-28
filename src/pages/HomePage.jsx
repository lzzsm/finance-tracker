import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import MonthlyChart from "@/components/charts/MonthlyChart";
import CategoryChart from "@/components/charts/CategoryChart";
import { TAB_CLASS } from "@/constants/styles";

export default function HomePage({
  transactions,
  addTransaction,
  editTransaction,
  deleteTransaction,
  totalIncome,
  totalExpense,
  balance,
  monthlyData,
  categoryData,
}) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  function handleConfirmDelete() {
    deleteTransaction(deletingId);
    setDeletingId(null);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finanças</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Controle suas receitas e despesas
          </p>
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
    </div>
  );
}
