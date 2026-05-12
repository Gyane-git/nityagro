/*
  Warnings:

  - Added the required column `addType` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `addType` VARCHAR(191) NOT NULL;
