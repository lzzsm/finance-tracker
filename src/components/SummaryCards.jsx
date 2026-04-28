import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

export default function SummaryCards({ balance, totalIncome, totalExpense }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-zinc-400 flex items-center gap-2">
            <Wallet size={14} />
            Saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-xl font-bold ${balance >= 0 ? "text-white" : "text-red-400"}`}
          >
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-zinc-400 flex items-center gap-2">
            <TrendingUp size={14} />
            Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-emerald-400">
            {formatCurrency(totalIncome)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-zinc-400 flex items-center gap-2">
            <TrendingDown size={14} />
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-red-400">
            {formatCurrency(totalExpense)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
