import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import authRouter from "../routes/auth.js";
import transactionsRouter from "../routes/transactions.js";
import db from "../database.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/transactions", transactionsRouter);

// ---------------------------------------------------------------------------
// Setup — cria usuário de teste e pega token antes de todos os testes
// ---------------------------------------------------------------------------

let token;
let otherToken;

beforeAll(async () => {
  db.prepare(
    "DELETE FROM transactions WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@transactions-test.com')",
  ).run();
  db.prepare(
    "DELETE FROM users WHERE email LIKE '%@transactions-test.com'",
  ).run();

  const res = await request(app)
    .post("/auth/register")
    .send({ email: "main@transactions-test.com", password: "senha123" });
  token = res.body.token;

  const res2 = await request(app)
    .post("/auth/register")
    .send({ email: "other@transactions-test.com", password: "senha123" });
  otherToken = res2.body.token;
});

afterAll(() => {
  db.prepare(
    "DELETE FROM transactions WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@transactions-test.com')",
  ).run();
  db.prepare(
    "DELETE FROM users WHERE email LIKE '%@transactions-test.com'",
  ).run();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function authHeader(t) {
  return { Authorization: `Bearer ${t}` };
}

async function createTransaction(overrides = {}) {
  const payload = {
    description: "Salário",
    amount: 3000,
    type: "income",
    category: "Salário",
    ...overrides,
  };
  const res = await request(app)
    .post("/transactions")
    .set(authHeader(token))
    .send(payload);
  return res.body;
}

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------

describe("autenticação", () => {
  test("retorna 401 sem token", async () => {
    const res = await request(app).get("/transactions");
    expect(res.status).toBe(401);
  });

  test("retorna 401 com token inválido", async () => {
    const res = await request(app)
      .get("/transactions")
      .set({ Authorization: "Bearer token-invalido" });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /transactions
// ---------------------------------------------------------------------------

describe("GET /transactions", () => {
  beforeAll(async () => {
    await createTransaction({
      description: "Salário",
      type: "income",
      category: "Salário",
      amount: 3000,
    });
    await createTransaction({
      description: "Aluguel",
      type: "expense",
      category: "Moradia",
      amount: 1200,
    });
    await createTransaction({
      description: "Mercado",
      type: "expense",
      category: "Alimentação",
      amount: 500,
    });
  });

  test("retorna lista de transações com paginação", async () => {
    const res = await request(app).get("/transactions").set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.transactions).toBeInstanceOf(Array);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalPages");
  });

  test("filtra por tipo income", async () => {
    const res = await request(app)
      .get("/transactions?type=income")
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.transactions.every((t) => t.type === "income")).toBe(true);
  });

  test("filtra por tipo expense", async () => {
    const res = await request(app)
      .get("/transactions?type=expense")
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.transactions.every((t) => t.type === "expense")).toBe(true);
  });

  test("filtra por categoria", async () => {
    const res = await request(app)
      .get("/transactions?category=Moradia")
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.transactions.every((t) => t.category === "Moradia")).toBe(
      true,
    );
  });

  test("busca por descrição", async () => {
    const res = await request(app)
      .get("/transactions?search=Mercado")
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.transactions.length).toBeGreaterThan(0);
    expect(
      res.body.transactions.every((t) => t.description.includes("Mercado")),
    ).toBe(true);
  });

  test("não retorna transações de outro usuário", async () => {
    await request(app)
      .post("/transactions")
      .set(authHeader(otherToken))
      .send({
        description: "Transação do outro",
        amount: 999,
        type: "income",
        category: "Outros",
      });

    const res = await request(app).get("/transactions").set(authHeader(token));

    const descriptions = res.body.transactions.map((t) => t.description);
    expect(descriptions).not.toContain("Transação do outro");
  });

  test("respeita paginação — página 1 com limit 10", async () => {
    const res = await request(app)
      .get("/transactions?page=1")
      .set(authHeader(token));

    expect(res.body.page).toBe(1);
    expect(res.body.transactions.length).toBeLessThanOrEqual(10);
  });
});

// ---------------------------------------------------------------------------
// POST /transactions
// ---------------------------------------------------------------------------

describe("POST /transactions", () => {
  test("cria transação com dados válidos", async () => {
    const res = await request(app)
      .post("/transactions")
      .set(authHeader(token))
      .send({
        description: "Freelance",
        amount: 1500,
        type: "income",
        category: "Freelance",
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      description: "Freelance",
      amount: 1500,
      type: "income",
      category: "Freelance",
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.date).toBeDefined();
  });

  test("retorna 400 quando campos obrigatórios estão ausentes", async () => {
    const res = await request(app)
      .post("/transactions")
      .set(authHeader(token))
      .send({ description: "Sem amount" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("converte amount para float ao salvar", async () => {
    const res = await request(app)
      .post("/transactions")
      .set(authHeader(token))
      .send({
        description: "Decimal",
        amount: "99.99",
        type: "income",
        category: "Outros",
      });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(99.99);
  });
});

// ---------------------------------------------------------------------------
// PUT /transactions/:id
// ---------------------------------------------------------------------------

describe("PUT /transactions/:id", () => {
  let transactionId;

  beforeAll(async () => {
    const t = await createTransaction({
      description: "Para editar",
      amount: 100,
      type: "income",
      category: "Outros",
    });
    transactionId = t.id;
  });

  test("edita transação existente com dados válidos", async () => {
    const res = await request(app)
      .put(`/transactions/${transactionId}`)
      .set(authHeader(token))
      .send({
        description: "Editada",
        amount: 200,
        type: "expense",
        category: "Lazer",
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      description: "Editada",
      amount: 200,
      type: "expense",
    });
  });

  test("retorna 404 ao editar transação inexistente", async () => {
    const res = await request(app)
      .put("/transactions/id-que-nao-existe")
      .set(authHeader(token))
      .send({
        description: "X",
        amount: 1,
        type: "income",
        category: "Outros",
      });

    expect(res.status).toBe(404);
  });

  test("não permite editar transação de outro usuário", async () => {
    const res = await request(app)
      .put(`/transactions/${transactionId}`)
      .set(authHeader(otherToken))
      .send({
        description: "Invadida",
        amount: 1,
        type: "income",
        category: "Outros",
      });

    expect(res.status).toBe(404);
  });

  test("retorna 400 quando campos obrigatórios estão ausentes", async () => {
    const res = await request(app)
      .put(`/transactions/${transactionId}`)
      .set(authHeader(token))
      .send({ description: "Só descrição" });

    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// DELETE /transactions/:id
// ---------------------------------------------------------------------------

describe("DELETE /transactions/:id", () => {
  let transactionId;

  beforeAll(async () => {
    const t = await createTransaction({
      description: "Para deletar",
      amount: 50,
      type: "expense",
      category: "Lazer",
    });
    transactionId = t.id;
  });

  test("deleta transação existente e retorna 204", async () => {
    const res = await request(app)
      .delete(`/transactions/${transactionId}`)
      .set(authHeader(token));

    expect(res.status).toBe(204);
  });

  test("retorna 404 ao deletar transação já removida", async () => {
    const res = await request(app)
      .delete(`/transactions/${transactionId}`)
      .set(authHeader(token));

    expect(res.status).toBe(404);
  });

  test("não permite deletar transação de outro usuário", async () => {
    const t = await createTransaction({
      description: "Protegida",
      amount: 10,
      type: "income",
      category: "Outros",
    });

    const res = await request(app)
      .delete(`/transactions/${t.id}`)
      .set(authHeader(otherToken));

    expect(res.status).toBe(404);

    const still = db
      .prepare("SELECT id FROM transactions WHERE id = ?")
      .get(t.id);
    expect(still).toBeDefined();
  });
});
