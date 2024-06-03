import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.createSchema("escroguard").execute();

  await db.schema
    .createTable("escroguard.users")
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
    .createTable("escroguard.spaces")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("owner_id", "integer", (col) =>
      col.references("escroguard.users.id").onDelete("cascade").notNull()
    )
    .addColumn("created_at", "timestamptz(0)", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("escroguard.user_spaces")
    .addColumn("user_id", "integer", (col) =>
      col.references("escroguard.users.id").onDelete("cascade").notNull()
    )
    .addColumn("space_id", "integer", (col) =>
      col.references("escroguard.spaces.id").onDelete("cascade").notNull()
    )
    .addPrimaryKeyConstraint("primary_kay", ["user_id", "space_id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("escroguard.user_spaces").execute();
  await db.schema.dropTable("escroguard.spaces").execute();
  await db.schema.dropTable("escroguard.users").execute();
}
