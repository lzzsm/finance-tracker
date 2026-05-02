import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../database.js";
import { JWT_SECRET } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "A senha deve ter pelo menos 6 caracteres." });
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);
  if (existing) {
    return res.status(409).json({ error: "Email já cadastrado." });
  }

  // 10 salt rounds — padrão recomendado entre segurança e performance
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = { id: uuidv4(), email, password: hashedPassword };
  db.prepare(
    "INSERT INTO users (id, email, password) VALUES (@id, @email, @password)",
  ).run(user);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  // Mensagem genérica intencional — não revela se o email existe ou não
  if (!user) {
    return res.status(401).json({ error: "Email ou senha incorretos." });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Email ou senha incorretos." });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

export default router;
