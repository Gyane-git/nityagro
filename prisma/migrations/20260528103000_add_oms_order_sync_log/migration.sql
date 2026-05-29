CREATE TABLE IF NOT EXISTS `omsOrderSyncLog` (
  `omsOrderSyncLogId` BIGINT NOT NULL AUTO_INCREMENT,
  `orderType` VARCHAR(191) NOT NULL,
  `localOrderIds` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `payload` JSON NOT NULL,
  `response` JSON NULL,
  `errorMessage` TEXT NULL,
  `lastTriedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `omsOrderSyncLog_status_idx`(`status`),
  PRIMARY KEY (`omsOrderSyncLogId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
