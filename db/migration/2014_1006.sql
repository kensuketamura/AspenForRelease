SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

ALTER TABLE `aspen`.`Subjects` 
DROP FOREIGN KEY `fk_subject_lecture`;

ALTER TABLE `aspen`.`SubmitStatuses` 
DROP FOREIGN KEY `fk_user_has_subject_subject1`;

ALTER TABLE `aspen`.`Subjects` 
DROP COLUMN `LectureId`,
ADD COLUMN `LectureId` INT(11) NOT NULL AFTER `content`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
ADD INDEX `fk_Subjects_Lectures1_idx` (`LectureId` ASC),
DROP INDEX `fk_subject_lecture_idx` ;

ALTER TABLE `aspen`.`Subjects` 
ADD CONSTRAINT `fk_Subjects_Lectures1`
  FOREIGN KEY (`LectureId`)
  REFERENCES `aspen`.`Lectures` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `aspen`.`SubmitStatuses` 
ADD CONSTRAINT `fk_user_has_subject_subject1`
  FOREIGN KEY (`SubjectId`)
  REFERENCES `aspen`.`Subjects` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
