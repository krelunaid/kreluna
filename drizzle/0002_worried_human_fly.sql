CREATE TABLE `risonix_order_events` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`provider_event_id` text,
	`event_type` text NOT NULL,
	`payload_hash` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `risonix_orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_risonix_order_events_order` ON `risonix_order_events` (`order_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_risonix_order_events_provider` ON `risonix_order_events` (`provider_event_id`);--> statement-breakpoint
CREATE TABLE `risonix_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_user_hash` text NOT NULL,
	`customer_email_hash` text NOT NULL,
	`customer_email_encrypted` text NOT NULL,
	`status` text DEFAULT 'created' NOT NULL,
	`stripe_checkout_session_id` text,
	`stripe_payment_intent_id` text,
	`currency` text,
	`amount_total` integer,
	`license_id` text,
	`license_key_encrypted` text,
	`email_status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`paid_at` integer,
	`fulfilled_at` integer,
	`refunded_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_risonix_orders_customer_user` ON `risonix_orders` (`customer_user_hash`);--> statement-breakpoint
CREATE INDEX `idx_risonix_orders_customer_email` ON `risonix_orders` (`customer_email_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_risonix_orders_stripe_session` ON `risonix_orders` (`stripe_checkout_session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_risonix_orders_payment_intent` ON `risonix_orders` (`stripe_payment_intent_id`);--> statement-breakpoint
ALTER TABLE `risonix_licenses` ADD `purchase_order_id` text REFERENCES risonix_orders(id);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_risonix_license_purchase_order` ON `risonix_licenses` (`purchase_order_id`);