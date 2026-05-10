import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { transactionSchema } from "@/constants/schemas";
import TransactionFormFields from "@/components/TransactionFormFields";

export default function EditDialog({ transaction, onSave, onClose }) {
  const {
    register,
    handleSubmit,
    control,
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

  const selectedType = useWatch({ control, name: "type" });

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
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Editar transação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <TransactionFormFields
            register={register}
            control={control}
            errors={errors}
            selectedType={selectedType}
            setValue={setValue}
            idPrefix="edit"
          />
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
