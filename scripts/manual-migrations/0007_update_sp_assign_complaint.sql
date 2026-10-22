-- =====================================================================
-- Migration: 0007_update_sp_assign_complaint
-- Description: Update SP to accept staff email and admin email.
-- =====================================================================

DROP PROCEDURE IF EXISTS `sp_assign_complaint`;

DELIMITER //

CREATE PROCEDURE `sp_assign_complaint`(
    IN p_complaint_id INT,
    IN p_staff_email VARCHAR(150),
    IN p_admin_email VARCHAR(150)
)
BEGIN
    DECLARE v_current_status VARCHAR(20);
    DECLARE v_staff_id INT;
    DECLARE v_admin_id INT;
    
    -- 1. Resolve staff ID from email
    SELECT id INTO v_staff_id FROM staff WHERE email = p_staff_email;
    IF v_staff_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Staff email not found';
    END IF;

    -- 2. Resolve admin ID from email
    SELECT id INTO v_admin_id FROM staff WHERE email = p_admin_email;
    IF v_admin_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Admin email not found';
    END IF;
    
    START TRANSACTION;
    
    -- 3. Get current status and lock row
    SELECT status INTO v_current_status 
    FROM complaints 
    WHERE id = p_complaint_id 
    FOR UPDATE;
    
    -- 4. Update complaint
    UPDATE complaints 
    SET status = 'assigned', assigned_staff_id = v_staff_id, updated_at = NOW()
    WHERE id = p_complaint_id;
    
    -- 5. Insert history
    INSERT INTO complaint_status_history (
        complaint_id, old_status, new_status, changed_by_staff_id, note, changed_at
    ) VALUES (
        p_complaint_id, v_current_status, 'assigned', v_admin_id, 
        CONCAT('Assigned to staff ', p_staff_email, ' via stored procedure'), NOW()
    );
    
    COMMIT;
END //

DELIMITER ;