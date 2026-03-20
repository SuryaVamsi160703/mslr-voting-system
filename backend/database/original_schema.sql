-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (x86_64)
--
-- Host: localhost    Database: cw2_2025

--
-- Table structure for table `referendum`
--

DROP TABLE IF EXISTS `referendum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referendum` (
  `referendum_id` int NOT NULL AUTO_INCREMENT,
  `text` longtext,
  PRIMARY KEY (`referendum_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referendum`
--

LOCK TABLES `referendum` WRITE;
/*!40000 ALTER TABLE `referendum` DISABLE KEYS */;
INSERT INTO `referendum` VALUES (1,'Should Shangri-La pursue an expansion of its administrative boundaries to incorporate adjacent counties?'),(2,'Should Shangri-La prohibit cigarette sales');
/*!40000 ALTER TABLE `referendum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referendum_options`
--

DROP TABLE IF EXISTS `referendum_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referendum_options` (
  `opt_id` int NOT NULL,
  `referendum_id` int DEFAULT NULL,
  `option_text` longtext,
  PRIMARY KEY (`opt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referendum_options`
--

LOCK TABLES `referendum_options` WRITE;
/*!40000 ALTER TABLE `referendum_options` DISABLE KEYS */;
INSERT INTO `referendum_options` VALUES (1,1,'Expand its boundaries to include all adjacent counties'),(2,1,'Remain status quo'),(3,2,'Yes'),(4,2,'No');
/*!40000 ALTER TABLE `referendum_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scc_code`
--

DROP TABLE IF EXISTS `scc_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scc_code` (
  `scc` varchar(11) NOT NULL,
  `used` int NOT NULL,
  PRIMARY KEY (`scc`,`used`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scc_code`
--

LOCK TABLES `scc_code` WRITE;
/*!40000 ALTER TABLE `scc_code` DISABLE KEYS */;
INSERT INTO `scc_code` VALUES ('0IXYCAH8UW',0),('12EOU5RGVX',0),('1AZN0FXJVM',0),('46HJV9KH1F',0),('4XRDN9O4AW',0),('921664ML8D',0),('9IJKHGHJK4',0),('A546AKU16A',0),('GKJ3K1YBGE',0),('IGBQET8OOY',0),('IKKSZYJTSH',1),('JOV50TOSYR',0),('N5J53QK9FO',0),('R2ZHBUYO2V',0),('S6K3AV3IVR',0),('SDUBJ5IOYB',0),('V0GB2G690L',0),('YFUVLYBQZR',0),('Z9HOC1LF4X',0),('ZDN06T01V9',0);
/*!40000 ALTER TABLE `scc_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voter_history`
--

DROP TABLE IF EXISTS `voter_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voter_history` (
  `voter_email` int NOT NULL,
  `referendum_id` int DEFAULT NULL,
  `voted_option_id` int DEFAULT NULL,
  PRIMARY KEY (`voter_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voter_history`
--

LOCK TABLES `voter_history` WRITE;
/*!40000 ALTER TABLE `voter_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `voter_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voters`
--

DROP TABLE IF EXISTS `voters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voters` (
  `voter_email` varchar(50) NOT NULL,
  `fullname` varchar(45) DEFAULT NULL,
  `dob` varchar(45) DEFAULT NULL,
  `passwordhash` varchar(45) NOT NULL,
  `ssc` varchar(45) NOT NULL,
  PRIMARY KEY (`voter_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voters`
--

LOCK TABLES `voters` WRITE;
/*!40000 ALTER TABLE `voters` DISABLE KEYS */;
/*!40000 ALTER TABLE `voters` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-14  9:56:52
