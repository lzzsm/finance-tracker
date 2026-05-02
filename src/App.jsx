import { useAuth } from "./hooks/useAuth";
import { useTransactions } from "./hooks/useTransactions";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

// Componente separado que só monta quando o usuário já está autenticado.
// Isso garante que useTransactions só roda com um token válido —
// evita o fetch disparar com token null logo após o login.
function AuthenticatedApp({ token, onLogout }) {
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
  } = useTransactions(token);

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
      onLogout={onLogout}
    />
  );
}

export default function App() {
  const {
    token,
    isAuthenticated,
    authError,
    authLoading,
    login,
    register,
    logout,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthPage
        onLogin={login}
        onRegister={register}
        authError={authError}
        authLoading={authLoading}
      />
    );
  }

  return <AuthenticatedApp token={token} onLogout={logout} />;
}
