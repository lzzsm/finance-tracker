import { PencilIcon, TrashIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-300">
          Transações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-6">
            Nenhuma transação registrada.
          </p>
        ) : (
          <ul className="space-y-1">
            {transactions.map((transaction, index) => (
              <li key={transaction.id}>
                <div className="flex items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-xs border-zinc-700 text-zinc-500 px-1.5 py-0"
                      >
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-zinc-600">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-sm font-medium tabular-nums ${
                      transaction.type === "income"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(transaction)}
                    aria-label={`Editar ${transaction.description}`}
                    className="cursor-pointer text-zinc-600 hover:text-zinc-300 hover:bg-transparent"
                  >
                    <PencilIcon size={15} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(transaction.id)}
                    aria-label={`Excluir ${transaction.description}`}
                    className="cursor-pointer text-zinc-600 hover:text-red-400 hover:bg-transparent"
                  >
                    <TrashIcon size={15} />
                  </Button>
                </div>

                {index < transactions.length - 1 && (
                  <Separator className="bg-zinc-800" />
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
