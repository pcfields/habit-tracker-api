import { Router } from "express";

const router = Router();

router.post("/", (_req, res) => {
  res.json({ message: "user" });
});

export default router;
