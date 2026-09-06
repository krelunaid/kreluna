CREATE TABLE `app_launch_waitlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project` text NOT NULL,
	`email` text NOT NULL,
	`locale` text NOT NULL,
	`consent_version` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_app_launch_project_email` ON `app_launch_waitlist` (`project`,`email`);