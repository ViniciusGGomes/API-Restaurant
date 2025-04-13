import { Request, Response, NextFunction } from "express";
import { number, z } from "zod";
import { knex } from "../database/knex";
import { AppError } from "@/utils/AppError";

export class OrderController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: number(),
        product_id: number(),
        quantity: number(),
      });

      const { table_session_id, product_id, quantity } = bodySchema.parse(
        request.body
      );

      const session = await knex<tablesSessionsRepository>("tables_sessions")
        .where({ id: table_session_id })
        .first();

      if (!session) {
        throw new AppError("session table not found");
      }

      if (session.closed_at) {
        throw new AppError("This table is closed");
      }

      const product = await knex<productsRepository>("products")
        .where({ id: product_id })
        .first();

      if (!product) {
        throw new AppError("Product not found");
      }

      await knex<ordersRepository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price,
      });

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const table_session_id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number" })
        .parse(request.params.table_session_id);

      const order = await knex<ordersRepository>("orders")
        .select(
          "orders.id",
          "orders.table_session_id",
          "orders.product_id",
          "products.name",
          "orders.price",
          "orders.quantity",
          knex.raw("(orders.price * orders.quantity) AS total"),
          "orders.created_at",
          "orders.updated_at"
        )
        .join("products", "products.id", "orders.product_id")
        .where({ table_session_id })
        .orderBy("orders.created_at", "desc");

      return response.json(order);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const table_session_id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), {
          message: "table_session_id must be a number",
        })
        .parse(request.params.table_session_id);

      const order = await knex<ordersRepository>("orders")
        .select(
          knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS total"),
          knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity")
        )
        .where({
          table_session_id,
        })
        .first();

      return response.json(order);
    } catch (error) {
      next(error);
    }
  }
}
