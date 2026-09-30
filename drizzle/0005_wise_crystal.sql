CREATE TABLE `citybeam_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`payload_hash` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`locale` text NOT NULL,
	`format` text NOT NULL,
	`preferred_date` text,
	`idea` text NOT NULL,
	`preview_message` text,
	`preview_theme` text,
	`privacy_version` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`notification_status` text DEFAULT 'pending' NOT NULL,
	`notification_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_citybeam_requests_email_created` ON `citybeam_requests` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_citybeam_requests_created` ON `citybeam_requests` (`created_at`);