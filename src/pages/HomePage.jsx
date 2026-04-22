import { useState } from "react";
import {
  TrashIcon,
  TrendingUp,
  TrendingDown,
  Wallet,
  PencilIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const INCOME_CATEGORIES = ["Salário", "Freelance", "Investimentos", "Outros"];
const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Saúde",
  "Lazer",
  "Outros",
];

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("pt-BR");
}

export default function HomePage({
  transactions,
  addTransaction,
  editTransaction,
  deleteTransaction,
  totalIncome,
  totalExpense,
  balance,
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editError, setEditError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  function handleEditOpen(transaction) {
    setEditingTransaction(transaction);
    setEditDescription(transaction.description);
    setEditAmount(String(transaction.amount));
    setEditType(transaction.type);
    setEditCategory(transaction.category);
    setEditError("");
  }

  function handleEditClose() {
    setEditingTransaction(null);
    setEditDescription("");
    setEditAmount("");
    setEditType("");
    setEditCategory("");
    setEditError("");
  }

  function handleEditTypeChange(value) {
    setEditType(value);
    setEditCategory("");
  }

  function handleEditSubmit() {
    if (!editDescription.trim() || !editAmount || !editType || !editCategory) {
      setEditError("Preencha todos os campos.");
      return;
    }
    if (isNaN(parseFloat(editAmount)) || parseFloat(editAmount) <= 0) {
      setEditError("O valor deve ser um número positivo.");
      return;
    }
    editTransaction(
      editingTransaction.id,
      editDescription,
      editAmount,
      editType,
      editCategory,
    );
    handleEditClose();
  }

  function handleSubmit() {
    if (!description.trim() || !amount || !type || !category) {
      setError("Preencha todos os campos.");
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("O valor deve ser um número positivo.");
      return;
    }
    setError("");
    addTransaction(description, amount, type, category);
    setDescription("");
    setAmount("");
    setType("");
    setCategory("");
  }

  function handleTypeChange(value) {
    setType(value);
    setCategory("");
  }

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const editCategories =
    editType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finanças</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Controle suas receitas e despesas
          </p>
        </div>

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
                className={`text-lg font-bold ${balance >= 0 ? "text-white" : "text-red-400"}`}
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
              <p className="text-lg font-bold text-emerald-400">
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
              <p className="text-lg font-bold text-red-400">
                {formatCurrency(totalExpense)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300">
              Nova transação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-zinc-400">
                Descrição
              </Label>
              <Input
                id="description"
                placeholder="Ex: Aluguel, Salário..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-zinc-400">
                Valor (R$)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Tipo</Label>
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="income" className="text-zinc-100">
                      Receita
                    </SelectItem>
                    <SelectItem value="expense" className="text-zinc-100">
                      Despesa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-400">Categoria</Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  disabled={!type}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 disabled:opacity-40">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-zinc-100"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <Button
              onClick={handleSubmit}
              className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            >
              Adicionar
            </Button>
          </CardContent>
        </Card>

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
                        onClick={() => handleEditOpen(transaction)}
                        aria-label={`Editar ${transaction.description}`}
                        className="text-zinc-600 hover:text-zinc-300 hover:bg-transparent"
                      >
                        <PencilIcon size={15} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(transaction.id)}
                        aria-label={`Excluir ${transaction.description}`}
                        className="text-zinc-600 hover:text-red-400 hover:bg-transparent"
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
      </div>

      {/* Dialog de edição */}
      <Dialog open={!!editingTransaction} onOpenChange={handleEditClose}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader className="bg-zinc-900">
            <DialogTitle className="text-zinc-100">
              Editar transação
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-zinc-400">Descrição</Label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-400">Valor (R$)</Label>
              <Input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-400">Tipo</Label>
                <Select value={editType} onValueChange={handleEditTypeChange}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="income" className="text-zinc-100">
                      Receita
                    </SelectItem>
                    <SelectItem value="expense" className="text-zinc-100">
                      Despesa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-400">Categoria</Label>
                <Select
                  value={editCategory}
                  onValueChange={setEditCategory}
                  disabled={!editType}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 disabled:opacity-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {editCategories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-zinc-100"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editError && <p className="text-red-400 text-xs">{editError}</p>}
          </div>

          {/* bg-zinc-900 no footer garante que o fundo herde a cor do modal */}
          <DialogFooter className="bg-zinc-900">
            <Button
              variant="ghost"
              onClick={handleEditClose}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de confirmação de exclusão */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader className="bg-zinc-900">
            <AlertDialogTitle className="text-zinc-100">
              Excluir transação?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* bg-zinc-900 no footer do AlertDialog pelo mesmo motivo */}
          <AlertDialogFooter className="bg-zinc-900">
            <AlertDialogCancel
              onClick={() => setDeletingId(null)}
              className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteTransaction(deletingId);
                setDeletingId(null);
              }}
              className="bg-red-600 text-white hover:bg-red-700 border-0"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
