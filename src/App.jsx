import { useAuth } from "@/hooks/useAuth";
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";

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

  // token passado para HomePage para que useTransactions só monte com token válido
  return <HomePage token={token} onLogout={logout} />;
}
