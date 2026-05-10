import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { transactionSchema } from "@/constants/schemas";
import TransactionFormFields from "@/components/TransactionFormFields";

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
        <TransactionFormFields
          register={register}
          control={control}
          errors={errors}
          selectedType={selectedType}
          setValue={setValue}
          idPrefix="add"
        />
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
