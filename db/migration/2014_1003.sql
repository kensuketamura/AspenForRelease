SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

ALTER TABLE `aspen`.`Subjects` 
DROP FOREIGN KEY `fk_subject_lecture`;

ALTER TABLE `aspen`.`Lectures` 
CHANGE COLUMN `createdAt` `createdAt` DATETIME NOT NULL DEFAULT now() ;

ALTER TABLE `aspen`.`Subjects` 
DROP COLUMN `lecture_id`,
CHANGE COLUMN `endAt` `endAt` DATETIME NULL DEFAULT NULL ,
ADD COLUMN `LectureId` INT(11) NOT NULL AFTER `content`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`, `LectureId`),
DROP INDEX `fk_subject_lecture_idx` ,
ADD INDEX `fk_subject_lecture_idx` (`LectureId` ASC);

ALTER TABLE `aspen`.`LecturesUsers` 
CHANGE COLUMN `createdAt` `createdAt` DATETIME NOT NULL DEFAULT now() ;

ALTER TABLE `aspen`.`Subjects` 
ADD CONSTRAINT `fk_subject_lecture`
  FOREIGN KEY (`LectureId`)
  REFERENCES `aspen`.`Lectures` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
