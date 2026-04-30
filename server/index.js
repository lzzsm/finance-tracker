import express from "express";
import cors from "cors";
import transactionsRouter from "./routes/transactions.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/transactions", transactionsRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
