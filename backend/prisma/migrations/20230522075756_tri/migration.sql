-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_classroom_id_fkey`;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
