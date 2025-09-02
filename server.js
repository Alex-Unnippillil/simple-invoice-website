import express from "express";
import dotenv from "dotenv";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(rateLimitMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Simple Invoice" });
});

app.get("/burst", (req, res) => {
  res.json({ message: "Burst analytics available in Upstash dashboard" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
