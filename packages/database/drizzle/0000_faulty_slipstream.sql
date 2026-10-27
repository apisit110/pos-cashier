CREATE TABLE `roles` (
	`id` integer PRIMARY KEY NOT NULL,
	`role_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `staffs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`role_id` integer NOT NULL,
	`full_name` text NOT NULL,
	`status` text NOT NULL,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`sync_id` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staffs_username_unique` ON `staffs` (`username`);--> statement-breakpoint
CREATE TABLE `staff_pins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`pin_hash` text NOT NULL,
	`failed_attempts` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `staffs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staff_pins_user_id_unique` ON `staff_pins` (`user_id`);--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` integer NOT NULL,
	`permission_key` text NOT NULL,
	`is_granted` integer NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`points` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`merchant_id` text NOT NULL,
	`store_id` text NOT NULL,
	`terminal_id` text,
	`total_amount` real NOT NULL,
	`staff_id` text NOT NULL,
	`member_id` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`is_synced` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`idempotency_key` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_idempotency_key_unique` ON `orders` (`idempotency_key`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`amount` real NOT NULL,
	`method` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer NOT NULL,
	`received_amount` real,
	`change_amount` real
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`image_url` text,
	`unit_name` text,
	`brand` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_barcode_unique` ON `products` (`barcode`);--> statement-breakpoint
CREATE TABLE `sync_metadata` (
	`id` text PRIMARY KEY NOT NULL,
	`last_product_sync_version` integer DEFAULT 0 NOT NULL,
	`profile_version` text,
	`status` text DEFAULT 'IDLE' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sync_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`retry_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`processed_at` text
);
--> statement-breakpoint
CREATE TABLE `terminals` (
	`tid` text PRIMARY KEY NOT NULL,
	`mid` text NOT NULL,
	`sid` text NOT NULL,
	`is_available` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`merchant_id` text NOT NULL,
	`store_id` text NOT NULL,
	`terminal_id` text,
	`amount` real NOT NULL,
	`payment_method` text NOT NULL,
	`status` text NOT NULL,
	`staff_name` text NOT NULL,
	`is_synced` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_order_id_unique` ON `transactions` (`order_id`);