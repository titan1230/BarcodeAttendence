import { Router } from "express";
const router = Router();


import dataRoute from "./data";
import accountRouter from "./account"

router.use("/attendance", dataRoute);
router.use("/account", accountRouter);

export default router;