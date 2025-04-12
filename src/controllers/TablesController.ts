import { Request, Response, NextFunction } from "express";
import { knex } from "../database/knex";

class TablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const table = await knex<tablesRepository>("tables")
        .select()
        .orderBy("table_number");

      return response.json(table);
    } catch (error) {
      next(error);
    }
  }
}

export { TablesController };
