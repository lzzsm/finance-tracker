import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../database.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
const PAGE_SIZE = 10;

router.use(authMiddleware);

router.get("/", (req, res) => {
  const { page = 1, type, category, search } = req.query;
  const offset = (parseInt(page) - 1) * PAGE_SIZE;

  // Monta a query dinamicamente baseado nos filtros recebidos
  // WHERE sempre filtra por user_id — demais condições são opcionais
  const conditions = ["user_id = ?"];
  const params = [req.user.id];

  if (type) {
    conditions.push("type = ?");
    params.push(type);
  }

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (search) {
    conditions.push("description LIKE ?");
    params.push(`%${search}%`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  // Busca o total de registros com os filtros aplicados — necessário pra calcular total de páginas
  const total = db
    .prepare(`SELECT COUNT(*) as count FROM transactions ${where}`)
    .get(...params).count;

  const transactions = db
    .prepare(
      `SELECT * FROM transactions ${where} ORDER BY date DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, PAGE_SIZE, offset);

  res.json({
    transactions,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
});

router.post("/", (req, res) => {
  const { description, amount, type, category } = req.body;

  if (!description || !amount || !type || !category) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const transaction = {
    id: uuidv4(),
    description,
    amount: parseFloat(amount),
    type,
    category,
    date: new Date().toISOString(),
    user_id: req.user.id,
  };

  db.prepare(
    `
    INSERT INTO transactions (id, description, amount, type, category, date, user_id)
    VALUES (@id, @description, @amount, @type, @category, @date, @user_id)
  `,
  ).run(transaction);

  res.status(201).json(transaction);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category } = req.body;

  if (!description || !amount || !type || !category) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const result = db
    .prepare(
      `
    UPDATE transactions
    SET description = @description, amount = @amount, type = @type, category = @category
    WHERE id = @id AND user_id = @user_id
  `,
    )
    .run({
      id,
      description,
      amount: parseFloat(amount),
      type,
      category,
      user_id: req.user.id,
    });

  if (result.changes === 0) {
    return res.status(404).json({ error: "Transação não encontrada." });
  }

  const updated = db.prepare("SELECT * FROM transactions WHERE id = ?").get(id);
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const result = db
    .prepare("DELETE FROM transactions WHERE id = ? AND user_id = ?")
    .run(id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Transação não encontrada." });
  }

  res.status(204).send();
});

export default router;
