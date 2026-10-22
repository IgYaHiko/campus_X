
ALTER TABLE `students`
  DROP FOREIGN KEY `fk_students_department`;
--> statement-breakpoint

ALTER TABLE `students`
  ADD `branch` varchar(100);
--> statement-breakpoint

ALTER TABLE `students`
  DROP COLUMN `department_id`;
--> statement-breakpoint

UPDATE `students` SET `branch` = 'CSE' WHERE `roll_number` LIKE 'CS%';
--> statement-breakpoint
UPDATE `students` SET `branch` = 'ECE' WHERE `roll_number` LIKE 'EC%';
--> statement-breakpoint
UPDATE `students` SET `branch` = 'Mechanical' WHERE `roll_number` LIKE 'ME%';
--> statement-breakpoint
UPDATE `students` SET `branch` = 'Civil' WHERE `roll_number` LIKE 'CE%';
--> statement-breakpoint
UPDATE `students` SET `branch` = 'IT' WHERE `roll_number` LIKE 'IT%';
--> statement-breakpoint
UPDATE `students` SET `branch` = 'Electrical' WHERE `roll_number` LIKE 'EE%';
