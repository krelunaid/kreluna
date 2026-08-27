CREATE TABLE `velvet_waitlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`audience` text NOT NULL,
	`restaurant_name` text,
	`city` text,
	`source` text DEFAULT 'velvet-page' NOT NULL,
	`consent_version` text DEFAULT '2026-08-25' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_velvet_waitlist_email_audience` ON `velvet_waitlist` (`email`,`audience`);