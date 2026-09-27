import express from "express";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import habitsRoutes from "./routes/habitRoutes.ts";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { isTest } from "../env.ts";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("dev", {
    skip: () => isTest(),
  }),
);

app.get("/health", (_req, res) => {
  res.json({ message: "hello" }).status(200);
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/habits", habitsRoutes);

export { app };
