CREATE TABLE `citybeam_booking_events` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`kind` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `citybeam_bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_citybeam_booking_event` ON `citybeam_booking_events` (`booking_id`);--> statement-breakpoint
CREATE TABLE `citybeam_bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`token_expires` integer NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`description` text NOT NULL,
	`campaign_date` text NOT NULL,
	`supplier_reference` text NOT NULL,
	`terms` text NOT NULL,
	`expires_at` integer NOT NULL,
	`status` text DEFAULT 'quoted' NOT NULL,
	`accepted_at` integer,
	`checkout_started` integer,
	`stripe_session` text,
	`stripe_url` text,
	`payment_intent` text,
	`paid_at` integer,
	`campaign_reference` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `citybeam_requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_citybeam_booking_request` ON `citybeam_bookings` (`request_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_citybeam_booking_token` ON `citybeam_bookings` (`token_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_citybeam_booking_session` ON `citybeam_bookings` (`stripe_session`);--> statement-breakpoint
CREATE TABLE `citybeam_materials` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`object_key` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`upload_status` text DEFAULT 'uploading' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `citybeam_bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_citybeam_material_booking` ON `citybeam_materials` (`booking_id`);