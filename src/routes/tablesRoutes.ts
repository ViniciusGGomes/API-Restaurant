import { Router } from "express";
import { TablesController } from "@/controllers/TablesController";

const tablesController = new TablesController();

export const tablesRoutes = Router();

tablesRoutes.get("/", tablesController.index);
