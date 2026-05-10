CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`amount` real NOT NULL,
	`payment_method` text NOT NULL,
	`status` text NOT NULL,
	`staff_name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_order_id_unique` ON `transactions` (`order_id`);