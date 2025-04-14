import { Router } from "express";
import { TablesSessionsController } from "@/controllers/TablesSessionsController";

const tablesSessionsController = new TablesSessionsController();

export const tablesSessionsRoutes = Router();

tablesSessionsRoutes.post("/", tablesSessionsController.create);
tablesSessionsRoutes.get("/", tablesSessionsController.index);
tablesSessionsRoutes.patch("/:id", tablesSessionsController.update);
