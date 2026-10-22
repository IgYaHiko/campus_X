-- =====================================================================
-- Migration: 0004_create_status_audit_trigger
-- Description: Automatically logs status changes to history table.
-- =====================================================================

DELIMITER //

CREATE TRIGGER `trg_complaint_status_change`
AFTER UPDATE ON `complaints`
FOR EACH ROW
BEGIN
    -- Only insert a history record if the status actually changed
    IF OLD.status <> NEW.status THEN
        INSERT INTO `complaint_status_history` 
            (complaint_id, old_status, new_status, changed_by_staff_id, note, changed_at)
        VALUES 
            (NEW.id, OLD.status, NEW.status, NULL, 'Automated trigger log', NOW());
    END IF;
END //

DELIMITER ;