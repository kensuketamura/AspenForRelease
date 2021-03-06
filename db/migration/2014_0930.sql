SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

ALTER TABLE `aspen`.`SubmitStatuses` 
DROP FOREIGN KEY `fk_user_has_subject_subject1`;

ALTER TABLE `aspen`.`Users` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `aspen`.`Lectures` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `aspen`.`Subjects` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `aspen`.`SubmitStatuses` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`, `UserId`, `SubjectId`);

ALTER TABLE `aspen`.`SubmitStatuses` 
ADD CONSTRAINT `fk_user_has_subject_subject1`
  FOREIGN KEY (`SubjectId` , `id`)
  REFERENCES `aspen`.`Subjects` (`id` , `lecture_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
