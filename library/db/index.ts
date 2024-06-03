import { createKysely } from "@vercel/postgres-kysely";
import { DB } from "kysely-codegen";

export const db = createKysely<DB>();
export { sql } from "kysely";
