-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 25, 2026 at 06:41 AM
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
(15, 'OIL', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.832', '2026-08-24 05:56:08.832'),
(16, 'Local Rice', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.836', '2026-08-24 05:56:08.836'),
(17, 'SATTU', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.839', '2026-08-24 05:56:08.839'),
(18, 'Branch Stock', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.840', '2026-08-24 05:56:08.840'),
(19, 'COLDPRESS OIL', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.842', '2026-08-24 05:56:08.842'),
(20, 'DALIYA', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.844', '2026-08-24 05:56:08.844'),
(21, 'Medical', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.846', '2026-08-24 06:09:49.448'),
(22, 'JAGGERY', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.848', '2026-08-24 05:56:08.848'),
(23, 'STONEPRESS FLOUR', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.850', '2026-08-24 05:56:08.850'),
(24, 'SPICES', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.851', '2026-08-24 05:56:08.851'),
(25, 'WOODPRESS OIL', 1, NULL, NULL, NULL, NULL, NULL, 0, '2026-08-24 05:56:08.854', '2026-08-24 05:56:08.854');

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
(1, NULL, NULL, '/uploads/products/gallery-c8a8a04c7d1ca2d92549732cf1ad4277f3a55c5f-1-1780901710495-ik6lfh.png', 0, '2026-06-08 06:55:10.499', '2026-06-08 06:55:10.499'),
(2, NULL, NULL, '/uploads/products/gallery-86ac5ac385f0c733fc52ab7c92304f40c205d512-1780901710496-153ri0.png', 0, '2026-06-08 06:55:10.499', '2026-06-08 06:55:10.499'),
(3, NULL, NULL, '/uploads/products/gallery-384a7fe56a24d56ac28be156b4ef2601172c40cc-1780901710497-ijob5z.png', 0, '2026-06-08 06:55:10.499', '2026-06-08 06:55:10.499'),
(4, NULL, NULL, '/uploads/combos/main-b2-1780902610552-vintjl.png', 1, '2026-06-08 07:10:10.559', '2026-06-08 07:10:10.559'),
(5, NULL, NULL, '/uploads/combos/gallery-b1-1780902610554-1w4il3.png', 0, '2026-06-08 07:10:10.559', '2026-06-08 07:10:10.559'),
(6, NULL, NULL, '/uploads/combos/gallery-b2-1780902610557-kki94a.png', 0, '2026-06-08 07:10:10.559', '2026-06-08 07:10:10.559'),
(7, NULL, NULL, '/uploads/combos/gallery-384a7fe56a24d56ac28be156b4ef2601172c40cc-1780902610558-fgi18q.png', 0, '2026-06-08 07:10:10.559', '2026-06-08 07:10:10.559');

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
(115, '50', 'Branch Stock', 1, 'Sample Product', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.713', '2026-08-24 06:09:49.708'),
(116, '51', 'WOODPRESS OIL', 1, 'WOODPRESS BLACK MUSTARD OIL - 1000 ML', 'WOODPRESS BLACK MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.719', '2026-08-24 06:09:49.478'),
(117, '52', 'WOODPRESS OIL', 1, 'WOODPRESS YELLOW MUSTARD OIL - 1000 ML', 'WOODPRESS YELLOW MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.724', '2026-08-24 06:09:49.480'),
(118, '53', 'WOODPRESS OIL', 1, 'WOODPRESS PEANUT OIL - 1000 ML', 'WOODPRESS PEANUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.727', '2026-08-24 06:09:49.484'),
(119, '54', 'WOODPRESS OIL', 1, 'WOODPRESS SESAME OIL - 1000 ML', 'WOODPRESS SESAME OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.729', '2026-08-24 06:09:49.489'),
(120, '55', 'WOODPRESS OIL', 1, 'WOODPRESS COCONUT OIL - 1000 ML', 'WOODPRESS COCONUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.731', '2026-08-24 06:09:49.491'),
(121, '56', 'WOODPRESS OIL', 1, 'WOODPRESS COCONUT OIL - 300 ML', 'WOODPRESS COCONUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.733', '2026-08-24 06:09:49.494'),
(122, '57', 'COLDPRESS OIL', 1, 'COLDPRESS BLACK MUSTARD OIL - 1000 ML', 'COLDPRESS BLACK MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.736', '2026-08-24 06:09:49.496'),
(123, '58', 'WOODPRESS OIL', 1, 'WOODPRESS BLACK MUSTARD OIL - 5000 ML', 'WOODPRESS BLACK MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.738', '2026-08-24 06:09:49.500'),
(124, '59', 'WOODPRESS OIL', 1, 'WOODPRESS YELLOW MUSTARD OIL - 5000 ML', 'WOODPRESS YELLOW MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.741', '2026-08-24 06:09:49.503'),
(125, '60', 'WOODPRESS OIL', 1, 'WOODPRESS SESAME OIL - 5000 ML', 'WOODPRESS SESAME OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.742', '2026-08-24 06:09:49.505'),
(126, '61', 'WOODPRESS OIL', 1, 'WOODPRESS PEANUT OIL - 5000 ML', 'WOODPRESS PEANUT OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.744', '2026-08-24 06:09:49.507'),
(127, '62', 'COLDPRESS OIL', 1, 'COLDPRESS BLACK MUSTARD OIL - 5000 ML', 'COLDPRESS BLACK MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.747', '2026-08-24 06:09:49.510'),
(128, '63', 'STONEPRESS FLOUR', 1, 'STONEPRESS KODO FLOUR 1 KG', 'STONEPRESS KODO FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.749', '2026-08-24 06:09:49.513'),
(129, '64', 'STONEPRESS FLOUR', 1, 'STONEPRESS BAJRA FLOUR 1 KG', 'STONEPRESS BAJRA FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.753', '2026-08-24 06:09:49.515'),
(130, '65', 'STONEPRESS FLOUR', 1, 'STONEPRESS FAFER FLOUR 1 KG', 'STONEPRESS FAFER FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.756', '2026-08-24 06:09:49.518'),
(131, '66', 'STONEPRESS FLOUR', 1, 'STONEPRESS JAU FLOUR 1 KG', 'STONEPRESS JAU FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.758', '2026-08-24 06:09:49.521'),
(132, '67', 'STONEPRESS FLOUR', 1, 'STONEPRESS JOWAR FLOUR 1 KG', 'STONEPRESS JOWAR FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.759', '2026-08-24 06:09:49.523'),
(133, '68', 'STONEPRESS FLOUR', 1, 'STONEPRESS MAKAI FLOUR 1 KG', 'STONEPRESS MAKAI FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.760', '2026-08-24 06:09:49.526'),
(134, '69', 'STONEPRESS FLOUR', 1, 'STONEPRESS BESAN FLOUR 1 KG', 'STONEPRESS BESAN FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.762', '2026-08-24 06:09:49.529'),
(135, '70', 'SPICES', 1, 'STONEPRESS RED CHILLI  POWDER - 400 GMS', 'STONEPRESS RED CHILLI  POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.764', '2026-08-24 06:09:49.533'),
(136, '71', 'SPICES', 1, 'STONEPRESS TURMERIC  POWDER - 400 GMS', 'STONEPRESS TURMERIC  POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.766', '2026-08-24 06:09:49.536'),
(137, '72', 'SPICES', 1, 'STONEPRESS CORIANDER  POWDER - 400 GMS', 'STONEPRESS CORIANDER  POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.769', '2026-08-24 06:09:49.539'),
(138, '73', 'JAGGERY', 1, 'JAGGERY POWDER - 1 KG', 'JAGGERY POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.772', '2026-08-24 06:09:49.542'),
(139, '74', 'JAGGERY', 1, 'JAGGERY POWDER - 25 KGS', 'JAGGERY POWDER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.774', '2026-08-24 06:09:49.545'),
(140, '75', 'JAGGERY', 1, 'JAGGERY POWDER - 500 GMS', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.776', '2026-08-24 06:09:49.708'),
(141, '76', 'DALIYA', 1, 'DALIYA WHITE MAKAI - 1 KG', 'DALIYA WHITE MAKAI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.778', '2026-08-24 06:09:49.551'),
(142, '77', 'DALIYA', 1, 'DALIYA YELLOW MAKAI - 1 KG', 'DALIYA YELLOW MAKAI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.781', '2026-08-24 06:09:49.554'),
(143, '78', 'DALIYA', 1, 'DALIYA WHEAT - 1 KG', 'DALIYA WHEAT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.783', '2026-08-24 06:09:49.557'),
(144, '79', 'DALIYA', 1, 'DALIYA JAU - 1 KG', 'DALIYA JAU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.786', '2026-08-24 06:09:49.560'),
(145, '80', 'SATTU', 1, 'CHANNA SATTU - 500 GMS', 'CHANNA SATTU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.789', '2026-08-24 06:09:49.563'),
(146, '81', 'SATTU', 1, 'JAU SATTU - 500 GMS', 'JAU SATTU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.791', '2026-08-24 06:09:49.566'),
(147, '82', 'SATTU', 1, 'MULTIGRAIN SATTU - 500 GMS', 'MULTIGRAIN SATTU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.793', '2026-08-24 06:09:49.569'),
(148, '83', 'STONEPRESS FLOUR', 1, 'STONEPRESS WHEAT FLOUR 1KG - SARBAT', 'STONEPRESS WHEAT FLOUR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.796', '2026-08-24 06:09:49.572'),
(149, '84', 'Branch Stock', 1, 'Cold Press Black Mustard Oil 1000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.798', '2026-08-24 06:09:49.708'),
(150, '85', 'Branch Stock', 1, 'Daily Makai', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.801', '2026-08-24 06:09:49.708'),
(151, '86', 'Branch Stock', 1, 'Daily Wheat', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.804', '2026-08-24 06:09:49.708'),
(152, '87', 'Branch Stock', 1, 'Jaggery Powder', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.806', '2026-08-24 06:09:49.708'),
(153, '88', 'Branch Stock', 1, 'Jaggery Powder 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.808', '2026-08-24 06:09:49.708'),
(154, '89', 'Branch Stock', 1, 'Jaggery Powder 25kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.812', '2026-08-24 06:09:49.708'),
(155, '90', 'Branch Stock', 1, 'Sattu Chana', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.815', '2026-08-24 06:09:49.708'),
(156, '91', 'Branch Stock', 1, 'Sattu Multigrain', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.816', '2026-08-24 06:09:49.708'),
(157, '92', 'Branch Stock', 1, 'Stone Press Bajra Flour 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.818', '2026-08-24 06:09:49.708'),
(158, '93', 'Branch Stock', 1, 'Stone Press Besan Flour 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.820', '2026-08-24 06:09:49.708'),
(159, '94', 'Branch Stock', 1, 'Stone Press Coriander Powder', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.823', '2026-08-24 06:09:49.708'),
(160, '95', 'Branch Stock', 1, 'Stone Press Fafer Flour 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.824', '2026-08-24 06:09:49.708'),
(161, '96', 'Branch Stock', 1, 'Stone Press Jau Flour 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.826', '2026-08-24 06:09:49.708'),
(162, '97', 'Branch Stock', 1, 'Stone Press Jowar Flour 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.828', '2026-08-24 06:09:49.708'),
(163, '98', 'Branch Stock', 1, 'Stone Press Kodo Flour 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.830', '2026-08-24 06:09:49.708'),
(164, '99', 'Branch Stock', 1, 'Stone Press Makkai Flour 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.832', '2026-08-24 06:09:49.708'),
(165, '100', 'Branch Stock', 1, 'Stone Press Red Chilly Powder', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.835', '2026-08-24 06:09:49.708'),
(166, '101', 'Branch Stock', 1, 'Stone Press Tumeric Powder', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.837', '2026-08-24 06:09:49.708'),
(167, '102', 'Branch Stock', 1, 'Stone Press Wheat 1kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.839', '2026-08-24 06:09:49.708'),
(168, '103', 'Branch Stock', 1, 'Wood Press Black Mustard Oil 1000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.840', '2026-08-24 06:09:49.708'),
(169, '104', 'Branch Stock', 1, 'Wood Press Black Mustard Oil 20ltrs', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.842', '2026-08-24 06:09:49.708'),
(170, '105', 'Branch Stock', 1, 'Wood Press Black Mustard Oil 5000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.843', '2026-08-24 06:09:49.708'),
(171, '106', 'Branch Stock', 1, 'Wood Press Black Mustard Oil 500ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.844', '2026-08-24 06:09:49.708'),
(172, '107', 'Branch Stock', 1, 'Wood Press Coconut Oil 1000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.845', '2026-08-24 06:09:49.708'),
(173, '108', 'Branch Stock', 1, 'Wood Press Peanut Oil 1000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.846', '2026-08-24 06:09:49.708'),
(174, '109', 'Branch Stock', 1, 'Wood Press Peanut Oil 5000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.848', '2026-08-24 06:09:49.708'),
(175, '110', 'Branch Stock', 1, 'Wood Press Sesami Oil 1000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.849', '2026-08-24 06:09:49.708'),
(176, '111', 'Branch Stock', 1, 'Wood Press Sesami Oil 5000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.851', '2026-08-24 06:09:49.708'),
(177, '112', 'Branch Stock', 1, 'Wood Press Yellow Mustard Oil 1000ml', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.855', '2026-08-24 06:09:49.708'),
(178, '113', 'Local Rice', 1, 'Bucket Wheat 50kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.859', '2026-08-24 06:09:49.708'),
(179, '114', 'Local Rice', 1, 'Chana 25kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.864', '2026-08-24 06:09:49.708'),
(180, '115', 'Local Rice', 1, 'Chiura 20  Kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.870', '2026-08-24 06:09:49.708'),
(181, '116', 'Local Rice', 1, 'Kabuli Chana 30kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.874', '2026-08-24 06:09:49.708'),
(182, '117', 'Local Rice', 1, 'Kala Bhatamas25kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.878', '2026-08-24 06:09:49.708'),
(183, '118', 'Local Rice', 1, 'Kwanti 20kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.882', '2026-08-24 06:09:49.708'),
(184, '119', 'Local Rice', 1, 'Mass Dal 25kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.887', '2026-08-24 06:09:49.708'),
(185, '120', 'Local Rice', 1, 'Moong Dal 25kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.891', '2026-08-24 06:09:49.708'),
(186, '121', 'Local Rice', 1, 'Moong Khosta 25kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.894', '2026-08-24 06:09:49.708'),
(187, '122', 'Local Rice', 1, 'Musuro Dal 25 KG', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.900', '2026-08-24 06:09:49.708'),
(188, '123', 'Local Rice', 1, 'Rajma (30 Kg)', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.919', '2026-08-24 06:09:49.708'),
(189, '124', 'Local Rice', 1, 'Rice 20 Kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.923', '2026-08-24 06:09:49.708'),
(190, '125', 'Local Rice', 1, 'Rice 25 KG', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.926', '2026-08-24 06:09:49.708'),
(191, '126', 'Local Rice', 1, 'Rice 30 Kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.929', '2026-08-24 06:09:49.708'),
(192, '127', 'Local Rice', 1, 'Seto Semi 30kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.932', '2026-08-24 06:09:49.708'),
(193, '128', 'Local Rice', 1, 'Wheat 25kg', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.934', '2026-08-24 06:09:49.708'),
(194, '129', 'Medical', 1, 'International Acilarix LXS Series Diagnostic Ultrasound System with Accessories.', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.937', '2026-08-24 06:09:49.708'),
(195, '130', 'Medical', 1, 'SONY-UPP-X899 17D Thermal Printer', 'No Subgroup', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.939', '2026-08-24 06:09:49.708'),
(196, '131', 'OIL', 1, '1LTR COLDPRESS BLACK MUSTARD OIL', 'COLDPRESS BLACK MUSTARD OIL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, 0, 0, '2026-08-24 05:46:31.941', '2026-08-24 06:09:49.710');

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
(113, '50', 'No Subgroup', 'Sample Product', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.726'),
(114, '51', 'WOODPRESS BLACK MUSTARD OIL', 'WOODPRESS BLACK MUSTARD OIL - 1000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.727'),
(115, '52', 'WOODPRESS YELLOW MUSTARD OIL', 'WOODPRESS YELLOW MUSTARD OIL - 1000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.728'),
(116, '53', 'WOODPRESS PEANUT OIL', 'WOODPRESS PEANUT OIL - 1000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.729'),
(117, '54', 'WOODPRESS SESAME OIL', 'WOODPRESS SESAME OIL - 1000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.730'),
(118, '55', 'WOODPRESS COCONUT OIL', 'WOODPRESS COCONUT OIL - 1000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.730'),
(119, '56', 'WOODPRESS COCONUT OIL', 'WOODPRESS COCONUT OIL - 300 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.731'),
(120, '57', 'COLDPRESS BLACK MUSTARD OIL', 'COLDPRESS BLACK MUSTARD OIL - 1000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.731'),
(121, '58', 'WOODPRESS BLACK MUSTARD OIL', 'WOODPRESS BLACK MUSTARD OIL - 5000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.732'),
(122, '59', 'WOODPRESS YELLOW MUSTARD OIL', 'WOODPRESS YELLOW MUSTARD OIL - 5000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.732'),
(123, '60', 'WOODPRESS SESAME OIL', 'WOODPRESS SESAME OIL - 5000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.733'),
(124, '61', 'WOODPRESS PEANUT OIL', 'WOODPRESS PEANUT OIL - 5000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.733'),
(125, '62', 'COLDPRESS BLACK MUSTARD OIL', 'COLDPRESS BLACK MUSTARD OIL - 5000 ML', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.733'),
(126, '63', 'STONEPRESS KODO FLOUR', 'STONEPRESS KODO FLOUR 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.734'),
(127, '64', 'STONEPRESS BAJRA FLOUR', 'STONEPRESS BAJRA FLOUR 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.735'),
(128, '65', 'STONEPRESS FAFER FLOUR', 'STONEPRESS FAFER FLOUR 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.736'),
(129, '66', 'STONEPRESS JAU FLOUR', 'STONEPRESS JAU FLOUR 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.737'),
(130, '67', 'STONEPRESS JOWAR FLOUR', 'STONEPRESS JOWAR FLOUR 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.737'),
(131, '68', 'STONEPRESS MAKAI FLOUR', 'STONEPRESS MAKAI FLOUR 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.738'),
(132, '69', 'STONEPRESS BESAN FLOUR', 'STONEPRESS BESAN FLOUR 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.739'),
(133, '70', 'STONEPRESS RED CHILLI  POWDER', 'STONEPRESS RED CHILLI  POWDER - 400 GMS', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.739'),
(134, '71', 'STONEPRESS TURMERIC  POWDER', 'STONEPRESS TURMERIC  POWDER - 400 GMS', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.740'),
(135, '72', 'STONEPRESS CORIANDER  POWDER', 'STONEPRESS CORIANDER  POWDER - 400 GMS', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.741'),
(136, '73', 'JAGGERY POWDER', 'JAGGERY POWDER - 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.741'),
(137, '74', 'JAGGERY POWDER', 'JAGGERY POWDER - 25 KGS', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.743'),
(138, '75', 'No Subgroup', 'JAGGERY POWDER - 500 GMS', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.743'),
(139, '76', 'DALIYA WHITE MAKAI', 'DALIYA WHITE MAKAI - 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.744'),
(140, '77', 'DALIYA YELLOW MAKAI', 'DALIYA YELLOW MAKAI - 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.745'),
(141, '78', 'DALIYA WHEAT', 'DALIYA WHEAT - 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.745'),
(142, '79', 'DALIYA JAU', 'DALIYA JAU - 1 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.746'),
(143, '80', 'CHANNA SATTU', 'CHANNA SATTU - 500 GMS', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.748'),
(144, '81', 'JAU SATTU', 'JAU SATTU - 500 GMS', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.749'),
(145, '82', 'MULTIGRAIN SATTU', 'MULTIGRAIN SATTU - 500 GMS', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.749'),
(146, '83', 'STONEPRESS WHEAT FLOUR', 'STONEPRESS WHEAT FLOUR 1KG - SARBAT', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.750'),
(147, '84', 'No Subgroup', 'Cold Press Black Mustard Oil 1000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.751'),
(148, '85', 'No Subgroup', 'Daily Makai', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.752'),
(149, '86', 'No Subgroup', 'Daily Wheat', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.753'),
(150, '87', 'No Subgroup', 'Jaggery Powder', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.753'),
(151, '88', 'No Subgroup', 'Jaggery Powder 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.754'),
(152, '89', 'No Subgroup', 'Jaggery Powder 25kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.755'),
(153, '90', 'No Subgroup', 'Sattu Chana', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.755'),
(154, '91', 'No Subgroup', 'Sattu Multigrain', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.756'),
(155, '92', 'No Subgroup', 'Stone Press Bajra Flour 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.756'),
(156, '93', 'No Subgroup', 'Stone Press Besan Flour 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.757'),
(157, '94', 'No Subgroup', 'Stone Press Coriander Powder', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.757'),
(158, '95', 'No Subgroup', 'Stone Press Fafer Flour 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.758'),
(159, '96', 'No Subgroup', 'Stone Press Jau Flour 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.758'),
(160, '97', 'No Subgroup', 'Stone Press Jowar Flour 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.758'),
(161, '98', 'No Subgroup', 'Stone Press Kodo Flour 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.759'),
(162, '99', 'No Subgroup', 'Stone Press Makkai Flour 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.760'),
(163, '100', 'No Subgroup', 'Stone Press Red Chilly Powder', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.760'),
(164, '101', 'No Subgroup', 'Stone Press Tumeric Powder', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.761'),
(165, '102', 'No Subgroup', 'Stone Press Wheat 1kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.762'),
(166, '103', 'No Subgroup', 'Wood Press Black Mustard Oil 1000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.762'),
(167, '104', 'No Subgroup', 'Wood Press Black Mustard Oil 20ltrs', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.762'),
(168, '105', 'No Subgroup', 'Wood Press Black Mustard Oil 5000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.763'),
(169, '106', 'No Subgroup', 'Wood Press Black Mustard Oil 500ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.763'),
(170, '107', 'No Subgroup', 'Wood Press Coconut Oil 1000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.763'),
(171, '108', 'No Subgroup', 'Wood Press Peanut Oil 1000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.764'),
(172, '109', 'No Subgroup', 'Wood Press Peanut Oil 5000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.764'),
(173, '110', 'No Subgroup', 'Wood Press Sesami Oil 1000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.765'),
(174, '111', 'No Subgroup', 'Wood Press Sesami Oil 5000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.766'),
(175, '112', 'No Subgroup', 'Wood Press Yellow Mustard Oil 1000ml', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.767'),
(176, '113', 'No Subgroup', 'Bucket Wheat 50kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.768'),
(177, '114', 'No Subgroup', 'Chana 25kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.769'),
(178, '115', 'No Subgroup', 'Chiura 20  Kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.770'),
(179, '116', 'No Subgroup', 'Kabuli Chana 30kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.770'),
(180, '117', 'No Subgroup', 'Kala Bhatamas25kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.771'),
(181, '118', 'No Subgroup', 'Kwanti 20kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.772'),
(182, '119', 'No Subgroup', 'Mass Dal 25kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.772'),
(183, '120', 'No Subgroup', 'Moong Dal 25kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.773'),
(184, '121', 'No Subgroup', 'Moong Khosta 25kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.774'),
(185, '122', 'No Subgroup', 'Musuro Dal 25 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.775'),
(186, '123', 'No Subgroup', 'Rajma (30 Kg)', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.776'),
(187, '124', 'No Subgroup', 'Rice 20 Kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.777'),
(188, '125', 'No Subgroup', 'Rice 25 KG', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.778'),
(189, '126', 'No Subgroup', 'Rice 30 Kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.779'),
(190, '127', 'No Subgroup', 'Seto Semi 30kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.779'),
(191, '128', 'No Subgroup', 'Wheat 25kg', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.780'),
(192, '129', 'No Subgroup', 'International Acilarix LXS Series Diagnostic Ultrasound System with Accessories.', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.780'),
(193, '130', 'No Subgroup', 'SONY-UPP-X899 17D Thermal Printer', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.782'),
(194, '131', 'COLDPRESS BLACK MUSTARD OIL', '1LTR COLDPRESS BLACK MUSTARD OIL', 0, 0, '2026-08-24 05:59:16.287', '2026-08-24 06:09:49.783');

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
  MODIFY `cartId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categoryId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
  MODIFY `productId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT for table `productVariant`
--
ALTER TABLE `productVariant`
  MODIFY `variantId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

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
