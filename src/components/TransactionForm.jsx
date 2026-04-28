import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/constants/categories";

export default function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  function handleTypeChange(value) {
    setType(value);
    setCategory("");
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
    onAdd(description, amount, type, category);
    setDescription("");
    setAmount("");
    setType("");
    setCategory("");
  }

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
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
              <SelectTrigger className="cursor-pointer bg-zinc-800 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
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
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-400">Categoria</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={!type}
            >
              <SelectTrigger className="cursor-pointer bg-zinc-800 border-zinc-700 text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {categories.map((cat) => (
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

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <Button
          onClick={handleSubmit}
          className="cursor-pointer w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
        >
          Adicionar
        </Button>
      </CardContent>
    </Card>
  );
}
