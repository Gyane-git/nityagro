CREATE TABLE `authOtp` (
    `authOtpId` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `codeHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `consumed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `authOtp_email_purpose_idx`(`email`, `purpose`),
    PRIMARY KEY (`authOtpId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
