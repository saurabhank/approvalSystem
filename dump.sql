-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: approvalSystem
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anyoneApprovals`
--

DROP TABLE IF EXISTS `anyoneApprovals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anyoneApprovals` (
  `levelId` varchar(32) DEFAULT NULL,
  `userId` varchar(32) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `id` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anyoneApprovals`
--

LOCK TABLES `anyoneApprovals` WRITE;
/*!40000 ALTER TABLE `anyoneApprovals` DISABLE KEYS */;
INSERT INTO `anyoneApprovals` VALUES ('1_1','D Joshi',2,'1_1_D Joshi'),('1_1','Elsa Ingram',0,'1_1_Elsa Ingram');
/*!40000 ALTER TABLE `anyoneApprovals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roundRobinApprovals`
--

DROP TABLE IF EXISTS `roundRobinApprovals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roundRobinApprovals` (
  `levelId` varchar(32) DEFAULT NULL,
  `userId` varchar(32) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `id` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roundRobinApprovals`
--

LOCK TABLES `roundRobinApprovals` WRITE;
/*!40000 ALTER TABLE `roundRobinApprovals` DISABLE KEYS */;
INSERT INTO `roundRobinApprovals` VALUES ('2_1','D Joshi',0,'D Joshi_2_1'),('2_1','Elsa Ingram',0,'Elsa Ingram_2_1'),('2_1','John',0,'John_2_1');
/*!40000 ALTER TABLE `roundRobinApprovals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequentialApprovals`
--

DROP TABLE IF EXISTS `sequentialApprovals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sequentialApprovals` (
  `levelId` varchar(32) NOT NULL,
  `userId` varchar(32) DEFAULT NULL,
  `sequence` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`levelId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequentialApprovals`
--

LOCK TABLES `sequentialApprovals` WRITE;
/*!40000 ALTER TABLE `sequentialApprovals` DISABLE KEYS */;
/*!40000 ALTER TABLE `sequentialApprovals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userId` varchar(32) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('D Joshi','D Joshi'),('Elsa Ingram','Elsa Ingram'),('John','John'),('Nick Holden','Nick Holden'),('Paul Marsh','Paul Marsh');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workFlowLevels`
--

DROP TABLE IF EXISTS `workFlowLevels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workFlowLevels` (
  `levelId` varchar(32) NOT NULL,
  `workFlowId` varchar(32) DEFAULT NULL,
  `levelNo` int(11) DEFAULT NULL,
  `approvalType` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`levelId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workFlowLevels`
--

LOCK TABLES `workFlowLevels` WRITE;
/*!40000 ALTER TABLE `workFlowLevels` DISABLE KEYS */;
INSERT INTO `workFlowLevels` VALUES ('1_1','1',1,'anyone'),('2_1','1',2,'roundRobin');
/*!40000 ALTER TABLE `workFlowLevels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workFlows`
--

DROP TABLE IF EXISTS `workFlows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workFlows` (
  `workFlowId` varchar(32) NOT NULL,
  `totalLevels` int(11) DEFAULT NULL,
  `currentLevel` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`workFlowId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workFlows`
--

LOCK TABLES `workFlows` WRITE;
/*!40000 ALTER TABLE `workFlows` DISABLE KEYS */;
INSERT INTO `workFlows` VALUES ('1',3,2,2),('2',3,1,0);
/*!40000 ALTER TABLE `workFlows` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-31  0:41:56
