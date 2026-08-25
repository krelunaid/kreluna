import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const velvetWaitlist = sqliteTable(
  "velvet_waitlist",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    audience: text("audience", { enum: ["customer", "restaurant"] }).notNull(),
    restaurantName: text("restaurant_name"),
    city: text("city"),
    source: text("source").notNull().default("velvet-page"),
    consentVersion: text("consent_version").notNull().default("2026-08-25"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("idx_velvet_waitlist_email_audience").on(table.email, table.audience)],
);
