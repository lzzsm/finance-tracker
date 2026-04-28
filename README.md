# finance-tracker

Aplicação de controle financeiro pessoal construída com React e shadcn/ui. Projeto desenvolvido de forma progressiva — cada fase introduz novas tecnologias e conceitos.

## Stack atual

- **React 19** — componentes funcionais, hooks e React Compiler
- **Vite** — bundler e dev server
- **Tailwind CSS v4** — estilização utility-first com tema escuro
- **shadcn/ui** — biblioteca de componentes acessíveis e customizáveis
- **React Hook Form** — gerenciamento de formulários performático
- **Zod** — validação de schema com tipagem
- **Recharts** — gráficos de barras e pizza
- **uuid** — geração de IDs únicos por transação
- **tailwind-merge** — merge seguro de classes Tailwind conflitantes
- **lucide-react** — ícones

## Funcionalidades

- Adicionar transações com descrição, valor, tipo (receita/despesa) e categoria
- Validação de formulário por campo com React Hook Form + Zod
- Editar transações via modal com formulário pré-preenchido
- Excluir transações com confirmação via AlertDialog
- Cards de resumo com saldo total, receitas e despesas
- Aba de Dashboard com gráfico de barras (receitas vs despesas por mês) e gráfico de pizza (despesas por categoria)
- Fallback visual quando há apenas uma categoria de despesa
- Persistência via `localStorage`

## Componentes shadcn utilizados

| Componente | Uso |
|---|---|
| `Card` | Cards de resumo e seções |
| `Button` | Ações e submits |
| `Input` | Campos de texto e valor |
| `Label` | Labels acessíveis associados aos inputs |
| `Select` | Seleção de tipo e categoria |
| `Badge` | Exibição de categoria nas transações |
| `Separator` | Divisor entre itens da lista |
| `Tabs` | Alternância entre Transações e Dashboard |
| `Dialog` | Modal de edição de transação |
| `AlertDialog` | Confirmação de exclusão |

## Estrutura do projeto

```
src/
├── components/
│   ├── charts/
│   │   ├── CategoryChart.jsx
│   │   └── MonthlyChart.jsx
│   ├── ui/                    ← componentes do shadcn/ui
│   ├── DeleteDialog.jsx
│   ├── EditDialog.jsx
│   ├── SummaryCards.jsx
│   ├── TransactionForm.jsx
│   └── TransactionList.jsx
├── constants/
│   ├── categories.js
│   ├── months.js
│   ├── schemas.js
│   └── styles.js
├── hooks/
│   └── useTransactions.js
├── lib/
│   └── formatters.js
├── pages/
│   └── HomePage.jsx
└── App.jsx
```

## Decisões técnicas

**Estado centralizado via `useTransactions`**
Toda a lógica de estado (CRUD, persistência, cálculos derivados) vive no custom hook. O `App.jsx` apenas consome o hook e distribui via props.

**Estado derivado sem `useState`**
Saldo, total de receitas, total de despesas, dados mensais e dados por categoria são calculados diretamente a partir do array de transações.

**React Hook Form + Zod**
Formulários gerenciados pelo RHF com validação por schema Zod. `register()` para inputs nativos, `Controller` para o `Select` do shadcn. `useWatch()` em vez de `watch()` para compatibilidade com o React Compiler.

**`key` prop no `EditDialog`**
O `HomePage` passa `key={transaction.id}` no `EditDialog`, fazendo o React recriar o componente quando uma transação diferente é selecionada — inicializando o `useForm` com os valores corretos sem precisar de `useEffect`.

**shadcn/ui como base de componentes**
Os componentes do shadcn vivem em `src/components/ui/` e podem ser editados livremente.

## Como rodar

```bash
npm install
npm run dev
```

## Roadmap

- [x] Fase 1 — React + shadcn/ui + localStorage
- [x] Fase 2 — Gráficos com Recharts
- [x] Fase 3 — Validação com React Hook Form + Zod
- [ ] Fase 4 — Backend com Node + Express + MySQL
- [ ] Fase 5 — Autenticação com JWT