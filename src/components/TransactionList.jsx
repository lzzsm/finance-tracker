import { PencilIcon, TrashIcon, SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ALL_CATEGORIES } from "@/constants/schemas";
import { formatCurrency, formatDate } from "@/lib/formatters";

// Retorna os números de página a exibir com null representando ellipsis.
// Sempre inclui: primeira, última, página atual e uma adjacente em cada lado.
function buildPageRange(page, totalPages) {
  const delta = 1;
  const range = new Set([1, totalPages]);

  for (
    let i = Math.max(2, page - delta);
    i <= Math.min(totalPages - 1, page + delta);
    i++
  ) {
    range.add(i);
  }

  const sorted = [...range].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(null);
    result.push(sorted[i]);
  }

  return result;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  filters,
  updateFilters,
  page,
  totalPages,
  setPage,
}) {
  const pageRange = buildPageRange(page, totalPages);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-300">
          Transações
        </CardTitle>

        <div className="space-y-3 pt-2">
          <div className="relative">
            <SearchIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <Input
              placeholder="Buscar por descrição..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-8 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              value={filters.type}
              onValueChange={(value) =>
                updateFilters({ type: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="cursor-pointer bg-zinc-800 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem
                  value="all"
                  className="cursor-pointer text-zinc-100"
                >
                  Todos os tipos
                </SelectItem>
                <SelectItem
                  value="income"
                  className="cursor-pointer text-zinc-100"
                >
                  Receita
                </SelectItem>
                <SelectItem
                  value="expense"
                  className="cursor-pointer text-zinc-100"
                >
                  Despesa
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.category}
              onValueChange={(value) =>
                updateFilters({ category: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="cursor-pointer bg-zinc-800 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem
                  value="all"
                  className="cursor-pointer text-zinc-100"
                >
                  Todas as categorias
                </SelectItem>
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="cursor-pointer text-zinc-100"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-6">
            Nenhuma transação encontrada.
          </p>
        ) : (
          <>
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

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={`cursor-pointer text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 ${
                          page === 1 ? "pointer-events-none opacity-40" : ""
                        }`}
                      />
                    </PaginationItem>

                    {pageRange.map((p, i) =>
                      p === null ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                          <PaginationEllipsis className="text-zinc-600" />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            onClick={() => setPage(p)}
                            isActive={p === page}
                            className={`cursor-pointer ${
                              p === page
                                ? "bg-zinc-700 text-zinc-100 border-zinc-600"
                                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                            }`}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={`cursor-pointer text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 ${
                          page === totalPages
                            ? "pointer-events-none opacity-40"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
