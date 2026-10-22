
-- Drop the department foreign key
ALTER TABLE `students`
  DROP FOREIGN KEY `fk_students_department`;

-- Remove department_id
ALTER TABLE `students`
  DROP COLUMN `department_id`;

-- Add branch
ALTER TABLE `students`
  ADD COLUMN `branch` VARCHAR(100) NULL AFTER `password_hash`;

-- Update existing student branches
UPDATE `students` SET `branch` = 'CSE'
WHERE `roll_number` LIKE 'CS%';

UPDATE `students` SET `branch` = 'ECE'
WHERE `roll_number` LIKE 'EC%';

UPDATE `students` SET `branch` = 'Mechanical'
WHERE `roll_number` LIKE 'ME%';

UPDATE `students` SET `branch` = 'Civil'
WHERE `roll_number` LIKE 'CE%';

UPDATE `students` SET `branch` = 'IT'
WHERE `roll_number` LIKE 'IT%';

UPDATE `students` SET `branch` = 'Electrical'
WHERE `roll_number` LIKE 'EE%';
