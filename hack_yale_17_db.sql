#mysql -h localhost -u root -ptemp < hack_yale_17_db.sql



DROP SCHEMA IF EXISTS `hack_yale_17` ;

-- -----------------------------------------------------
-- Schema hack_yale_17
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `hack_yale_17` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `hack_yale_17` ;

-- -----------------------------------------------------
-- Table `hack_yale_17`.`Drugs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hack_yale_17`.`Drugs` (
  `did` INT NOT NULL AUTO_INCREMENT, -- drug brand id
  `dname` VARCHAR(100) NOT NULL, -- drug brandname
  `generic` VARCHAR(100) NOT NULL, -- generic drug name
  FULLTEXT dname_idx(`dname`),
  PRIMARY KEY (`did`) )
ENGINE = InnoDB;

LOAD DATA LOCAL INFILE './Drug_List.csv' INTO TABLE `hack_yale_17`.`Drugs`
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r' IGNORE 0 ROWS;

-- CREATE FULLTEXT INDEX dname_idx ON `hack_yale_17`.`Drugs`(name);

