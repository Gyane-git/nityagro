-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 14, 2026 at 08:24 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nityagro_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `addressId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `province` varchar(191) NOT NULL,
  `district` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `ward` varchar(191) NOT NULL,
  `locality` varchar(191) DEFAULT NULL,
  `zipCode` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `addType` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `fullName` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`addressId`, `userId`, `province`, `district`, `city`, `ward`, `locality`, `zipCode`, `createdAt`, `updatedAt`, `addType`, `email`, `fullName`, `phone`) VALUES
(1, 1, 'Lumbini Province', 'Rupandehi', 'Lumbini Sanskritik', '09', 'naxal', NULL, '2026-06-08 06:59:09.129', '2026-06-08 06:59:09.129', 'Home', 'jrerif@gmail.com', 'Gyanendra Shah', '9821212332');

-- --------------------------------------------------------

--
-- Table structure for table `auditLog`
--

CREATE TABLE `auditLog` (
  `auditLogId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `action` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `authOtp`
--

CREATE TABLE `authOtp` (
  `authOtpId` bigint(20) NOT NULL,
  `email` varchar(191) NOT NULL,
  `purpose` varchar(191) NOT NULL,
  `codeHash` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `consumed` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `bannerId` bigint(20) NOT NULL,
  `bannerName` varchar(191) NOT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `bannerDescription` varchar(191) DEFAULT NULL,
  `bannerImageforWeb` varchar(191) DEFAULT NULL,
  `bannerImageforMobile` varchar(191) DEFAULT NULL,
  `cardImage` varchar(191) DEFAULT NULL,
  `bannerStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`bannerId`, `bannerName`, `slug`, `bannerDescription`, `bannerImageforWeb`, `bannerImageforMobile`, `cardImage`, `bannerStatus`, `createdAt`, `updatedAt`) VALUES
(1, 'dnx', NULL, 'dxn', '/banners/web-images-1783512256903-pasc3o.jpg', NULL, NULL, 1, '2026-07-08 12:04:16.906', '2026-07-08 12:04:16.906');

-- --------------------------------------------------------

--
-- Table structure for table `cartList`
--

CREATE TABLE `cartList` (
  `cartId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `quantity` bigint(20) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryId` bigint(20) NOT NULL,
  `categoryName` varchar(191) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `categoryDescription` varchar(191) DEFAULT NULL,
  `categoryImage` varchar(191) DEFAULT NULL,
  `categoryLogo` varchar(191) DEFAULT NULL,
  `categoryBanner` varchar(191) DEFAULT NULL,
  `categoryStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryId`, `categoryName`, `userId`, `slug`, `categoryDescription`, `categoryImage`, `categoryLogo`, `categoryBanner`, `categoryStatus`, `createdAt`, `updatedAt`) VALUES
(3, 'DALIYA', 1, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-08 06:52:52.878', '2026-06-08 06:53:01.182'),
(4, 'STONEPRESS FLOUR', 1, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-08 06:52:52.882', '2026-06-08 06:53:07.339'),
(5, 'WOODPRESS OIL', 1, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-08 06:52:52.884', '2026-06-08 06:53:12.493'),
(6, 'STONEPRESS SPICES', 1, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-08 06:52:52.885', '2026-06-08 06:53:19.452'),
(7, 'SATTU', 1, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-08 06:52:52.886', '2026-06-08 06:53:24.770');

-- --------------------------------------------------------

--
-- Table structure for table `comboOrderCancellation`
--

CREATE TABLE `comboOrderCancellation` (
  `comboOrderCancellationId` bigint(20) NOT NULL,
  `comboOrderId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `comboProductId` bigint(20) NOT NULL,
  `comboName` varchar(191) DEFAULT NULL,
  `comboItems` varchar(191) DEFAULT NULL,
  `cancellationReason` varchar(191) DEFAULT NULL,
  `adminCancellationReason` varchar(191) DEFAULT NULL,
  `cancellationStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comboOrderReturn`
--

CREATE TABLE `comboOrderReturn` (
  `comboOrderReturnId` bigint(20) NOT NULL,
  `comboOrderId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `comboProductId` bigint(20) NOT NULL,
  `comboName` varchar(191) DEFAULT NULL,
  `comboItems` varchar(191) DEFAULT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `returnImage` varchar(191) DEFAULT NULL,
  `returnStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comboOrders`
--

CREATE TABLE `comboOrders` (
  `comboOrderId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `comboProductId` bigint(20) NOT NULL,
  `quantity` bigint(20) NOT NULL DEFAULT 1,
  `unitPrice` double NOT NULL DEFAULT 0,
  `productTotal` double NOT NULL DEFAULT 0,
  `deliveryCharge` double NOT NULL DEFAULT 0,
  `totalAmount` double NOT NULL,
  `orderStatus` varchar(191) DEFAULT NULL,
  `paymentStatus` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comboOrders`
--

INSERT INTO `comboOrders` (`comboOrderId`, `userId`, `comboProductId`, `quantity`, `unitPrice`, `productTotal`, `deliveryCharge`, `totalAmount`, `orderStatus`, `paymentStatus`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 3280, 3280, 0, 3280, 'PLACED', 'PENDING', '2026-06-08 07:12:07.778', '2026-06-08 07:12:07.778'),
(2, 1, 1, 1, 3280, 3280, 0, 3280, 'PLACED', 'PENDING', '2026-06-08 07:42:38.295', '2026-06-08 07:42:38.295');

-- --------------------------------------------------------

--
-- Table structure for table `comboProduct`
--

CREATE TABLE `comboProduct` (
  `comboProductId` bigint(20) NOT NULL,
  `comboCode` varchar(191) NOT NULL,
  `comboName` varchar(191) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `productCodes` longtext NOT NULL,
  `productPrices` double NOT NULL,
  `comboPrice` double NOT NULL,
  `discount` double DEFAULT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `comboDescription` longtext DEFAULT NULL,
  `comboStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comboProduct`
--

INSERT INTO `comboProduct` (`comboProductId`, `comboCode`, `comboName`, `productId`, `productCodes`, `productPrices`, `comboPrice`, `discount`, `slug`, `comboDescription`, `comboStatus`, `createdAt`, `updatedAt`) VALUES
(1, 'C83679278', 'Combo1', 3, '1,9', 3280, 3280, 50, NULL, 'WOODPRESS BLACK MUSTARD OIL\r\n\r\nMade from carefully selected black mustard seeds using the traditional wood-pressed (cold-pressed) extraction method. This process helps retain the oil\'s natural aroma, flavor, and nutrients. It is suitable for everyday cooking, pickling, sautéing, and traditional recipes.\r\n\r\nKey Features\r\n\r\n100% Wood-Pressed Black Mustard Oil\r\nNo Artificial Colors or Flavors\r\nNo Added Preservatives\r\nRich Natural Aroma\r\nTraditionally Extracted\r\nSuitable for Daily Cooking', 1, '2026-06-08 07:10:10.548', '2026-06-08 07:10:56.183');

-- --------------------------------------------------------

--
-- Table structure for table `companyInfo`
--

CREATE TABLE `companyInfo` (
  `companyInfoId` bigint(20) NOT NULL,
  `privacyPolicy` varchar(191) NOT NULL,
  `companyInfo` varchar(191) DEFAULT NULL,
  `companyDescription` varchar(191) DEFAULT NULL,
  `termConditions` varchar(191) DEFAULT NULL,
  `returnPolicy` varchar(191) DEFAULT NULL,
  `shippingPolicy` varchar(191) DEFAULT NULL,
  `companyImage` varchar(191) DEFAULT NULL,
  `companyMission` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contactSettings`
--

CREATE TABLE `contactSettings` (
  `id` bigint(20) NOT NULL,
  `customerName` varchar(191) NOT NULL,
  `customerEmail` varchar(191) DEFAULT NULL,
  `customerMessage` varchar(191) DEFAULT NULL,
  `customerPhone` varchar(191) DEFAULT NULL,
  `mapUrl` varchar(191) DEFAULT NULL,
  `whatsappNumber` varchar(191) DEFAULT NULL,
  `companyAddress` varchar(191) DEFAULT NULL,
  `companyEmail` varchar(191) DEFAULT NULL,
  `companyPhone` varchar(191) DEFAULT NULL,
  `facebookUrl` varchar(191) DEFAULT NULL,
  `twitterUrl` varchar(191) DEFAULT NULL,
  `instagramUrl` varchar(191) DEFAULT NULL,
  `tikTokUrl` varchar(191) DEFAULT NULL,
  `contactStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deliveryDetails`
--

CREATE TABLE `deliveryDetails` (
  `deliveryDetailsId` bigint(20) NOT NULL,
  `orderId` bigint(20) NOT NULL,
  `shippingDetailsId` bigint(20) NOT NULL,
  `deliveryDate` datetime(3) DEFAULT NULL,
  `paymentMode` varchar(191) DEFAULT NULL,
  `transactionId` varchar(191) DEFAULT NULL,
  `trackingNumber` varchar(191) DEFAULT NULL,
  `deliveryStatus` varchar(191) DEFAULT NULL,
  `deliveryRemark` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deliveryDetails`
--

INSERT INTO `deliveryDetails` (`deliveryDetailsId`, `orderId`, `shippingDetailsId`, `deliveryDate`, `paymentMode`, `transactionId`, `trackingNumber`, `deliveryStatus`, `deliveryRemark`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, NULL, 'COD', 'COD-1780901968383', NULL, 'PENDING', 'Order placed. Awaiting dispatch.', '2026-06-08 06:59:28.390', '2026-06-08 06:59:28.390'),
(2, 2, 2, NULL, 'COD', 'COD-1780984033816', NULL, 'PENDING', 'Order placed. Awaiting dispatch.', '2026-06-09 05:47:13.822', '2026-06-09 05:47:13.822'),
(3, 3, 3, NULL, 'COD', 'COD-1780984069394', NULL, 'PENDING', 'Order placed. Awaiting dispatch.', '2026-06-09 05:47:49.403', '2026-06-09 05:47:49.403'),
(4, 4, 4, NULL, 'COD', 'COD-1780984135866', NULL, 'PENDING', 'Order placed. Awaiting dispatch.', '2026-06-09 05:48:55.875', '2026-06-09 05:48:55.875'),
(5, 5, 5, NULL, 'COD', 'COD-1780995378736', NULL, 'PENDING', 'Order placed. Awaiting dispatch.', '2026-06-09 08:56:18.746', '2026-06-09 08:56:18.746'),
(6, 6, 6, NULL, 'CONNECTIPS', 'NGTXN1781000616123', NULL, 'PENDING', 'Order paid via ConnectIPS. Awaiting dispatch.', '2026-06-09 10:23:56.759', '2026-06-09 10:23:56.759'),
(7, 7, 7, NULL, 'CONNECTIPS', 'NG1781007235755', NULL, 'PENDING', 'Order paid via ConnectIPS. Awaiting dispatch.', '2026-06-09 12:18:01.381', '2026-06-09 12:18:01.381');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `faqsId` bigint(20) NOT NULL,
  `question` text NOT NULL,
  `answer` text DEFAULT NULL,
  `faqSection` varchar(191) NOT NULL DEFAULT 'products-quality',
  `showOnHome` tinyint(1) NOT NULL DEFAULT 0,
  `sortOrder` bigint(20) NOT NULL DEFAULT 0,
  `faqStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inquiry`
--

CREATE TABLE `inquiry` (
  `inquiryId` bigint(20) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `message` varchar(191) DEFAULT NULL,
  `inquiryStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newsletterSubscription`
--

CREATE TABLE `newsletterSubscription` (
  `newsletterSubscriptionId` bigint(20) NOT NULL,
  `email` varchar(191) NOT NULL,
  `subscriptionStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `omsOrderSyncLog`
--

CREATE TABLE `omsOrderSyncLog` (
  `omsOrderSyncLogId` bigint(20) NOT NULL,
  `orderType` varchar(191) NOT NULL,
  `localOrderIds` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `attempts` int(11) NOT NULL DEFAULT 0,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payload`)),
  `response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`response`)),
  `errorMessage` text DEFAULT NULL,
  `lastTriedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `omsOrderSyncLog`
--

INSERT INTO `omsOrderSyncLog` (`omsOrderSyncLogId`, `orderType`, `localOrderIds`, `status`, `attempts`, `payload`, `response`, `errorMessage`, `lastTriedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'ORDER', '1', 'SUCCESS', 1, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"1\",\"SalesCenter\":\"\",\"orderId\":\"1\",\"Updated\":\"2026-06-08T06:59:28.394Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"0\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"COD\",\"Order\":[{\"sku\":\"9\",\"quantity\":\"1\",\"unitPrice\":\"2700\",\"finalPrice\":\"2700\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-08T06:59:28.394Z\"}}', '{\"message\":\"Order placed successfull\",\"status\":\"success\",\"timestamp\":\"6/8/2026 12:44:32 PM\",\"orderNumber\":\"SO-0001-2082/83\"}', NULL, '2026-06-08 06:59:28.394', '2026-06-08 06:59:32.855', '2026-06-08 06:59:32.855'),
(2, 'COMBO_ORDER', '1', 'FAILED', 2, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"1\",\"SalesCenter\":\"\",\"orderId\":\"1\",\"Updated\":\"2026-06-08T07:12:07.789Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"0\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"COD\",\"Order\":[{\"sku\":\"1\",\"quantity\":\"1\",\"unitPrice\":\"630\",\"finalPrice\":\"630\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"},{\"sku\":\"9\",\"quantity\":\"1\",\"unitPrice\":\"2700\",\"finalPrice\":\"2700\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-08T07:12:07.789Z\"}}', NULL, 'OMS placeEcomOrder failed (300): {\"message\":\" Duplicate order number.\",\"status\":\"failed\",\"timestamp\":\"6/8/2026 12:57:08 PM\",\"orderNumber\":\"\"}', '2026-06-08 07:12:07.789', '2026-06-08 07:12:08.498', '2026-06-08 07:12:08.498'),
(3, 'COMBO_ORDER', '2', 'SUCCESS', 1, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"2\",\"SalesCenter\":\"\",\"orderId\":\"2\",\"Updated\":\"2026-06-08T07:42:38.302Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"0\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"COD\",\"Order\":[{\"sku\":\"1\",\"quantity\":\"1\",\"unitPrice\":\"630\",\"finalPrice\":\"630\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"},{\"sku\":\"9\",\"quantity\":\"1\",\"unitPrice\":\"2700\",\"finalPrice\":\"2700\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-08T07:42:38.302Z\"}}', '{\"message\":\"Order placed successfull\",\"status\":\"success\",\"timestamp\":\"6/8/2026 1:27:42 PM\",\"orderNumber\":\"SO-0002-2082/83\"}', NULL, '2026-06-08 07:42:38.302', '2026-06-08 07:42:42.613', '2026-06-08 07:42:42.613'),
(4, 'ORDER', '2', 'FAILED', 2, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"2\",\"SalesCenter\":\"\",\"orderId\":\"2\",\"Updated\":\"2026-06-09T05:47:13.823Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"0\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"COD\",\"Order\":[{\"sku\":\"1\",\"quantity\":\"2\",\"unitPrice\":\"630\",\"finalPrice\":\"1260\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-09T05:47:13.823Z\"}}', NULL, 'OMS placeEcomOrder failed (300): {\"message\":\" Duplicate order number.\",\"status\":\"failed\",\"timestamp\":\"6/9/2026 11:32:14 AM\",\"orderNumber\":\"\"}', '2026-06-09 05:47:13.823', '2026-06-09 05:47:14.335', '2026-06-09 05:47:14.335'),
(5, 'ORDER', '3', 'SUCCESS', 1, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"3\",\"SalesCenter\":\"\",\"orderId\":\"3\",\"Updated\":\"2026-06-09T05:47:49.408Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"0\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"COD\",\"Order\":[{\"sku\":\"1\",\"quantity\":\"2\",\"unitPrice\":\"630\",\"finalPrice\":\"1260\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-09T05:47:49.408Z\"}}', '{\"message\":\"Order placed successfull\",\"status\":\"success\",\"timestamp\":\"6/9/2026 11:32:53 AM\",\"orderNumber\":\"SO-0006-2082/83\"}', NULL, '2026-06-09 05:47:49.408', '2026-06-09 05:47:53.665', '2026-06-09 05:47:53.665'),
(6, 'ORDER', '4', 'SUCCESS', 1, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"4\",\"SalesCenter\":\"\",\"orderId\":\"4\",\"Updated\":\"2026-06-09T05:48:55.880Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"0\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"COD\",\"Order\":[{\"sku\":\"1\",\"quantity\":\"2\",\"unitPrice\":\"630\",\"finalPrice\":\"1260\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-09T05:48:55.880Z\"}}', '{\"message\":\"Order placed successfull\",\"status\":\"success\",\"timestamp\":\"6/9/2026 11:34:00 AM\",\"orderNumber\":\"SO-0007-2082/83\"}', NULL, '2026-06-09 05:48:55.880', '2026-06-09 05:49:00.123', '2026-06-09 05:49:00.123'),
(7, 'ORDER', '5', 'SUCCESS', 1, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"5\",\"SalesCenter\":\"\",\"orderId\":\"5\",\"Updated\":\"2026-06-09T08:56:18.749Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"0\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"COD\",\"Order\":[{\"sku\":\"1\",\"quantity\":\"1\",\"unitPrice\":\"630\",\"finalPrice\":\"630\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-09T08:56:18.749Z\"}}', '{\"message\":\"Order placed successfull\",\"status\":\"success\",\"timestamp\":\"6/9/2026 2:41:22 PM\",\"orderNumber\":\"SO-0008-2082/83\"}', NULL, '2026-06-09 08:56:18.749', '2026-06-09 08:56:22.944', '2026-06-09 08:56:22.944'),
(8, 'ORDER', '6', 'FAILED', 2, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"6\",\"SalesCenter\":\"\",\"orderId\":\"6\",\"Updated\":\"2026-06-09T10:23:56.762Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"11\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"CONNECTIPS\",\"Order\":[{\"sku\":\"2\",\"quantity\":\"1\",\"unitPrice\":\"11\",\"finalPrice\":\"11\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-09T10:23:56.762Z\"}}', NULL, 'OMS placeEcomOrder failed (500): {\"message\":\"Error placing order\",\"status\":\"failed\",\"timestamp\":\"6/9/2026 4:08:57 PM\",\"orderNumber\":\"\"}', '2026-06-09 10:23:56.762', '2026-06-09 10:23:57.532', '2026-06-09 10:23:57.532'),
(9, 'ORDER', '7', 'FAILED', 2, '{\"storeCode\":\"NITYAM8201\",\"orderNumber\":\"7\",\"SalesCenter\":\"\",\"orderId\":\"7\",\"Updated\":\"2026-06-09T12:18:01.387Z\",\"remarks\":\"Website Order\",\"membercode\":\"1\",\"membername\":\"Gyanendra Shah\",\"membermobile\":\"9821212332\",\"PaymentAmount\":\"11\",\"CustomerName\":\"Gyanendra Shah\",\"Cashbankname\":\"CONNECTIPS\",\"Order\":[{\"sku\":\"2\",\"quantity\":\"1\",\"unitPrice\":\"11\",\"finalPrice\":\"11\",\"remarks\":\"Website Order\",\"DiscountAmount\":\"0\",\"Discountrate\":\"0\",\"DispatchAmount\":\"0\"}],\"userDetails\":{\"userName\":\"Gyanendra Shah\",\"userCode\":\"1\",\"phone\":\"9821212332\",\"deliveryTime\":\"2026-06-09T12:18:01.387Z\"}}', NULL, 'OMS placeEcomOrder failed (300): {\"message\":\" Duplicate order number.\",\"status\":\"failed\",\"timestamp\":\"6/9/2026 6:03:01 PM\",\"orderNumber\":\"\"}', '2026-06-09 12:18:01.387', '2026-06-09 12:18:01.890', '2026-06-09 12:18:01.890');

-- --------------------------------------------------------

--
-- Table structure for table `orderCancellation`
--

CREATE TABLE `orderCancellation` (
  `orderCancellationId` bigint(20) NOT NULL,
  `orderId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `adminCancellationReason` varchar(191) DEFAULT NULL,
  `cancellationReason` varchar(191) DEFAULT NULL,
  `cancellationImage` varchar(191) DEFAULT NULL,
  `cancellationStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderReturn`
--

CREATE TABLE `orderReturn` (
  `orderReturnId` bigint(20) NOT NULL,
  `orderId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `returnImage` varchar(191) DEFAULT NULL,
  `returnStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `quantity` bigint(20) NOT NULL DEFAULT 1,
  `unitPrice` double NOT NULL DEFAULT 0,
  `productTotal` double NOT NULL DEFAULT 0,
  `deliveryCharge` double NOT NULL DEFAULT 0,
  `totalAmount` double NOT NULL,
  `orderStatus` varchar(191) DEFAULT NULL,
  `paymentStatus` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderId`, `userId`, `productId`, `quantity`, `unitPrice`, `productTotal`, `deliveryCharge`, `totalAmount`, `orderStatus`, `paymentStatus`, `createdAt`, `updatedAt`) VALUES
(1, 1, 11, 1, 2700, 2700, 0, 2700, 'PLACED', 'PENDING', '2026-06-08 06:59:28.385', '2026-06-08 06:59:28.385'),
(2, 1, 3, 2, 630, 1260, 0, 1260, 'PLACED', 'PENDING', '2026-06-09 05:47:13.818', '2026-06-09 05:47:13.818'),
(3, 1, 3, 2, 630, 1260, 0, 1260, 'PLACED', 'PENDING', '2026-06-09 05:47:49.396', '2026-06-09 05:47:49.396'),
(4, 1, 3, 2, 630, 1260, 0, 1260, 'PLACED', 'PENDING', '2026-06-09 05:48:55.868', '2026-06-09 05:48:55.868'),
(5, 1, 3, 1, 630, 630, 0, 630, 'PLACED', 'PENDING', '2026-06-09 08:56:18.738', '2026-06-09 08:56:18.738'),
(6, 1, 4, 1, 11, 11, 0, 11, 'PLACED', 'PAID', '2026-06-09 10:23:56.751', '2026-06-09 10:23:56.751'),
(7, 1, 4, 1, 11, 11, 0, 11, 'PLACED', 'PAID', '2026-06-09 12:18:01.371', '2026-06-09 12:18:01.371');

-- --------------------------------------------------------

--
-- Table structure for table `paymentDetails`
--

CREATE TABLE `paymentDetails` (
  `paymentDetailsId` bigint(20) NOT NULL,
  `orderId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `paymentMode` varchar(191) DEFAULT NULL,
  `paymentAmount` double DEFAULT NULL,
  `paymentDate` datetime(3) DEFAULT NULL,
  `transactionId` varchar(191) DEFAULT NULL,
  `paymentStatus` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `paymentDetails`
--

INSERT INTO `paymentDetails` (`paymentDetailsId`, `orderId`, `userId`, `paymentMode`, `paymentAmount`, `paymentDate`, `transactionId`, `paymentStatus`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'COD', 2700, '2026-06-08 06:59:28.383', 'COD-1780901968383', 'PENDING', '2026-06-08 06:59:28.387', '2026-06-08 06:59:28.387'),
(2, 2, 1, 'COD', 1260, '2026-06-09 05:47:13.816', 'COD-1780984033816', 'PENDING', '2026-06-09 05:47:13.819', '2026-06-09 05:47:13.819'),
(3, 3, 1, 'COD', 1260, '2026-06-09 05:47:49.394', 'COD-1780984069394', 'PENDING', '2026-06-09 05:47:49.399', '2026-06-09 05:47:49.399'),
(4, 4, 1, 'COD', 1260, '2026-06-09 05:48:55.866', 'COD-1780984135866', 'PENDING', '2026-06-09 05:48:55.871', '2026-06-09 05:48:55.871'),
(5, 5, 1, 'COD', 630, '2026-06-09 08:56:18.736', 'COD-1780995378736', 'PENDING', '2026-06-09 08:56:18.743', '2026-06-09 08:56:18.743'),
(6, 6, 1, 'CONNECTIPS', 11, '2026-06-09 10:23:56.748', 'NGTXN1781000616123', 'PAID', '2026-06-09 10:23:56.756', '2026-06-09 10:23:56.756'),
(7, 7, 1, 'CONNECTIPS', 11, '2026-06-09 12:18:01.369', 'NG1781007235755', 'PAID', '2026-06-09 12:18:01.376', '2026-06-09 12:18:01.376');

-- --------------------------------------------------------

--
-- Table structure for table `popupBanner`
--

CREATE TABLE `popupBanner` (
  `popupBannerId` bigint(20) NOT NULL,
  `popupName` varchar(191) DEFAULT NULL,
  `popupDescription` varchar(191) DEFAULT NULL,
  `popupImage` varchar(191) DEFAULT NULL,
  `popupStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ProductImage`
--

CREATE TABLE `ProductImage` (
  `productImageId` bigint(20) NOT NULL,
  `productId` bigint(20) DEFAULT NULL,
  `comboProductId` bigint(20) DEFAULT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `isMain` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ProductImage`
--

INSERT INTO `ProductImage` (`productImageId`, `productId`, `comboProductId`, `imageUrl`, `isMain`, `createdAt`, `updatedAt`) VALUES
(1, 3, NULL, '/uploads/products/gallery-c8a8a04c7d1ca2d92549732cf1ad4277f3a55c5f-1-1780901710495-ik6lfh.png', 0, '2026-06-08 06:55:10.499', '2026-06-08 06:55:10.499'),
(2, 3, NULL, '/uploads/products/gallery-86ac5ac385f0c733fc52ab7c92304f40c205d512-1780901710496-153ri0.png', 0, '2026-06-08 06:55:10.499', '2026-06-08 06:55:10.499'),
(3, 3, NULL, '/uploads/products/gallery-384a7fe56a24d56ac28be156b4ef2601172c40cc-1780901710497-ijob5z.png', 0, '2026-06-08 06:55:10.499', '2026-06-08 06:55:10.499'),
(4, NULL, 1, '/uploads/combos/main-b2-1780902610552-vintjl.png', 1, '2026-06-08 07:10:10.559', '2026-06-08 07:10:10.559'),
(5, NULL, 1, '/uploads/combos/gallery-b1-1780902610554-1w4il3.png', 0, '2026-06-08 07:10:10.559', '2026-06-08 07:10:10.559'),
(6, NULL, 1, '/uploads/combos/gallery-b2-1780902610557-kki94a.png', 0, '2026-06-08 07:10:10.559', '2026-06-08 07:10:10.559'),
(7, NULL, 1, '/uploads/combos/gallery-384a7fe56a24d56ac28be156b4ef2601172c40cc-1780902610558-fgi18q.png', 0, '2026-06-08 07:10:10.559', '2026-06-08 07:10:10.559');

-- --------------------------------------------------------

--
-- Table structure for table `productReview`
--

CREATE TABLE `productReview` (
  `productReviewId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `rating` bigint(20) NOT NULL,
  `review` varchar(191) DEFAULT NULL,
  `productReviewImage` varchar(191) DEFAULT NULL,
  `reviewStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productId` bigint(20) NOT NULL,
  `productCode` varchar(191) NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `productName` varchar(191) NOT NULL,
  `subGroupName` varchar(191) DEFAULT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `productVariation` varchar(191) DEFAULT NULL,
  `productDescription` longtext DEFAULT NULL,
  `nutritionInfo` longtext DEFAULT NULL,
  `cookingInstruction` longtext DEFAULT NULL,
  `storageInstruction` longtext DEFAULT NULL,
  `pImage` varchar(191) DEFAULT NULL,
  `productStatus` tinyint(1) NOT NULL DEFAULT 1,
  `actualPrice` double NOT NULL,
  `sellingPrice` double NOT NULL,
  `deliveryTargetDays` bigint(20) DEFAULT NULL,
  `stockQuantity` bigint(20) DEFAULT NULL,
  `availableQuantity` bigint(20) DEFAULT NULL,
  `flashSale` tinyint(1) NOT NULL DEFAULT 0,
  `specialOffer` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productId`, `productCode`, `categoryId`, `userId`, `productName`, `subGroupName`, `slug`, `productVariation`, `productDescription`, `nutritionInfo`, `cookingInstruction`, `storageInstruction`, `pImage`, `productStatus`, `actualPrice`, `sellingPrice`, `deliveryTargetDays`, `stockQuantity`, `availableQuantity`, `flashSale`, `specialOffer`, `createdAt`, `updatedAt`) VALUES
(3, '1', 'WOODPRESS OIL', 1, '1LTR WOODPRESS BLACK MUSTARD OIL', 'WOODPRESS BLACK MUSTARD OIL', NULL, NULL, 'WOODPRESS BLACK MUSTARD OIL\r\n\r\nMade from carefully selected black mustard seeds using the traditional wood-pressed (cold-pressed) extraction method. This process helps retain the oil\'s natural aroma, flavor, and nutrients. It is suitable for everyday cooking, pickling, sautéing, and traditional recipes.\r\n\r\nKey Features\r\n\r\n100% Wood-Pressed Black Mustard Oil\r\nNo Artificial Colors or Flavors\r\nNo Added Preservatives\r\nRich Natural Aroma\r\nTraditionally Extracted\r\nSuitable for Daily Cooking', 'WOODPRESS BLACK MUSTARD OIL\r\n\r\nMade from carefully selected black mustard seeds using the traditional wood-pressed (cold-pressed) extraction method. This process helps retain the oil\'s natural aroma, flavor, and nutrients. It is suitable for everyday cooking, pickling, sautéing, and traditional recipes.\r\n\r\nKey Features\r\n\r\n100% Wood-Pressed Black Mustard Oil\r\nNo Artificial Colors or Flavors\r\nNo Added Preservatives\r\nRich Natural Aroma\r\nTraditionally Extracted\r\nSuitable for Daily Cooking', 'WOODPRESS BLACK MUSTARD OIL\r\n\r\nMade from carefully selected black mustard seeds using the traditional wood-pressed (cold-pressed) extraction method. This process helps retain the oil\'s natural aroma, flavor, and nutrients. It is suitable for everyday cooking, pickling, sautéing, and traditional recipes.\r\n\r\nKey Features\r\n\r\n100% Wood-Pressed Black Mustard Oil\r\nNo Artificial Colors or Flavors\r\nNo Added Preservatives\r\nRich Natural Aroma\r\nTraditionally Extracted\r\nSuitable for Daily Cooking', 'WOODPRESS BLACK MUSTARD OIL\r\n\r\nMade from carefully selected black mustard seeds using the traditional wood-pressed (cold-pressed) extraction method. This process helps retain the oil\'s natural aroma, flavor, and nutrients. It is suitable for everyday cooking, pickling, sautéing, and traditional recipes.\r\n\r\nKey Features\r\n\r\n100% Wood-Pressed Black Mustard Oil\r\nNo Artificial Colors or Flavors\r\nNo Added Preservatives\r\nRich Natural Aroma\r\nTraditionally Extracted\r\nSuitable for Daily Cooking', '/uploads/products/main-384a7fe56a24d56ac28be156b4ef2601172c40cc-1780901710486-mczq0m.png', 1, 700, 630, 2, 65, 65, 0, 1, '2026-06-08 06:52:52.899', '2026-07-20 11:02:53.679'),
(4, '2', 'WOODPRESS OIL', 1, '1LTR WOODPRESS YELLOW MUSTARD OIL', 'WOODPRESS YELLOW MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 5, 11, 2, 78, 78, 0, 0, '2026-06-08 06:52:52.901', '2026-07-20 11:02:53.679'),
(5, '3', 'WOODPRESS OIL', 1, '1LTR WOODPRESS PEANUT OIL', 'WOODPRESS PEANUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 950, 855, NULL, 82, 82, 0, 0, '2026-06-08 06:52:52.902', '2026-07-20 11:02:53.679'),
(6, '4', 'WOODPRESS OIL', 1, '1LTR WOODPRESS SESAME OIL', 'WOODPRESS SESAME OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1100, 990, NULL, 84, 84, 0, 0, '2026-06-08 06:52:52.904', '2026-07-20 11:02:53.679'),
(7, '5', 'WOODPRESS OIL', 1, '1LTR WOODPRESS COCONUT OIL', 'WOODPRESS COCONUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 2500, 2250, NULL, 88, 88, 0, 0, '2026-06-08 06:52:52.905', '2026-07-20 11:02:53.680'),
(8, '6', 'WOODPRESS OIL', 1, '300ML WOODPRESS COCONUT OIL', 'WOODPRESS COCONUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 700, 630, NULL, 90, 90, 0, 0, '2026-06-08 06:52:52.907', '2026-06-28 04:45:30.297'),
(9, '7', 'WOODPRESS OIL', 1, '200ML WOODPRESS COCONUT OIL', 'WOODPRESS COCONUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 500, 450, NULL, 92, 92, 0, 0, '2026-06-08 06:52:52.908', '2026-06-28 04:45:30.298'),
(10, '8', 'WOODPRESS OIL', 1, '1LTR COLDPRESS BLACK MUSTARD OIL', 'COLDPRESS BLACK MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 600, 540, NULL, 92, 92, 0, 0, '2026-06-08 06:52:52.909', '2026-07-20 11:02:53.681'),
(11, '9', 'WOODPRESS OIL', 1, '5LTR WOODPRESS BLACK MUSTARD OIL', 'WOODPRESS BLACK MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 3000, 2700, 2, 92, 92, 0, 1, '2026-06-08 06:52:52.910', '2026-07-20 10:44:17.378'),
(12, '10', 'WOODPRESS OIL', 1, '5LTR WOODPRESS YELLOW MUSTARD OIL', 'WOODPRESS YELLOW MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 3500, 3150, 2, 97, 97, 0, 0, '2026-06-08 06:52:52.912', '2026-08-14 04:37:31.606'),
(13, '11', 'WOODPRESS OIL', 1, '5LTR WOODPRESS PEANUT OIL', 'WOODPRESS PEANUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 4000, 3600, NULL, 100, 100, 0, 0, '2026-06-08 06:52:52.913', '2026-06-28 04:45:30.304'),
(14, '12', 'WOODPRESS OIL', 1, '5LTR COLDPRESS BLACK MUSTARD OIL', 'COLDPRESS BLACK MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 2500, 2250, NULL, 102, 102, 0, 0, '2026-06-08 06:52:52.914', '2026-06-28 04:45:30.306'),
(15, '13', 'STONEPRESS FLOUR', 1, '1KG STONEPRESS KODO FLOUR', 'STONEPRESS KODO FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 180, NULL, 104, 104, 0, 0, '2026-06-08 06:52:52.916', '2026-07-20 11:02:53.681'),
(16, '14', 'STONEPRESS FLOUR', 1, '1KG STONEPRESS BAJRA FLOUR', 'STONEPRESS BAJRA FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 180, NULL, 105, 105, 0, 0, '2026-06-08 06:52:52.917', '2026-07-20 11:02:53.681'),
(17, '15', 'STONEPRESS FLOUR', 1, '1KG STONEPRESS FAFER FLOUR', 'STONEPRESS FAFER FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 250, 225, NULL, 108, 108, 0, 0, '2026-06-08 06:52:52.918', '2026-07-20 11:02:53.681'),
(18, '16', 'STONEPRESS FLOUR', 1, '1KG STONEPRESS JAU FLOUR', 'STONEPRESS JAU FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 250, 225, NULL, 110, 110, 0, 0, '2026-06-08 06:52:52.919', '2026-07-20 11:02:53.681'),
(19, '17', 'STONEPRESS FLOUR', 1, '1KG STONEPRESS JOWAR FLOUR', 'STONEPRESS JOWAR FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 250, 225, NULL, 112, 112, 0, 0, '2026-06-08 06:52:52.920', '2026-07-20 11:02:53.681'),
(20, '18', 'STONEPRESS FLOUR', 1, '1KG STONEPRESS MAKAI FLOUR', 'STONEPRESS MAKAI FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 150, 135, NULL, 114, 114, 0, 0, '2026-06-08 06:52:52.921', '2026-07-20 11:02:53.681'),
(21, '19', 'STONEPRESS FLOUR', 1, '1KG STONEPRESS BESAN FLOUR', 'STONEPRESS BESAN FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 250, 225, NULL, 114, 114, 0, 0, '2026-06-08 06:52:52.923', '2026-07-20 11:02:53.681'),
(22, '20', 'STONEPRESS SPICES', 1, '400GMS STONEPRESS RED CHILLI POWDER', 'STONEPRESS RED CHILLI  POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 520, 468, NULL, 118, 118, 0, 0, '2026-06-08 06:52:52.924', '2026-07-20 11:02:53.681'),
(23, '21', 'STONEPRESS SPICES', 1, '400GMS STONEPRESS TURMERIC POWDER', 'STONEPRESS TURMERIC  POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 470, 423, NULL, 120, 120, 0, 0, '2026-06-08 06:52:52.925', '2026-07-20 11:02:53.681'),
(24, '22', 'STONEPRESS SPICES', 1, '400GMS STONEPRESS CORIANDER POWDER', 'STONEPRESS CORIANDER  POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 340, 306, NULL, 121, 121, 0, 0, '2026-06-08 06:52:52.926', '2026-07-20 11:02:53.681'),
(25, '23', 'STONEPRESS SPICES', 1, '500GMS JAGGERY POWDER', 'JAGGERY POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 275, 247.5, NULL, 124, 124, 0, 0, '2026-06-08 06:52:52.927', '2026-07-20 11:02:53.682'),
(26, '24', 'DALIYA', 1, '1KG DALIYA WHITE MAKAI', 'DALIYA WHITE MAKAI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 150, 135, NULL, 126, 126, 0, 0, '2026-06-08 06:52:52.928', '2026-08-14 05:06:47.218'),
(27, '25', 'DALIYA', 1, '1KG DALIYA YELLOW MAKAI', 'DALIYA YELLOW MAKAI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 150, 135, NULL, 109, 109, 0, 0, '2026-06-08 06:52:52.929', '2026-08-14 05:06:47.218'),
(28, '26', 'DALIYA', 1, '1KG DALIYA WHEAT', 'DALIYA WHEAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 200, 180, NULL, 130, 130, 0, 0, '2026-06-08 06:52:52.931', '2026-07-20 11:02:53.682'),
(29, '27', 'DALIYA', 1, '1KG DALIYA JAU', 'DALIYA JAU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 250, 225, NULL, 132, 132, 0, 0, '2026-06-08 06:52:52.932', '2026-08-14 05:06:47.218'),
(30, '28', 'SATTU', 1, '500GMS CHANNA SATTU', 'CHANNA SATTU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 250, 225, NULL, 134, 134, 0, 0, '2026-06-08 06:52:52.933', '2026-07-20 11:02:53.682'),
(31, '29', 'SATTU', 1, '500GMS JAU SATTU', 'JAU SATTU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 250, 225, NULL, 136, 136, 0, 0, '2026-06-08 06:52:52.934', '2026-08-14 05:06:47.218'),
(32, '30', 'SATTU', 1, '500GMS MULTIGRAIN SATTU', 'MULTIGRAIN SATTU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 250, 225, NULL, 138, 138, 0, 0, '2026-06-08 06:52:52.935', '2026-07-20 11:02:53.682');

-- --------------------------------------------------------

--
-- Table structure for table `productVariant`
--

CREATE TABLE `productVariant` (
  `variantId` bigint(20) NOT NULL,
  `pCode` varchar(191) NOT NULL,
  `subGroupName` varchar(191) NOT NULL,
  `variationName` varchar(191) NOT NULL,
  `salesRate` double DEFAULT NULL,
  `stockQuantity` bigint(20) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productVariant`
--

INSERT INTO `productVariant` (`variantId`, `pCode`, `subGroupName`, `variationName`, `salesRate`, `stockQuantity`, `createdAt`, `updatedAt`) VALUES
(1, '1', 'WOODPRESS BLACK MUSTARD OIL', '1LTR WOODPRESS BLACK MUSTARD OIL', 630, 65, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.679'),
(2, '2', 'WOODPRESS YELLOW MUSTARD OIL', '1LTR WOODPRESS YELLOW MUSTARD OIL', 11, 78, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.679'),
(3, '3', 'WOODPRESS PEANUT OIL', '1LTR WOODPRESS PEANUT OIL', 855, 82, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.679'),
(4, '4', 'WOODPRESS SESAME OIL', '1LTR WOODPRESS SESAME OIL', 990, 84, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.679'),
(5, '5', 'WOODPRESS COCONUT OIL', '1LTR WOODPRESS COCONUT OIL', 2250, 88, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(6, '6', 'WOODPRESS COCONUT OIL', '300ML WOODPRESS COCONUT OIL', 630, 90, '2026-06-08 06:49:14.495', '2026-06-28 04:45:30.365'),
(7, '7', 'WOODPRESS COCONUT OIL', '200ML WOODPRESS COCONUT OIL', 450, 92, '2026-06-08 06:49:14.495', '2026-06-28 04:45:30.366'),
(8, '8', 'COLDPRESS BLACK MUSTARD OIL', '1LTR COLDPRESS BLACK MUSTARD OIL', 540, 92, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(9, '9', 'WOODPRESS BLACK MUSTARD OIL', '5LTR WOODPRESS BLACK MUSTARD OIL', 2700, 92, '2026-06-08 06:49:14.495', '2026-07-20 10:44:17.378'),
(10, '10', 'WOODPRESS YELLOW MUSTARD OIL', '5LTR WOODPRESS YELLOW MUSTARD OIL', 3150, 97, '2026-06-08 06:49:14.495', '2026-08-14 04:37:31.606'),
(11, '11', 'WOODPRESS PEANUT OIL', '5LTR WOODPRESS PEANUT OIL', 3600, 100, '2026-06-08 06:49:14.495', '2026-06-28 04:45:30.368'),
(12, '12', 'COLDPRESS BLACK MUSTARD OIL', '5LTR COLDPRESS BLACK MUSTARD OIL', 2250, 102, '2026-06-08 06:49:14.495', '2026-06-28 04:45:30.368'),
(13, '13', 'STONEPRESS KODO FLOUR', '1KG STONEPRESS KODO FLOUR', 180, 104, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(14, '14', 'STONEPRESS BAJRA FLOUR', '1KG STONEPRESS BAJRA FLOUR', 180, 105, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(15, '15', 'STONEPRESS FAFER FLOUR', '1KG STONEPRESS FAFER FLOUR', 225, 108, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(16, '16', 'STONEPRESS JAU FLOUR', '1KG STONEPRESS JAU FLOUR', 225, 110, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(17, '17', 'STONEPRESS JOWAR FLOUR', '1KG STONEPRESS JOWAR FLOUR', 225, 112, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(18, '18', 'STONEPRESS MAKAI FLOUR', '1KG STONEPRESS MAKAI FLOUR', 135, 114, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(19, '19', 'STONEPRESS BESAN FLOUR', '1KG STONEPRESS BESAN FLOUR', 225, 114, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(20, '20', 'STONEPRESS RED CHILLI  POWDER', '400GMS STONEPRESS RED CHILLI POWDER', 468, 118, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(21, '21', 'STONEPRESS TURMERIC  POWDER', '400GMS STONEPRESS TURMERIC POWDER', 423, 120, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.681'),
(22, '22', 'STONEPRESS CORIANDER  POWDER', '400GMS STONEPRESS CORIANDER POWDER', 306, 121, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.682'),
(23, '23', 'JAGGERY POWDER', '500GMS JAGGERY POWDER', 247.5, 124, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.682'),
(24, '24', 'DALIYA WHITE MAKAI', '1KG DALIYA WHITE MAKAI', 135, 126, '2026-06-08 06:49:14.495', '2026-08-14 05:06:47.218'),
(25, '25', 'DALIYA YELLOW MAKAI', '1KG DALIYA YELLOW MAKAI', 135, 109, '2026-06-08 06:49:14.495', '2026-08-14 05:06:47.218'),
(26, '26', 'DALIYA WHEAT', '1KG DALIYA WHEAT', 180, 130, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.682'),
(27, '27', 'DALIYA JAU', '1KG DALIYA JAU', 225, 132, '2026-06-08 06:49:14.495', '2026-08-14 05:06:47.218'),
(28, '28', 'CHANNA SATTU', '500GMS CHANNA SATTU', 225, 134, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.682'),
(29, '29', 'JAU SATTU', '500GMS JAU SATTU', 225, 136, '2026-06-08 06:49:14.495', '2026-08-14 05:06:47.218'),
(30, '30', 'MULTIGRAIN SATTU', '500GMS MULTIGRAIN SATTU', 225, 138, '2026-06-08 06:49:14.495', '2026-07-20 11:02:53.682');

-- --------------------------------------------------------

--
-- Table structure for table `promoCode`
--

CREATE TABLE `promoCode` (
  `promoCodeId` bigint(20) NOT NULL,
  `code` varchar(191) NOT NULL,
  `discountPercentage` double NOT NULL,
  `validFrom` datetime(3) NOT NULL,
  `validTo` datetime(3) NOT NULL,
  `promoStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `setShippingCost`
--

CREATE TABLE `setShippingCost` (
  `setShippingCostId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `minOrderAmount` double NOT NULL,
  `maxOrderAmount` double NOT NULL,
  `shippingAdress` varchar(191) DEFAULT NULL,
  `shippingMethod` varchar(191) DEFAULT NULL,
  `shippingCost` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `setShippingCost`
--

INSERT INTO `setShippingCost` (`setShippingCostId`, `userId`, `minOrderAmount`, `maxOrderAmount`, `shippingAdress`, `shippingMethod`, `shippingCost`, `createdAt`, `updatedAt`) VALUES
(1, 1, 0, 0, '{\"provinceId\":\"3\",\"provinceName\":\"Bagmati Province\",\"districtId\":\"27\",\"districtName\":\"Kathmandu\",\"cityId\":\"307\",\"cityName\":\"Kathmandu\"}', 'CITY', 1, '2026-06-09 07:55:02.350', '2026-06-09 07:55:02.350');

-- --------------------------------------------------------

--
-- Table structure for table `shippingDetails`
--

CREATE TABLE `shippingDetails` (
  `shippingDetailsId` bigint(20) NOT NULL,
  `orderId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `shippingCourier` varchar(191) DEFAULT NULL,
  `trackingNumber` varchar(191) DEFAULT NULL,
  `shippingDate` datetime(3) DEFAULT NULL,
  `shippingRemark` varchar(191) DEFAULT NULL,
  `shippingStatus` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shippingDetails`
--

INSERT INTO `shippingDetails` (`shippingDetailsId`, `orderId`, `productId`, `shippingCourier`, `trackingNumber`, `shippingDate`, `shippingRemark`, `shippingStatus`, `createdAt`, `updatedAt`) VALUES
(1, 1, 11, NULL, NULL, NULL, 'Gyanendra Shah | 9821212332 | naxal, 09, Lumbini Sanskritik, Lumbini Province | Lumbini Sanskritik | Lumbini Province | naxal', 'PENDING', '2026-06-08 06:59:28.388', '2026-06-08 06:59:28.388'),
(2, 2, 3, NULL, NULL, NULL, 'Gyanendra Shah | 9821212332 | naxal, 09, Lumbini Sanskritik, Lumbini Province | Lumbini Sanskritik | Lumbini Province | naxal', 'PENDING', '2026-06-09 05:47:13.821', '2026-06-09 05:47:13.821'),
(3, 3, 3, NULL, NULL, NULL, 'Gyanendra Shah | 9821212332 | naxal, 09, Lumbini Sanskritik, Lumbini Province | Lumbini Sanskritik | Lumbini Province | naxal', 'PENDING', '2026-06-09 05:47:49.401', '2026-06-09 05:47:49.401'),
(4, 4, 3, NULL, NULL, NULL, 'Gyanendra Shah | 9821212332 | naxal, 09, Lumbini Sanskritik, Lumbini Province | Lumbini Sanskritik | Lumbini Province | naxal', 'PENDING', '2026-06-09 05:48:55.873', '2026-06-09 05:48:55.873'),
(5, 5, 3, NULL, NULL, NULL, 'Gyanendra Shah | 9821212332 | naxal, 09, Lumbini Sanskritik, Lumbini Province | Lumbini Sanskritik | Lumbini Province | naxal', 'PENDING', '2026-06-09 08:56:18.745', '2026-06-09 08:56:18.745'),
(6, 6, 4, NULL, NULL, NULL, 'Gyanendra Shah | 9821212332 | naxal, 09, Lumbini Sanskritik, Lumbini Province | Lumbini Sanskritik | Lumbini Province | naxal', 'PENDING', '2026-06-09 10:23:56.757', '2026-06-09 10:23:56.757'),
(7, 7, 4, NULL, NULL, NULL, 'Gyanendra Shah | 9821212332 | naxal, 09, Lumbini Sanskritik, Lumbini Province | Lumbini Sanskritik | Lumbini Province | naxal', 'PENDING', '2026-06-09 12:18:01.379', '2026-06-09 12:18:01.379');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `testimonialsId` bigint(20) NOT NULL,
  `name` varchar(191) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `title` varchar(191) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `designation` varchar(191) DEFAULT NULL,
  `starRating` bigint(20) DEFAULT NULL,
  `testimonialStatus` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` bigint(20) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL,
  `rolePermission` varchar(191) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `password` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `zipCode` varchar(191) DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `name`, `email`, `role`, `rolePermission`, `status`, `password`, `phone`, `city`, `state`, `zipCode`, `country`, `createdAt`, `updatedAt`) VALUES
(1, 'Super Admin', 'admin@nityagro.com', 'SUPER_ADMIN', 'ALL', 1, 'scrypt$154d4f01877b505850107d4b72c7239d$b4534f9899180c2fc8a7e74e91a58b123062c1fe11d2c3a07969fc2267f1c41fdf0c1bc65e754d4c858425ad3a38e07d7b67820981cffa737c551ae141329b8c', NULL, NULL, NULL, NULL, NULL, '2026-06-08 12:35:50.020', '2026-06-08 12:35:50.020');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `wishId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('02646b23-a650-4a78-9a9e-2b4fc6761d4d', 'b40632d00a50ab72e5c29d704ad165d7e43f53226f340788901dec974e46ecff', '2026-06-08 06:48:26.833', '20260604081348_init', NULL, NULL, '2026-06-08 06:48:26.082', 1),
('2d4e71bc-997b-4d60-a43f-77756eee124c', 'd8225d212efc65a742855de138026ce1d72d275165a68824dcb245b33c3dd781', '2026-06-08 06:48:26.848', '20260608062000_product_description_longtext', NULL, NULL, '2026-06-08 06:48:26.833', 1),
('53093294-0632-4250-8a2b-c466cf7d3fd1', 'bd36ab4e7e9700a6ce07bf4065004f53caa7d64f996f07efd682dd46d41114ed', '2026-06-08 07:10:02.930', '20260608065000_combo_product_longtext', NULL, NULL, '2026-06-08 07:10:02.917', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`addressId`),
  ADD KEY `address_userId_fkey` (`userId`);

--
-- Indexes for table `auditLog`
--
ALTER TABLE `auditLog`
  ADD PRIMARY KEY (`auditLogId`),
  ADD KEY `auditLog_userId_fkey` (`userId`);

--
-- Indexes for table `authOtp`
--
ALTER TABLE `authOtp`
  ADD PRIMARY KEY (`authOtpId`),
  ADD KEY `authOtp_email_purpose_idx` (`email`,`purpose`);

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`bannerId`);

--
-- Indexes for table `cartList`
--
ALTER TABLE `cartList`
  ADD PRIMARY KEY (`cartId`),
  ADD KEY `cartList_productId_fkey` (`productId`),
  ADD KEY `cartList_userId_fkey` (`userId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryId`),
  ADD KEY `categories_userId_fkey` (`userId`);

--
-- Indexes for table `comboOrderCancellation`
--
ALTER TABLE `comboOrderCancellation`
  ADD PRIMARY KEY (`comboOrderCancellationId`),
  ADD KEY `comboOrderCancellation_comboOrderId_fkey` (`comboOrderId`),
  ADD KEY `comboOrderCancellation_comboProductId_fkey` (`comboProductId`),
  ADD KEY `comboOrderCancellation_userId_fkey` (`userId`);

--
-- Indexes for table `comboOrderReturn`
--
ALTER TABLE `comboOrderReturn`
  ADD PRIMARY KEY (`comboOrderReturnId`),
  ADD KEY `comboOrderReturn_comboOrderId_fkey` (`comboOrderId`),
  ADD KEY `comboOrderReturn_comboProductId_fkey` (`comboProductId`),
  ADD KEY `comboOrderReturn_userId_fkey` (`userId`);

--
-- Indexes for table `comboOrders`
--
ALTER TABLE `comboOrders`
  ADD PRIMARY KEY (`comboOrderId`),
  ADD KEY `comboOrders_comboProductId_fkey` (`comboProductId`),
  ADD KEY `comboOrders_userId_fkey` (`userId`);

--
-- Indexes for table `comboProduct`
--
ALTER TABLE `comboProduct`
  ADD PRIMARY KEY (`comboProductId`),
  ADD KEY `comboProduct_productId_fkey` (`productId`);

--
-- Indexes for table `companyInfo`
--
ALTER TABLE `companyInfo`
  ADD PRIMARY KEY (`companyInfoId`);

--
-- Indexes for table `contactSettings`
--
ALTER TABLE `contactSettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deliveryDetails`
--
ALTER TABLE `deliveryDetails`
  ADD PRIMARY KEY (`deliveryDetailsId`),
  ADD KEY `deliveryDetails_orderId_fkey` (`orderId`),
  ADD KEY `deliveryDetails_shippingDetailsId_fkey` (`shippingDetailsId`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`faqsId`);

--
-- Indexes for table `inquiry`
--
ALTER TABLE `inquiry`
  ADD PRIMARY KEY (`inquiryId`);

--
-- Indexes for table `newsletterSubscription`
--
ALTER TABLE `newsletterSubscription`
  ADD PRIMARY KEY (`newsletterSubscriptionId`),
  ADD UNIQUE KEY `newsletterSubscription_email_key` (`email`);

--
-- Indexes for table `omsOrderSyncLog`
--
ALTER TABLE `omsOrderSyncLog`
  ADD PRIMARY KEY (`omsOrderSyncLogId`),
  ADD KEY `omsOrderSyncLog_status_idx` (`status`);

--
-- Indexes for table `orderCancellation`
--
ALTER TABLE `orderCancellation`
  ADD PRIMARY KEY (`orderCancellationId`),
  ADD KEY `orderCancellation_orderId_fkey` (`orderId`),
  ADD KEY `orderCancellation_productId_fkey` (`productId`),
  ADD KEY `orderCancellation_userId_fkey` (`userId`);

--
-- Indexes for table `orderReturn`
--
ALTER TABLE `orderReturn`
  ADD PRIMARY KEY (`orderReturnId`),
  ADD KEY `orderReturn_orderId_fkey` (`orderId`),
  ADD KEY `orderReturn_productId_fkey` (`productId`),
  ADD KEY `orderReturn_userId_fkey` (`userId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `orders_productId_fkey` (`productId`),
  ADD KEY `orders_userId_fkey` (`userId`);

--
-- Indexes for table `paymentDetails`
--
ALTER TABLE `paymentDetails`
  ADD PRIMARY KEY (`paymentDetailsId`),
  ADD KEY `paymentDetails_orderId_fkey` (`orderId`),
  ADD KEY `paymentDetails_userId_fkey` (`userId`);

--
-- Indexes for table `popupBanner`
--
ALTER TABLE `popupBanner`
  ADD PRIMARY KEY (`popupBannerId`);

--
-- Indexes for table `ProductImage`
--
ALTER TABLE `ProductImage`
  ADD PRIMARY KEY (`productImageId`),
  ADD KEY `ProductImage_productId_idx` (`productId`),
  ADD KEY `ProductImage_comboProductId_idx` (`comboProductId`);

--
-- Indexes for table `productReview`
--
ALTER TABLE `productReview`
  ADD PRIMARY KEY (`productReviewId`),
  ADD KEY `productReview_productId_fkey` (`productId`),
  ADD KEY `productReview_userId_fkey` (`userId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`),
  ADD UNIQUE KEY `products_productCode_key` (`productCode`),
  ADD KEY `products_userId_fkey` (`userId`);

--
-- Indexes for table `productVariant`
--
ALTER TABLE `productVariant`
  ADD PRIMARY KEY (`variantId`);

--
-- Indexes for table `promoCode`
--
ALTER TABLE `promoCode`
  ADD PRIMARY KEY (`promoCodeId`),
  ADD UNIQUE KEY `promoCode_code_key` (`code`);

--
-- Indexes for table `setShippingCost`
--
ALTER TABLE `setShippingCost`
  ADD PRIMARY KEY (`setShippingCostId`),
  ADD KEY `setShippingCost_userId_fkey` (`userId`);

--
-- Indexes for table `shippingDetails`
--
ALTER TABLE `shippingDetails`
  ADD PRIMARY KEY (`shippingDetailsId`),
  ADD KEY `shippingDetails_orderId_fkey` (`orderId`),
  ADD KEY `shippingDetails_productId_fkey` (`productId`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`testimonialsId`),
  ADD KEY `testimonials_userId_fkey` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`wishId`),
  ADD KEY `wishlist_productId_fkey` (`productId`),
  ADD KEY `wishlist_userId_fkey` (`userId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `addressId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auditLog`
--
ALTER TABLE `auditLog`
  MODIFY `auditLogId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `authOtp`
--
ALTER TABLE `authOtp`
  MODIFY `authOtpId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `bannerId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cartList`
--
ALTER TABLE `cartList`
  MODIFY `cartId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categoryId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `comboOrderCancellation`
--
ALTER TABLE `comboOrderCancellation`
  MODIFY `comboOrderCancellationId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comboOrderReturn`
--
ALTER TABLE `comboOrderReturn`
  MODIFY `comboOrderReturnId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comboOrders`
--
ALTER TABLE `comboOrders`
  MODIFY `comboOrderId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `comboProduct`
--
ALTER TABLE `comboProduct`
  MODIFY `comboProductId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `companyInfo`
--
ALTER TABLE `companyInfo`
  MODIFY `companyInfoId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contactSettings`
--
ALTER TABLE `contactSettings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deliveryDetails`
--
ALTER TABLE `deliveryDetails`
  MODIFY `deliveryDetailsId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `faqsId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiry`
--
ALTER TABLE `inquiry`
  MODIFY `inquiryId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newsletterSubscription`
--
ALTER TABLE `newsletterSubscription`
  MODIFY `newsletterSubscriptionId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `omsOrderSyncLog`
--
ALTER TABLE `omsOrderSyncLog`
  MODIFY `omsOrderSyncLogId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orderCancellation`
--
ALTER TABLE `orderCancellation`
  MODIFY `orderCancellationId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderReturn`
--
ALTER TABLE `orderReturn`
  MODIFY `orderReturnId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `paymentDetails`
--
ALTER TABLE `paymentDetails`
  MODIFY `paymentDetailsId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `popupBanner`
--
ALTER TABLE `popupBanner`
  MODIFY `popupBannerId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ProductImage`
--
ALTER TABLE `ProductImage`
  MODIFY `productImageId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `productReview`
--
ALTER TABLE `productReview`
  MODIFY `productReviewId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `productVariant`
--
ALTER TABLE `productVariant`
  MODIFY `variantId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `promoCode`
--
ALTER TABLE `promoCode`
  MODIFY `promoCodeId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `setShippingCost`
--
ALTER TABLE `setShippingCost`
  MODIFY `setShippingCostId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shippingDetails`
--
ALTER TABLE `shippingDetails`
  MODIFY `shippingDetailsId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `testimonialsId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `wishId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `auditLog`
--
ALTER TABLE `auditLog`
  ADD CONSTRAINT `auditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `cartList`
--
ALTER TABLE `cartList`
  ADD CONSTRAINT `cartList_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cartList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `comboOrderCancellation`
--
ALTER TABLE `comboOrderCancellation`
  ADD CONSTRAINT `comboOrderCancellation_comboOrderId_fkey` FOREIGN KEY (`comboOrderId`) REFERENCES `comboOrders` (`comboOrderId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `comboOrderCancellation_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct` (`comboProductId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `comboOrderCancellation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `comboOrderReturn`
--
ALTER TABLE `comboOrderReturn`
  ADD CONSTRAINT `comboOrderReturn_comboOrderId_fkey` FOREIGN KEY (`comboOrderId`) REFERENCES `comboOrders` (`comboOrderId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `comboOrderReturn_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct` (`comboProductId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `comboOrderReturn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `comboOrders`
--
ALTER TABLE `comboOrders`
  ADD CONSTRAINT `comboOrders_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct` (`comboProductId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `comboOrders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `comboProduct`
--
ALTER TABLE `comboProduct`
  ADD CONSTRAINT `comboProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE;

--
-- Constraints for table `deliveryDetails`
--
ALTER TABLE `deliveryDetails`
  ADD CONSTRAINT `deliveryDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `deliveryDetails_shippingDetailsId_fkey` FOREIGN KEY (`shippingDetailsId`) REFERENCES `shippingDetails` (`shippingDetailsId`) ON UPDATE CASCADE;

--
-- Constraints for table `orderCancellation`
--
ALTER TABLE `orderCancellation`
  ADD CONSTRAINT `orderCancellation_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orderCancellation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orderCancellation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `orderReturn`
--
ALTER TABLE `orderReturn`
  ADD CONSTRAINT `orderReturn_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orderReturn_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orderReturn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `paymentDetails`
--
ALTER TABLE `paymentDetails`
  ADD CONSTRAINT `paymentDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentDetails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `ProductImage`
--
ALTER TABLE `ProductImage`
  ADD CONSTRAINT `ProductImage_comboProductId_fkey` FOREIGN KEY (`comboProductId`) REFERENCES `comboProduct` (`comboProductId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `productReview`
--
ALTER TABLE `productReview`
  ADD CONSTRAINT `productReview_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `productReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `setShippingCost`
--
ALTER TABLE `setShippingCost`
  ADD CONSTRAINT `setShippingCost_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `shippingDetails`
--
ALTER TABLE `shippingDetails`
  ADD CONSTRAINT `shippingDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `shippingDetails_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE;

--
-- Constraints for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
