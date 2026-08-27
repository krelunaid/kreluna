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

export const risonixOrders = sqliteTable(
  "risonix_orders",
  {
    id: text("id").primaryKey(),
    customerUserHash: text("customer_user_hash").notNull(),
    customerEmailHash: text("customer_email_hash").notNull(),
    customerEmailEncrypted: text("customer_email_encrypted").notNull(),
    status: text("status", {
      enum: ["created", "checkout_pending", "paid", "fulfilled", "refunded", "cancelled", "failed"],
    }).notNull().default("created"),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    currency: text("currency"),
    amountTotal: integer("amount_total"),
    licenseId: text("license_id"),
    licenseKeyEncrypted: text("license_key_encrypted"),
    emailStatus: text("email_status", { enum: ["pending", "sent", "failed"] }).notNull().default("pending"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
    paidAt: integer("paid_at"),
    fulfilledAt: integer("fulfilled_at"),
    refundedAt: integer("refunded_at"),
  },
  (table) => [
    index("idx_risonix_orders_customer_user").on(table.customerUserHash),
    index("idx_risonix_orders_customer_email").on(table.customerEmailHash),
    uniqueIndex("idx_risonix_orders_stripe_session").on(table.stripeCheckoutSessionId),
    uniqueIndex("idx_risonix_orders_payment_intent").on(table.stripePaymentIntentId),
  ],
);

export const risonixOrderEvents = sqliteTable(
  "risonix_order_events",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull().references(() => risonixOrders.id),
    providerEventId: text("provider_event_id"),
    eventType: text("event_type").notNull(),
    payloadHash: text("payload_hash"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("idx_risonix_order_events_order").on(table.orderId),
    uniqueIndex("idx_risonix_order_events_provider").on(table.providerEventId),
  ],
);

export const risonixLicenses = sqliteTable(
  "risonix_licenses",
  {
    id: text("id").primaryKey(),
    keyHash: text("key_hash").notNull(),
    status: text("status", { enum: ["active", "disabled"] }).notNull().default("active"),
    orderReference: text("order_reference"),
    purchaseOrderId: text("purchase_order_id").references(() => risonixOrders.id),
    customerEmailHash: text("customer_email_hash"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("idx_risonix_license_key").on(table.keyHash),
    uniqueIndex("idx_risonix_license_purchase_order").on(table.purchaseOrderId),
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
