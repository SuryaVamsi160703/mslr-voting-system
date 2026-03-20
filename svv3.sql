-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: CREATE DATABASE IF NOT EXISTS suryadb;
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-12 11:39:48
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: suryadb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `referendum`
--
CREATE DATABASE IF NOT EXISTS suryadb;
USE suryadb;

DROP TABLE IF EXISTS `referendum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referendum` (
  `referendum_id` int NOT NULL AUTO_INCREMENT,
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('open','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'closed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`referendum_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referendum`
--

LOCK TABLES `referendum` WRITE;
/*!40000 ALTER TABLE `referendum` DISABLE KEYS */;
INSERT INTO `referendum` VALUES (1,'Should Shangri-La pursue an expansion of its administrative boundaries to incorporate adjacent counties?','open','2026-01-12 05:28:17','2026-01-12 06:01:19'),(2,'Should Shangri-La prohibit cigarette sales?','closed','2026-01-12 05:28:17','2026-01-12 05:28:17'),(3,'Should Shangri-La implement a comprehensive recycling program with mandatory household participation?','open','2026-01-12 06:02:44','2026-01-12 06:03:00'),(4,'should we telecaste more sucessfully stories in local channels  ','closed','2026-01-12 11:14:27','2026-01-12 11:14:27');
/*!40000 ALTER TABLE `referendum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referendum_options`
--

DROP TABLE IF EXISTS `referendum_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referendum_options` (
  `opt_id` int NOT NULL AUTO_INCREMENT,
  `referendum_id` int NOT NULL,
  `option_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`opt_id`),
  KEY `referendum_id` (`referendum_id`),
  CONSTRAINT `referendum_options_ibfk_1` FOREIGN KEY (`referendum_id`) REFERENCES `referendum` (`referendum_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referendum_options`
--

LOCK TABLES `referendum_options` WRITE;
/*!40000 ALTER TABLE `referendum_options` DISABLE KEYS */;
INSERT INTO `referendum_options` VALUES (1,1,'Expand its boundaries to include all adjacent counties'),(2,1,'Remain status quo'),(3,2,'Yes'),(4,2,'No'),(5,3,'Yes, implement full recycling program'),(6,3,'No, maintain current voluntary system'),(7,3,'Yes, but only in urban areas'),(8,3,'No, focus on waste reduction instead'),(9,4,'yes'),(10,4,'no');
/*!40000 ALTER TABLE `referendum_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scc_codes`
--

DROP TABLE IF EXISTS `scc_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scc_codes` (
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `used_by_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`code`),
  KEY `used_by_email` (`used_by_email`),
  CONSTRAINT `scc_codes_ibfk_1` FOREIGN KEY (`used_by_email`) REFERENCES `users` (`email`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scc_codes`
--

LOCK TABLES `scc_codes` WRITE;
/*!40000 ALTER TABLE `scc_codes` DISABLE KEYS */;
INSERT INTO `scc_codes` VALUES ('0IXYCAH8UW',0,NULL,NULL),('12EOU5RGVX',0,NULL,NULL),('1AZN0FXJVM',0,NULL,NULL),('46HJV9KH1F',0,NULL,NULL),('4XRDN9O4AW',0,NULL,NULL),('921664ML8D',0,NULL,NULL),('9IJKHGHJK4',0,NULL,NULL),('A546AKU16A',0,NULL,NULL),('GKJ3K1YBGE',1,'suryavamsi@gmail.com','2026-01-12 05:58:21'),('IGBQET8OOY',0,NULL,NULL),('IKKSZYJTSH',0,NULL,NULL),('JOV50TOSYR',0,NULL,NULL),('N5J53QK9FO',0,NULL,NULL),('R2ZHBUYO2V',0,NULL,NULL),('S6K3AV3IVR',0,NULL,NULL),('SDUBJ5IOYB',0,NULL,NULL),('V0GB2G690L',0,NULL,NULL),('YFUVLYBQZR',0,NULL,NULL),('Z9HOC1LF4X',1,'test@gmail.com','2026-01-12 11:11:32'),('ZDN06T01V9',0,NULL,NULL);
/*!40000 ALTER TABLE `scc_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('VOTER','EC') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VOTER',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('ec@referendum.gov.sr','Election Commission','1990-01-01','$2a$10$/pWYeown.HGK6dDSFLR4EuQ5zJA7DgS2M5ze3PmJyZRmouDHSyWoW','EC','2026-01-12 05:28:17'),('suryavamsi@gmail.com','surya vamsi','2003-07-16','$2a$10$lYgQpj.GlCCgpx0/DV3kv.JoAa7p18AvhDWkL0Ah1lvKFqa.od6XK','VOTER','2026-01-12 05:58:21'),('test@gmail.com','tester','2003-07-16','$2a$10$n46K1KdPuFXQ7.qpB5V0fe8niPpXpo8aHwA3fdWhFmqPDh.S7sw0e','VOTER','2026-01-12 11:11:32');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voter_history`
--

DROP TABLE IF EXISTS `voter_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voter_history` (
  `voter_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `referendum_id` int NOT NULL,
  `voted_option_id` int NOT NULL,
  `voted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`voter_email`,`referendum_id`),
  KEY `referendum_id` (`referendum_id`),
  KEY `voted_option_id` (`voted_option_id`),
  CONSTRAINT `voter_history_ibfk_1` FOREIGN KEY (`voter_email`) REFERENCES `users` (`email`) ON DELETE CASCADE,
  CONSTRAINT `voter_history_ibfk_2` FOREIGN KEY (`referendum_id`) REFERENCES `referendum` (`referendum_id`) ON DELETE CASCADE,
  CONSTRAINT `voter_history_ibfk_3` FOREIGN KEY (`voted_option_id`) REFERENCES `referendum_options` (`opt_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voter_history`
--

LOCK TABLES `voter_history` WRITE;
/*!40000 ALTER TABLE `voter_history` DISABLE KEYS */;
INSERT INTO `voter_history` VALUES ('suryavamsi@gmail.com',1,1,'2026-01-12 05:58:50');
/*!40000 ALTER TABLE `voter_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-12 11:39:48
