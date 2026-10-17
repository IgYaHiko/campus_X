-- MySQL dump 10.13  Distrib 8.0.46, for Linux (aarch64)
--
-- Host: localhost    Database: campusfix
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__drizzle_migrations`
--

DROP TABLE IF EXISTS `__drizzle_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__drizzle_migrations`
--

LOCK TABLES `__drizzle_migrations` WRITE;
/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */;
INSERT INTO `__drizzle_migrations` VALUES (1,'dfc916d6c0ec50783d1cd1d7d5880b399dd53a6b5dc1706b8f69b4685a9e85ec',1791910058784),(2,'0001_add_foreign_keys_manual',1792061849000),(3,'3c4eea8d3333be650c9a46ab1c530fc6718d8cfdcbbbd0d6688a93a082273aba',1792062091362);
/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `description` text,
  `default_department_id` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `slug` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`),
  KEY `fk_categories_default_department` (`default_department_id`),
  CONSTRAINT `fk_categories_default_department` FOREIGN KEY (`default_department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Wi-Fi Issue','No connection, slow speed, or drops.',3,1,'2026-10-15 11:55:00','wifi-issue'),(2,'Power Outage','No electricity, sparks, or flickering lights.',1,1,'2026-10-15 11:55:00','power-outage'),(3,'Water Leak','Leaking taps, pipes, or water damage.',2,1,'2026-10-15 11:55:00','water-leak'),(4,'Cleanliness','Unclean classrooms, corridors, or washrooms.',4,1,'2026-10-15 11:55:00','cleanliness'),(5,'Furniture Damage','Broken chairs, desks, doors, or windows.',5,1,'2026-10-15 11:55:00','furniture-damage'),(6,'Other','Any issue that does not fit other categories.',NULL,1,'2026-10-15 11:55:00','other');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint_comments`
--

DROP TABLE IF EXISTS `complaint_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaint_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `complaint_id` int NOT NULL,
  `commenter_type` enum('student','staff') NOT NULL,
  `student_id` int DEFAULT NULL,
  `staff_id` int DEFAULT NULL,
  `body` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `comments_complaint_idx` (`complaint_id`),
  KEY `fk_comments_student` (`student_id`),
  KEY `fk_comments_staff` (`staff_id`),
  CONSTRAINT `fk_comments_complaint` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint_comments`
--

LOCK TABLES `complaint_comments` WRITE;
/*!40000 ALTER TABLE `complaint_comments` DISABLE KEYS */;
INSERT INTO `complaint_comments` VALUES (1,1,'staff',NULL,2,'Assigned to IT team. Investigating router configuration.','2026-10-15 11:55:00'),(2,1,'student',1,NULL,'Thank you. It has been down for 4 hours now.','2026-10-15 11:55:00'),(3,1,'staff',NULL,2,'Router replacement ordered. Should be resolved by EOD.','2026-10-15 11:55:00'),(4,3,'staff',NULL,3,'Urgent â€” sending team to inspect the ceiling immediately.','2026-10-15 11:55:00'),(5,3,'student',3,NULL,'Please hurry, it is getting worse.','2026-10-15 11:55:00'),(6,7,'staff',NULL,1,'Socket isolated. Electrician on site now.','2026-10-15 11:55:00'),(7,7,'student',7,NULL,'Thanks for the quick response.','2026-10-15 11:55:00'),(8,9,'staff',NULL,6,'Which projector model is it? Sending someone shortly.','2026-10-15 11:55:00'),(9,9,'student',9,NULL,'It is a BenQ MX560P.','2026-10-15 11:55:00'),(10,12,'staff',NULL,3,'Fan replaced. Marking as closed.','2026-10-15 11:55:00');
/*!40000 ALTER TABLE `complaint_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint_status_history`
--

DROP TABLE IF EXISTS `complaint_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaint_status_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `complaint_id` int NOT NULL,
  `old_status` enum('open','assigned','in_progress','resolved','rejected','closed') DEFAULT NULL,
  `new_status` enum('open','assigned','in_progress','resolved','rejected','closed') NOT NULL,
  `changed_by_staff_id` int DEFAULT NULL,
  `note` text,
  `changed_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `history_complaint_idx` (`complaint_id`),
  KEY `history_changed_at_idx` (`changed_at`),
  KEY `fk_history_changed_by_staff` (`changed_by_staff_id`),
  CONSTRAINT `fk_history_changed_by_staff` FOREIGN KEY (`changed_by_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_history_complaint` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint_status_history`
--

LOCK TABLES `complaint_status_history` WRITE;
/*!40000 ALTER TABLE `complaint_status_history` DISABLE KEYS */;
INSERT INTO `complaint_status_history` VALUES (1,1,'open','assigned',6,'Auto-assigned to IT department.','2026-10-15 11:55:00'),(2,1,'assigned','in_progress',2,'Working on router config.','2026-10-15 11:55:00'),(3,2,'open','assigned',6,'Assigned to Electrical.','2026-10-15 11:55:00'),(4,3,'open','open',NULL,'Complaint created.','2026-10-15 11:55:00'),(5,4,'open','assigned',6,'Assigned to Housekeeping.','2026-10-15 11:55:00'),(6,4,'assigned','in_progress',4,'Cleanup started.','2026-10-15 11:55:00'),(7,4,'in_progress','resolved',4,'Dustbin cleared.','2026-10-15 11:55:00'),(8,7,'open','assigned',6,'Urgent â€” assigned to Electrical head.','2026-10-15 11:55:00'),(9,7,'assigned','in_progress',1,'Electrician inspecting socket.','2026-10-15 11:55:00'),(10,8,'open','assigned',6,'Assigned to Plumbing.','2026-10-15 11:55:00'),(11,8,'assigned','in_progress',5,'Tap washer replacement.','2026-10-15 11:55:00'),(12,8,'in_progress','resolved',5,'Tap repaired.','2026-10-15 11:55:00'),(13,11,'open','assigned',6,'Assigned to IT.','2026-10-15 11:55:00'),(14,11,'assigned','in_progress',2,'Optimizing access point.','2026-10-15 11:55:00'),(15,11,'in_progress','resolved',2,'Speed restored.','2026-10-15 11:55:00'),(16,12,'open','assigned',6,'Assigned to Civil.','2026-10-15 11:55:00'),(17,12,'assigned','in_progress',3,'Fan replacement in progress.','2026-10-15 11:55:00'),(18,12,'in_progress','resolved',3,'Fan replaced.','2026-10-15 11:55:00'),(19,12,'resolved','closed',6,'Verified by admin.','2026-10-15 11:55:00'),(20,13,NULL,'open',NULL,'Complaint created','2026-10-16 18:51:23'),(21,14,NULL,'open',NULL,'Complaint created','2026-10-16 18:53:43');
/*!40000 ALTER TABLE `complaint_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint_tags`
--

DROP TABLE IF EXISTS `complaint_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaint_tags` (
  `complaint_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `tagged_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`complaint_id`,`tag_id`),
  KEY `fk_complaint_tags_tag` (`tag_id`),
  CONSTRAINT `fk_complaint_tags_complaint` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_complaint_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint_tags`
--

LOCK TABLES `complaint_tags` WRITE;
/*!40000 ALTER TABLE `complaint_tags` DISABLE KEYS */;
INSERT INTO `complaint_tags` VALUES (1,2,'2026-10-15 11:55:00'),(1,4,'2026-10-15 11:55:00'),(2,5,'2026-10-15 11:55:00'),(3,1,'2026-10-15 11:55:00'),(3,3,'2026-10-15 11:55:00'),(3,6,'2026-10-15 11:55:00'),(4,7,'2026-10-15 11:55:00'),(5,8,'2026-10-15 11:55:00'),(6,2,'2026-10-15 11:55:00'),(7,1,'2026-10-15 11:55:00'),(7,3,'2026-10-15 11:55:00'),(7,5,'2026-10-15 11:55:00'),(8,6,'2026-10-15 11:55:00'),(9,2,'2026-10-15 11:55:00'),(10,8,'2026-10-15 11:55:00'),(11,4,'2026-10-15 11:55:00'),(12,2,'2026-10-15 11:55:00');
/*!40000 ALTER TABLE `complaint_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `student_id` int NOT NULL,
  `category_id` int NOT NULL,
  `location` varchar(200) NOT NULL,
  `building` varchar(100) DEFAULT NULL,
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status` enum('open','assigned','in_progress','resolved','rejected','closed') NOT NULL DEFAULT 'open',
  `department_id` int DEFAULT NULL,
  `assigned_staff_id` int DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `resolution_note` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `complaints_student_idx` (`student_id`),
  KEY `complaints_category_idx` (`category_id`),
  KEY `complaints_status_idx` (`status`),
  KEY `complaints_department_idx` (`department_id`),
  KEY `complaints_staff_idx` (`assigned_staff_id`),
  KEY `complaints_status_priority_idx` (`status`,`priority`),
  CONSTRAINT `fk_complaints_assigned_staff` FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_complaints_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_complaints_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_complaints_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (1,'Wi-Fi not working in Lab 204','The Wi-Fi in CS Lab 204 has been down since morning. Cannot connect to any network.',1,1,'CS Lab 204','Academic Block A','high','in_progress',3,2,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(2,'Flickering lights in Hostel B corridor','Lights in the second-floor corridor flicker constantly. Possible loose connection.',2,2,'Hostel B, 2nd Floor','Hostel B','medium','assigned',1,3,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(3,'Water leakage from washroom ceiling','Water is dripping from the ceiling near the washroom entrance. Floor becoming slippery.',3,3,'Washroom near Canteen','Main Building','urgent','open',2,NULL,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(4,'Dustbin not cleared for 3 days','The dustbin near Room 101 has not been emptied. Strong smell developing.',4,4,'Room 101','Academic Block B','medium','resolved',4,4,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(5,'Broken chair in Library','Chair at reading table 5 has a broken leg. Unsafe to sit.',5,5,'Library Reading Hall','Library','low','open',5,NULL,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(6,'AC not cooling in Seminar Hall','AC unit in Seminar Hall runs but does not cool. Room becomes very hot during presentations.',6,1,'Seminar Hall','Academic Block A','high','assigned',3,2,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(7,'Spark from power socket in Lab 101','Power socket in Lab 101 sparked when plugging in a laptop. Please inspect urgently.',7,2,'EE Lab 101','Academic Block C','urgent','in_progress',1,1,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(8,'Tap leaking in Boys Hostel washroom','One of the taps in the first-floor washroom keeps dripping continuously.',8,3,'Hostel A, 1st floor washroom','Hostel A','low','resolved',2,5,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(9,'Projector not turning on','The projector in Lecture Hall 3 does not turn on. Class presentations are affected.',9,6,'Lecture Hall 3','Academic Block B','medium','open',NULL,NULL,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(10,'Broken window in Room 208','Window pane in Room 208 is cracked and lets in rainwater.',10,5,'Room 208','Academic Block A','medium','assigned',5,5,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(11,'Wi-Fi speed extremely slow in Library','Wi-Fi works but speed is unusable. Cannot access online resources.',1,1,'Library','Library','medium','resolved',3,2,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(12,'Ceiling fan making loud noise','Fan in Room 305 makes loud rattling sound. Distracts during lectures.',2,6,'Room 305','Academic Block C','low','closed',NULL,NULL,NULL,NULL,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(13,'Air conditioner not working in Room 401','The AC unit in Room 401 has not been cooling since yesterday evening. Room becomes unusable during afternoon lectures.',1,2,'Room 401','Academic Block A','high','open',NULL,NULL,NULL,NULL,'2026-10-16 18:51:23','2026-10-16 18:51:23'),(14,'Vs code nehi chal raha thik karke jao','The AC unit in Room 401 has not been cooling since yesterday evening.',2,3,'Room 201','Academic Block A','low','open',NULL,NULL,NULL,NULL,'2026-10-16 18:53:43','2026-10-16 18:53:43');
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Electrical','Handles power, wiring, lighting, and electrical faults.','electrical@campusfix.edu','1001','2026-10-15 11:55:00','2026-10-15 11:55:00'),(2,'Plumbing','Handles water supply, drainage, and leakage issues.','plumbing@campusfix.edu','1002','2026-10-15 11:55:00','2026-10-15 11:55:00'),(3,'IT & Network','Handles Wi-Fi, LAN, computers, and software issues.','it@campusfix.edu','1003','2026-10-15 11:55:00','2026-10-15 11:55:00'),(4,'Housekeeping','Handles cleanliness, waste, and sanitation.','housekeeping@campusfix.edu','1004','2026-10-15 11:55:00','2026-10-15 11:55:00'),(5,'Civil','Handles furniture, doors, windows, and structural issues.','civil@campusfix.edu','1005','2026-10-15 11:55:00','2026-10-15 11:55:00');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('staff','supervisor','admin') NOT NULL DEFAULT 'staff',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Rakesh Kumar','rakesh.kumar@campusfix.edu','hash_rakesh','8000000001','staff',1,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(2,'Priya Menon','priya.menon@campusfix.edu','hash_priya','8000000002','staff',1,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(3,'Suresh Naik','suresh.naik@campusfix.edu','hash_suresh','8000000003','supervisor',1,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(4,'Neha Joshi','neha.joshi@campusfix.edu','hash_neha','8000000004','staff',1,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(5,'Vikram Bose','vikram.bose@campusfix.edu','hash_vikram','8000000005','staff',1,'2026-10-15 11:55:00','2026-10-15 11:55:00'),(6,'Lakshmi Pillai','lakshmi.pillai@campusfix.edu','hash_lakshmi','8000000006','admin',1,'2026-10-15 11:55:00','2026-10-15 11:55:00');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_departments`
--

DROP TABLE IF EXISTS `staff_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_departments` (
  `staff_id` int NOT NULL,
  `department_id` int NOT NULL,
  `role_in_dept` enum('member','lead') NOT NULL DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`staff_id`,`department_id`),
  KEY `fk_staff_dept_department` (`department_id`),
  CONSTRAINT `fk_staff_dept_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_staff_dept_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_departments`
--

LOCK TABLES `staff_departments` WRITE;
/*!40000 ALTER TABLE `staff_departments` DISABLE KEYS */;
INSERT INTO `staff_departments` VALUES (1,1,'member','2026-10-15 11:55:00'),(1,2,'member','2026-10-15 11:55:00'),(2,3,'lead','2026-10-15 11:55:00'),(3,1,'lead','2026-10-15 11:55:00'),(3,5,'member','2026-10-15 11:55:00'),(4,4,'lead','2026-10-15 11:55:00'),(5,2,'member','2026-10-15 11:55:00'),(5,5,'member','2026-10-15 11:55:00'),(6,3,'member','2026-10-15 11:55:00');
/*!40000 ALTER TABLE `staff_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roll_number` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `students_roll_number_unique` (`roll_number`),
  UNIQUE KEY `students_email_unique` (`email`),
  KEY `fk_students_department` (`department_id`),
  CONSTRAINT `fk_students_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'CS22B001','Aarav Mehta','hash_aarav','9000000001',3,3,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','aarav.mehta@student.edu'),(2,'CS22B002','Diya Sharma','hash_diya','9000000002',3,3,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','diya.sharma@student.edu'),(3,'EC21B014','Rohan Kapoor','hash_rohan','9000000003',1,4,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','rohan.kapoor@student.edu'),(4,'ME22B007','Sanya Iyer','hash_sanya','9000000004',5,2,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','sanya.iyer@student.edu'),(5,'CS23B021','Kabir Singh','hash_kabir','9000000005',3,2,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','kabir.singh@student.edu'),(6,'CE22B009','Ananya Verma','hash_ananya','9000000006',5,3,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','ananya.verma@student.edu'),(7,'EE22B033','Vihaan Reddy','hash_vihaan','9000000007',1,3,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','vihaan.reddy@student.edu'),(8,'IT21B018','Ishita Nair','hash_ishita','9000000008',3,4,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','ishita.nair@student.edu'),(9,'ME23B045','Arjun Patel','hash_arjun','9000000009',5,1,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','arjun.patel@student.edu'),(10,'CS21B003','Meera Krishnan','hash_meera','9000000010',3,4,1,'2026-10-15 11:55:00','2026-10-15 11:55:00','meera.krishnan@student.edu');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `color` varchar(7) NOT NULL DEFAULT '#6B7280',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tags_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'Urgent','#EF4444','2026-10-15 11:55:00'),(2,'Recurring','#F59E0B','2026-10-15 11:55:00'),(3,'Safety','#DC2626','2026-10-15 11:55:00'),(4,'Wi-Fi','#3B82F6','2026-10-15 11:55:00'),(5,'Electrical','#8B5CF6','2026-10-15 11:55:00'),(6,'Water','#06B6D4','2026-10-15 11:55:00'),(7,'Cleanliness','#10B981','2026-10-15 11:55:00'),(8,'Furniture','#A16207','2026-10-15 11:55:00');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-17 14:17:26
