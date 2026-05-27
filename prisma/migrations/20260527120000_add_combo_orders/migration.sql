-- CreateTable
CREATE TABLE IF NOT EXISTS `comboOrders` (
    `comboOrderId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `comboProductId` BIGINT NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `orderStatus` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `comboOrders_comboProductId_fkey`(`comboProductId`),
    INDEX `comboOrders_userId_fkey`(`userId`),
    PRIMARY KEY (`comboOrderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comboOrders` ADD CONSTRAINT `comboOrders_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct`(`comboProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrders` ADD CONSTRAINT `comboOrders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
