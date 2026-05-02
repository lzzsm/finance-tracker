import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../database.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// authMiddleware aplicado no router inteiro —
// todas as rotas abaixo exigem token válido
router.use(authMiddleware);

router.get("/", (req, res) => {
  // req.user.id vem do token decodificado pelo authMiddleware
  const transactions = db
    .prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC")
    .all(req.user.id);

  res.json(transactions);
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

  // Filtra por user_id também no WHERE — impede editar transações de outros usuários
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
