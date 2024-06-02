import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text")
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("avatar_url", "text")
    .addColumn("created_at", "timestamptz(0)", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("spaces")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("owner_id", "integer", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("created_at", "timestamptz(0)", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("user_spaces")
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("space_id", "integer", (col) =>
      col.references("spaces.id").onDelete("cascade").notNull()
    )
    .addPrimaryKeyConstraint("primary_kay", ["user_id", "space_id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
  await db.schema.dropTable("spaces").execute();
  await db.schema.dropTable("user_spaces").execute();
}
