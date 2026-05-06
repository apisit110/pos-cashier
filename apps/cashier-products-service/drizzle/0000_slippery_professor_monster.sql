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
	`status` text DEFAULT 'IDLE' NOT NULL,
	`updated_at` text NOT NULL
);
