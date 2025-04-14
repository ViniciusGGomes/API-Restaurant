import { Router } from "express";
import { OrderController } from "@/controllers/OrdersController";

const orderController = new OrderController();

export const ordersRoutes = Router();

ordersRoutes.post("/", orderController.create);
ordersRoutes.get("/table_session/:table_session_id", orderController.index);
ordersRoutes.get(
  "/table_session/:table_session_id/total",
  orderController.show
);
