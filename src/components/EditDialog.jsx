import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

export default function EditDialog({ transaction, onSave, onClose }) {
  const [form, setForm] = useState({
    description: transaction.description,
    amount: String(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    error: "",
  });

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTypeChange(value) {
    setForm((prev) => ({ ...prev, type: value, category: "" }));
  }

  function handleSubmit() {
    if (
      !form.description.trim() ||
      !form.amount ||
      !form.type ||
      !form.category
    ) {
      setField("error", "Preencha todos os campos.");
      return;
    }
    if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setField("error", "O valor deve ser um número positivo.");
      return;
    }
    onSave(
      transaction.id,
      form.description,
      form.amount,
      form.type,
      form.category,
    );
    onClose();
  }

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open={!!transaction} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader className="bg-zinc-900">
          <DialogTitle className="text-zinc-100">Editar transação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-zinc-400">Descrição</Label>
            <Input
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-400">Valor (R$)</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setField("amount", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-zinc-400">Tipo</Label>
              <Select value={form.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="cursor-pointer bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue />
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
                value={form.category}
                onValueChange={(v) => setField("category", v)}
                disabled={!form.type}
              >
                <SelectTrigger className="cursor-pointer bg-zinc-800 border-zinc-700 text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed">
                  <SelectValue />
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

          {form.error && <p className="text-red-400 text-xs">{form.error}</p>}
        </div>

        <DialogFooter className="bg-zinc-900">
          <Button
            variant="ghost"
            onClick={onClose}
            className="cursor-pointer text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="cursor-pointer bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
