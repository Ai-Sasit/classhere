-- CreateTable
CREATE TABLE `QRQuota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classroom_id` INTEGER NOT NULL,
    `quota` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QRQuota` ADD CONSTRAINT `QRQuota_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
