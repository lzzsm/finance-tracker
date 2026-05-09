import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionForm from "@/components/TransactionForm";

// shadcn Select usa Radix UI que depende de APIs do browser não disponíveis no jsdom.
// O mock substitui o Select por um <select> nativo — comportamento idêntico pro teste.
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
  SelectTrigger: ({ children }) => <>{children}</>,
  SelectValue: ({ placeholder }) => <option value="">{placeholder}</option>,
  SelectContent: ({ children }) => <>{children}</>,
  SelectItem: ({ value, children }) => (
    <option value={value}>{children}</option>
  ),
}));

function renderForm(onAdd = vi.fn()) {
  render(<TransactionForm onAdd={onAdd} />);
  return {
    descriptionInput: () => screen.getByLabelText("Descrição"),
    amountInput: () => screen.getByLabelText("Valor (R$)"),
    typeSelect: () => screen.getAllByTestId("select")[0],
    categorySelect: () => screen.getAllByTestId("select")[1],
    submitButton: () => screen.getByRole("button", { name: /adicionar/i }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TransactionForm — renderização", () => {
  test("exibe todos os campos e o botão de submit", () => {
    renderForm();

    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor (R$)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /adicionar/i }),
    ).toBeInTheDocument();
  });

  test("categoria começa desabilitada enquanto tipo não for selecionado", () => {
    const { categorySelect } = renderForm();
    expect(categorySelect()).toBeDisabled();
  });
});

describe("TransactionForm — validação", () => {
  test("exibe erros de descrição, tipo e categoria ao submeter com campos vazios", async () => {
    const user = userEvent.setup();
    const { submitButton } = renderForm();

    await user.click(submitButton());

    await waitFor(() => {
      expect(screen.getByText("Descrição obrigatória.")).toBeInTheDocument();
      expect(screen.getByText("Selecione o tipo.")).toBeInTheDocument();
      expect(screen.getByText("Selecione a categoria.")).toBeInTheDocument();
    });
  });

  test("exibe erro ao informar valor negativo", async () => {
    const user = userEvent.setup();
    const { amountInput, submitButton } = renderForm();

    await user.type(amountInput(), "-50");
    await user.click(submitButton());

    await waitFor(() => {
      expect(
        screen.getByText("O valor deve ser positivo."),
      ).toBeInTheDocument();
    });
  });

  test("exibe erro ao informar valor zero", async () => {
    const user = userEvent.setup();
    const { amountInput, submitButton } = renderForm();

    await user.type(amountInput(), "0");
    await user.click(submitButton());

    await waitFor(() => {
      expect(
        screen.getByText("O valor deve ser positivo."),
      ).toBeInTheDocument();
    });
  });
});

describe("TransactionForm — interação", () => {
  test("habilita categoria após selecionar tipo", async () => {
    const user = userEvent.setup();
    const { typeSelect, categorySelect } = renderForm();

    await user.selectOptions(typeSelect(), "income");

    expect(categorySelect()).not.toBeDisabled();
  });

  test("limpa categoria ao trocar de tipo", async () => {
    const user = userEvent.setup();
    const { typeSelect, categorySelect } = renderForm();

    await user.selectOptions(typeSelect(), "income");
    await user.selectOptions(categorySelect(), "Salário");
    await user.selectOptions(typeSelect(), "expense");

    expect(categorySelect()).toHaveValue("");
  });

  test("chama onAdd com os dados corretos ao submeter", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const {
      descriptionInput,
      amountInput,
      typeSelect,
      categorySelect,
      submitButton,
    } = renderForm(onAdd);

    await user.type(descriptionInput(), "Salário mensal");
    await user.type(amountInput(), "3000");
    await user.selectOptions(typeSelect(), "income");
    await user.selectOptions(categorySelect(), "Salário");
    await user.click(submitButton());

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledOnce();
      expect(onAdd).toHaveBeenCalledWith(
        "Salário mensal",
        3000,
        "income",
        "Salário",
      );
    });
  });

  test("limpa o formulário após submit bem-sucedido", async () => {
    const user = userEvent.setup();
    const {
      descriptionInput,
      amountInput,
      typeSelect,
      categorySelect,
      submitButton,
    } = renderForm();

    await user.type(descriptionInput(), "Aluguel");
    await user.type(amountInput(), "1500");
    await user.selectOptions(typeSelect(), "expense");
    await user.selectOptions(categorySelect(), "Moradia");
    await user.click(submitButton());

    await waitFor(() => {
      expect(descriptionInput()).toHaveValue("");
      expect(amountInput()).toHaveValue(null);
      expect(typeSelect()).toHaveValue("");
      expect(categorySelect()).toHaveValue("");
    });
  });

  test("não chama onAdd quando campos estão inválidos", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const { submitButton } = renderForm(onAdd);

    await user.click(submitButton());

    await waitFor(() => {
      expect(onAdd).not.toHaveBeenCalled();
    });
  });
});
