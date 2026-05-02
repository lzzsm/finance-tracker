import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import authRouter from "../routes/auth.js";
import db from "../database.js";

// Cria uma instância do Express só pra testes
// não usa o server/index.js pra não conflitar com o servidor real
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

// beforeAll roda uma vez antes de todos os testes do arquivo
beforeAll(() => {
  db.prepare("DELETE FROM users WHERE email LIKE '%@test.com'").run();
});

// afterAll roda uma vez depois de todos os testes do arquivo
afterAll(() => {
  db.prepare("DELETE FROM users WHERE email LIKE '%@test.com'").run();
});

describe("POST /auth/register", () => {
  test("cadastra usuário com dados válidos e retorna token", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "novo@test.com", password: "senha123" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test("retorna 409 quando email já está cadastrado", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "duplicado@test.com", password: "senha123" });

    const res = await request(app)
      .post("/auth/register")
      .send({ email: "duplicado@test.com", password: "senha123" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email já cadastrado.");
  });

  test("retorna 400 quando senha tem menos de 6 caracteres", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "curto@test.com", password: "123" });

    expect(res.status).toBe(400);
  });

  test("retorna 400 quando campos obrigatórios estão ausentes", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "sem-senha@test.com" });

    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  beforeAll(async () => {
    // Cadastra um usuário pra usar nos testes de login
    await request(app)
      .post("/auth/register")
      .send({ email: "login@test.com", password: "senha123" });
  });

  test("autentica com credenciais corretas e retorna token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "login@test.com", password: "senha123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("retorna 401 com senha incorreta", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "login@test.com", password: "errada" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Email ou senha incorretos.");
  });

  test("retorna 401 com email inexistente", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "naoexiste@test.com", password: "senha123" });

    expect(res.status).toBe(401);
  });
});
