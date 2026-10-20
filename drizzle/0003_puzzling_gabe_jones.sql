ALTER TABLE `tags` ADD `slug` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `tags` ADD CONSTRAINT `tags_slug_unique` UNIQUE(`slug`);