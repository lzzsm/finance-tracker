import { useTransactions } from "./hooks/useTransactions";
import HomePage from "./pages/HomePage";

export default function App() {
  const {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
  } = useTransactions();

  return (
    <HomePage
      transactions={transactions}
      addTransaction={addTransaction}
      editTransaction={editTransaction}
      deleteTransaction={deleteTransaction}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      balance={balance}
    />
  );
}
