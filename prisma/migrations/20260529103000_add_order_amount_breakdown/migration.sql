ALTER TABLE `orders`
  ADD COLUMN `unitPrice` DOUBLE NOT NULL DEFAULT 0,
  ADD COLUMN `productTotal` DOUBLE NOT NULL DEFAULT 0,
  ADD COLUMN `deliveryCharge` DOUBLE NOT NULL DEFAULT 0;

ALTER TABLE `comboOrders`
  ADD COLUMN `unitPrice` DOUBLE NOT NULL DEFAULT 0,
  ADD COLUMN `productTotal` DOUBLE NOT NULL DEFAULT 0,
  ADD COLUMN `deliveryCharge` DOUBLE NOT NULL DEFAULT 0;

UPDATE `orders` o
LEFT JOIN `products` p ON p.`productId` = o.`productId`
SET
  o.`unitPrice` = CASE
    WHEN o.`quantity` > 0 AND p.`sellingPrice` IS NOT NULL AND p.`sellingPrice` > 0 THEN p.`sellingPrice`
    WHEN o.`quantity` > 0 THEN o.`totalAmount` / o.`quantity`
    ELSE o.`totalAmount`
  END,
  o.`productTotal` = CASE
    WHEN o.`quantity` > 0 AND p.`sellingPrice` IS NOT NULL AND p.`sellingPrice` > 0 THEN p.`sellingPrice` * o.`quantity`
    ELSE o.`totalAmount`
  END,
  o.`deliveryCharge` = GREATEST(
    o.`totalAmount` - CASE
      WHEN o.`quantity` > 0 AND p.`sellingPrice` IS NOT NULL AND p.`sellingPrice` > 0 THEN p.`sellingPrice` * o.`quantity`
      ELSE o.`totalAmount`
    END,
    0
  );

UPDATE `comboOrders` co
LEFT JOIN `comboProduct` cp ON cp.`comboProductId` = co.`comboProductId`
SET
  co.`unitPrice` = CASE
    WHEN co.`quantity` > 0 AND cp.`comboPrice` IS NOT NULL AND cp.`comboPrice` > 0 THEN cp.`comboPrice`
    WHEN co.`quantity` > 0 THEN co.`totalAmount` / co.`quantity`
    ELSE co.`totalAmount`
  END,
  co.`productTotal` = CASE
    WHEN co.`quantity` > 0 AND cp.`comboPrice` IS NOT NULL AND cp.`comboPrice` > 0 THEN cp.`comboPrice` * co.`quantity`
    ELSE co.`totalAmount`
  END,
  co.`deliveryCharge` = GREATEST(
    co.`totalAmount` - CASE
      WHEN co.`quantity` > 0 AND cp.`comboPrice` IS NOT NULL AND cp.`comboPrice` > 0 THEN cp.`comboPrice` * co.`quantity`
      ELSE co.`totalAmount`
    END,
    0
  );
