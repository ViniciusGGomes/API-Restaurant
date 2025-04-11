import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (value) => {
    value.increments("id").primary();
    value
      .integer("table_session_id")
      .notNullable()
      .references("id")
      .inTable("tables_sessions");
    value
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products");
    value.integer("quantity").notNullable();
    value.decimal("price").notNullable();
    value.timestamp("created_at").defaultTo(knex.fn.now());
    value.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orders");
}
