import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { transactionSchema } from "@/constants/schemas";

export default function EditDialog({ transaction, onSave, onClose }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
    },
  });

  const selectedType = watch("type");
  const categories =
    selectedType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function onSubmit(data) {
    onSave(
      transaction.id,
      data.description,
      data.amount,
      data.type,
      data.category,
    );
    onClose();
  }

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
              {...register("description")}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
            {errors.description && (
              <p className="text-red-400 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-400">Valor (R$)</Label>
            <Input
              type="number"
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
                )}
              />
              {errors.category && (
                <p className="text-red-400 text-xs">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
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
            onClick={handleSubmit(onSubmit)}
            className="cursor-pointer bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
