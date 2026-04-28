import { z } from "zod";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/constants/categories";

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const transactionSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória."),

  amount: z.coerce
    .number({ invalid_type_error: "Valor obrigatório." })
    .positive("O valor deve ser positivo."),

  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Selecione o tipo." }),
  }),

  // z.enum() não aceita array dinâmico em JS puro — usamos refine()
  category: z
    .string()
    .min(1, "Selecione a categoria.")
    .refine((val) => ALL_CATEGORIES.includes(val), {
      message: "Categoria inválida.",
    }),
});
