CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`description` text,
	`default_department_id` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `complaint_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`complaint_id` int NOT NULL,
	`commenter_type` enum('student','staff') NOT NULL,
	`student_id` int,
	`staff_id` int,
	`body` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `complaint_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`student_id` int NOT NULL,
	`category_id` int NOT NULL,
	`location` varchar(200) NOT NULL,
	`building` varchar(100),
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','assigned','in_progress','resolved','rejected','closed') NOT NULL DEFAULT 'open',
	`department_id` int,
	`assigned_staff_id` int,
	`resolved_at` timestamp,
	`resolution_note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `complaints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaint_status_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`complaint_id` int NOT NULL,
	`old_status` enum('open','assigned','in_progress','resolved','rejected','closed'),
	`new_status` enum('open','assigned','in_progress','resolved','rejected','closed') NOT NULL,
	`changed_by_staff_id` int,
	`note` text,
	`changed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `complaint_status_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaint_tags` (
	`complaint_id` int NOT NULL,
	`tag_id` int NOT NULL,
	`tagged_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `complaint_tags_complaint_id_tag_id_pk` PRIMARY KEY(`complaint_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`email` varchar(50),
	`phone` varchar(20),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `departments_id` PRIMARY KEY(`id`),
	CONSTRAINT `departments_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(150) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`phone` varchar(20),
	`role` enum('staff','supervisor','admin') NOT NULL DEFAULT 'staff',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `staff_departments` (
	`staff_id` int NOT NULL,
	`department_id` int NOT NULL,
	`role_in_dept` enum('member','lead') NOT NULL DEFAULT 'member',
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `staff_departments_staff_id_department_id_pk` PRIMARY KEY(`staff_id`,`department_id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roll_number` varchar(30) NOT NULL,
	`name` varchar(50) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`department_id` int,
	`year` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_roll_number_unique` UNIQUE(`roll_number`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`color` varchar(7) NOT NULL DEFAULT '#6B7280',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE INDEX `comments_complaint_idx` ON `complaint_comments` (`complaint_id`);--> statement-breakpoint
CREATE INDEX `complaints_student_idx` ON `complaints` (`student_id`);--> statement-breakpoint
CREATE INDEX `complaints_category_idx` ON `complaints` (`category_id`);--> statement-breakpoint
CREATE INDEX `complaints_status_idx` ON `complaints` (`status`);--> statement-breakpoint
CREATE INDEX `complaints_department_idx` ON `complaints` (`department_id`);--> statement-breakpoint
CREATE INDEX `complaints_staff_idx` ON `complaints` (`assigned_staff_id`);--> statement-breakpoint
CREATE INDEX `complaints_status_priority_idx` ON `complaints` (`status`,`priority`);--> statement-breakpoint
CREATE INDEX `history_complaint_idx` ON `complaint_status_history` (`complaint_id`);--> statement-breakpoint
CREATE INDEX `history_changed_at_idx` ON `complaint_status_history` (`changed_at`);