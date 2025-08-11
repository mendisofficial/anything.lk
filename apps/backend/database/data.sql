-- list of cities into the `city` table.
INSERT INTO `AnythingLK`.`city` (`name`) VALUES
('Colombo'),
('Kandy'),
('Galle'),
('Jaffna'),
('Negombo'),
('Anuradhapura'),
('Ratnapura'),
('Badulla'),
('Kurunegala'),
('Trincomalee'),
('Matara'),
('Batticaloa'),
('Nuwara Eliya'),
('Hambantota'),
('Polonnaruwa'),
('Vavuniya'),
('Kalutara'),
('Ampara'),
('Monaragala'),
('Puttalam');

-- list of brands into the `brand` table.
INSERT INTO `AnythingLK`.`brand` (`name`) VALUES
('Apple'),
('Samsung'),
('Xiaomi'),
('OnePlus'),
('Oppo'),
('Vivo'),
('Realme'),
('Nokia');

-- list of models into the `model` table.
INSERT INTO `AnythingLK`.`model` (`name`, `brand_id`) VALUES
('iPhone 13', 1),
('iPhone 14 Pro', 1),
('Galaxy S22', 2),
('Galaxy A54', 2),
('Redmi Note 12', 3),
('Mi 11 Lite', 3),
('OnePlus 11', 4),
('Nord CE 3 Lite', 4),
('Oppo F21 Pro', 5),
('Oppo A78', 5),
('Vivo V27', 6),
('Vivo Y100', 6),
('Realme Narzo 60', 7),
('Realme 11x', 7),
('Nokia G60', 8);

-- list of conditions into the `color` table.
INSERT INTO `AnythingLK`.`color` (`value`) VALUES
('Black'),
('White'),
('Blue'),
('Green'),
('Purple'),
('Silver'),
('Gold'),
('Red');

-- list of conditions into the `quality` table.
INSERT INTO `AnythingLK`.`quality` (`value`) VALUES
('Brand New'),
('Like New'),
('Used - Good'),
('Used - Fair'),
('Refurbished');

-- list of storage options into the `storage` table.
INSERT INTO `AnythingLK`.`storage` (`value`) VALUES
('32 GB'),
('64 GB'),
('128 GB'),
('256 GB'),
('512 GB'),
('1 TB');

-- list of status options into the `status` table.
INSERT INTO `AnythingLK`.`status` (`value`) VALUES
('Pending'),
('Paid'),
('Processing'),
('Shipped'),
('Delivered'),
('Cancelled'),
('Returned'),
('Active'),
('Inactive');

-- seed a demo user to satisfy product user_id FKs and enable collections
INSERT INTO `AnythingLK`.`user` (`first_name`, `last_name`, `email`, `password`, `verification`, `created_at`)
VALUES ('Demo', 'User', 'user@anything.lk', 'Pass1234', 'Verified', NOW());

-- create a few sample collections for the demo user
INSERT INTO `AnythingLK`.`collection` (`name`, `slug`, `description`, `is_public`, `user_id`, `created_at`) VALUES
('Tech Deals', 'tech-deals', 'Top picks and promos on popular phones', 1, 1, NOW()),
('My Favorites', 'my-favorites', 'Personal shortlist of favorites', 0, 1, NOW()),
('Budget Picks', 'budget-picks', 'Great value devices under budget', 1, 1, NOW());

INSERT INTO `AnythingLK`.`product`
(`title`, `model_id`, `description`, `price`, `qty`, `color_id`, `storage_id`, `condition_id`, `status_id`, `user_id`, `created_at`)
VALUES
('iPhone 13 - Black', 1, 'Gently used iPhone 13 with minor scratches, works perfectly.', 1800.00, 2, 1, 3, 2, 8, 1, NOW()),
('iPhone 14 Pro - Silver', 2, 'Brand new iPhone 14 Pro still in sealed box.', 3200.00, 1, 6, 4, 1, 8, 1, NOW()),
('Galaxy S22 - White', 3, 'Used Galaxy S22 in great condition, no dents or scratches.', 1550.00, 3, 2, 3, 3, 8, 1, NOW()),
('Galaxy A54 - Green', 4, 'Like new Galaxy A54 with full accessories.', 1200.00, 5, 4, 2, 2, 8, 1, NOW()),
('Redmi Note 12 - Blue', 5, 'Used Redmi Note 12, good condition, fast and responsive.', 980.00, 4, 3, 4, 3, 8, 1, NOW()),
('Mi 11 Lite - Purple', 6, 'Sleek and stylish Mi 11 Lite, lightly used.', 850.00, 2, 5, 2, 2, 8, 1, NOW()),
('OnePlus 11 - Black', 7, 'High performance OnePlus 11 in excellent condition.', 1950.00, 1, 1, 5, 1, 8, 1, NOW()),
('Nord CE 3 Lite - Blue', 8, 'Budget-friendly Nord CE 3 Lite, barely used.', 890.00, 6, 3, 3, 2, 8, 1, NOW()),
('Oppo F21 Pro - Gold', 9, 'Elegant gold F21 Pro with solid camera.', 1050.00, 2, 7, 2, 2, 8, 1, NOW()),
('Oppo A78 - Red', 10, 'Red Oppo A78 in fair condition, comes with charger.', 750.00, 3, 8, 2, 4, 8, 1, NOW()),
('Vivo V27 - White', 11, 'Vivo V27 with smooth performance, minimal wear.', 1100.00, 3, 2, 4, 2, 8, 1, NOW()),
('Vivo Y100 - Black', 12, 'Refurbished Vivo Y100 with warranty.', 900.00, 2, 1, 3, 5, 8, 1, NOW()),
('Realme Narzo 60 - Green', 13, 'Gaming-ready Narzo 60 with good battery.', 880.00, 5, 4, 3, 3, 8, 1, NOW()),
('Realme 11x - Blue', 14, 'Almost new Realme 11x, quick charge supported.', 780.00, 4, 3, 2, 2, 8, 1, NOW()),
('Nokia G60 - Black', 15, 'Durable Nokia G60, ideal for rough use.', 670.00, 6, 1, 2, 4, 8, 1, NOW()),
('iPhone 13 - Red', 1, 'iPhone 13 in rare red color, works like new.', 1820.00, 2, 8, 3, 2, 8, 1, NOW()),
('Galaxy A54 - Purple', 4, 'Purple Galaxy A54, excellent battery life.', 1250.00, 3, 5, 4, 1, 8, 1, NOW()),
('OnePlus 11 - White', 7, 'Powerful OnePlus 11 in white, barely used.', 2000.00, 1, 2, 5, 1, 8, 1, NOW()),
('Realme 11x - Silver', 14, 'Sleek Realme 11x in silver, great value.', 800.00, 2, 6, 2, 2, 8, 1, NOW()),
('Vivo Y100 - Gold', 12, 'Stylish gold Vivo Y100, lightly refurbished.', 950.00, 1, 7, 3, 5, 8, 1, NOW());

-- map some products into the sample collections using titles to resolve IDs
INSERT INTO `AnythingLK`.`collection_product` (`collection_id`, `product_id`)
SELECT (SELECT id FROM `AnythingLK`.`collection` WHERE slug = 'tech-deals'), (SELECT id FROM `AnythingLK`.`product` WHERE title = 'OnePlus 11 - Black')
UNION ALL SELECT (SELECT id FROM `AnythingLK`.`collection` WHERE slug = 'tech-deals'), (SELECT id FROM `AnythingLK`.`product` WHERE title = 'iPhone 14 Pro - Silver')
UNION ALL SELECT (SELECT id FROM `AnythingLK`.`collection` WHERE slug = 'tech-deals'), (SELECT id FROM `AnythingLK`.`product` WHERE title = 'Galaxy S22 - White')
UNION ALL SELECT (SELECT id FROM `AnythingLK`.`collection` WHERE slug = 'my-favorites'), (SELECT id FROM `AnythingLK`.`product` WHERE title = 'iPhone 13 - Black')
UNION ALL SELECT (SELECT id FROM `AnythingLK`.`collection` WHERE slug = 'my-favorites'), (SELECT id FROM `AnythingLK`.`product` WHERE title = 'Redmi Note 12 - Blue')
UNION ALL SELECT (SELECT id FROM `AnythingLK`.`collection` WHERE slug = 'budget-picks'), (SELECT id FROM `AnythingLK`.`product` WHERE title = 'Nord CE 3 Lite - Blue')
UNION ALL SELECT (SELECT id FROM `AnythingLK`.`collection` WHERE slug = 'budget-picks'), (SELECT id FROM `AnythingLK`.`product` WHERE title = 'Realme 11x - Blue')
UNION ALL SELECT (SELECT id FROM `AnythingLK`.`collection` WHERE slug = 'budget-picks'), (SELECT id FROM `AnythingLK`.`product` WHERE title = 'Oppo A78 - Red');

INSERT INTO `AnythingLK`.`delivery_type` (`name`, `price`)
VALUES
('Within Colombo', 499.00),
('Outside Colombo', 999.00);

INSERT INTO `AnythingLK`.`order_status` (`value`)
VALUES
('Pending'),
('Processing'),
('Shipped'),
('Out for Delivery'),
('Delivered'),
('Cancelled'),
('Returned'),
('Refunded');

