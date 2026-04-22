# finance-tracker

Aplicação de controle financeiro pessoal construída com React e shadcn/ui. Projeto desenvolvido com foco em boas práticas, componentização e UI consistente.

> Fase 1 de um projeto progressivo — cada fase introduz novas tecnologias e conceitos.

## Stack

- **React 19** — componentes funcionais e hooks
- **Vite** — bundler e dev server
- **Tailwind CSS v4** — estilização utility-first com tema escuro
- **shadcn/ui** — biblioteca de componentes acessíveis e customizáveis
- **uuid** — geração de IDs únicos por transação
- **tailwind-merge** — merge seguro de classes Tailwind conflitantes
- **lucide-react** — ícones

## Funcionalidades

- Adicionar transações com descrição, valor, tipo (receita/despesa) e categoria
- Validação de formulário com feedback de erro
- Editar transações via modal
- Excluir transações com confirmação via AlertDialog
- Cards de resumo com saldo total, receitas e despesas
- Persistência via `localStorage`
- Estado vazio ilustrado quando não há transações

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
| `Dialog` | Modal de edição de transação |
| `AlertDialog` | Confirmação de exclusão |

## Estrutura do projeto

```
src/
├── components/
│   └── ui/               ← componentes do shadcn/ui
├── hooks/
│   └── useTransactions.js
├── pages/
│   └── HomePage.jsx
└── App.jsx
```

## Decisões técnicas

**Estado centralizado via `useTransactions`**
Toda a lógica de estado (CRUD, persistência, cálculos derivados) vive no custom hook. O `App.jsx` apenas consome o hook e distribui via props, mantendo o arquivo focado em composição.

**Estado derivado sem `useState`**
Saldo, total de receitas e total de despesas são calculados diretamente a partir do array de transações — sem estados paralelos que poderiam ficar dessincronizados.

**shadcn/ui como base de componentes**
Os componentes do shadcn vivem em `src/components/ui/` e podem ser editados livremente. Nenhuma dependência de biblioteca externa no runtime — o código é seu.

## Como rodar

```bash
npm install
npm run dev
```

## Roadmap

- [x] Fase 1 — React + shadcn/ui + localStorage
- [ ] Fase 2 — Gráficos com Recharts
- [ ] Fase 3 — Validação com React Hook Form + Zod
- [ ] Fase 4 — Backend com Node + Express + SQLite
- [ ] Fase 5 — Autenticação com JWT