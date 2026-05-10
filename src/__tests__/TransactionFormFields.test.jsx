import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TransactionFormFields from "@/components/TransactionFormFields";
import { transactionSchema } from "@/constants/schemas";

// O mock captura o id do SelectTrigger e o aplica no <select> nativo,
// permitindo que getByLabelText("Tipo") e getByLabelText("Categoria") funcionem.
vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, children, disabled }) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      data-testid="select"
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ id, children }) => (
    <span data-trigger-id={id}>{children}</span>
  ),
  SelectValue: ({ placeholder }) => <option value="">{placeholder}</option>,
  SelectContent: ({ children }) => <>{children}</>,
  SelectItem: ({ value, children }) => (
    <option value={value}>{children}</option>
  ),
}));

function Wrapper({ idPrefix = "test", selectedType = "" }) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: { description: "", amount: "", type: "", category: "" },
  });

  return (
    <TransactionFormFields
      register={register}
      control={control}
      errors={errors}
      selectedType={selectedType}
      setValue={setValue}
      idPrefix={idPrefix}
    />
  );
}

beforeEach(() => vi.clearAllMocks());

describe("TransactionFormFields — renderização", () => {
  test("renderiza campos de descrição e valor com labels corretos", () => {
    render(<Wrapper />);

    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor (R$)")).toBeInTheDocument();
  });

  test("renderiza labels de Tipo e Categoria", () => {
    render(<Wrapper />);

    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
  });

  test("ids dos campos usam o idPrefix corretamente", () => {
    render(<Wrapper idPrefix="edit" />);

    expect(screen.getByLabelText("Descrição").id).toBe("edit-description");
    expect(screen.getByLabelText("Valor (R$)").id).toBe("edit-amount");
  });

  test("categoria começa desabilitada quando selectedType está vazio", () => {
    render(<Wrapper selectedType="" />);
    expect(screen.getAllByTestId("select")[1]).toBeDisabled();
  });

  test("categoria fica habilitada quando selectedType é passado", () => {
    render(<Wrapper selectedType="income" />);
    expect(screen.getAllByTestId("select")[1]).not.toBeDisabled();
  });
});

describe("TransactionFormFields — interação", () => {
  test("aceita digitação no campo de descrição", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await user.type(screen.getByLabelText("Descrição"), "Salário");
    expect(screen.getByLabelText("Descrição")).toHaveValue("Salário");
  });

  test("aceita digitação no campo de valor", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await user.type(screen.getByLabelText("Valor (R$)"), "1500");
    expect(screen.getByLabelText("Valor (R$)")).toHaveValue(1500);
  });

  test("dois idPrefixes diferentes não geram IDs duplicados", () => {
    render(
      <>
        <Wrapper idPrefix="add" />
        <Wrapper idPrefix="edit" />
      </>,
    );

    const descriptions = screen.getAllByLabelText("Descrição");
    const ids = descriptions.map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
