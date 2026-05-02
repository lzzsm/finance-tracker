import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const authSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default function AuthPage({
  onLogin,
  onRegister,
  authError,
  authLoading,
}) {
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(authSchema) });

  function handleToggle() {
    setIsLogin((prev) => !prev);
    reset();
  }

  async function onSubmit(data) {
    if (isLogin) {
      await onLogin(data.email, data.password);
    } else {
      await onRegister(data.email, data.password);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 text-lg font-semibold">
            {isLogin ? "Entrar" : "Criar conta"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-zinc-400">Email</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400">Senha</Label>
              <Input
                type="password"
                placeholder="••••••"
                {...register("password")}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
              {errors.password && (
                <p className="text-red-400 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {authError && <p className="text-red-400 text-xs">{authError}</p>}

            <Button
              type="submit"
              disabled={authLoading}
              className="cursor-pointer w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
            >
              {authLoading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
            </Button>

            <p className="text-center text-xs text-zinc-600">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={handleToggle}
                className="cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {isLogin ? "Cadastre-se" : "Entrar"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
