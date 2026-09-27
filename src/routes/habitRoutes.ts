import { Router } from "express";
import { validateBody } from "../middleware/validation.ts";
import z from "zod";

const router = Router();

const createHabitSchema = z.object({
  name: z.string(),
});

router.get("/", (_req, res) => {
  res.json({ message: "habits" });
});

router.get("/:id", (_req, res) => {
  res.json({ message: "got one habit" });
});

router.post("/", validateBody(createHabitSchema), (_req, res) => {
  res.json({ message: "created habit" }).status(201);
});

router.delete("/:id", (_req, res) => {
  res.json({ message: "deleted habit" });
});

export default router;
