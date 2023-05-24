/*
  Warnings:

  - A unique constraint covering the columns `[classroom_id]` on the table `qrcode_quota` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `qrcode_quota_classroom_id_key` ON `qrcode_quota`(`classroom_id`);
