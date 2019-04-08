-- MySQL dump 10.13  Distrib 5.7.18, for Win64 (x86_64)
--
-- Host: localhost    Database: money
-- ------------------------------------------------------
-- Server version	5.7.18

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
-- Table structure for table `bank`
--

DROP TABLE IF EXISTS `bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bank` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(255) DEFAULT NULL,
  `orderd` smallint(5) unsigned DEFAULT NULL,
  `bankType` int(1) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank`
--

LOCK TABLES `bank` WRITE;
/*!40000 ALTER TABLE `bank` DISABLE KEYS */;
INSERT INTO `bank` VALUES (1,'招商',1,0),(2,'广发',6,0),(3,'工商',4,0),(4,'交通',4,0),(5,'中行',5,0),(6,'建行',2,0),(7,'民生',8,0),(8,'北京',9,0),(9,'农商',10,0),(10,'农业',3,0),(11,'邮政',12,0),(12,'人民',7,0),(13,'其它',100,0),(14,'支付宝',1,1),(15,'微信钱包',2,1),(16,'京东余额',3,1),(17,'其它',100,1),(18,'现金',1,2),(20,'其它',1,9),(21,'滴滴',4,1);
/*!40000 ALTER TABLE `bank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banktype`
--

DROP TABLE IF EXISTS `banktype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banktype` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(255) DEFAULT NULL,
  `orderd` smallint(5) unsigned DEFAULT NULL,
  `type` tinyint(1) unsigned DEFAULT '0' COMMENT '0：银行卡 1：网络资产 2：现金 9：其它',
  PRIMARY KEY (`id`),
  KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banktype`
--

LOCK TABLES `banktype` WRITE;
/*!40000 ALTER TABLE `banktype` DISABLE KEYS */;
INSERT INTO `banktype` VALUES (1,'现金',1,2),(2,'借记卡',2,0),(3,'信用卡',3,0),(4,'网络资产',4,1),(5,'其它',100,9);
/*!40000 ALTER TABLE `banktype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cards` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `num` varchar(255) DEFAULT '',
  `sname` varchar(255) DEFAULT '' COMMENT '别名',
  `memberKey` int(10) unsigned DEFAULT NULL,
  `bankTypeKey` int(10) unsigned DEFAULT NULL,
  `bankKey` int(10) unsigned DEFAULT NULL,
  `cungen` int(15) DEFAULT '0',
  `income` int(15) DEFAULT '0',
  `pay` int(15) DEFAULT '0',
  `yu_e` int(15) DEFAULT '0',
  `validityPeriod` varchar(255) DEFAULT '' COMMENT '有效期',
  `other` text,
  PRIMARY KEY (`id`),
  KEY `memberKey_` (`memberKey`),
  KEY `bankTypeKey_` (`bankTypeKey`),
  KEY `bankKey_` (`bankKey`),
  CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`bankKey`) REFERENCES `bank` (`id`),
  CONSTRAINT `cards_ibfk_2` FOREIGN KEY (`bankTypeKey`) REFERENCES `banktype` (`id`),
  CONSTRAINT `cards_ibfk_3` FOREIGN KEY (`memberKey`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (1,'6225880162057823','招行卡',2,2,1,0,0,0,0,'',''),(2,'6225683721003149608','广发卡',2,2,2,0,0,0,0,'',''),(3,'6228480010955518617','农行卡',2,2,10,0,0,0,0,'',''),(4,'6217000010026600703','建行卡',2,2,6,0,0,0,0,'',''),(5,'6212260200013264748','工行卡',2,2,3,0,0,0,0,'',''),(6,'6226220123533332','民生卡',2,2,7,0,0,0,0,'',''),(7,'6216610100012633489','中行卡',2,2,5,0,0,0,0,'',''),(8,'6210981000009091796','邮政卡',2,2,11,0,0,0,0,'',''),(9,'6222600910069077004','交通卡',2,2,4,0,0,0,0,'',''),(10,'4392250808857212','招信卡',2,3,1,0,0,0,0,'07/20',''),(11,'4581240918395584','交信卡',2,3,4,0,0,0,0,'04/21',''),(12,'6258101643917042','广信卡',2,3,2,0,0,0,0,'01/21',''),(17,'6212260412000848371','赤城房贷',2,2,3,0,0,0,0,'',''),(18,'6222370141709275','车用',2,3,3,0,0,0,0,'12/23','');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `in_out`
--

DROP TABLE IF EXISTS `in_out`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `in_out` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date_dbCreate` datetime DEFAULT NULL,
  `name` char(255) DEFAULT NULL,
  `type` tinyint(1) unsigned DEFAULT '0' COMMENT '0：支出 1：收入',
  `money` int(15) unsigned DEFAULT '0',
  `intypeKey` int(10) unsigned DEFAULT NULL,
  `memberKey` int(10) unsigned DEFAULT NULL COMMENT '支出时为支出货币的账户，收入时为收入货币的账户',
  `for_from_memberKey` int(10) unsigned DEFAULT NULL COMMENT '当支出时为for who，当收入时为from who',
  `actOn_memberKey` int(10) unsigned DEFAULT NULL,
  `bankTypeKey` int(10) unsigned DEFAULT NULL,
  `bankKey` int(10) unsigned DEFAULT NULL,
  `outtype1Key` int(10) unsigned DEFAULT NULL,
  `outtype2Key` int(10) unsigned DEFAULT NULL,
  `date_sign` date DEFAULT NULL,
  `other` text,
  `dtype` char(255) DEFAULT '',
  `isOughtNotPay` tinyint(4) DEFAULT '0' COMMENT '0:不是额外花费，1:是额外花费',
  PRIMARY KEY (`id`),
  KEY `bankKey` (`bankKey`),
  KEY `bankTypeKey` (`bankTypeKey`),
  KEY `outtype1Key_` (`outtype1Key`),
  KEY `outtype2Key_` (`outtype2Key`),
  KEY `intypeKey_` (`intypeKey`),
  KEY `memberKey` (`memberKey`),
  KEY `actOn_memberKey` (`actOn_memberKey`),
  KEY `for_from_memberKey` (`for_from_memberKey`),
  CONSTRAINT `in_out_ibfk_1` FOREIGN KEY (`actOn_memberKey`) REFERENCES `member` (`id`),
  CONSTRAINT `in_out_ibfk_2` FOREIGN KEY (`bankKey`) REFERENCES `bank` (`id`),
  CONSTRAINT `in_out_ibfk_3` FOREIGN KEY (`bankTypeKey`) REFERENCES `banktype` (`id`),
  CONSTRAINT `in_out_ibfk_4` FOREIGN KEY (`for_from_memberKey`) REFERENCES `member` (`id`),
  CONSTRAINT `in_out_ibfk_5` FOREIGN KEY (`intypeKey`) REFERENCES `intype` (`id`),
  CONSTRAINT `in_out_ibfk_6` FOREIGN KEY (`intypeKey`) REFERENCES `intype` (`id`),
  CONSTRAINT `in_out_ibfk_7` FOREIGN KEY (`memberKey`) REFERENCES `member` (`id`),
  CONSTRAINT `in_out_ibfk_8` FOREIGN KEY (`outtype1Key`) REFERENCES `outtype1` (`id`),
  CONSTRAINT `in_out_ibfk_9` FOREIGN KEY (`outtype2Key`) REFERENCES `outtype2` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `in_out`
--

LOCK TABLES `in_out` WRITE;
/*!40000 ALTER TABLE `in_out` DISABLE KEYS */;
/*!40000 ALTER TABLE `in_out` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intype`
--

DROP TABLE IF EXISTS `intype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `intype` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(255) DEFAULT NULL,
  `orderd` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intype`
--

LOCK TABLES `intype` WRITE;
/*!40000 ALTER TABLE `intype` DISABLE KEYS */;
INSERT INTO `intype` VALUES (1,'工资',1),(2,'兼职',2),(3,'公积金',3),(4,'给予',4),(5,'加班',5),(6,'奖金',6),(7,'利息',7),(9,'房租',9),(10,'中奖捡钱',10),(11,'政府补贴',11),(12,'报销',12),(15,'其它',100),(16,'物品出售',13);
/*!40000 ALTER TABLE `intype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(255) DEFAULT NULL,
  `orderd` smallint(5) unsigned DEFAULT NULL,
  `ifhome` tinyint(3) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'公共',2,1),(2,'老公',1,1),(3,'老婆',3,1),(4,'老大',4,1),(5,'老二',5,1),(6,'父亲',6,0),(7,'母亲',7,0),(8,'岳父',8,0),(9,'岳母',9,0),(10,'妹妹',10,0),(11,'奶奶',11,0),(12,'岳奶',12,0),(13,'亲戚',20,0),(14,'他人',40,0),(15,'其它',100,0),(16,'姥姥',15,0),(17,'同事',37,0),(18,'同学',38,0);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outtype1`
--

DROP TABLE IF EXISTS `outtype1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `outtype1` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(255) DEFAULT NULL,
  `orderd` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outtype1`
--

LOCK TABLES `outtype1` WRITE;
/*!40000 ALTER TABLE `outtype1` DISABLE KEYS */;
INSERT INTO `outtype1` VALUES (1,'食品酒水',1),(2,'居家物业',3),(3,'行车交通',2),(4,'休闲娱乐',5),(5,'医疗保健',6),(6,'数码家电',7),(7,'网资通讯',8),(8,'学习进修',9),(9,'人情往来',10),(10,'差旅出游',11),(11,'金融保险',12),(12,'其它',100),(13,'衣服饰品',4);
/*!40000 ALTER TABLE `outtype1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outtype2`
--

DROP TABLE IF EXISTS `outtype2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `outtype2` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(255) DEFAULT NULL,
  `orderd` smallint(5) unsigned DEFAULT NULL,
  `outType1Key` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `outType1Key` (`outType1Key`),
  CONSTRAINT `outtype2_ibfk_1` FOREIGN KEY (`outType1Key`) REFERENCES `outtype1` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outtype2`
--

LOCK TABLES `outtype2` WRITE;
/*!40000 ALTER TABLE `outtype2` DISABLE KEYS */;
INSERT INTO `outtype2` VALUES (1,'装修费',17,2),(2,'建材',16,2),(3,'居家百货',1,2),(4,'电器',2,2),(5,'家具',3,2),(6,'五金电子',4,2),(7,'布软家纺',14,2),(8,'摄影文印',15,2),(9,'卫厨浴用品',5,2),(10,'书房用品',13,2),(11,'儿童物品',6,2),(12,'水费',7,2),(13,'电费',8,2),(14,'燃气费',9,2),(15,'有线费',10,2),(16,'物业卫生',11,2),(17,'家政费',18,2),(18,'房租',12,2),(19,'其它',100,2),(20,'给钱',1,9),(21,'买物',2,9),(22,'买药',2,9),(23,'诊病',3,9),(24,'捐助',7,9),(25,'请客',4,9),(26,'均摊',5,9),(27,'其它',100,9),(28,'烟',1,1),(29,'酒',2,1),(30,'饭馆',4,1),(31,'饮品冲品',9,1),(32,'调料油盐',8,1),(33,'做饭主副食',5,1),(34,'零食',6,1),(35,'水果',7,1),(36,'其它',100,1),(37,'汽车用品',9,3),(38,'维修',10,3),(39,'保养',11,3),(40,'加油',4,3),(41,'高速费',1,3),(42,'停车',2,3),(43,'车检',12,3),(44,'违章',13,3),(45,'事故赔偿',14,3),(46,'车险',15,3),(47,'行车证件',16,3),(48,'公交地铁',3,3),(49,'的士共享',6,3),(50,'火船汽飞',20,3),(51,'自行车',7,3),(52,'电动车',8,3),(53,'其它',100,3),(54,'吃',1,10),(55,'住',2,10),(56,'玩',3,10),(57,'儿童娱乐',1,4),(58,'腐败庆祝',3,4),(59,'休闲玩乐',2,4),(60,'宠物宝贝',4,4),(61,'其它',100,4),(62,'幼儿园',1,8),(63,'培训费',2,8),(64,'书刊杂志',3,8),(65,'考试',4,8),(66,'学习用品',5,8),(67,'其它',100,8),(68,'衣服',1,13),(69,'鞋帽',2,13),(70,'箱包',3,13),(71,'配件配饰',4,13),(72,'珠宝金银',5,13),(73,'其它',100,13),(74,'洗澡理发',1,5),(75,'美妆护理',2,5),(76,'保健用品',3,5),(77,'健身卡',4,5),(78,'买药',5,5),(79,'医院花销',6,5),(80,'其它',100,5),(82,'银行手续',5,11),(83,'还利',6,11),(85,'房贷',13,2),(88,'其它',100,11),(89,'快递邮政',5,7),(90,'网费',2,7),(91,'电话手机费',1,7),(92,'域名主机',3,7),(93,'充值游戏',4,7),(94,'其它',100,7),(95,'手机',1,6),(96,'手机配件',2,6),(97,'电脑',4,6),(98,'电脑配件',5,6),(99,'数码周边',8,6),(100,'数码设备',7,6),(101,'网络设备',9,6),(102,'手机修理',3,6),(103,'电脑修理',6,6),(104,'家电',10,6),(105,'其它',100,6),(106,'丢失',1,12),(107,'无头账',2,12),(108,'其它',100,12),(109,'其它',100,10),(110,'早点',3,1),(111,'中点',3,1),(112,'晚点',3,1),(113,'娱乐物品',6,4),(114,'社保',4,11),(115,'洗车',5,3),(116,'忘记',3,12),(117,' 其它它',105,12);
/*!40000 ALTER TABLE `outtype2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(255) DEFAULT NULL,
  `sname` char(255) DEFAULT NULL,
  `level` tinyint(1) unsigned DEFAULT '1' COMMENT '1:normal 2:supper',
  `other` text,
  `password` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'adminlg','老夫',2,NULL,'bGxjQjd1eVE=YmM4M2NlYzRkNDVkMTEyYWViNDlmMmZlNDJjNGY2Nzg='),(2,'admin','老妻',1,NULL,'alF4WWt1SXM=MzcxYTEzMzg0MTI4NTQ3ZDczMDk1M2Y2MjA2OTdmOGI=');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zhuan_cun`
--

DROP TABLE IF EXISTS `zhuan_cun`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zhuan_cun` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date_dbCreate` datetime DEFAULT NULL,
  `name` char(255) DEFAULT NULL,
  `type` smallint(10) DEFAULT '1' COMMENT '100：转存\r\n\r\n0：存根\r\n\r\n1：借入 \r\n2：还入\r\n3：生意收入\r\n\r\n-1：借出\r\n-2：还出\r\n-3：生意投资',
  `money` int(15) unsigned DEFAULT '0',
  `memberKey_to` int(10) unsigned DEFAULT NULL,
  `memberKey_from` int(10) unsigned DEFAULT NULL,
  `bankTypeKey_to` int(10) unsigned DEFAULT NULL,
  `bankTypeKey_from` int(10) unsigned DEFAULT NULL,
  `bankKey_to` int(10) unsigned DEFAULT NULL,
  `bankKey_from` int(10) unsigned DEFAULT NULL,
  `date_sign` date DEFAULT NULL,
  `other` text,
  `dtype` char(255) DEFAULT NULL,
  `isOughtNotPay` tinyint(4) DEFAULT '0' COMMENT '0:不是额外花费，1:是额外花费',
  PRIMARY KEY (`id`),
  KEY `memberKey_to` (`memberKey_to`),
  KEY `memberKey_from` (`memberKey_from`),
  KEY `bankTypeKey_to` (`bankTypeKey_to`),
  KEY `bankTypeKey_from` (`bankTypeKey_from`),
  KEY `bankKey_to` (`bankKey_to`),
  KEY `bankKey_from` (`bankKey_from`),
  CONSTRAINT `zhuan_cun_ibfk_1` FOREIGN KEY (`bankKey_from`) REFERENCES `bank` (`id`),
  CONSTRAINT `zhuan_cun_ibfk_2` FOREIGN KEY (`bankKey_to`) REFERENCES `bank` (`id`),
  CONSTRAINT `zhuan_cun_ibfk_3` FOREIGN KEY (`bankTypeKey_from`) REFERENCES `banktype` (`id`),
  CONSTRAINT `zhuan_cun_ibfk_4` FOREIGN KEY (`bankTypeKey_to`) REFERENCES `banktype` (`id`),
  CONSTRAINT `zhuan_cun_ibfk_5` FOREIGN KEY (`memberKey_from`) REFERENCES `member` (`id`),
  CONSTRAINT `zhuan_cun_ibfk_6` FOREIGN KEY (`memberKey_to`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='存根表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zhuan_cun`
--

LOCK TABLES `zhuan_cun` WRITE;
/*!40000 ALTER TABLE `zhuan_cun` DISABLE KEYS */;
INSERT INTO `zhuan_cun` VALUES (1,'2019-01-01 09:26:40','微信钱包',0,1601,2,2,4,1,15,18,'2019-01-01','','',0),(2,'2019-01-01 09:27:12','支付宝',0,1314,2,2,4,1,14,18,'2019-01-01','','',0),(3,'2019-01-01 09:27:26','现金',0,500,2,2,1,1,18,18,'2019-01-01','','',0),(4,'2019-01-01 09:29:40','老婆现金',0,1,3,2,1,1,18,18,'2019-01-01','','',0);
/*!40000 ALTER TABLE `zhuan_cun` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-01  9:29:54
