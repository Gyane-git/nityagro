-- CreateTable
CREATE TABLE `users` (
    `userId` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `rolePermission` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `zipCode` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
CREATE TABLE `categories` (
    `categoryId` BIGINT NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(191) NOT NULL,
    `userId` BIGINT NOT NULL,
    `slug` VARCHAR(191) NULL,
    `categoryDescription` VARCHAR(191) NULL,
    `categoryImage` VARCHAR(191) NULL,
    `categoryLogo` VARCHAR(191) NULL,
    `categoryBanner` VARCHAR(191) NULL,
    `categoryStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `categories_userId_fkey`(`userId`),
    PRIMARY KEY (`categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `productId` BIGINT NOT NULL AUTO_INCREMENT,
    `productCode` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `userId` BIGINT NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `subGroupName` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `productVariation` VARCHAR(191) NULL,
    `productDescription` VARCHAR(191) NULL,
    `nutritionInfo` VARCHAR(191) NULL,
    `cookingInstruction` VARCHAR(191) NULL,
    `storageInstruction` VARCHAR(191) NULL,
    `pImage` VARCHAR(191) NULL,
    `productStatus` BOOLEAN NOT NULL DEFAULT true,
    `actualPrice` DOUBLE NOT NULL,
    `sellingPrice` DOUBLE NOT NULL,
    `deliveryTargetDays` BIGINT NULL,
    `stockQuantity` BIGINT NULL,
    `availableQuantity` BIGINT NULL,
    `flashSale` BOOLEAN NOT NULL DEFAULT false,
    `specialOffer` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_productCode_key`(`productCode`),
    INDEX `products_userId_fkey`(`userId`),
    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comboProduct` (
    `comboProductId` BIGINT NOT NULL AUTO_INCREMENT,
    `comboCode` VARCHAR(191) NOT NULL,
    `comboName` VARCHAR(191) NOT NULL,
    `productId` BIGINT NOT NULL,
    `productCodes` VARCHAR(191) NOT NULL,
    `productPrices` DOUBLE NOT NULL,
    `comboPrice` DOUBLE NOT NULL,
    `discount` DOUBLE NULL,
    `slug` VARCHAR(191) NULL,
    `comboDescription` VARCHAR(191) NULL,
    `comboStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`comboProductId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cartList` (
    `cartId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `productId` BIGINT NOT NULL,
    `quantity` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `cartList_productId_fkey`(`productId`),
    INDEX `cartList_userId_fkey`(`userId`),
    PRIMARY KEY (`cartId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist` (
    `wishId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `productId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `wishlist_productId_fkey`(`productId`),
    INDEX `wishlist_userId_fkey`(`userId`),
    PRIMARY KEY (`wishId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `orderId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `productId` BIGINT NOT NULL,
    `quantity` BIGINT NOT NULL DEFAULT 1,
    `unitPrice` DOUBLE NOT NULL DEFAULT 0,
    `productTotal` DOUBLE NOT NULL DEFAULT 0,
    `deliveryCharge` DOUBLE NOT NULL DEFAULT 0,
    `totalAmount` DOUBLE NOT NULL,
    `orderStatus` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `orders_productId_fkey`(`productId`),
    INDEX `orders_userId_fkey`(`userId`),
    PRIMARY KEY (`orderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comboOrders` (
    `comboOrderId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `comboProductId` BIGINT NOT NULL,
    `quantity` BIGINT NOT NULL DEFAULT 1,
    `unitPrice` DOUBLE NOT NULL DEFAULT 0,
    `productTotal` DOUBLE NOT NULL DEFAULT 0,
    `deliveryCharge` DOUBLE NOT NULL DEFAULT 0,
    `totalAmount` DOUBLE NOT NULL,
    `orderStatus` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `comboOrders_comboProductId_fkey`(`comboProductId`),
    INDEX `comboOrders_userId_fkey`(`userId`),
    PRIMARY KEY (`comboOrderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comboOrderCancellation` (
    `comboOrderCancellationId` BIGINT NOT NULL AUTO_INCREMENT,
    `comboOrderId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `comboProductId` BIGINT NOT NULL,
    `comboName` VARCHAR(191) NULL,
    `comboItems` VARCHAR(191) NULL,
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

-- CreateTable
CREATE TABLE `comboOrderReturn` (
    `comboOrderReturnId` BIGINT NOT NULL AUTO_INCREMENT,
    `comboOrderId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `comboProductId` BIGINT NOT NULL,
    `comboName` VARCHAR(191) NULL,
    `comboItems` VARCHAR(191) NULL,
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

-- CreateTable
CREATE TABLE `omsOrderSyncLog` (
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

-- CreateTable
CREATE TABLE `banner` (
    `bannerId` BIGINT NOT NULL AUTO_INCREMENT,
    `bannerName` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `bannerDescription` VARCHAR(191) NULL,
    `bannerImageforWeb` VARCHAR(191) NULL,
    `bannerImageforMobile` VARCHAR(191) NULL,
    `cardImage` VARCHAR(191) NULL,
    `bannerStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`bannerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faqs` (
    `faqsId` BIGINT NOT NULL AUTO_INCREMENT,
    `question` TEXT NOT NULL,
    `answer` TEXT NULL,
    `faqSection` VARCHAR(191) NOT NULL DEFAULT 'products-quality',
    `showOnHome` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` BIGINT NOT NULL DEFAULT 0,
    `faqStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`faqsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contactSettings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customerName` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NULL,
    `customerMessage` VARCHAR(191) NULL,
    `customerPhone` VARCHAR(191) NULL,
    `mapUrl` VARCHAR(191) NULL,
    `whatsappNumber` VARCHAR(191) NULL,
    `companyAddress` VARCHAR(191) NULL,
    `companyEmail` VARCHAR(191) NULL,
    `companyPhone` VARCHAR(191) NULL,
    `facebookUrl` VARCHAR(191) NULL,
    `twitterUrl` VARCHAR(191) NULL,
    `instagramUrl` VARCHAR(191) NULL,
    `tikTokUrl` VARCHAR(191) NULL,
    `contactStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `testimonialsId` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `userId` BIGINT NOT NULL,
    `title` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `image` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `starRating` BIGINT NULL,
    `testimonialStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `testimonials_userId_fkey`(`userId`),
    PRIMARY KEY (`testimonialsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `popupBanner` (
    `popupBannerId` BIGINT NOT NULL AUTO_INCREMENT,
    `popupName` VARCHAR(191) NULL,
    `popupDescription` VARCHAR(191) NULL,
    `popupImage` VARCHAR(191) NULL,
    `popupStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`popupBannerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companyInfo` (
    `companyInfoId` BIGINT NOT NULL AUTO_INCREMENT,
    `privacyPolicy` VARCHAR(191) NOT NULL,
    `companyInfo` VARCHAR(191) NULL,
    `companyDescription` VARCHAR(191) NULL,
    `termConditions` VARCHAR(191) NULL,
    `returnPolicy` VARCHAR(191) NULL,
    `shippingPolicy` VARCHAR(191) NULL,
    `companyImage` VARCHAR(191) NULL,
    `companyMission` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`companyInfoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productReview` (
    `productReviewId` BIGINT NOT NULL AUTO_INCREMENT,
    `productId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `rating` BIGINT NOT NULL,
    `review` VARCHAR(191) NULL,
    `productReviewImage` VARCHAR(191) NULL,
    `reviewStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `productReview_productId_fkey`(`productId`),
    INDEX `productReview_userId_fkey`(`userId`),
    PRIMARY KEY (`productReviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderReturn` (
    `orderReturnId` BIGINT NOT NULL AUTO_INCREMENT,
    `orderId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `productId` BIGINT NOT NULL,
    `reason` VARCHAR(191) NULL,
    `returnImage` VARCHAR(191) NULL,
    `returnStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `orderReturn_orderId_fkey`(`orderId`),
    INDEX `orderReturn_productId_fkey`(`productId`),
    INDEX `orderReturn_userId_fkey`(`userId`),
    PRIMARY KEY (`orderReturnId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderCancellation` (
    `orderCancellationId` BIGINT NOT NULL AUTO_INCREMENT,
    `orderId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `productId` BIGINT NOT NULL,
    `adminCancellationReason` VARCHAR(191) NULL,
    `cancellationReason` VARCHAR(191) NULL,
    `cancellationImage` VARCHAR(191) NULL,
    `cancellationStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `orderCancellation_orderId_fkey`(`orderId`),
    INDEX `orderCancellation_productId_fkey`(`productId`),
    INDEX `orderCancellation_userId_fkey`(`userId`),
    PRIMARY KEY (`orderCancellationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletterSubscription` (
    `newsletterSubscriptionId` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `subscriptionStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `newsletterSubscription_email_key`(`email`),
    PRIMARY KEY (`newsletterSubscriptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promoCode` (
    `promoCodeId` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `discountPercentage` DOUBLE NOT NULL,
    `validFrom` DATETIME(3) NOT NULL,
    `validTo` DATETIME(3) NOT NULL,
    `promoStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `promoCode_code_key`(`code`),
    PRIMARY KEY (`promoCodeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shippingDetails` (
    `shippingDetailsId` BIGINT NOT NULL AUTO_INCREMENT,
    `orderId` BIGINT NOT NULL,
    `productId` BIGINT NOT NULL,
    `shippingCourier` VARCHAR(191) NULL,
    `trackingNumber` VARCHAR(191) NULL,
    `shippingDate` DATETIME(3) NULL,
    `shippingRemark` VARCHAR(191) NULL,
    `shippingStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `shippingDetails_orderId_fkey`(`orderId`),
    INDEX `shippingDetails_productId_fkey`(`productId`),
    PRIMARY KEY (`shippingDetailsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deliveryDetails` (
    `deliveryDetailsId` BIGINT NOT NULL AUTO_INCREMENT,
    `orderId` BIGINT NOT NULL,
    `shippingDetailsId` BIGINT NOT NULL,
    `deliveryDate` DATETIME(3) NULL,
    `paymentMode` VARCHAR(191) NULL,
    `transactionId` VARCHAR(191) NULL,
    `trackingNumber` VARCHAR(191) NULL,
    `deliveryStatus` VARCHAR(191) NULL,
    `deliveryRemark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `deliveryDetails_orderId_fkey`(`orderId`),
    INDEX `deliveryDetails_shippingDetailsId_fkey`(`shippingDetailsId`),
    PRIMARY KEY (`deliveryDetailsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentDetails` (
    `paymentDetailsId` BIGINT NOT NULL AUTO_INCREMENT,
    `orderId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `paymentMode` VARCHAR(191) NULL,
    `paymentAmount` DOUBLE NULL,
    `paymentDate` DATETIME(3) NULL,
    `transactionId` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `paymentDetails_orderId_fkey`(`orderId`),
    INDEX `paymentDetails_userId_fkey`(`userId`),
    PRIMARY KEY (`paymentDetailsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry` (
    `inquiryId` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `inquiryStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`inquiryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `productVariant` (
    `variantId` BIGINT NOT NULL AUTO_INCREMENT,
    `pCode` VARCHAR(191) NOT NULL,
    `subGroupName` VARCHAR(191) NOT NULL,
    `variationName` VARCHAR(191) NOT NULL,
    `salesRate` DOUBLE NULL,
    `stockQuantity` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`variantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setShippingCost` (
    `setShippingCostId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `minOrderAmount` DOUBLE NOT NULL,
    `maxOrderAmount` DOUBLE NOT NULL,
    `shippingAdress` VARCHAR(191) NULL,
    `shippingMethod` VARCHAR(191) NULL,
    `shippingCost` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `setShippingCost_userId_fkey`(`userId`),
    PRIMARY KEY (`setShippingCostId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `addressId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `ward` VARCHAR(191) NOT NULL,
    `locality` VARCHAR(191) NULL,
    `zipCode` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `addType` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,

    INDEX `address_userId_fkey`(`userId`),
    PRIMARY KEY (`addressId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auditLog` (
    `auditLogId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `auditLog_userId_fkey`(`userId`),
    PRIMARY KEY (`auditLogId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboProduct` ADD CONSTRAINT `comboProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartList` ADD CONSTRAINT `cartList_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartList` ADD CONSTRAINT `cartList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrders` ADD CONSTRAINT `comboOrders_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct`(`comboProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrders` ADD CONSTRAINT `comboOrders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrderCancellation` ADD CONSTRAINT `comboOrderCancellation_comboOrderId_fkey` FOREIGN KEY (`comboOrderId`) REFERENCES `comboOrders`(`comboOrderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrderCancellation` ADD CONSTRAINT `comboOrderCancellation_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct`(`comboProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrderCancellation` ADD CONSTRAINT `comboOrderCancellation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrderReturn` ADD CONSTRAINT `comboOrderReturn_comboOrderId_fkey` FOREIGN KEY (`comboOrderId`) REFERENCES `comboOrders`(`comboOrderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrderReturn` ADD CONSTRAINT `comboOrderReturn_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct`(`comboProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboOrderReturn` ADD CONSTRAINT `comboOrderReturn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productReview` ADD CONSTRAINT `productReview_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productReview` ADD CONSTRAINT `productReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderReturn` ADD CONSTRAINT `orderReturn_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderReturn` ADD CONSTRAINT `orderReturn_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderReturn` ADD CONSTRAINT `orderReturn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderCancellation` ADD CONSTRAINT `orderCancellation_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderCancellation` ADD CONSTRAINT `orderCancellation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderCancellation` ADD CONSTRAINT `orderCancellation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shippingDetails` ADD CONSTRAINT `shippingDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shippingDetails` ADD CONSTRAINT `shippingDetails_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deliveryDetails` ADD CONSTRAINT `deliveryDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deliveryDetails` ADD CONSTRAINT `deliveryDetails_shippingDetailsId_fkey` FOREIGN KEY (`shippingDetailsId`) REFERENCES `shippingDetails`(`shippingDetailsId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paymentDetails` ADD CONSTRAINT `paymentDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paymentDetails` ADD CONSTRAINT `paymentDetails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct`(`comboProductId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `setShippingCost` ADD CONSTRAINT `setShippingCost_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auditLog` ADD CONSTRAINT `auditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
