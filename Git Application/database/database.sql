-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           5.7.11 - MySQL Community Server (GPL)
-- SE du serveur:                Win32
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Export de la structure de la base pour website
DROP DATABASE IF EXISTS `website`;
CREATE DATABASE IF NOT EXISTS `website` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `website`;

-- Export de la structure de la table website. client
DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `nom` varchar(150) NOT NULL,
  `prenom` varchar(150) NOT NULL,
  `adresse` varchar(250) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `email` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Export de données de la table website.client : ~1 rows (environ)
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` (`id`, `login`, `password`, `nom`, `prenom`, `adresse`, `phone`, `email`) VALUES
	(4, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'rezgui', 'Hoang', '12 Sandra Ct', '2407162326', 'hoang@gmail.com');
/*!40000 ALTER TABLE `client` ENABLE KEYS */;

-- Export de la structure de la table website. facture
DROP TABLE IF EXISTS `facture`;
CREATE TABLE IF NOT EXISTS `facture` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_client` int(11) DEFAULT '0',
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `prix_total_HT` double(10,2) DEFAULT NULL,
  `mode_reglement` varchar(50) DEFAULT NULL,
  `commentaires` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__client` (`id_client`),
  CONSTRAINT `FK__client` FOREIGN KEY (`id_client`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table website.facture : ~0 rows (environ)
/*!40000 ALTER TABLE `facture` DISABLE KEYS */;
/*!40000 ALTER TABLE `facture` ENABLE KEYS */;

-- Export de la structure de la table website. ligne_facture
DROP TABLE IF EXISTS `ligne_facture`;
CREATE TABLE IF NOT EXISTS `ligne_facture` (
  `id_ligne_facture` int(11) NOT NULL AUTO_INCREMENT,
  `id_facture` int(11) DEFAULT NULL,
  `id_produit` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `prix` double(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_ligne_facture`),
  KEY `FK__facture` (`id_facture`),
  KEY `FK__produit` (`id_produit`),
  CONSTRAINT `FK__facture` FOREIGN KEY (`id_facture`) REFERENCES `facture` (`id`),
  CONSTRAINT `FK__produit` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table website.ligne_facture : ~0 rows (environ)
/*!40000 ALTER TABLE `ligne_facture` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligne_facture` ENABLE KEYS */;

-- Export de la structure de la table website. produit
DROP TABLE IF EXISTS `produit`;
CREATE TABLE IF NOT EXISTS `produit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(250) NOT NULL,
  `image` varchar(250) NOT NULL,
  `prix` double(10,2) NOT NULL,
  `qty` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Export de données de la table website.produit : ~6 rows (environ)
/*!40000 ALTER TABLE `produit` DISABLE KEYS */;
INSERT INTO `produit` (`id`, `nom`, `image`, `prix`, `qty`) VALUES
	(1, 'Iphone 7', 'iphone7.png', 699.00, 5),
	(2, 'Iphone 7s', 'iphone7s.png', 799.00, 4),
	(3, 'Ipad Air', 'ipadair.png', 599.00, 3),
	(4, 'Ipad Pro', 'ipadpro.png', 899.00, 2),
	(5, 'Macbook Air', 'macbookair.png', 999.00, 1),
	(6, 'Macbook Pro', 'macbookpro.png', 1399.00, 0);
/*!40000 ALTER TABLE `produit` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
