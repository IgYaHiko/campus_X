ALTER TABLE `students` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `students` MODIFY COLUMN `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `students` ADD `email` varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_email_unique` UNIQUE(`email`);