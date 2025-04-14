import { Router } from "express";
import { ProductsController } from "@/controllers/ProductsController";

const productsController = new ProductsController();

export const productsRoutes = Router();

productsRoutes.get("/", productsController.index);
productsRoutes.post("/", productsController.create);
productsRoutes.put("/:id", productsController.update)
productsRoutes.delete("/:id", productsController.remove)
