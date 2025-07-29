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
('Delivered');
