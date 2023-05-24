/*
  Warnings:

  - You are about to drop the `QRQuota` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `QRQuota` DROP FOREIGN KEY `QRQuota_classroom_id_fkey`;

-- DropTable
DROP TABLE `QRQuota`;

-- CreateTable
CREATE TABLE `qrcode_quota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classroom_id` INTEGER NOT NULL,
    `quota` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `qrcode_quota` ADD CONSTRAINT `qrcode_quota_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
