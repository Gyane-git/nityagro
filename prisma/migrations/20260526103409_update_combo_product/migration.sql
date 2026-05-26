/*
  Warnings:

  - You are about to drop the column `comboImage` on the `comboProduct` table. All the data in the column will be lost.
  - You are about to drop the `productImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `productImage` DROP FOREIGN KEY `productImage_productId_fkey`;

-- AlterTable
ALTER TABLE `comboProduct` DROP COLUMN `comboImage`;

-- DropTable
DROP TABLE `productImage`;

-- CreateTable
CREATE TABLE `ProductImage` (
    `productImageId` BIGINT NOT NULL AUTO_INCREMENT,
    `productId` BIGINT NULL,
    `comboProductId` BIGINT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `isMain` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductImage_productId_idx`(`productId`),
    INDEX `ProductImage_comboProductId_idx`(`comboProductId`),
    PRIMARY KEY (`productImageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct`(`comboProductId`) ON DELETE SET NULL ON UPDATE CASCADE;
