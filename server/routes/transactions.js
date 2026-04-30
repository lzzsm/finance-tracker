import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../database.js";

const router = Router();

router.get("/", (req, res) => {
  const transactions = db
    .prepare("SELECT * FROM transactions ORDER BY date DESC")
    .all();

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
  };

  db.prepare(
    `
    INSERT INTO transactions (id, description, amount, type, category, date)
    VALUES (@id, @description, @amount, @type, @category, @date)
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
    WHERE id = @id
  `,
    )
    .run({ id, description, amount: parseFloat(amount), type, category });

  // result.changes === 0 significa que o id não existe no banco
  if (result.changes === 0) {
    return res.status(404).json({ error: "Transação não encontrada." });
  }

  // Busca a transação atualizada pra retornar com todos os campos,
  // incluindo a date que não foi alterada mas precisa estar na resposta
  const updated = db.prepare("SELECT * FROM transactions WHERE id = ?").get(id);

  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const result = db.prepare("DELETE FROM transactions WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Transação não encontrada." });
  }

  res.status(204).send();
});

export default router;
