import { useTransactions } from "./hooks/useTransactions";
import HomePage from "./pages/HomePage";

export default function App() {
  const {
    transactions,
    loading,
    error,
    mutationError,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
    monthlyData,
    categoryData,
  } = useTransactions();

  return (
    <HomePage
      transactions={transactions}
      loading={loading}
      error={error}
      mutationError={mutationError}
      addTransaction={addTransaction}
      editTransaction={editTransaction}
      deleteTransaction={deleteTransaction}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      balance={balance}
      monthlyData={monthlyData}
      categoryData={categoryData}
    />
  );
}
