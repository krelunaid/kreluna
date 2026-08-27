import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

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

export const risonixLicenses = sqliteTable(
  "risonix_licenses",
  {
    id: text("id").primaryKey(),
    keyHash: text("key_hash").notNull(),
    status: text("status", { enum: ["active", "disabled"] }).notNull().default("active"),
    orderReference: text("order_reference"),
    customerEmailHash: text("customer_email_hash"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("idx_risonix_license_key").on(table.keyHash),
    index("idx_risonix_customer_email").on(table.customerEmailHash),
  ],
);

export const risonixActivations = sqliteTable(
  "risonix_activations",
  {
    id: text("id").primaryKey(),
    licenseId: text("license_id").notNull().references(() => risonixLicenses.id),
    deviceId: text("device_id").notNull(),
    devicePublicKey: text("device_public_key").notNull(),
    deviceLabel: text("device_label").notNull(),
    platform: text("platform").notNull(),
    appVersion: text("app_version").notNull(),
    status: text("status", { enum: ["active", "disabled"] }).notNull().default("active"),
    activatedAt: integer("activated_at").notNull(),
    lastSeen: integer("last_seen").notNull(),
    lastNonce: text("last_nonce"),
  },
  (table) => [uniqueIndex("idx_risonix_one_device").on(table.licenseId)],
);

export const risonixLicenseEvents = sqliteTable(
  "risonix_license_events",
  {
    id: text("id").primaryKey(),
    licenseId: text("license_id").notNull().references(() => risonixLicenses.id),
    eventType: text("event_type").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("idx_risonix_events_license").on(table.licenseId)],
);
