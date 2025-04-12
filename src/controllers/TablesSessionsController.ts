import { Request, Response, NextFunction } from "express";
import { number, z } from "zod";
import { knex } from "../database/knex";
import { AppError } from "@/utils/AppError";

class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: number(),
      });

      const { table_id } = bodySchema.parse(request.body);

      const session = await knex<tablesSessionsRepository>("tables_sessions")
        .select()
        .where({ table_id })
        .orderBy("opened_at", "desc")
        .first();

      if (session && !session.closed_at) {
        throw new AppError("This table is already open");
      }

      await knex<tablesSessionsRepository>("tables_sessions").insert({
        table_id,
        opened_at: knex.fn.now(),
      });

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    const sessions = await knex<tablesSessionsRepository>(
      "tables_sessions"
    ).orderBy("closed_at");

    return response.json(sessions);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Id must be a number" })
        .parse(request.params.id);

      const session = await knex<tablesSessionsRepository>("tables_sessions")
        .select()
        .where({ id })
        .first();

      if (!session) {
        throw new AppError("Session table not found");
      }

      if (session.closed_at) {
        throw new AppError("This session table is already closed");
      }

      await knex<tablesSessionsRepository>("tables_sessions")
        .update({ closed_at: knex.fn.now() })
        .where({ id });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsController };
