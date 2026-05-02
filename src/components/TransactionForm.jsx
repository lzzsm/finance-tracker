import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { transactionSchema } from "@/constants/schemas";

const EMPTY_FORM = { description: "", amount: "", type: "", category: "" };

export default function TransactionForm({ onAdd }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: EMPTY_FORM,
  });

  const selectedType = useWatch({ control, name: "type" });
  const categories =
    selectedType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function onSubmit(data) {
    onAdd(data.description, data.amount, data.type, data.category);
    reset(EMPTY_FORM);
  }

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
            {...register("description")}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
          />
          {errors.description && (
            <p className="text-red-400 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amount" className="text-zinc-400">
            Valor (R$)
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="0,00"
            {...register("amount")}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
          />
          {errors.amount && (
            <p className="text-red-400 text-xs">{errors.amount.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-zinc-400">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("category", "");
                  }}
                >
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
              )}
            />
            {errors.type && (
              <p className="text-red-400 text-xs">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-400">Categoria</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedType}
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
              )}
            />
            {errors.category && (
              <p className="text-red-400 text-xs">{errors.category.message}</p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          className="cursor-pointer w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
        >
          Adicionar
        </Button>
      </CardContent>
    </Card>
  );
}
