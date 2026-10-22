
ALTER TABLE `staff`
  ADD COLUMN `google_id` varchar(255) NULL,
  ADD CONSTRAINT `staff_google_id_unique` UNIQUE (`google_id`),
  MODIFY COLUMN `password_hash` varchar(255) NULL;

--> statement-breakpoint

ALTER TABLE `students`
  ADD COLUMN `google_id` varchar(255) NULL,
  ADD CONSTRAINT `students_google_id_unique` UNIQUE (`google_id`),
  MODIFY COLUMN `password_hash` varchar(255) NULL;
