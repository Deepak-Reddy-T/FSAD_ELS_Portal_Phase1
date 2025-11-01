-- Database Setup Script for Equipment Lending System
-- Run this script in MySQL to set up the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS equipment_lending;
USE equipment_lending;

-- Create user for the application
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root1234';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON equipment_lending.* TO 'root'@'localhost';

-- Flush privileges to ensure they take effect
FLUSH PRIVILEGES;

-- Show the created user
SELECT User, Host FROM mysql.user WHERE User = 'root';

-- Show databases
SHOW DATABASES;

-- Ensure a clean slate (drop in FK-safe order)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS borrow_requests;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Create tables required by the application if they don't exist

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  condition_text VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  available_quantity INT NOT NULL,
  description VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Borrow requests table
CREATE TABLE IF NOT EXISTS borrow_requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  equipment_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  request_date DATETIME NOT NULL,
  borrow_date DATETIME NULL,
  return_date DATETIME NULL,
  status VARCHAR(20) NOT NULL,
  purpose VARCHAR(500),
  admin_notes VARCHAR(500),
  INDEX idx_borrow_user (user_id),
  INDEX idx_borrow_equipment (equipment_id),
  CONSTRAINT fk_borrow_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_borrow_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verify tables and engines
SHOW TABLES;
SHOW TABLE STATUS WHERE Name IN ('users','equipment','borrow_requests');
