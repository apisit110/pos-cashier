CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`points` integer DEFAULT 0 NOT NULL
);
