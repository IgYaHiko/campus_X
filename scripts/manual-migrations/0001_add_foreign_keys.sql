-- =====================================================================
-- Migration: 0001_add_foreign_keys
-- Description: Add all FOREIGN KEY constraints to enforce referential
--              integrity across the CampusFix schema.
-- =====================================================================

-- 1. students.department_id → departments.id
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_department`
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 2. categories.default_department_id → departments.id
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_categories_default_department`
  FOREIGN KEY (`default_department_id`) REFERENCES `departments`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 3. complaints.student_id → students.id
ALTER TABLE `complaints`
  ADD CONSTRAINT `fk_complaints_student`
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 4. complaints.category_id → categories.id
ALTER TABLE `complaints`
  ADD CONSTRAINT `fk_complaints_category`
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 5. complaints.department_id → departments.id
ALTER TABLE `complaints`
  ADD CONSTRAINT `fk_complaints_department`
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 6. complaints.assigned_staff_id → staff.id
ALTER TABLE `complaints`
  ADD CONSTRAINT `fk_complaints_assigned_staff`
  FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 7. complaint_comments.complaint_id → complaints.id
ALTER TABLE `complaint_comments`
  ADD CONSTRAINT `fk_comments_complaint`
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 8. complaint_comments.student_id → students.id
ALTER TABLE `complaint_comments`
  ADD CONSTRAINT `fk_comments_student`
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 9. complaint_comments.staff_id → staff.id
ALTER TABLE `complaint_comments`
  ADD CONSTRAINT `fk_comments_staff`
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 10. complaint_status_history.complaint_id → complaints.id
ALTER TABLE `complaint_status_history`
  ADD CONSTRAINT `fk_history_complaint`
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 11. complaint_status_history.changed_by_staff_id → staff.id
ALTER TABLE `complaint_status_history`
  ADD CONSTRAINT `fk_history_changed_by_staff`
  FOREIGN KEY (`changed_by_staff_id`) REFERENCES `staff`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 12. staff_departments.staff_id → staff.id
ALTER TABLE `staff_departments`
  ADD CONSTRAINT `fk_staff_dept_staff`
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 13. staff_departments.department_id → departments.id
ALTER TABLE `staff_departments`
  ADD CONSTRAINT `fk_staff_dept_department`
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 14. complaint_tags.complaint_id → complaints.id
ALTER TABLE `complaint_tags`
  ADD CONSTRAINT `fk_complaint_tags_complaint`
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 15. complaint_tags.tag_id → tags.id
ALTER TABLE `complaint_tags`
  ADD CONSTRAINT `fk_complaint_tags_tag`
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;