/*
  Warnings:

  - Added the required column `fullName` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;
