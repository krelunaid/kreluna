CREATE TABLE `risonix_activations` (
	`id` text PRIMARY KEY NOT NULL,
	`license_id` text NOT NULL,
	`device_id` text NOT NULL,
	`device_public_key` text NOT NULL,
	`device_label` text NOT NULL,
	`platform` text NOT NULL,
	`app_version` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`activated_at` integer NOT NULL,
	`last_seen` integer NOT NULL,
	`last_nonce` text,
	FOREIGN KEY (`license_id`) REFERENCES `risonix_licenses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_risonix_one_device` ON `risonix_activations` (`license_id`);--> statement-breakpoint
CREATE TABLE `risonix_license_events` (
	`id` text PRIMARY KEY NOT NULL,
	`license_id` text NOT NULL,
	`event_type` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`license_id`) REFERENCES `risonix_licenses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_risonix_events_license` ON `risonix_license_events` (`license_id`);--> statement-breakpoint
CREATE TABLE `risonix_licenses` (
	`id` text PRIMARY KEY NOT NULL,
	`key_hash` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`order_reference` text,
	`customer_email_hash` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_risonix_license_key` ON `risonix_licenses` (`key_hash`);--> statement-breakpoint
CREATE INDEX `idx_risonix_customer_email` ON `risonix_licenses` (`customer_email_hash`);