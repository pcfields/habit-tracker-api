import { Router } from "express";

const router = Router();

router.post("/", (_req, res) => {
  res.json({ message: "auth" });
});

export default router;
