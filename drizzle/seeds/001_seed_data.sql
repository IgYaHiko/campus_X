-- =====================================================================
-- CampusFix — Seed Data
-- Populates: departments, categories, students, staff,
--            staff_departments, tags, complaints,
--            complaint_comments, complaint_status_history,
--            complaint_tags
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- 1. DEPARTMENTS
-- -----------------------------------------------------
INSERT INTO departments (name, description, email, phone) VALUES
  ('Electrical',   'Handles power, wiring, lighting, and electrical faults.', 'electrical@campusfix.edu', '1001'),
  ('Plumbing',     'Handles water supply, drainage, and leakage issues.',      'plumbing@campusfix.edu',   '1002'),
  ('IT & Network', 'Handles Wi-Fi, LAN, computers, and software issues.',      'it@campusfix.edu',         '1003'),
  ('Housekeeping', 'Handles cleanliness, waste, and sanitation.',              'housekeeping@campusfix.edu','1004'),
  ('Civil',        'Handles furniture, doors, windows, and structural issues.','civil@campusfix.edu',      '1005');

-- -----------------------------------------------------
-- 2. CATEGORIES
-- -----------------------------------------------------
INSERT INTO categories (name, description, default_department_id) VALUES
  ('Wi-Fi Issue',      'No connection, slow speed, or drops.',          3),
  ('Power Outage',     'No electricity, sparks, or flickering lights.', 1),
  ('Water Leak',       'Leaking taps, pipes, or water damage.',         2),
  ('Cleanliness',      'Unclean classrooms, corridors, or washrooms.',  4),
  ('Furniture Damage', 'Broken chairs, desks, doors, or windows.',      5),
  ('Other',            'Any issue that does not fit other categories.', NULL);

-- -----------------------------------------------------
-- 3. STUDENTS
-- -----------------------------------------------------
INSERT INTO students (roll_number, name, email, password_hash, phone, department_id, year) VALUES
  ('CS22B001', 'Aarav Mehta',    'aarav.mehta@student.edu',    'hash_aarav',  '9000000001', 3, 3),
  ('CS22B002', 'Diya Sharma',    'diya.sharma@student.edu',    'hash_diya',   '9000000002', 3, 3),
  ('EC21B014', 'Rohan Kapoor',   'rohan.kapoor@student.edu',   'hash_rohan',  '9000000003', 1, 4),
  ('ME22B007', 'Sanya Iyer',     'sanya.iyer@student.edu',     'hash_sanya',  '9000000004', 5, 2),
  ('CS23B021', 'Kabir Singh',    'kabir.singh@student.edu',    'hash_kabir',  '9000000005', 3, 2),
  ('CE22B009', 'Ananya Verma',   'ananya.verma@student.edu',   'hash_ananya', '9000000006', 5, 3),
  ('EE22B033', 'Vihaan Reddy',   'vihaan.reddy@student.edu',   'hash_vihaan', '9000000007', 1, 3),
  ('IT21B018', 'Ishita Nair',    'ishita.nair@student.edu',    'hash_ishita', '9000000008', 3, 4),
  ('ME23B045', 'Arjun Patel',    'arjun.patel@student.edu',    'hash_arjun',  '9000000009', 5, 1),
  ('CS21B003', 'Meera Krishnan', 'meera.krishnan@student.edu', 'hash_meera',  '9000000010', 3, 4);

-- -----------------------------------------------------
-- 4. STAFF
-- -----------------------------------------------------
INSERT INTO staff (name, email, password_hash, phone, role) VALUES
  ('Rakesh Kumar',  'rakesh.kumar@campusfix.edu',  'hash_rakesh',  '8000000001', 'staff'),
  ('Priya Menon',   'priya.menon@campusfix.edu',   'hash_priya',   '8000000002', 'staff'),
  ('Suresh Naik',   'suresh.naik@campusfix.edu',   'hash_suresh',  '8000000003', 'supervisor'),
  ('Neha Joshi',    'neha.joshi@campusfix.edu',    'hash_neha',    '8000000004', 'staff'),
  ('Vikram Bose',   'vikram.bose@campusfix.edu',   'hash_vikram',  '8000000005', 'staff'),
  ('Lakshmi Pillai','lakshmi.pillai@campusfix.edu','hash_lakshmi', '8000000006', 'admin');

-- -----------------------------------------------------
-- 5. STAFF_DEPARTMENTS (M:N junction)
-- -----------------------------------------------------
INSERT INTO staff_departments (staff_id, department_id, role_in_dept) VALUES
  (1, 1, 'member'),    -- Rakesh -> Electrical
  (1, 2, 'member'),    -- Rakesh also -> Plumbing
  (2, 3, 'lead'),      -- Priya leads IT
  (3, 1, 'lead'),      -- Suresh leads Electrical
  (3, 5, 'member'),    -- Suresh also in Civil
  (4, 4, 'lead'),      -- Neha leads Housekeeping
  (5, 2, 'member'),    -- Vikram -> Plumbing
  (5, 5, 'member'),    -- Vikram also -> Civil
  (6, 3, 'member');    -- Lakshmi -> IT

-- -----------------------------------------------------
-- 6. TAGS
-- -----------------------------------------------------
INSERT INTO tags (name, color) VALUES
  ('Urgent',     '#EF4444'),
  ('Recurring',  '#F59E0B'),
  ('Safety',     '#DC2626'),
  ('Wi-Fi',      '#3B82F6'),
  ('Electrical', '#8B5CF6'),
  ('Water',      '#06B6D4'),
  ('Cleanliness','#10B981'),
  ('Furniture',  '#A16207');

-- -----------------------------------------------------
-- 7. COMPLAINTS
-- -----------------------------------------------------
INSERT INTO complaints
  (title, description, student_id, category_id, location, building, priority, status, department_id, assigned_staff_id)
VALUES
  ('Wi-Fi not working in Lab 204',
   'The Wi-Fi in CS Lab 204 has been down since morning. Cannot connect to any network.',
   1, 1, 'CS Lab 204', 'Academic Block A', 'high', 'in_progress', 3, 2),

  ('Flickering lights in Hostel B corridor',
   'Lights in the second-floor corridor flicker constantly. Possible loose connection.',
   2, 2, 'Hostel B, 2nd Floor', 'Hostel B', 'medium', 'assigned', 1, 3),

  ('Water leakage from washroom ceiling',
   'Water is dripping from the ceiling near the washroom entrance. Floor becoming slippery.',
   3, 3, 'Washroom near Canteen', 'Main Building', 'urgent', 'open', 2, NULL),

  ('Dustbin not cleared for 3 days',
   'The dustbin near Room 101 has not been emptied. Strong smell developing.',
   4, 4, 'Room 101', 'Academic Block B', 'medium', 'resolved', 4, 4),

  ('Broken chair in Library',
   'Chair at reading table 5 has a broken leg. Unsafe to sit.',
   5, 5, 'Library Reading Hall', 'Library', 'low', 'open', 5, NULL),

  ('AC not cooling in Seminar Hall',
   'AC unit in Seminar Hall runs but does not cool. Room becomes very hot during presentations.',
   6, 1, 'Seminar Hall', 'Academic Block A', 'high', 'assigned', 3, 2),

  ('Spark from power socket in Lab 101',
   'Power socket in Lab 101 sparked when plugging in a laptop. Please inspect urgently.',
   7, 2, 'EE Lab 101', 'Academic Block C', 'urgent', 'in_progress', 1, 1),

  ('Tap leaking in Boys Hostel washroom',
   'One of the taps in the first-floor washroom keeps dripping continuously.',
   8, 3, 'Hostel A, 1st floor washroom', 'Hostel A', 'low', 'resolved', 2, 5),

  ('Projector not turning on',
   'The projector in Lecture Hall 3 does not turn on. Class presentations are affected.',
   9, 6, 'Lecture Hall 3', 'Academic Block B', 'medium', 'open', NULL, NULL),

  ('Broken window in Room 208',
   'Window pane in Room 208 is cracked and lets in rainwater.',
   10, 5, 'Room 208', 'Academic Block A', 'medium', 'assigned', 5, 5),

  ('Wi-Fi speed extremely slow in Library',
   'Wi-Fi works but speed is unusable. Cannot access online resources.',
   1, 1, 'Library', 'Library', 'medium', 'resolved', 3, 2),

  ('Ceiling fan making loud noise',
   'Fan in Room 305 makes loud rattling sound. Distracts during lectures.',
   2, 6, 'Room 305', 'Academic Block C', 'low', 'closed', NULL, NULL);

-- -----------------------------------------------------
-- 8. COMPLAINT_COMMENTS
-- -----------------------------------------------------
INSERT INTO complaint_comments (complaint_id, commenter_type, student_id, staff_id, body) VALUES
  (1, 'staff',   NULL, 2, 'Assigned to IT team. Investigating router configuration.'),
  (1, 'student', 1,    NULL, 'Thank you. It has been down for 4 hours now.'),
  (1, 'staff',   NULL, 2, 'Router replacement ordered. Should be resolved by EOD.'),

  (3, 'staff',   NULL, 3, 'Urgent — sending team to inspect the ceiling immediately.'),
  (3, 'student', 3,    NULL, 'Please hurry, it is getting worse.'),

  (7, 'staff',   NULL, 1, 'Socket isolated. Electrician on site now.'),
  (7, 'student', 7,    NULL, 'Thanks for the quick response.'),

  (9, 'staff',   NULL, 6, 'Which projector model is it? Sending someone shortly.'),
  (9, 'student', 9,    NULL, 'It is a BenQ MX560P.'),

  (12, 'staff',  NULL, 3, 'Fan replaced. Marking as closed.');

-- -----------------------------------------------------
-- 9. COMPLAINT_STATUS_HISTORY
-- -----------------------------------------------------
INSERT INTO complaint_status_history (complaint_id, old_status, new_status, changed_by_staff_id, note) VALUES
  (1, 'open',        'assigned',    6, 'Auto-assigned to IT department.'),
  (1, 'assigned',    'in_progress', 2, 'Working on router config.'),
  (2, 'open',        'assigned',    6, 'Assigned to Electrical.'),
  (3, 'open',        'open',        NULL, 'Complaint created.'),
  (4, 'open',        'assigned',    6, 'Assigned to Housekeeping.'),
  (4, 'assigned',    'in_progress', 4, 'Cleanup started.'),
  (4, 'in_progress', 'resolved',    4, 'Dustbin cleared.'),
  (7, 'open',        'assigned',    6, 'Urgent — assigned to Electrical head.'),
  (7, 'assigned',    'in_progress', 1, 'Electrician inspecting socket.'),
  (8, 'open',        'assigned',    6, 'Assigned to Plumbing.'),
  (8, 'assigned',    'in_progress', 5, 'Tap washer replacement.'),
  (8, 'in_progress', 'resolved',    5, 'Tap repaired.'),
  (11,'open',        'assigned',    6, 'Assigned to IT.'),
  (11,'assigned',    'in_progress', 2, 'Optimizing access point.'),
  (11,'in_progress', 'resolved',    2, 'Speed restored.'),
  (12,'open',        'assigned',    6, 'Assigned to Civil.'),
  (12,'assigned',    'in_progress', 3, 'Fan replacement in progress.'),
  (12,'in_progress', 'resolved',    3, 'Fan replaced.'),
  (12,'resolved',    'closed',      6, 'Verified by admin.');

-- -----------------------------------------------------
-- 10. COMPLAINT_TAGS (M:N junction)
-- -----------------------------------------------------
INSERT INTO complaint_tags (complaint_id, tag_id) VALUES
  (1, 4),    -- Wi-Fi complaint → Wi-Fi
  (1, 2),    -- → Recurring
  (2, 5),    -- Electrical
  (3, 6),    -- Water
  (3, 1),    -- Urgent
  (3, 3),    -- Safety
  (4, 7),    -- Cleanliness
  (5, 8),    -- Furniture
  (6, 2),    -- Recurring
  (7, 5),    -- Electrical
  (7, 1),    -- Urgent
  (7, 3),    -- Safety
  (8, 6),    -- Water
  (9, 2),    -- Recurring
  (10, 8),   -- Furniture
  (11, 4),   -- Wi-Fi
  (12, 2);   -- Recurring

-- =====================================================================
-- Done
-- =====================================================================