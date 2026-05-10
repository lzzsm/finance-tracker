import { Controller } from "react-hook-form";
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

// Campos compartilhados entre TransactionForm e EditDialog.
// Recebe register, control, errors, selectedType e setValue do hook useForm do pai.
export default function TransactionFormFields({
  register,
  control,
  errors,
  selectedType,
  setValue,
  idPrefix = "field",
}) {
  const categories =
    selectedType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-description`} className="text-zinc-400">
          Descrição
        </Label>
        <Input
          id={`${idPrefix}-description`}
          placeholder="Ex: Aluguel, Salário..."
          {...register("description")}
          className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
        />
        {errors.description && (
          <p className="text-red-400 text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-amount`} className="text-zinc-400">
          Valor (R$)
        </Label>
        <Input
          id={`${idPrefix}-amount`}
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
          <Label htmlFor={`${idPrefix}-type`} className="text-zinc-400">
            Tipo
          </Label>
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
                <SelectTrigger
                  id={`${idPrefix}-type`}
                  className="cursor-pointer bg-zinc-800 border-zinc-700 text-zinc-100"
                >
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
          <Label htmlFor={`${idPrefix}-category`} className="text-zinc-400">
            Categoria
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!selectedType}
              >
                <SelectTrigger
                  id={`${idPrefix}-category`}
                  className="cursor-pointer bg-zinc-800 border-zinc-700 text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
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
    </>
  );
}
