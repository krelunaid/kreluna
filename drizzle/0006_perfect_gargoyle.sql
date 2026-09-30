ALTER TABLE `citybeam_requests` ADD `notification_attempts` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `citybeam_requests` ADD `notification_attempted_at` integer;