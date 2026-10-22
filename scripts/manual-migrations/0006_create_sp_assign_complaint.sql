-- =====================================================================
-- Migration: 0006_create_sp_assign_complaint
-- Description: Stored procedure to atomically assign a complaint.
-- =====================================================================

DELIMITER //

CREATE PROCEDURE `sp_assign_complaint`(
    IN p_complaint_id INT,
    IN p_staff_id INT,
    IN p_admin_id INT
)
BEGIN
    DECLARE v_current_status VARCHAR(20);
    
    -- 1. Start Transaction
    START TRANSACTION;
    
    -- 2. Get current status (lock the row for update to prevent race conditions)
    SELECT status INTO v_current_status 
    FROM complaints 
    WHERE id = p_complaint_id 
    FOR UPDATE;
    
    -- 3. Update the complaint
    UPDATE complaints 
    SET 
        status = 'assigned',
        assigned_staff_id = p_staff_id,
        updated_at = NOW()
    WHERE id = p_complaint_id;
    
    -- 4. Insert history
    INSERT INTO complaint_status_history (
        complaint_id, old_status, new_status, changed_by_staff_id, note, changed_at
    ) VALUES (
        p_complaint_id, v_current_status, 'assigned', p_admin_id, 
        CONCAT('Assigned to staff ID ', p_staff_id, ' via stored procedure'), NOW()
    );
    
    -- 5. Commit
    COMMIT;
END //

DELIMITER ;