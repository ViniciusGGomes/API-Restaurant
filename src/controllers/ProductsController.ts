import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { number, string, z } from "zod";
import { knex } from "../database/knex";
import { ReplOptions } from "repl";

export class ProductsController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { name } = request.query;

      const products = await knex<productsRepository>("products")
        .select()
        .whereLike("name", `%${name ?? ""}%`);

      return response.json(products);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: string().trim().min(6),
        price: number().gt(0),
      });

      const { name, price } = bodySchema.parse(request.body);

      await knex<productsRepository>("products").insert({ name, price });

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number" })
        .parse(request.params.id);

      const bodySchema = z.object({
        name: string().trim().min(6),
        price: number().gt(0),
      });

      const product = await knex<productsRepository>("products")
        .select()
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("Product not found");
      }

      const { name, price } = bodySchema.parse(request.body);

      await knex<productsRepository>("products")
        .update({
          name,
          price,
          updated_at: knex.fn.now(),
        })
        .where({ id });

      return response.json();
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Id must be a number" })
        .parse(request.params.id);

      const product = await knex<productsRepository>("products")
        .select()
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("Product not found");
      }

      await knex<productsRepository>("products").delete().where({ id });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}
