CREATE TABLE IF NOT EXISTS `comboOrderCancellation` (
  `comboOrderCancellationId` BIGINT NOT NULL AUTO_INCREMENT,
  `comboOrderId` BIGINT NOT NULL,
  `userId` BIGINT NOT NULL,
  `comboProductId` BIGINT NOT NULL,
  `comboName` VARCHAR(191) NULL,
  `comboItems` TEXT NULL,
  `cancellationReason` VARCHAR(191) NULL,
  `adminCancellationReason` VARCHAR(191) NULL,
  `cancellationStatus` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `comboOrderCancellation_comboOrderId_fkey`(`comboOrderId`),
  INDEX `comboOrderCancellation_comboProductId_fkey`(`comboProductId`),
  INDEX `comboOrderCancellation_userId_fkey`(`userId`),
  PRIMARY KEY (`comboOrderCancellationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `comboOrderReturn` (
  `comboOrderReturnId` BIGINT NOT NULL AUTO_INCREMENT,
  `comboOrderId` BIGINT NOT NULL,
  `userId` BIGINT NOT NULL,
  `comboProductId` BIGINT NOT NULL,
  `comboName` VARCHAR(191) NULL,
  `comboItems` TEXT NULL,
  `reason` VARCHAR(191) NULL,
  `returnImage` VARCHAR(191) NULL,
  `returnStatus` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `comboOrderReturn_comboOrderId_fkey`(`comboOrderId`),
  INDEX `comboOrderReturn_comboProductId_fkey`(`comboProductId`),
  INDEX `comboOrderReturn_userId_fkey`(`userId`),
  PRIMARY KEY (`comboOrderReturnId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `comboOrderCancellation` ADD CONSTRAINT `comboOrderCancellation_comboOrderId_fkey` FOREIGN KEY (`comboOrderId`) REFERENCES `comboOrders`(`comboOrderId`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `comboOrderCancellation` ADD CONSTRAINT `comboOrderCancellation_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct`(`comboProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `comboOrderCancellation` ADD CONSTRAINT `comboOrderCancellation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `comboOrderReturn` ADD CONSTRAINT `comboOrderReturn_comboOrderId_fkey` FOREIGN KEY (`comboOrderId`) REFERENCES `comboOrders`(`comboOrderId`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `comboOrderReturn` ADD CONSTRAINT `comboOrderReturn_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct`(`comboProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `comboOrderReturn` ADD CONSTRAINT `comboOrderReturn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
